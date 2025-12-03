package keeper

import (
    "context"
    "fmt"
    "time"

    //sdktypes "github.com/cosmos/cosmos-sdk/types"
    types "github.com/rollchains/rollchain/x/auction/types"
	sdkmath "cosmossdk.io/math"
)

// StartAuction creates and stores a new auction
func (k Keeper) StartAuction(ctx context.Context, msg *types.MsgStartAuction) error {
    // parse times
    start, err := time.Parse(time.RFC3339, msg.StartTime)
    if err != nil {
        return fmt.Errorf("invalid start_time: %w", err)
    }

    end, err := time.Parse(time.RFC3339, msg.EndTime)
    if err != nil {
        return fmt.Errorf("invalid end_time: %w", err)
    }

    if !end.After(start) {
        return fmt.Errorf("end_time must be after start_time")
    }

    // parse price
    initialPrice, ok := sdkmath.NewIntFromString(msg.InitialPrice)
    if !ok {
        return fmt.Errorf("invalid initial_price")
    }

    // basic: ensure auctionID not already taken
    _, err = k.Auctions.Get(ctx, msg.AuctionId)
    if err == nil {
        return fmt.Errorf("auction already exists with id %s", msg.AuctionId)
    }

    auction := types.Auction{
        Id:            msg.AuctionId,
        Creator:       msg.Creator,
        StartTime:     start.Format(time.RFC3339),
        EndTime:       end.Format(time.RFC3339),
        InitialPrice:  initialPrice.String(),
        HighestBid:    "0",
        HighestBidder: "",
        Status:        types.AuctionStatus_AUCTION_STATUS_OPEN,
        Bids:          []*types.Bid{},
    }

    return k.Auctions.Set(ctx, msg.AuctionId, auction)
}

// PlaceBid applies your earlier logic but with collections.Map
func (k Keeper) PlaceBid(ctx context.Context, auctionID, bidder string, bidAmount sdkmath.Int) error {
    auction, err := k.Auctions.Get(ctx, auctionID)
    if err != nil {
        return fmt.Errorf("auction not found")
    }

    // check if auction is still open
    end, err := time.Parse(time.RFC3339, auction.EndTime)
    if err == nil && time.Now().After(end) {
        return fmt.Errorf("auction already ended")
    }

    // highest bid
    currentHighest, ok := sdkmath.NewIntFromString(auction.HighestBid)
    if !ok {
        currentHighest = sdkmath.ZeroInt()
    }

    if !bidAmount.GT(currentHighest) {
        return fmt.Errorf("bid must be higher than current highest bid")
    }

    // update auction
    auction.HighestBid = bidAmount.String()
    auction.HighestBidder = bidder

    // append bid
    auction.Bids = append(auction.Bids, &types.Bid{
        Bidder: bidder,
        Amount: bidAmount.String(),
    })

    return k.Auctions.Set(ctx, auctionID, auction)
}
