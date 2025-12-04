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
				{
					RpcMethod: "GetProviderPrice",
					Use:       "provider-price [provider] [symbol]",
					Short:     "Query a provider price for a symbol",
					PositionalArgs: []*autocliv1.PositionalArgDescriptor{
						{ProtoField: "provider"},
						{ProtoField: "symbol"},
					},
				},
				{
					RpcMethod: "GetAllProviderPrices",
					Use:       "provider-prices [provider]",
					Short:     "Query all prices for a provider",
					PositionalArgs: []*autocliv1.PositionalArgDescriptor{
						{ProtoField: "provider"},
					},
				},
				{
					RpcMethod: "GetProvider",
					Use:       "provider [provider]",
					Short:     "Get provider metadata",
					PositionalArgs: []*autocliv1.PositionalArgDescriptor{
						{ProtoField: "provider"},
					},
				},
				{
					RpcMethod: "GetAllProviders",
					Use:       "providers",
					Short:     "List all providers",
				},
				{
					RpcMethod: "GetOracleInfo",
					Use:       "oracle-info [symbol]",
					Short:     "Get oracle metadata for a symbol",
					PositionalArgs: []*autocliv1.PositionalArgDescriptor{
						{ProtoField: "symbol"},
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
				{
					RpcMethod: "RegisterProvider",
					Use:       "register-provider [provider]",
					Short:     "Register a new price provider (authority only)",
					PositionalArgs: []*autocliv1.PositionalArgDescriptor{
						{ProtoField: "provider"},
					},
				},
				{
					RpcMethod: "UpdateProvider",
					Use:       "update-provider [provider]",
					Short:     "Update provider relayers/metadata (authority only)",
					PositionalArgs: []*autocliv1.PositionalArgDescriptor{
						{ProtoField: "provider"},
					},
				},
				{
					RpcMethod: "RelayProviderPrices",
					Use:       "relay-provider-prices [provider] [symbols] [prices]",
					Short:     "Relay provider prices (authorized relayer)",
					Long:      "Relay provider prices. symbols and prices should be comma-separated lists with the same length.",
					PositionalArgs: []*autocliv1.PositionalArgDescriptor{
						{ProtoField: "provider"},
						{ProtoField: "symbols"},
						{ProtoField: "prices"},
					},
				},
			},
		},
	}
}
