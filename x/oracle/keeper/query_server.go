package keeper

import (
	"context"
	"fmt"

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
