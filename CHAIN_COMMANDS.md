# rolld — Practical Commands Cheat Sheet

A compact, practical reference of common `rolld` commands for the `rollchain` repo (local testnet).
Adjust addresses, amounts and flags as needed.

Defaults used in examples:
- Binary: `rolld` (or `/home/asim/go/bin/rolld`)  
- Testnet home: `$HOME/.rollchain`  
- RPC node: `http://localhost:26657`  
- Chain ID: `localchain_9000-1`  
- Keyring backend (local tests): `--keyring-backend=test`
- Example account: `acc0` (address: `roll140fehngcrxvhdt84x729p3f0qmkmea8n9v9fhm`)

Command styles — Simple vs Explicit
----------------------------------

You can run commands in two idiomatic ways:

- Simple (short): assumes sane defaults or that you've set helpful aliases/environment variables. Good for quick local testing.
- Explicit (full): includes all flags (`--home`, `--node`, `--keyring-backend`, `--chain-id`, `-y`) for scripts, CI, or when you want reproducible runs.

Recommended quick setup (one-time) to allow short commands:

```bash
# Set short alias that includes your common flags (adjust path if needed)
export ROLLD=${ROLLD:-/home/asim/go/bin/rolld}
export ROLL_HOST=http://localhost:26657
export ROLL_HOME=$HOME/.rollchain
export ROLL_KR=--keyring-backend=test
export ROLL_CHAIN=${ROLL_CHAIN:-localchain_9000-1}
alias r="$ROLLD --node=$ROLL_HOST --home=$ROLL_HOME --chain-id=$ROLL_CHAIN $ROLL_KR"
```
roll1p2m3jly029ms03z52qun3xtyyrnhyj5k9568nv

After this you can use the short form with the `r` alias (or `rolld` if you configured defaults).

Examples (both styles):

# Bank send — Simple
r tx bank send $(r keys show acc1 -a) 5000000ux --from acc0 -y
correct:
rolld tx bank send acc0 roll1p2m3jly029ms03z52qun3xtyyrnhyj5k9568nv 5000000uroll --chain-id localchain_9000-1 --keyring-backend test -y
# Bank send — Explicit
/home/asim/go/bin/rolld tx bank send $(/home/asim/go/bin/rolld keys show acc1 -a --keyring-backend=test --home=$HOME/.rollchain) \
  5000000ux --from acc0 --keyring-backend=test --home=$HOME/.rollchain --chain-id=localchain_9000-1 -y

# Oracle post-price — Simple
r tx oracle post-price BTC 45000.50 --from acc0 -y

# Oracle post-price — Explicit
/home/asim/go/bin/rolld tx oracle post-price BTC 45000.50 \
  --from acc0 --keyring-backend=test --home=$HOME/.rollchain --chain-id=localchain_9000-1 --node=http://localhost:26657 --gas=auto -y


---

## Wallet & Key Management

Use these quick references for everyday key tasks:

```bash
r keys list
r keys show acc0
r keys add newuser
r config chain-id $ROLL_CHAIN
r config keyring-backend test
```

All module examples below assume the default `acc0` and validator keys from the local testnet setup.

---

## 1. Bank Module (tokens & balances)

Send tokens:
```bash
rolld tx bank send $(rolld keys show acc0 -a --keyring-backend=test --home=$HOME/.rollchain) \
  $(rolld keys show acc1 -a --keyring-backend=test --home=$HOME/.rollchain) 5000000ux --from acc0 \
  --keyring-backend=test --home=$HOME/.rollchain --chain-id=localchain_9000-1 -y
```
Check balance:
```bash
rolld query bank balances $(rolld keys show acc0 -a --keyring-backend=test --home=$HOME/.rollchain) --node=http://localhost:26657
```

Multi-send (advanced):
```bash
rolld tx bank multi-send \
  $(rolld keys show acc0 -a --keyring-backend=test --home=$HOME/.rollchain) \
  $(rolld keys show acc1 -a --keyring-backend=test --home=$HOME/.rollchain) 1000ux \
  $(rolld keys show val -a --keyring-backend=test --home=$HOME/.rollchain) 2000ux \
  --from acc0 --keyring-backend=test --home=$HOME/.rollchain --chain-id=localchain_9000-1 -y
```

---

## 2. Staking Module (validators)

Delegate (stake) tokens:
```bash
rolld tx staking delegate $(rolld keys show val --bech val -a --keyring-backend=test --home=$HOME/.rollchain) 1000000ux \
  --from acc0 --keyring-backend=test --home=$HOME/.rollchain --chain-id=localchain_9000-1 -y
```

Check delegations:
```bash
rolld query staking delegations $(rolld keys show acc0 -a --keyring-backend=test --home=$HOME/.rollchain) --node=http://localhost:26657
```

Unbond (unstake):
```bash
rolld tx staking unbond $(rolld keys show val --bech val -a --keyring-backend=test --home=$HOME/.rollchain) 500000ux --from acc0 --keyring-backend=test --home=$HOME/.rollchain --chain-id=localchain_9000-1 -y
```

Redelegate:
```bash
rolld tx staking redelegate <src-val-addr> <dst-val-addr> 100000ux --from acc0 --keyring-backend=test --home=$HOME/.rollchain -y
```

---

## 3. Distribution (rewards)

Check rewards:
```bash
rolld query distribution rewards $(rolld keys show acc0 -a --keyring-backend=test --home=$HOME/.rollchain) --node=http://localhost:26657
```

Withdraw all rewards:
```bash
rolld tx distribution withdraw-all-rewards --from acc0 --keyring-backend=test --home=$HOME/.rollchain --chain-id=localchain_9000-1 -y
```

Validator commission withdraw:
```bash
rolld tx distribution withdraw-rewards $(rolld keys show val --bech val -a --keyring-backend=test --home=$HOME/.rollchain) --commission --from val --keyring-backend=test --home=$HOME/.rollchain -y
```

---

## 4. Governance (on-chain voting)

Submit a text proposal:
```bash
rolld tx gov submit-legacy-proposal --type text --title "Increase Block Gas" --description "Increase block gas limit" --deposit 10000000ux --from acc0 --keyring-backend=test --home=$HOME/.rollchain -y
```

Query proposals:
```bash
rolld query gov proposals --node=http://localhost:26657
```

Vote on a proposal (id=1):
```bash
rolld tx gov vote 1 yes --from acc0 --keyring-backend=test --home=$HOME/.rollchain -y
```

---

## 5. TokenFactory (custom tokens)

Create a denom:
```bash
rolld tx tokenfactory create-denom bitcoin --from acc0 --keyring-backend=test --home=$HOME/.rollchain -y
```

Mint tokens:
```bash
export MY_COIN="factory/$(rolld keys show acc0 -a --keyring-backend=test --home=$HOME/.rollchain)/bitcoin"
rolld tx tokenfactory mint 1000000$MY_COIN --from acc0 --keyring-backend=test --home=$HOME/.rollchain -y
```

Burn tokens:
```bash
rolld tx tokenfactory burn 500$MY_COIN --from acc0 --keyring-backend=test --home=$HOME/.rollchain -y
```

Change admin:
```bash
rolld tx tokenfactory change-admin $MY_COIN $(rolld keys show acc1 -a --keyring-backend=test --home=$HOME/.rollchain) --from acc0 --keyring-backend=test --home=$HOME/.rollchain -y
```

---

## 6. CosmWasm (smart contracts)

Upload wasm code:
```bash
rolld tx wasm store ./artifacts/cw20_base.wasm --from acc0 --keyring-backend=test --home=$HOME/.rollchain --gas=auto -y
```

List uploaded codes:
```bash
rolld query wasm list-code --node=http://localhost:26657
```

Instantiate a contract:
```bash
rolld tx wasm instantiate 1 '{"name":"Test","symbol":"TST","decimals":6,"initial_balances":[]}' --label "test" --no-admin --from acc0 --keyring-backend=test --home=$HOME/.rollchain -y
```

Execute contract (example):
```bash
rolld tx wasm execute <contract_addr> '{"transfer":{"recipient":"<addr>","amount":"100"}}' --from acc0 --keyring-backend=test --home=$HOME/.rollchain -y
```

Query contract (smart):
```bash
rolld query wasm contract-state smart <contract_addr> '{"token_info":{}}' --node=http://localhost:26657
```

---

## 7. Oracle Module (price feeder)

Query module params:
```bash
rolld query oracle params --node=http://localhost:26657
```

Query price for an asset (per-asset query); repeat per symbol if you need a whole basket:
```bash
rolld query oracle get-price BTC --node=http://localhost:26657
rolld query oracle get-price ETH --node=http://localhost:26657
rolld query oracle get-price USDT --node=http://localhost:26657
```

List or inspect providers and prices:
```bash
rolld query oracle providers --node=http://localhost:26657
rolld query oracle provider coinmarketcap --node=http://localhost:26657
rolld query oracle provider-prices coinmarketcap --node=http://localhost:26657
rolld query oracle provider-price coinmarketcap BTC --node=http://localhost:26657
```

Relay provider prices from scripts or your tooling (CoinMarketCap relayer example):
```bash
go run ./scripts/cmc_relayer
rolld tx oracle relay-provider-prices --from acc0 --keyring-backend=test \
  --home=$HOME/.rollchain --chain-id=localchain_9000-1 --node=http://localhost:26657 -y
```

Post a price (tx now accepts positional args: `asset price`):
```bash
rolld tx oracle post-price BTC 45000.50 --from acc0 --keyring-backend=test --home=$HOME/.rollchain \
  --chain-id=localchain_9000-1 --node=http://localhost:26657 --gas=auto -y
```

Notes:
- `rolld query oracle provider-prices` requires the provider name, otherwise the CLI rejects the command.
- Passing the provider before the symbol matters on `provider-price` (it will complain `price not found for provider ETH symbol BTC` if you swap args).
- For older scaffolds that expect `PostPrice` to include a creator, use `rolld tx oracle post-price <creator> <asset> <price> ...`, but the current autocli definition uses `post-price [asset] [price]`.
- Use `--gas=auto --gas-adjustment=1.5` for safer estimations on testnet when you expect higher gas usage.

---

## 8. Auction Module (custom x/auction)

Query module params:
```bash
rolld query auction params --node=http://localhost:26657
```

Update params (authority account only):
```bash
rolld tx auction update-params true --from acc0 --keyring-backend=test \
  --home=$HOME/.rollchain --chain-id=localchain_9000-1 --node=http://localhost:26657 -y
```

---

## 9. Nameservice Module (custom x/nameservice)

Query module params:
```bash
rolld query nameservice params --node=http://localhost:26657
```

Update params (authority account only):
```bash
rolld tx nameservice update-params true --from acc0 --keyring-backend=test \
  --home=$HOME/.rollchain --chain-id=localchain_9000-1 --node=http://localhost:26657 -y
```

> NOTE: Nameservice currently exposes params + param updates only.  
> Expand CLI handlers once name registration transactions are implemented.

---

## 10. Advanced Debugging & Queries

Check a block by height:
```bash
rolld query block 100 --node=http://localhost:26657
```

Query a transaction by hash:
```bash
rolld query tx <tx_hash> --node=http://localhost:26657
```

RPC / Node status:
```bash
rolld status --node=http://localhost:26657
```

Tail local node logs (example path):
```bash
tail -f $HOME/.rollchain/logs/rolld.log
# or inspect the home dir for actual log filenames
```

---

## 11. Build, Proto & Dev Helpers

Regenerate protobufs:
```bash
make proto-gen
```

Build/install binary:
```bash
make install
# or build directly
go build -o $HOME/go/bin/rolld ./cmd/rolld
```

Start local single-node testnet:
```bash
make sh-testnet
```

Check go mod cache and verify:
```bash
go env GOMODCACHE
go mod verify
```

Fix modcache (if corrupted):
```bash
# Option A: fix ownership
sudo chown -R $(id -u):$(id -g) "$(go env GOMODCACHE)"
# Option B: remove offending module
rm -rf "$(go env GOMODCACHE)/github.com/!cosm!wasm/wasmd@v0.50.0"
# Option C: wipe full cache (last resort)
sudo rm -rf "$(go env GOMODCACHE)"
```

---

## 12. Quick Tips
- Use `--keyring-backend=test` for non-interactive local testing.  
- Use `-y` to auto-confirm transactions in scripts.  
- For CLI help on any module command: `rolld tx oracle --help` or `rolld query oracle --help`.  
- If a command says `accepts 0 arg(s), received N`: check `x/<module>/autocli.go` to ensure positional args are registered or run the `--help` for the command to see expected flags.

---

## 13. Automation & Helper Scripts

Optional cleanup if build cache gets corrupted:
```bash
rm -rf ~/.cache/go-build
```

Helpful environment variables for relayers or scripting:
```bash
export KEY_NAME=acc0
export KEYRING_HOME=$HOME/.rollchain
export NODE_RPC=http://localhost:26657
export CHAIN_ID=localchain_9000-1
export GAS_PRICES="0.025uroll"
export GAS_LIMIT=300000
export CMC_API_KEY=your_cmc_key
```

Run the CoinMarketCap relayer against those env vars:
```bash
go run ./scripts/cmc_relayer
```

Example node start command (adjust ports/flags as needed):
```bash
rolld start --pruning=nothing --minimum-gas-prices=0uroll \
  --rpc.laddr=tcp://0.0.0.0:26657 --home $HOME/.rollchain \
  --json-rpc.api=eth,txpool,personal,net,debug,web3 \
  --chain-id=localchain_9000-1
```
