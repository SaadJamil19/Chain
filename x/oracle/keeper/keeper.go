package keeper

import (
	"context"

	"cosmossdk.io/collections"
	storetypes "cosmossdk.io/core/store"
	"cosmossdk.io/log"
	"github.com/cosmos/cosmos-sdk/codec"

	authtypes "github.com/cosmos/cosmos-sdk/x/auth/types"
	govtypes "github.com/cosmos/cosmos-sdk/x/gov/types"

	"github.com/rollchains/rollchain/x/oracle/types"
)

type Keeper struct {
	cdc    codec.BinaryCodec
	logger log.Logger

	// state management
	Schema collections.Schema
	Params collections.Item[types.Params]

	// ✅ Prices Map: Key = Asset (string), Value = Price (Object)
	Prices collections.Map[string, types.Price]

	// Provider info keyed by provider name
	Providers collections.Map[string, types.ProviderInfo]

	// Provider specific prices: key = (provider, symbol)
	ProviderPrices collections.Map[collections.Pair[string, string], types.Price]

	// Validator specific prices: key = (validator, asset)
	ValidatorPrices collections.Map[collections.Pair[string, string], types.ValidatorPrice]

	// Oracle metadata keyed by symbol
	OracleInfos collections.Map[string, types.OracleInfo]

	authority string
}

// NewKeeper creates a new Keeper instance
func NewKeeper(
	cdc codec.BinaryCodec,
	storeService storetypes.KVStoreService,
	logger log.Logger,
	authority string,
) Keeper {
	logger = logger.With(log.ModuleKey, "x/"+types.ModuleName)

	sb := collections.NewSchemaBuilder(storeService)

	if authority == "" {
		authority = authtypes.NewModuleAddress(govtypes.ModuleName).String()
	}

	k := Keeper{
		cdc:    cdc,
		logger: logger,

		// Initialize Collections
		Params: collections.NewItem(sb, types.ParamsKey, "params", codec.CollValue[types.Params](cdc)),

		// ✅ Initialize the Prices Map
		Prices: collections.NewMap(sb,
			collections.NewPrefix(1),          // Unique ID
			"prices",                          // Name
			collections.StringKey,             // Key Type
			codec.CollValue[types.Price](cdc), // Value Type
		),

		Providers: collections.NewMap(sb,
			collections.NewPrefix(2),
			"providers",
			collections.StringKey,
			codec.CollValue[types.ProviderInfo](cdc),
		),

		ProviderPrices: collections.NewMap(sb,
			collections.NewPrefix(3),
			"provider_prices",
			collections.PairKeyCodec(collections.StringKey, collections.StringKey),
			codec.CollValue[types.Price](cdc),
		),

		ValidatorPrices: collections.NewMap(sb,
			collections.NewPrefix(4),
			"validator_prices",
			collections.PairKeyCodec(collections.StringKey, collections.StringKey),
			codec.CollValue[types.ValidatorPrice](cdc),
		),

		OracleInfos: collections.NewMap(sb,
			collections.NewPrefix(5),
			"oracle_infos",
			collections.StringKey,
			codec.CollValue[types.OracleInfo](cdc),
		),

		authority: authority,
	}

	schema, err := sb.Build()
	if err != nil {
		panic(err)
	}

	k.Schema = schema

	return k
}

func (k Keeper) Logger() log.Logger {
	return k.logger
}

// GetAuthority returns the module's authority.
func (k Keeper) GetAuthority() string {
	return k.authority
}

// InitGenesis initializes the module's state from a genesis state.
func (k *Keeper) InitGenesis(ctx context.Context, data *types.GenesisState) error {
	if err := data.Params.Validate(); err != nil {
		return err
	}

	// Set Params
	if err := k.Params.Set(ctx, data.Params); err != nil {
		return err
	}

	// ✅ Set Initial Prices from Genesis
	for _, price := range data.Prices {
		if err := k.Prices.Set(ctx, price.Asset, price); err != nil {
			return err
		}
	}

	for _, provider := range data.Providers {
		if err := k.Providers.Set(ctx, provider.Provider, provider); err != nil {
			return err
		}
	}

	for _, vp := range data.ValidatorPrices {
		if err := k.ValidatorPrices.Set(ctx, collections.Join(vp.Validator, vp.Asset), vp); err != nil {
			return err
		}
	}

	for _, oi := range data.OracleInfos {
		if err := k.OracleInfos.Set(ctx, oi.Symbol, oi); err != nil {
			return err
		}
	}

	return nil
}

// ExportGenesis exports the module's state to a genesis state.
func (k *Keeper) ExportGenesis(ctx context.Context) *types.GenesisState {
	params, err := k.Params.Get(ctx)
	if err != nil {
		panic(err)
	}

	// ✅ Export all prices
	var prices []types.Price
	k.Prices.Walk(ctx, nil, func(key string, value types.Price) (bool, error) {
		prices = append(prices, value)
		return false, nil
	})

	var providers []types.ProviderInfo
	k.Providers.Walk(ctx, nil, func(key string, value types.ProviderInfo) (bool, error) {
		providers = append(providers, value)
		return false, nil
	})

	var validatorPrices []types.ValidatorPrice
	k.ValidatorPrices.Walk(ctx, nil, func(key collections.Pair[string, string], value types.ValidatorPrice) (bool, error) {
		validatorPrices = append(validatorPrices, value)
		return false, nil
	})

	var oracleInfos []types.OracleInfo
	k.OracleInfos.Walk(ctx, nil, func(key string, value types.OracleInfo) (bool, error) {
		oracleInfos = append(oracleInfos, value)
		return false, nil
	})

	return &types.GenesisState{
		Params:          params,
		Prices:          prices,
		Providers:       providers,
		ValidatorPrices: validatorPrices,
		OracleInfos:     oracleInfos,
	}
}
