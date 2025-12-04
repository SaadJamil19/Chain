<!-- Auto-generated guidance for AI coding agents working on this repository. -->
# Copilot instructions for contributors and AI agents

This file documents the essential, discoverable knowledge an AI coding agent needs to be productive in this repository (rollchain / Chain).

- **Big picture:** This repo is a Cosmos SDK-based blockchain app with EVM and CosmWasm support. Key runtime pieces live in `app/` (application wiring, keepers, module manager), modules in `x/`, and protobuf sources in `proto/` that generate Go/Pulsar code into `api/`.

- **Key files:** `app/app.go` (app wiring & ModuleManager order), `cmd/rolld/` (CLI & server entrypoints), `Makefile` (build/test/proto/testnet targets), `scripts/protocgen.sh` (proto generation logic), `Dockerfile` (static build image), and `go.mod` (pinned/replace module versions).

- **Common developer workflows (examples):**
  - **Build binary:** `make build` (creates `build/rolld`) or `make install` to `GOPATH/bin`.
  - **Generate protobufs:** `make proto-gen` (runs `buf` inside a container and the repo's `scripts/protocgen.sh`).
  - **Quick local devnet:** `make sh-testnet` (single-node shell script: `scripts/test_node.sh`).
  - **Full local IBC testnet:** `make testnet` (installs local-interchain and starts via `spawn local-ic`).
  - **Run unit tests:** `go test ./... -v` or `make test`.
  - **Run e2e interchain tests:** `make ictest-basic` or other `ictest-*` targets (uses `interchaintest/`).

- **Proto generation gotchas:**
  - The project uses two generation targets: gogo (legacy) and pulsar/`buf` (current). `scripts/protocgen.sh` moves generated files into `api/` and rewrites some imports.
  - The Makefile runs protobuf generation inside a Docker image (`protoImage`) to ensure toolchain consistency. Use `make proto-gen` rather than calling `buf` manually unless you replicate the container env.

- **Build flags & static linking:**
  - `Dockerfile` and `Makefile` use env vars like `LEDGER_ENABLED`, `LINK_STATICALLY`, and `BUILD_TAGS` to control build tags and linker flags. For static musl builds the Dockerfile sets `LINK_STATICALLY=true` and `BUILD_TAGS=muslc`.

- **Module and code patterns:**
  - Modules follow Cosmos SDK patterns: `keeper`, `types`, `module` packages under `x/<mod>`; keepers are wired in `app/app.go` and added to the `ModuleManager` in a specific order (BeginBlockers/EndBlockers/InitGenesis matter).
  - EVM integration: `app/EVMAppOptions` and `app/config.go` set EVM coin info and chain config. The EVM keeper is created early and required by ERC20 keeper.
  - Wasm: `wasm` module is placed late in the init order and supports pinned codes and VM snapshotters (see `app.NewChainApp` & snapshot registration).

- **Testing & formatting conventions:**
  - Formatting uses `gofumpt` + `misspell` + `gci` via `make format` / `make lint` targets. Run these before submitting large changes.

- **Dependency management:**
  - `go.mod` contains many `replace` directives pinning forks and versions (Cosmos SDK forks, EVM/wasm forks). When updating deps, inspect `go.mod` carefully and run `make mod-tidy` / `go mod tidy` in both root and `interchaintest`.

- **Integration points to be careful with:**
  - IBC middleware stack (transfer → erc20 → ratelimit → fee → packetforward). Changes to IBC routing or middleware order must be reflected in `app/app.go` where stacks are composed.
  - Wasm and IBC light-client modules: they register special query plugins and VM configuration — see wasm VM creation in `app/app.go`.
  - Snapshot registration: `app.NewChainApp` registers snapshot extensions (WASM) and requires the snapshot manager registration code to run before `LoadLatestVersion()`.

- **How to add a new module (practical example):**
  1. Create `x/<mod>` with `keeper`, `types`, `module` subpackages following existing modules (see `x/nameservice` or `x/auction`).
  2. Add proto definitions in `proto/<mod>/v1` and run `make proto-gen` to generate `api/` stubs.
  3. Wire a Keeper in `app.NewChainApp` and add the module to `ModuleManager` with proper ordering in `SetOrderBeginBlockers/SetOrderEndBlockers/SetOrderInitGenesis`.

- **Quick references:**
  - `DefaultNodeHome` & `ChainID` are defined in `app/app.go` (used by CLI and `Makefile` scripts).
  - Testnet helper scripts: `scripts/test_node.sh` and `chains/*.json` (testnet configurations).
  - Local image builder: `heighliner` is used (`make local-image`) — see `Makefile` `local-image` target.

If anything here is unclear or you'd like more detail for a particular workflow (proto, wasm, IBC middleware, or CI), tell me which area to expand and I'll iterate. 
