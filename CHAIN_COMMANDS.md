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
alias r="$ROLLD --node=$ROLL_HOST --home=$ROLL_HOME $ROLL_KR"
```

After this you can use the short form with the `r` alias (or `rolld` if you configured defaults).

Examples (both styles):

# Bank send — Simple
r tx bank send $(r keys show acc1 -a) 5000000ux --from acc0 -y

# Bank send — Explicit
/home/asim/go/bin/rolld tx bank send $(/home/asim/go/bin/rolld keys show acc1 -a --keyring-backend=test --home=$HOME/.rollchain) \
  5000000ux --from acc0 --keyring-backend=test --home=$HOME/.rollchain --chain-id=localchain_9000-1 -y

# Oracle post-price — Simple
r tx oracle post-price BTC 45000.50 --from acc0 -y

# Oracle post-price — Explicit
/home/asim/go/bin/rolld tx oracle post-price BTC 45000.50 \
  --from acc0 --keyring-backend=test --home=$HOME/.rollchain --chain-id=localchain_9000-1 --node=http://localhost:26657 --gas=auto -y


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

Query price for an asset (per-asset query):
```bash
rolld query oracle get-price BTC --node=http://localhost:26657
```

Post a price (tx now accepts positional args: `asset price`):
```bash
rolld tx oracle post-price BTC 45000.50 --from acc0 --keyring-backend=test --home=$HOME/.rollchain \
  --chain-id=localchain_9000-1 --node=http://localhost:26657 --gas=auto -y
```

Notes:
- If your `PostPrice` message requires the creator field explicitly (older scaffolds), use: `rolld tx oracle post-price <creator> <asset> <price> ...` but current autocli registers `post-price [asset] [price]`.
- Use `--gas=auto --gas-adjustment=1.5` for safer estimations on testnet when needed.

---

## 8. Advanced Debugging & Queries

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

## 9. Build, Proto & Dev Helpers

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

## 10. Quick Tips
- Use `--keyring-backend=test` for non-interactive local testing.  
- Use `-y` to auto-confirm transactions in scripts.  
- For CLI help on any module command: `rolld tx oracle --help` or `rolld query oracle --help`.  
- If a command says `accepts 0 arg(s), received N`: check `x/<module>/autocli.go` to ensure positional args are registered or run the `--help` for the command to see expected flags.

---

File created: `/home/asim/Chain/CHAIN_COMMANDS.md`

If you want, I can:
- Run a few of these commands against the running local node and capture outputs, or
- Add a short section with common automation scripts (bash snippets) to run multiple test transactions in sequence.

rm -rf ~/.cache/go-build   # already done once

export KEY_NAME=acc0
export KEYRING_HOME=$HOME/.rollchain
export NODE_RPC=http://localhost:26657
export CHAIN_ID=localchain_9000-1
export GAS_PRICES="0.025uroll"
export GAS_LIMIT=300000          # adjust if needed
export CMC_API_KEY=your_cmc_key

go run ./scripts/cmc_relayer


rolld start --pruning=nothing --minimum-gas-prices=0uroll --rpc.laddr=tcp://0.0.0.0:26657 --home /home/rollchain/.rollchain --json-rpc.api=eth,txpool,personal,net,debug,web3 --chain-id=localchain_9000-1
