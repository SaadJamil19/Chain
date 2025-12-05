package keeper

import (
	"context"
	"fmt"

	"cosmossdk.io/collections"
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
func (ms msgServer) PostPrice(ctx context.Context, msg *types.MsgPostPrice) (*types.MsgPostPriceResponse, error) {
	if err := msg.ValidateBasic(); err != nil {
		return nil, err
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

	// Track validator-specific submissions
	validatorPrice := types.ValidatorPrice{
		Validator: msg.Creator,
		Asset:     msg.Asset,
		Price:     msg.Price,
		Timestamp: newPrice.Timestamp,
	}
	if err := ms.k.ValidatorPrices.Set(ctx, collections.Join(msg.Creator, msg.Asset), validatorPrice); err != nil {
		return nil, err
	}

	return &types.MsgPostPriceResponse{}, nil
}

// RelayProviderPrices allows an authorized relayer to submit prices from an external provider.
func (ms msgServer) RelayProviderPrices(ctx context.Context, msg *types.MsgRelayProviderPrices) (*types.MsgRelayProviderPricesResponse, error) {
	if err := msg.ValidateBasic(); err != nil {
		return nil, err
	}

	providerInfo, err := ms.k.Providers.Get(ctx, msg.Provider)
	if err != nil {
		return nil, errors.Wrapf(err, "provider %s not found", msg.Provider)
	}

	if !providerInfo.IsActive {
		return nil, fmt.Errorf("provider %s is not active", msg.Provider)
	}

	authorized := false
	for _, relayer := range providerInfo.Relayers {
		if relayer == msg.Sender {
			authorized = true
			break
		}
	}
	if !authorized {
		return nil, fmt.Errorf("sender %s not authorized for provider %s", msg.Sender, msg.Provider)
	}

	sdkCtx := sdk.UnwrapSDKContext(ctx)
	ts := msg.Timestamp
	if ts == 0 {
		ts = sdkCtx.BlockTime().Unix()
	}

	for i, symbol := range msg.Symbols {
		priceStr := msg.Prices[i]
		price := types.Price{
			Asset:     symbol,
			Price:     priceStr,
			Source:    msg.Provider,
			Timestamp: uint64(ts),
		}

		// Save per-provider price
		if err := ms.k.ProviderPrices.Set(ctx, collections.Join(msg.Provider, symbol), price); err != nil {
			return nil, err
		}

		// Also update the aggregate/latest price for the asset
		if err := ms.k.Prices.Set(ctx, symbol, price); err != nil {
			return nil, err
		}
	}

	return &types.MsgRelayProviderPricesResponse{}, nil
}

// RegisterProvider allows the module authority to register a provider and its relayers.
func (ms msgServer) RegisterProvider(ctx context.Context, msg *types.MsgRegisterProvider) (*types.MsgRegisterProviderResponse, error) {
	if err := msg.ValidateBasic(); err != nil {
		return nil, err
	}

	if msg.Authority != ms.k.authority {
		return nil, errors.Wrapf(govtypes.ErrInvalidSigner, "invalid authority; expected %s, got %s", ms.k.authority, msg.Authority)
	}

	// Default to active on creation
	info := types.ProviderInfo{
		Provider:    msg.Provider,
		Relayers:    msg.Relayers,
		IsActive:    true,
		Description: msg.Description,
	}

	if err := ms.k.Providers.Set(ctx, msg.Provider, info); err != nil {
		return nil, err
	}

	return &types.MsgRegisterProviderResponse{}, nil
}

// UpdateProvider allows the module authority to update provider relayers or status.
func (ms msgServer) UpdateProvider(ctx context.Context, msg *types.MsgUpdateProvider) (*types.MsgUpdateProviderResponse, error) {
	if err := msg.ValidateBasic(); err != nil {
		return nil, err
	}

	if msg.Authority != ms.k.authority {
		return nil, errors.Wrapf(govtypes.ErrInvalidSigner, "invalid authority; expected %s, got %s", ms.k.authority, msg.Authority)
	}

	info, err := ms.k.Providers.Get(ctx, msg.Provider)
	if err != nil {
		return nil, errors.Wrapf(err, "provider %s not found", msg.Provider)
	}

	info.Relayers = msg.Relayers
	info.IsActive = msg.IsActive
	info.Description = msg.Description

	if err := ms.k.Providers.Set(ctx, msg.Provider, info); err != nil {
		return nil, err
	}

	return &types.MsgUpdateProviderResponse{}, nil
}
