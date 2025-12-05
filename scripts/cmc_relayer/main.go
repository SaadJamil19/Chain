package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"cosmossdk.io/math"

	rpchttp "github.com/cometbft/cometbft/rpc/client/http"

	"github.com/cosmos/cosmos-sdk/client"
	"github.com/cosmos/cosmos-sdk/client/flags"
	"github.com/cosmos/cosmos-sdk/client/tx"
	"github.com/cosmos/cosmos-sdk/codec"
	"github.com/cosmos/cosmos-sdk/codec/address"
	cdctypes "github.com/cosmos/cosmos-sdk/codec/types"
	cryptocodec "github.com/cosmos/cosmos-sdk/crypto/codec"
	"github.com/cosmos/cosmos-sdk/crypto/keyring"
	cryptotypes "github.com/cosmos/cosmos-sdk/crypto/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	authtx "github.com/cosmos/cosmos-sdk/x/auth/tx"
	authtypes "github.com/cosmos/cosmos-sdk/x/auth/types"
	"github.com/cosmos/evm/crypto/ethsecp256k1"

	"cosmossdk.io/x/tx/signing"
	"github.com/cosmos/gogoproto/proto"

	rollapp "github.com/rollchains/rollchain/app"
	appparams "github.com/rollchains/rollchain/app/params"
	"github.com/rollchains/rollchain/x/oracle/types"
)

// CoinMarketCap response (truncated to only needed fields).
type cmcResponse struct {
	Data []struct {
		Symbol string `json:"symbol"`
		Quote  map[string]struct {
			Price float64 `json:"price"`
		} `json:"quote"`
	} `json:"data"`
}

// Config is the relayer configuration.
type Config struct {
	CMCAPIKey   string
	Provider    string
	Convert     string
	Limit       int
	NodeRPC     string
	ChainID     string
	KeyringHome string
	KeyName     string
	GasPrices   string
	FeeGranter  string
	GasLimit    uint64
}

func loadConfig() Config {
	return Config{
		CMCAPIKey:   os.Getenv("CMC_API_KEY"),
		Provider:    getenv("PROVIDER", "coinmarketcap"),
		Convert:     getenv("CMC_CONVERT", "USD"),
		Limit:       getenvInt("CMC_LIMIT", 10),
		NodeRPC:     getenv("NODE_RPC", "http://localhost:26657"),
		ChainID:     getenv("CHAIN_ID", "localchain_9000-1"),
		KeyringHome: getenv("KEYRING_HOME", os.ExpandEnv("$HOME/.rollchain")),
		KeyName:     getenv("KEY_NAME", "acc0"),
		GasPrices:   getenv("GAS_PRICES", "0.025utoken"),
		FeeGranter:  os.Getenv("FEE_GRANTER"),
		GasLimit:    getenvUint64("GAS_LIMIT", 300000),
	}
}

// makeEncodingConfig registers the ethsecp (EVM) key types so the keyring can decode your keys.
func makeEncodingConfig() appparams.EncodingConfig {
	amino := codec.NewLegacyAmino()
	interfaceRegistry, err := cdctypes.NewInterfaceRegistryWithOptions(cdctypes.InterfaceRegistryOptions{
		ProtoFiles: proto.HybridResolver,
		SigningOptions: signing.Options{
			AddressCodec: address.Bech32Codec{
				Bech32Prefix: sdk.GetConfig().GetBech32AccountAddrPrefix(),
			},
			ValidatorAddressCodec: address.Bech32Codec{
				Bech32Prefix: sdk.GetConfig().GetBech32ValidatorAddrPrefix(),
			},
		},
	})
	if err != nil {
		log.Fatalf("interface registry: %v", err)
	}

	// Register crypto key types used by this chain (including EVM ethsecp256k1).
	cryptocodec.RegisterInterfaces(interfaceRegistry)
	cryptocodec.RegisterCrypto(amino)
	interfaceRegistry.RegisterImplementations((*cryptotypes.PubKey)(nil), &ethsecp256k1.PubKey{})
	interfaceRegistry.RegisterImplementations((*cryptotypes.PrivKey)(nil), &ethsecp256k1.PrivKey{})
	authtypes.RegisterInterfaces(interfaceRegistry)
	types.RegisterInterfaces(interfaceRegistry)

	protoCodec := codec.NewProtoCodec(interfaceRegistry)
	txCfg := authtx.NewTxConfig(protoCodec, authtx.DefaultSignModes)

	return appparams.EncodingConfig{
		InterfaceRegistry: interfaceRegistry,
		Codec:             protoCodec,
		TxConfig:          txCfg,
		Amino:             amino,
	}
}

func main() {
	initSDKConfig()

	cfg := loadConfig()
	if cfg.CMCAPIKey == "" {
		log.Fatal("CMC_API_KEY must be set")
	}

	encCfg := makeEncodingConfig()

	clientCtx, txf := mustMakeClient(cfg, encCfg)

	symbols, prices, ts, err := fetchCMC(cfg.CMCAPIKey, cfg.Convert, cfg.Limit)
	if err != nil {
		log.Fatalf("fetch CMC: %v", err)
	}

	msg := &types.MsgRelayProviderPrices{
		Sender:    clientCtx.GetFromAddress().String(),
		Provider:  cfg.Provider,
		Symbols:   symbols,
		Prices:    prices,
		Timestamp: ts,
	}

	if err := msg.ValidateBasic(); err != nil {
		log.Fatalf("msg validate: %v", err)
	}

	if err := tx.GenerateOrBroadcastTxWithFactory(clientCtx, txf, msg); err != nil {
		log.Fatalf("broadcast: %v", err)
	}

	fmt.Println("broadcasted relay-provider-prices successfully")
}

func fetchCMC(apiKey, convert string, limit int) ([]string, []string, int64, error) {
	url := fmt.Sprintf("https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=%d&convert=%s", limit, convert)
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, nil, 0, err
	}
	req.Header.Set("X-CMC_PRO_API_KEY", apiKey)
	req.Header.Set("Accept", "application/json")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, nil, 0, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, nil, 0, fmt.Errorf("cmc status %d", resp.StatusCode)
	}

	var parsed cmcResponse
	if err := json.NewDecoder(resp.Body).Decode(&parsed); err != nil {
		return nil, nil, 0, err
	}

	now := time.Now().Unix()
	var symbols []string
	var prices []string
	for _, d := range parsed.Data {
		q, ok := d.Quote[convert]
		if !ok {
			continue
		}
		dec := math.LegacyMustNewDecFromStr(fmt.Sprintf("%f", q.Price))
		symbols = append(symbols, strings.ToUpper(d.Symbol))
		prices = append(prices, dec.String())
	}
	return symbols, prices, now, nil
}

func mustMakeClient(cfg Config, encCfg appparams.EncodingConfig) (client.Context, tx.Factory) {
	kb, err := keyring.New(
		types.ModuleName,
		keyring.BackendTest, // adjust if using file/OS keyring
		cfg.KeyringHome,
		os.Stdin,
		encCfg.Codec.(codec.Codec),
	)
	if err != nil {
		log.Fatalf("keyring: %v", err)
	}

	fromRecord, err := kb.Key(cfg.KeyName)
	if err != nil {
		log.Fatalf("key %s not found in keyring: %v", cfg.KeyName, err)
	}
	fromAddr, err := fromRecord.GetAddress()
	if err != nil {
		log.Fatalf("address: %v", err)
	}

	rpcClient, err := rpchttp.New(cfg.NodeRPC, "/websocket")
	if err != nil {
		log.Fatalf("rpc client: %v", err)
	}

	clientCtx := client.Context{}.
		WithChainID(cfg.ChainID).
		WithCodec(encCfg.Codec).
		WithInterfaceRegistry(encCfg.InterfaceRegistry).
		WithTxConfig(encCfg.TxConfig).
		WithKeyring(kb).
		WithFromAddress(fromAddr).
		WithFromName(cfg.KeyName).
		WithBroadcastMode(flags.BroadcastSync).
		WithClient(rpcClient).
		WithNodeURI(cfg.NodeRPC).
		WithInput(os.Stdin)

	// Ensure account retriever is set to avoid nil panics in tx.Factory.Prepare.
	clientCtx = clientCtx.WithAccountRetriever(authtypes.AccountRetriever{})

	txf := tx.Factory{}.
		WithChainID(cfg.ChainID).
		WithTxConfig(encCfg.TxConfig).
		WithKeybase(kb).
		WithGasAdjustment(1.2).
		WithGas(cfg.GasLimit).
		WithGasPrices(cfg.GasPrices).
		WithMemo("cmc-relay").
		WithAccountRetriever(clientCtx.AccountRetriever)

	if cfg.FeeGranter != "" {
		feeGranter, err := sdk.AccAddressFromBech32(cfg.FeeGranter)
		if err != nil {
			log.Fatalf("fee granter: %v", err)
		}
		clientCtx = clientCtx.WithFeeGranterAddress(feeGranter)
		txf = txf.WithFeeGranter(feeGranter)
	}

	return clientCtx, txf
}

func getenv(key, def string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return def
}

func getenvInt(key string, def int) int {
	if v := os.Getenv(key); v != "" {
		var out int
		if _, err := fmt.Sscanf(v, "%d", &out); err == nil {
			return out
		}
	}
	return def
}

func getenvUint64(key string, def uint64) uint64 {
	if v := os.Getenv(key); v != "" {
		var out uint64
		if _, err := fmt.Sscanf(v, "%d", &out); err == nil {
			return out
		}
	}
	return def
}

// initSDKConfig sets the bech32 prefixes/coin type to match the rollchain binary.
func initSDKConfig() {
	cfg := sdk.GetConfig()
	cfg.SetBech32PrefixForAccount(rollapp.Bech32PrefixAccAddr, rollapp.Bech32PrefixAccPub)
	cfg.SetBech32PrefixForValidator(rollapp.Bech32PrefixValAddr, rollapp.Bech32PrefixValPub)
	cfg.SetBech32PrefixForConsensusNode(rollapp.Bech32PrefixConsAddr, rollapp.Bech32PrefixConsPub)
	cfg.SetCoinType(rollapp.CoinType)
	cfg.SetPurpose(44)
	cfg.Seal()
}
