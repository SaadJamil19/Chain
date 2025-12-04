# Oracle Module - Real Command Practice

This document contains **ACTUAL** oracle commands to run on the testnet.

---

## Quick Setup

```bash
export PATH="/home/asim/go/bin:$PATH"
export HOME_DIR="$HOME/.rollchain"
export KEYRING="test"
export CHAIN_ID="localchain_9000-1"
export RPC="http://localhost:26657"
export REST="http://localhost:1317"
```

### Available Test Keys
- **acc0**: roll140fehngcrxvhdt84x729p3f0qmkmea8n9v9fhm
- **acc1**: roll1r6yue0vuyj9m7xw78npspt9drq2tmtvgf3rgys

---

## Command 1: Check Testnet is Running

### Command
```bash
ps aux | grep rolld | grep -v grep
```

### Description
Verifies the testnet node is running

---

## Command 2: List All Keys

### Command
```bash
/home/asim/go/bin/rolld keys list --keyring-backend=test --home=$HOME/.rollchain
```

### Description
Shows all available keys in the testnet

---

## Command 3: Get Account Address

### Command
```bash
/home/asim/go/bin/rolld keys show acc0 -a --keyring-backend=test --home=$HOME/.rollchain
```

### Output
```
roll140fehngcrxvhdt84x729p3f0qmkmea8n9v9fhm
```

---

## Command 4: Query Account Balance

### Command
```bash
/home/asim/go/bin/rolld q bank balances roll140fehngcrxvhdt84x729p3f0qmkmea8n9v9fhm --node=http://localhost:26657
```

### Description
Shows the balance of acc0 account

---

## Command 5: Query Oracle Price (per-asset)

### Command
```bash
# The oracle module exposes per-asset queries. Use `get-price` with an asset argument:
/home/asim/go/bin/rolld query oracle get-price BTC --node=http://localhost:26657
```

### Description
Query the stored price for a specific asset. The oracle module does not provide a `prices` list command; use `get-price <asset>` instead.

### Note — observed CLI behavior
If you run `rolld query oracle get-price` without providing an asset, the node returns a not-found error. Example observed output from the node:

```
rpc error: code = NotFound desc = rpc error: code = NotFound desc = price not found for asset: : key not found
```
This indicates no asset was provided (empty asset) or the asset has no stored price.

---

## Command 6: Post Bitcoin Price (VALID)

### Command
```bash
/home/asim/go/bin/rolld tx oracle post-price \
  roll140fehngcrxvhdt84x729p3f0qmkmea8n9v9fhm \
  BTC \
  45000.50 \
  --from=acc0 \
  --keyring-backend=test \
  --home=$HOME/.rollchain \
  --chain-id=localchain_9000-1 \
  --node=http://localhost:26657 \
  --gas=auto \
  --gas-adjustment=1.5
```

### Parameters
- **Creator Address**: roll140fehngcrxvhdt84x729p3f0qmkmea8n9v9fhm (acc0)
- **Asset**: BTC
- **Price**: 45000.50

---

## Command 7: Post Ethereum Price (VALID)

### Command
```bash
/home/asim/go/bin/rolld tx oracle post-price \
  roll140fehngcrxvhdt84x729p3f0qmkmea8n9v9fhm \
  ETH \
  2500.75 \
  --from=acc0 \
  --keyring-backend=test \
  --home=$HOME/.rollchain \
  --chain-id=localchain_9000-1 \
  --node=http://localhost:26657 \
  --gas=auto
```

---

## Command 8: Try Negative Price (VALIDATION TEST - SHOULD FAIL)

### Command
```bash
/home/asim/go/bin/rolld tx oracle post-price \
  roll140fehngcrxvhdt84x729p3f0qmkmea8n9v9fhm \
  BTC \
  -100 \
  --from=acc0 \
  --keyring-backend=test \
  --home=$HOME/.rollchain \
  --chain-id=localchain_9000-1 \
  --node=http://localhost:26657 \
  --gas=auto
```

### Expected Error
```
Error: invalid request: price cannot be negative
```

### Why It Fails
- ValidateBasic() checks if price.IsNegative()
- Rejects before transaction hits mempool

---

## Command 9: Try Empty Asset (VALIDATION TEST - SHOULD FAIL)

### Command
```bash
/home/asim/go/bin/rolld tx oracle post-price \
  roll140fehngcrxvhdt84x729p3f0qmkmea8n9v9fhm \
  "" \
  50000 \
  --from=acc0 \
  --keyring-backend=test \
  --home=$HOME/.rollchain \
  --chain-id=localchain_9000-1 \
  --node=http://localhost:26657 \
  --gas=auto
```

### Expected Error
```
Error: invalid request: asset cannot be empty
```

---

## Command 10: Try Invalid Decimal (VALIDATION TEST - SHOULD FAIL)

### Command
```bash
/home/asim/go/bin/rolld tx oracle post-price \
  roll140fehngcrxvhdt84x729p3f0qmkmea8n9v9fhm \
  ETH \
  "notanumber" \
  --from=acc0 \
  --keyring-backend=test \
  --home=$HOME/.rollchain \
  --chain-id=localchain_9000-1 \
  --node=http://localhost:26657 \
  --gas=auto
```

### Expected Error
```
Error: invalid request: price must be a valid decimal
```

---

## Command 11: Try Invalid Address (VALIDATION TEST - SHOULD FAIL)

### Command
```bash
/home/asim/go/bin/rolld tx oracle post-price \
  invalid_address \
  BTC \
  45000.50 \
  --from=acc0 \
  --keyring-backend=test \
  --home=$HOME/.rollchain \
  --chain-id=localchain_9000-1 \
  --node=http://localhost:26657 \
  --gas=auto
```

### Expected Error
```
Error: invalid address: decoding bech32 failed
```

---

## Command 12: Query Oracle Parameters

### Command
```bash
/home/asim/go/bin/rolld q oracle params --node=http://localhost:26657
```

### Description
Shows oracle module parameters

---

## Command 13: Query Specific Asset Price

### Command
```bash
/home/asim/go/bin/rolld q oracle price BTC --node=http://localhost:26657
```

### Description
Query the stored price for a specific asset

---

## Command 14: Query Transaction by Hash

### Command
```bash
/home/asim/go/bin/rolld q tx <tx-hash> --node=http://localhost:26657
```

### Description
After posting a price, use the returned txhash to query transaction details

---

## Complete Workflow to Test Oracle Module

### Step 1: Verify testnet is running
```bash
ps aux | grep rolld | grep -v grep
```

### Step 2: Query current price for BTC (example — may be empty)
```bash
/home/asim/go/bin/rolld query oracle get-price BTC --node=http://localhost:26657
```

### Step 3: Submit BTC price
```bash
/home/asim/go/bin/rolld tx oracle post-price \
  roll140fehngcrxvhdt84x729p3f0qmkmea8n9v9fhm \
  BTC \
  45000.50 \
  --from=acc0 \
  --keyring-backend=test \
  --home=$HOME/.rollchain \
  --chain-id=localchain_9000-1 \
  --node=http://localhost:26657 \
  --gas=auto \
  --gas-adjustment=1.5
```

### Step 4: Wait 1-2 blocks for transaction confirmation

### Step 5: Query BTC price again
```bash
/home/asim/go/bin/rolld query oracle get-price BTC --node=http://localhost:26657
```

### Step 6: Query specific BTC price
```bash
/home/asim/go/bin/rolld q oracle price BTC --node=http://localhost:26657
```

### Step 7: Submit ETH price
```bash
/home/asim/go/bin/rolld tx oracle post-price \
  roll140fehngcrxvhdt84x729p3f0qmkmea8n9v9fhm \
  ETH \
  2500.75 \
  --from=acc0 \
  --keyring-backend=test \
  --home=$HOME/.rollchain \
  --chain-id=localchain_9000-1 \
  --node=http://localhost:26657 \
  --gas=auto
```

### Step 8: Wait 1-2 blocks, then query BTC price
```bash
/home/asim/go/bin/rolld query oracle get-price BTC --node=http://localhost:26657
```

### Step 9: Test validation - submit negative price (should fail)
```bash
/home/asim/go/bin/rolld tx oracle post-price \
  roll140fehngcrxvhdt84x729p3f0qmkmea8n9v9fhm \
  BTC \
  -100 \
  --from=acc0 \
  --keyring-backend=test \
  --home=$HOME/.rollchain \
  --chain-id=localchain_9000-1 \
  --node=http://localhost:26657 \
  --gas=auto
```

### Step 10: Verify prices didn't change
```bash
/home/asim/go/bin/rolld q oracle prices --node=http://localhost:26657
```

---

## Quick Reference

| Task | Command |
|------|---------|
| Check testnet running | `ps aux \| grep rolld \| grep -v grep` |
| Query price for an asset | `/home/asim/go/bin/rolld query oracle get-price <asset> --node=http://localhost:26657` |
| Post price | `/home/asim/go/bin/rolld tx oracle post-price <addr> <asset> <price> --from=acc0 --keyring-backend=test --home=$HOME/.rollchain --chain-id=localchain_9000-1 --node=http://localhost:26657 --gas=auto` |
| Query specific price | `/home/asim/go/bin/rolld q oracle price <asset> --node=http://localhost:26657` |
| Get acc0 address | `/home/asim/go/bin/rolld keys show acc0 -a --keyring-backend=test --home=$HOME/.rollchain` |
| Get oracle params | `/home/asim/go/bin/rolld q oracle params --node=http://localhost:26657` |
| Get account balance | `/home/asim/go/bin/rolld q bank balances <address> --node=http://localhost:26657` |

---

## Configuration

- **Binary**: `/home/asim/go/bin/rolld`
- **Testnet home**: `$HOME/.rollchain`
- **RPC endpoint**: `http://localhost:26657`
- **REST endpoint**: `http://localhost:1317`
- **GRPC endpoint**: `localhost:9090`
- **Chain ID**: `localchain_9000-1`
- **Block time**: ~1 second (1000ms)
- **Keyring backend**: `test`

---

## **Working Concepts & Main Commands**

- **Purpose:** The `oracle` module lets off-chain oracles post price data for assets to be consumed by on-chain modules and smart contracts. It validates, stores, and exposes per-asset price entries.
- **Core messages:**
  - `MsgPostPrice` (`post-price`): submit a price for an asset. Fields: `creator` (bech32 address), `asset` (string), `price` (decimal string). ValidateBasic ensures creator is valid, asset non-empty, price is a valid non-negative decimal.
  - `MsgUpdateParams` (`update-params`): change oracle module parameters (authority, update period). Only callable by the authority address.
- **State / storage:** Prices are stored per-asset (e.g., `Price{Asset, Price(string), Source, Timestamp}`) — implementations often store price as a string but validate it as a decimal on input.
- **Queries:**
  - `GetPrice` RPC (`rolld query oracle get-price <asset>`): fetch the latest price for a given asset.
  - `Params` (`rolld query oracle params`): fetch module parameters (authority, update_period, etc.).
- **Events emitted:** Posting a price emits a `message` event and an `oracle` event containing `asset` and `price` attributes. Listen to these via the REST/events API or `rolld q tx`.
- **Validation rules:**
  - Creator must be a valid Bech32 address.
  - Asset must be non-empty.
  - Price must parse as a decimal (e.g., `45000.50`) and not be negative.
- **Typical workflow:**
  1. Ensure node running and you have a funded key (`acc0`).
 2. Post prices with `rolld tx oracle post-price <creator> <asset> <price> --from=acc0`.
 3. Wait 1-2 blocks, then query with `rolld query oracle get-price <asset>`.

- **Main CLI commands (quick list):**
  - Query price: `rolld query oracle get-price <asset> --node=http://localhost:26657`
  - Query params: `rolld query oracle params --node=http://localhost:26657`
  - Post price: `rolld tx oracle post-price <creator> <asset> <price> --from=<key> --keyring-backend=test --home=$HOME/.rollchain --chain-id=localchain_9000-1`
  - Update params (authority): `rolld tx oracle update-params '{"authority":"<addr>","update_period":<secs>}' --from=<authority>`
  - Get tx details: `rolld query tx <tx-hash> --node=http://localhost:26657`
  - Keys: `rolld keys list --home=$HOME/.rollchain --keyring-backend=test`, `rolld keys show <name> -a ...`

- **Important notes:**
  - There is no `prices` list command in this CLI; use `get-price <asset>` per-asset queries.
  - Use `--gas=auto` and `--gas-adjustment=1.5` for safe estimation when posting transactions.
  - For local testing, the test keys (`acc0`, `acc1`) are pre-funded and usable with `--keyring-backend=test`.


