package keeper

import (
	"context"
	"fmt"

	sdk "github.com/cosmos/cosmos-sdk/types"
	govtypes "github.com/cosmos/cosmos-sdk/x/gov/types"

	"cosmossdk.io/errors"
	"github.com/rollchains/rollchain/x/oracle/types"
)

type msgServer struct {
	k Keeper
}

var _ types.MsgServer = msgServer{}

// NewMsgServerImpl returns an implementation of the module MsgServer interface.
func NewMsgServerImpl(keeper Keeper) types.MsgServer {
	return &msgServer{k: keeper}
}

func (ms msgServer) UpdateParams(ctx context.Context, msg *types.MsgUpdateParams) (*types.MsgUpdateParamsResponse, error) {
	if ms.k.authority != msg.Authority {
		return nil, errors.Wrapf(govtypes.ErrInvalidSigner, "invalid authority; expected %s, got %s", ms.k.authority, msg.Authority)
	}

	if err := ms.k.Params.Set(ctx, msg.Params); err != nil {
		return nil, err
	}

	return &types.MsgUpdateParamsResponse{}, nil
}

// PostPrice implements types.MsgServer.
// PostPrice implements types.MsgServer.
func (ms msgServer) PostPrice(ctx context.Context, msg *types.MsgPostPrice) (*types.MsgPostPriceResponse, error) {
	// 1. Validation
	if msg.Asset == "" {
		return nil, fmt.Errorf("asset cannot be empty")
	}

	if msg.Price == "" {
		return nil, fmt.Errorf("price cannot be empty")
	}

	// 2. Get Context for Timestamp
	sdkCtx := sdk.UnwrapSDKContext(ctx)

	// 3. Create the Price Object
	newPrice := types.Price{
		Asset:     msg.Asset,
		Price:     msg.Price,
		Source:    msg.Creator,
		Timestamp: uint64(sdkCtx.BlockTime().Unix()),
	}

	// 4. Save to Store
	if err := ms.k.Prices.Set(ctx, msg.Asset, newPrice); err != nil {
		return nil, err
	}

	return &types.MsgPostPriceResponse{}, nil
}
