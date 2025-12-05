package keeper

import (
	"context"
	"fmt"

	"cosmossdk.io/collections"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	"github.com/rollchains/rollchain/x/oracle/types"
)

var _ types.QueryServer = Querier{}

type Querier struct {
	Keeper
}

func NewQuerier(keeper Keeper) Querier {
	return Querier{Keeper: keeper}
}

func (k Querier) Params(c context.Context, req *types.QueryParamsRequest) (*types.QueryParamsResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}
	ctx := sdk.UnwrapSDKContext(c)

	p, err := k.Keeper.Params.Get(ctx)
	if err != nil {
		return nil, err
	}

	// ✅ FIX: Pass 'p' directly (no &) because proto struct is non-nullable here usually
	// If your proto still says nullable=false, use 'p'. If it compiles error, try '&p'.
	return &types.QueryParamsResponse{Params: p}, nil
}

// GetPrice implements types.QueryServer.
func (k Querier) GetPrice(goCtx context.Context, req *types.QueryGetPriceRequest) (*types.QueryGetPriceResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}

	ctx := sdk.UnwrapSDKContext(goCtx)

	// ✅ Logic: Fetch from Store
	price, err := k.Keeper.Prices.Get(ctx, req.Asset)
	if err != nil {
		return nil, status.Error(codes.NotFound, fmt.Sprintf("price not found for asset: %s", req.Asset))
	}

	return &types.QueryGetPriceResponse{Price: price}, nil
}

// GetProviderPrice returns price from a specific provider/symbol pair.
func (k Querier) GetProviderPrice(goCtx context.Context, req *types.QueryGetProviderPriceRequest) (*types.QueryGetProviderPriceResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}

	ctx := sdk.UnwrapSDKContext(goCtx)
	price, err := k.Keeper.ProviderPrices.Get(ctx, collections.Join(req.Provider, req.Symbol))
	if err != nil {
		return nil, status.Error(codes.NotFound, fmt.Sprintf("price not found for provider %s symbol %s", req.Provider, req.Symbol))
	}

	return &types.QueryGetProviderPriceResponse{Price: price}, nil
}

// GetAllProviderPrices returns all prices for a provider.
func (k Querier) GetAllProviderPrices(goCtx context.Context, req *types.QueryGetAllProviderPricesRequest) (*types.QueryGetAllProviderPricesResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}

	ctx := sdk.UnwrapSDKContext(goCtx)
	var prices []types.Price
	err := k.Keeper.ProviderPrices.Walk(ctx, collections.NewPrefixedPairRange[string, string](req.Provider), func(key collections.Pair[string, string], value types.Price) (bool, error) {
		prices = append(prices, value)
		return false, nil
	})
	if err != nil {
		return nil, err
	}

	return &types.QueryGetAllProviderPricesResponse{Prices: prices}, nil
}

// GetProvider returns a provider's metadata.
func (k Querier) GetProvider(goCtx context.Context, req *types.QueryGetProviderRequest) (*types.QueryGetProviderResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}

	ctx := sdk.UnwrapSDKContext(goCtx)
	info, err := k.Keeper.Providers.Get(ctx, req.Provider)
	if err != nil {
		return nil, status.Error(codes.NotFound, fmt.Sprintf("provider %s not found", req.Provider))
	}

	return &types.QueryGetProviderResponse{ProviderInfo: info}, nil
}

// GetAllProviders returns all registered providers.
func (k Querier) GetAllProviders(goCtx context.Context, req *types.QueryGetAllProvidersRequest) (*types.QueryGetAllProvidersResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}

	ctx := sdk.UnwrapSDKContext(goCtx)
	var providers []types.ProviderInfo
	err := k.Keeper.Providers.Walk(ctx, nil, func(key string, value types.ProviderInfo) (bool, error) {
		providers = append(providers, value)
		return false, nil
	})
	if err != nil {
		return nil, err
	}

	return &types.QueryGetAllProvidersResponse{Providers: providers}, nil
}

// GetOracleInfo returns metadata for a symbol.
func (k Querier) GetOracleInfo(goCtx context.Context, req *types.QueryGetOracleInfoRequest) (*types.QueryGetOracleInfoResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}

	ctx := sdk.UnwrapSDKContext(goCtx)
	info, err := k.Keeper.OracleInfos.Get(ctx, req.Symbol)
	if err != nil {
		return nil, status.Error(codes.NotFound, fmt.Sprintf("oracle info not found for symbol %s", req.Symbol))
	}

	return &types.QueryGetOracleInfoResponse{OracleInfo: info}, nil
}
