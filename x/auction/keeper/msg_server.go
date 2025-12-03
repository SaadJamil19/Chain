package keeper

import (
	"context"
	"fmt"


	govtypes "github.com/cosmos/cosmos-sdk/x/gov/types"

	"cosmossdk.io/errors"
	"github.com/rollchains/rollchain/x/auction/types"
	//sdk "github.com/cosmos/cosmos-sdk/types"
	sdkmath "cosmossdk.io/math"
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

	return nil, ms.k.Params.Set(ctx, msg.Params)
}

// StartAuction implements types.MsgServer.
func (ms msgServer) StartAuction(ctx context.Context, msg *types.MsgStartAuction) (*types.MsgStartAuctionResponse, error) {
    if err := ms.k.StartAuction(ctx, msg); err != nil {
        return nil, err
    }
    return &types.MsgStartAuctionResponse{}, nil
}


// PlaceBid implements types.MsgServer.
func (ms msgServer) PlaceBid(ctx context.Context, msg *types.MsgPlaceBid) (*types.MsgPlaceBidResponse, error) {
    amount, ok := sdkmath.NewIntFromString(msg.BidAmount)
    if !ok {
        return nil, fmt.Errorf("invalid bid_amount")
    }

    if err := ms.k.PlaceBid(ctx, msg.AuctionId, msg.Bidder, amount); err != nil {
        return nil, err
    }

    return &types.MsgPlaceBidResponse{}, nil
}
