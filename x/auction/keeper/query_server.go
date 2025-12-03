package keeper

import (
	"context"
	"fmt"
	"time"

	sdk "github.com/cosmos/cosmos-sdk/types"

	"github.com/rollchains/rollchain/x/auction/types"
)

var _ types.QueryServer = Querier{}

type Querier struct {
	Keeper
}

func NewQuerier(keeper Keeper) Querier {
	return Querier{Keeper: keeper}
}

func (k Querier) Params(c context.Context, req *types.QueryParamsRequest) (*types.QueryParamsResponse, error) {
	ctx := sdk.UnwrapSDKContext(c)

	p, err := k.Keeper.Params.Get(ctx)
	if err != nil {
		return nil, err
	}

	return &types.QueryParamsResponse{Params: &p}, nil
}

// Auction implements types.QueryServer.
func (k Querier) Auction(goCtx context.Context, req *types.QueryAuctionRequest) (*types.QueryAuctionResponse, error) {
    if req == nil {
        return nil, fmt.Errorf("empty request")
    }

    auction, err := k.Keeper.Auctions.Get(goCtx, req.AuctionId)
    if err != nil {
        return nil, fmt.Errorf("auction not found")
    }

    return &types.QueryAuctionResponse{
        Auction: &auction,
    }, nil
}

// Auctions implements types.QueryServer.
func (k Querier) Auctions(goCtx context.Context, req *types.QueryAuctionsRequest) (*types.QueryAuctionsResponse, error) {
    auctions := []*types.Auction{}

    err := k.Keeper.Auctions.Walk(goCtx, nil, func(id string, a types.Auction) (stop bool, err error) {
        aa := a
        auctions = append(auctions, &aa)
        return false, nil
    })
    if err != nil {
        return nil, err
    }

    return &types.QueryAuctionsResponse{
        Auctions: auctions,
    }, nil
}

// AuctionStatus implements types.QueryServer.
func (k Querier) AuctionStatus(goCtx context.Context, req *types.QueryAuctionStatusRequest) (*types.QueryAuctionStatusResponse, error) {
    auction, err := k.Keeper.Auctions.Get(goCtx, req.AuctionId)
    if err != nil {
        return nil, fmt.Errorf("auction not found")
    }

    status := "OPEN"

    end, err := time.Parse(time.RFC3339, auction.EndTime)
    if err == nil && time.Now().After(end) {
        status = "CLOSED"
    }

    return &types.QueryAuctionStatusResponse{
        Status: status,
    }, nil
}
