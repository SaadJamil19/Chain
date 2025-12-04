package module

import (
	autocliv1 "cosmossdk.io/api/cosmos/autocli/v1"
	modulev1 "github.com/rollchains/rollchain/api/oracle/v1"
)

// AutoCLIOptions implements the autocli.HasAutoCLIConfig interface.
func (am AppModule) AutoCLIOptions() *autocliv1.ModuleOptions {
	return &autocliv1.ModuleOptions{
		Query: &autocliv1.ServiceCommandDescriptor{
			Service: modulev1.Query_ServiceDesc.ServiceName,
			RpcCommandOptions: []*autocliv1.RpcCommandOptions{
				{
					RpcMethod: "Params",
					Use:       "params",
					Short:     "Query the current consensus parameters",
				},
				{
					RpcMethod: "GetPrice",
					Use:       "get-price [asset]",
					Short:     "Query the price for a specific asset",
					Long:      "Query the price for a specific asset (e.g., BTC, ETH)",
					Example:   "$ rolld query oracle get-price BTC",
					PositionalArgs: []*autocliv1.PositionalArgDescriptor{
						{
							ProtoField: "asset",
						},
					},
				},
			},
		},
		Tx: &autocliv1.ServiceCommandDescriptor{
			Service: modulev1.Msg_ServiceDesc.ServiceName,
			RpcCommandOptions: []*autocliv1.RpcCommandOptions{
				{
					RpcMethod: "PostPrice",
					Use:       "post-price [asset] [price]",
					Short:     "Post a price for an asset",
					Long:      "Post a price for a specific asset (e.g., BTC) with a decimal price value",
					Example:   "$ rolld tx oracle post-price BTC 45000.50 --from mykey",
					PositionalArgs: []*autocliv1.PositionalArgDescriptor{
						{
							ProtoField: "asset",
						},
						{
							ProtoField: "price",
						},
					},
				},
				{
					RpcMethod: "UpdateParams",
					Skip:      false, // set to true if authority gated
				},
			},
		},
	}
}
