package module

import (
	autocliv1 "cosmossdk.io/api/cosmos/autocli/v1"
	modulev1 "github.com/rollchains/rollchain/api/auction/v1"
)

// AutoCLIOptions implements the autocli.HasAutoCLIConfig interface.
func (am AppModule) AutoCLIOptions() *autocliv1.ModuleOptions {
    return &autocliv1.ModuleOptions{
        Query: &autocliv1.ServiceCommandDescriptor{
            Service: modulev1.Query_ServiceDesc.ServiceName,
            RpcCommandOptions: []*autocliv1.RpcCommandOptions{
                {
                    RpcMethod: "Auction",
                    Use:       "auction [auction-id]",
                    Short:     "Get a single auction by id",
                    PositionalArgs: []*autocliv1.PositionalArgDescriptor{
                        {ProtoField: "auction_id"},
                    },
                },
                {
                    RpcMethod: "Auctions",
                    Use:       "auctions",
                    Short:     "List all auctions",
                },
                {
                    RpcMethod: "AuctionStatus",
                    Use:       "status [auction-id]",
                    Short:     "Get status (OPEN/CLOSED) of an auction",
                    PositionalArgs: []*autocliv1.PositionalArgDescriptor{
                        {ProtoField: "auction_id"},
                    },
                },
                {
                    RpcMethod: "Params",
                    Use:       "params",
                    Short:     "Query module params",
                },
            },
        },
        Tx: &autocliv1.ServiceCommandDescriptor{
            Service: modulev1.Msg_ServiceDesc.ServiceName,
            RpcCommandOptions: []*autocliv1.RpcCommandOptions{
                {
                    RpcMethod: "StartAuction",
                    Use:       "start-auction [auction-id] [start-time] [end-time] [initial-price]",
                    Short:     "Start a new auction",
                    PositionalArgs: []*autocliv1.PositionalArgDescriptor{
                        {ProtoField: "auction_id"},
                        {ProtoField: "start_time"},
                        {ProtoField: "end_time"},
                        {ProtoField: "initial_price"},
                    },
                },
                {
                    RpcMethod: "PlaceBid",
                    Use:       "place-bid [auction-id] [bid-amount]",
                    Short:     "Place a bid on an auction",
                    PositionalArgs: []*autocliv1.PositionalArgDescriptor{
                        {ProtoField: "auction_id"},
                        {ProtoField: "bid_amount"},
                    },
                },
                {
                    RpcMethod: "UpdateParams",
                    Skip:      false,
                },
            },
        },
    }
}