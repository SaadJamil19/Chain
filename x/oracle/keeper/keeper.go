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

	return &types.GenesisState{
		Params: params,
		Prices: prices,
	}
}
