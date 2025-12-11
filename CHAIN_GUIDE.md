# rollchain Learning Guide

This repo is a complete Cosmos SDK-based chain with EVM, CosmWasm, and custom modules. The goal of this guide is to explain how the pieces are wired, where to look for the important code, and what runners/testnets/commands you can use to master the chain.

## 1. High-level picture

- **Stack:** built with `spawn`/Cosmos SDK v0.50+, integrates `x/feegrant`, EVM/`cosmosevm`, CosmWasm, tokenfactory, IBC, and custom modules (oracle, auction, nameservice). The CLI binary is `rolld` (`cmd/rolld`), and the app wiring lives under `app/app.go`.
- **Runtime wiring:** `app/app.go` constructs all keepers and the module manager: the oracle/auction/nameservice keepers are created near `app/app.go:675` while `module.NewManager` starts at `app/app.go:956`. This is also where the custom keepers are created (`OracleKeeper`, `AuctionKeeper`, `NameserviceKeeper`).
- **Configuration:** `app/params` and `app/params/encoding.go` hold the codec + interface registry setup reused everywhere (e.g., the CMC relayer in `scripts/cmc_relayer/main.go:79` imports `appparams`).

## 2. Repo layout and key directories

- `app/`: contains the Cosmos app definition, keepers, and upgrade wiring.
- `cmd/rolld`: CLI binary entry point and init code, wired by `main.go`.
- `proto/`: Proto definitions for modules (`oracle`, `x/auction`, etc.). Run `make proto-gen` (Makefile:194) after editing proto files.
- `x/`: module implementations (`x/oracle`, `x/auction`, `x/nameservice`). Each module follows the Cosmos pattern (`keeper/`, `types/`, `module.go`, `autocli.go`).
- `scripts/`: helper scripts such as `scripts/test_node.sh` (devnet bootstrap) and `scripts/cmc_relayer/main.go` (relay CoinMarketCap prices).
- `chains/`: `local-ic` JSON configs used by `make testnet` to spin up dockerized chains (`chains/testnet.json:1` defines the rollchain + gaia nodes, genesis accounts, and overrides used by `local-ic start testnet`).
- `interchaintest/`: Go integration tests powered by Strangelove’s Interchaintest (e.g., `interchaintest/basic_test.go:1` starts the chain in Docker, funds test users, and checks balances).
- `CHAIN_COMMANDS.md` & `Oracle_practice.md`: curated command cheatsheets (module-specific workflows, CLI gotchas, sample outputs).
- `ORACLE_ROADMAP.md`: implementation log for the oracle module, including DI fixes, proto adjustments, and outstanding build issues.

## 3. Core module stack

The chain ships with the vanilla SDK modules (auth, bank, staking, distribution, gov, mint, slashing, crisis, params, evidence, IBC, transfer, feegrant) plus:

- **CosmWasm + wasm client:** `wasm.NewAppModule(...)` is registered at `app/app.go:984` (with staking hooks, escrow, and subspace wiring).
- **Cosmosevm / erc20 / feemarket / relayer helpers:** the EVM keeper lives at `app/app.go:709` and is required before the ERC-20 keeper; `feemarket`, `erc20`, and `cosmosevmvm` modules appear at `app/app.go:999`.
- **Custom modules:** tokenfactory, packet forward, ratelimit, nameservice, auction, and oracle are plugged in at `app/app.go:996`. These extend the chain with liquidity primitives, nameservice auctions, and a price feeder.

## 4. Custom modules in detail

- **Oracle (x/oracle):** price feeder that stores asset prices posted by relayers/validators. See `ORACLE_ROADMAP.md` for the implementation log and fixes made to protos, `ValidateBasic`, autocli registration, and app wiring (`ORACLE_ROADMAP.md:1`). Use `Oracle_practice.md` for real commands that worked on the testnet. The relayer script `scripts/cmc_relayer/main.go:1` fetches CoinMarketCap data, builds `MsgRelayProviderPrices`, and broadcasts it. `register_provider.json:1` shows how to register CoinMarketCap as a provider via a governance proposal.
- **Auction (x/auction):** scaffolded module ready to define on-chain auctions. The `module` directory contains autocli bindings and keeper scaffolds under `x/auction/`.
- **Nameservice (x/nameservice):** module placeholder for on-chain naming; wiring is ready in `x/nameservice/module.go` and `app/app.go` while CLI help is exposed through `autocli.go`.

Feel free to dive into each `x/<module>` directory to see keeper logic, message definitions, and CLI registration.

## 5. Build & development workflow

- `make build` (Makefile:90) compiles `rolld` with strict `-mod=readonly` plus ledger and build-tag handling defined in the top of `Makefile`.
- `make install` installs the binary to `$GOPATH/bin`; `make proto-gen` regenerates protobuf/ORM code (see `Makefile:192`) and `go mod tidy`/`make mod-tidy` keep dependencies tidy.
- `scripts/test_node.sh` is your zero-docker bootstrap: running `sh scripts/test_node.sh CLEAN=true` wipes the home and re-initializes genesis (see `scripts/test_node.sh:1` for keys, config tweaks, and genesis edits). It adds the test mnemonics and rewrites `app.toml`/`config.toml` so the node is accessible on all interfaces.
- `make proto-all` bundles `proto-gen`, formatting, linting, and spawn stub-gen (Makefile:192). Use it whenever you touch `.proto` files.

## 6. Running networks & testnets

- **Local shell testnet:** `make sh-testnet` runs `scripts/test_node.sh` with tuned `CHAIN_ID`, `BLOCK_TIME`, and `CLEAN` (Makefile:258).
- **Dockerized IBC testnet:** `make testnet` installs dependencies (`local-ic`, `heighliner`) and then runs `local-ic start testnet` using `chains/testnet.json:1` as the definition. The file seeds `acc0/acc1/user0/user1` accounts, exposes RPC/REST ports, and configures instant gov/voting params so you can experiment quickly.
- **Custom `local-ic`**: run `local-ic chains` to list available chains (reads the `chains/` folder). Spawn containers directly if you need to inspect logs or the `rollchain` docker image built via `make local-image`.

## 7. CLI & operational knowledge

- Keep `CHAIN_COMMANDS.md` handy for module-by-module commands and tips (`CHAIN_COMMANDS.md:1` covers aliases, `CHAIN_COMMANDS.md:214` covers the Oracle workflow) and `Oracle_practice.md:1` collects reproducible Oracle txs/queries.
- Key commands include:
  - Query module params: `rolld query oracle params --node=http://localhost:26657`
  - Query prices: `rolld query oracle get-price <symbol> --node=...` (repeat for each asset; the CLI enforces `provider` order with `provider-price` and `provider-prices`).
  - Post price or relay provider: `rolld tx oracle post-price BTC 45000.50 ...` and `rolld tx oracle relay-provider-prices` (the relayer script automates the latter).
- For non-oracle operations, rely on the sections of `CHAIN_COMMANDS.md` that cover bank, staking, distribution, governance, tokenfactory, CosmWasm, and debugging commands.
- Save `export`ed environment variables at the top of `CHAIN_COMMANDS.md` or `Oracle_practice.md` to eliminate repeated flags.

## 8. Automation & helper scripts

- `scripts/cmc_relayer/main.go:1` fetches live prices and broadcasts `MsgRelayProviderPrices` via the chain’s encoding config and keyring; it is the reference implementation for any relayer/automation.
- `register_provider.json:1` is a ready-made governance proposal that authorizes the CoinMarketCap provider and its relayer key. Submit it with `rolld tx gov submit-legacy-proposal --title ... --deposit ... --from acc0 -y` and follow through with `gov vote`.
- `scripts/test_node.sh` (adult) rewrites `app.toml`, `config.toml`, and the genesis to run a reproducible single-node network.
- The repo already ships with `Makefile` targets to install `local-ic`, `heighliner`, and run the interchaintest `ictest-*` suites (`Makefile:210`).

## 9. Testing stack

- **Unit tests:** `go test ./...` or `make test` runs the entire suite with ledger tags.
- **E2E via Interchaintest:** `make ictest-basic` etc. rely on `interchaintest/basic_test.go:1` to spin up Docker nodes, fund accounts, and assert bank balances. The `interchaintest` package also exercises IBC integration and middleware.
- **Simulation & lint:** `make runsim`, `make test-sim-*`, `golangci-lint`, and `gofumpt` are wired through `Makefile`.

## 10. Learning resources & next steps

- Walk through `ORACLE_ROADMAP.md` (implementation history), `Oracle_practice.md`, and `CHAIN_COMMANDS.md` to see how the Oracle CLI is expected to behave.
- When editing modules, remember to re-run `make proto-gen` and `make zodiac` (proto-lint, stub-gen) as described in `Makefile:192`.
- For new features, consult the Interchaintest suite to ensure you have a regression test path before pushing.
- Keep `scripts/cmc_relayer`, `register_provider.json`, and `scripts/test_node.sh` updated as living documentation of your relayer/operator workflows.

This guide should give you the vocabulary to understand the chain’s architecture, run it locally, execute CLI workflows, and extend the modules further.
