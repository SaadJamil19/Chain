package types

import (
	"cosmossdk.io/errors"
	"cosmossdk.io/math"
	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
)

var (
	_ sdk.Msg = &MsgUpdateParams{}
	_ sdk.Msg = &MsgPostPrice{}
	_ sdk.Msg = &MsgRelayProviderPrices{}
	_ sdk.Msg = &MsgRegisterProvider{}
	_ sdk.Msg = &MsgUpdateProvider{}
)

// -------------------------------------------------------------------------
// MsgUpdateParams
// -------------------------------------------------------------------------

func (msg *MsgUpdateParams) Route() string { return ModuleName }
func (msg *MsgUpdateParams) Type() string  { return "update_params" }

func (msg *MsgUpdateParams) GetSigners() []sdk.AccAddress {
	authority, err := sdk.AccAddressFromBech32(msg.Authority)
	if err != nil {
		panic(err)
	}
	return []sdk.AccAddress{authority}
}

func (msg *MsgUpdateParams) GetSignBytes() []byte {
	bz := AminoCdc.MustMarshalJSON(msg)
	return sdk.MustSortJSON(bz)
}

func (msg *MsgUpdateParams) ValidateBasic() error {
	_, err := sdk.AccAddressFromBech32(msg.Authority)
	if err != nil {
		return errors.Wrapf(sdkerrors.ErrInvalidAddress, "invalid authority address (%s)", msg.Authority)
	}
	if err := msg.Params.Validate(); err != nil {
		return errors.Wrap(sdkerrors.ErrInvalidRequest, err.Error())
	}
	return nil
}

// -------------------------------------------------------------------------
// ✅ NEW LOGIC: MsgPostPrice
// -------------------------------------------------------------------------

func NewMsgPostPrice(creator string, asset string, price string) *MsgPostPrice {
	return &MsgPostPrice{
		Creator: creator,
		Asset:   asset,
		Price:   price, // Price is now a string in Pulsar
	}
}

func (msg *MsgPostPrice) Route() string { return ModuleName }
func (msg *MsgPostPrice) Type() string  { return "post_price" }

func (msg *MsgPostPrice) GetSigners() []sdk.AccAddress {
	creator, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		panic(err)
	}
	return []sdk.AccAddress{creator}
}

func (msg *MsgPostPrice) GetSignBytes() []byte {
	bz := AminoCdc.MustMarshalJSON(msg)
	return sdk.MustSortJSON(bz)
}

func (msg *MsgPostPrice) ValidateBasic() error {
	_, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		return errors.Wrapf(sdkerrors.ErrInvalidAddress, "invalid creator address (%s)", msg.Creator)
	}
	if msg.Asset == "" {
		return errors.Wrap(sdkerrors.ErrInvalidRequest, "asset cannot be empty")
	}

	if msg.Price == "" {
		return errors.Wrap(sdkerrors.ErrInvalidRequest, "price cannot be empty")
	}

	// Validate that price is a valid decimal string
	_, err = math.LegacyNewDecFromStr(msg.Price)
	if err != nil {
		return errors.Wrap(sdkerrors.ErrInvalidRequest, "price must be a valid decimal")
	}

	// Validate price is not negative
	price, _ := math.LegacyNewDecFromStr(msg.Price)
	if price.IsNegative() {
		return errors.Wrap(sdkerrors.ErrInvalidRequest, "price cannot be negative")
	}

	return nil
}

// -------------------------------------------------------------------------
// MsgRelayProviderPrices
// -------------------------------------------------------------------------

func (msg *MsgRelayProviderPrices) Route() string { return ModuleName }
func (msg *MsgRelayProviderPrices) Type() string  { return "relay_provider_prices" }

func (msg *MsgRelayProviderPrices) GetSigners() []sdk.AccAddress {
	sender, err := sdk.AccAddressFromBech32(msg.Sender)
	if err != nil {
		panic(err)
	}
	return []sdk.AccAddress{sender}
}

func (msg *MsgRelayProviderPrices) GetSignBytes() []byte {
	bz := AminoCdc.MustMarshalJSON(msg)
	return sdk.MustSortJSON(bz)
}

func (msg *MsgRelayProviderPrices) ValidateBasic() error {
	if _, err := sdk.AccAddressFromBech32(msg.Sender); err != nil {
		return errors.Wrapf(sdkerrors.ErrInvalidAddress, "invalid sender address (%s)", msg.Sender)
	}
	if msg.Provider == "" {
		return errors.Wrap(sdkerrors.ErrInvalidRequest, "provider cannot be empty")
	}
	if len(msg.Symbols) == 0 {
		return errors.Wrap(sdkerrors.ErrInvalidRequest, "symbols cannot be empty")
	}
	if len(msg.Symbols) != len(msg.Prices) {
		return errors.Wrap(sdkerrors.ErrInvalidRequest, "symbols and prices length mismatch")
	}

	for i, symbol := range msg.Symbols {
		if symbol == "" {
			return errors.Wrapf(sdkerrors.ErrInvalidRequest, "symbol at index %d cannot be empty", i)
		}
		price := msg.Prices[i]
		if price == "" {
			return errors.Wrapf(sdkerrors.ErrInvalidRequest, "price at index %d cannot be empty", i)
		}
		dec, err := math.LegacyNewDecFromStr(price)
		if err != nil {
			return errors.Wrapf(sdkerrors.ErrInvalidRequest, "invalid price at index %d: %v", i, err)
		}
		if dec.IsNegative() {
			return errors.Wrapf(sdkerrors.ErrInvalidRequest, "price at index %d cannot be negative", i)
		}
	}

	return nil
}

// -------------------------------------------------------------------------
// MsgRegisterProvider
// -------------------------------------------------------------------------

func (msg *MsgRegisterProvider) Route() string { return ModuleName }
func (msg *MsgRegisterProvider) Type() string  { return "register_provider" }

func (msg *MsgRegisterProvider) GetSigners() []sdk.AccAddress {
	auth, err := sdk.AccAddressFromBech32(msg.Authority)
	if err != nil {
		panic(err)
	}
	return []sdk.AccAddress{auth}
}

func (msg *MsgRegisterProvider) GetSignBytes() []byte {
	bz := AminoCdc.MustMarshalJSON(msg)
	return sdk.MustSortJSON(bz)
}

func (msg *MsgRegisterProvider) ValidateBasic() error {
	if _, err := sdk.AccAddressFromBech32(msg.Authority); err != nil {
		return errors.Wrapf(sdkerrors.ErrInvalidAddress, "invalid authority address (%s)", msg.Authority)
	}
	if msg.Provider == "" {
		return errors.Wrap(sdkerrors.ErrInvalidRequest, "provider cannot be empty")
	}
	if len(msg.Relayers) == 0 {
		return errors.Wrap(sdkerrors.ErrInvalidRequest, "relayers cannot be empty")
	}
	for _, r := range msg.Relayers {
		if _, err := sdk.AccAddressFromBech32(r); err != nil {
			return errors.Wrapf(sdkerrors.ErrInvalidAddress, "invalid relayer address (%s)", r)
		}
	}
	return nil
}

// -------------------------------------------------------------------------
// MsgUpdateProvider
// -------------------------------------------------------------------------

func (msg *MsgUpdateProvider) Route() string { return ModuleName }
func (msg *MsgUpdateProvider) Type() string  { return "update_provider" }

func (msg *MsgUpdateProvider) GetSigners() []sdk.AccAddress {
	auth, err := sdk.AccAddressFromBech32(msg.Authority)
	if err != nil {
		panic(err)
	}
	return []sdk.AccAddress{auth}
}

func (msg *MsgUpdateProvider) GetSignBytes() []byte {
	bz := AminoCdc.MustMarshalJSON(msg)
	return sdk.MustSortJSON(bz)
}

func (msg *MsgUpdateProvider) ValidateBasic() error {
	if _, err := sdk.AccAddressFromBech32(msg.Authority); err != nil {
		return errors.Wrapf(sdkerrors.ErrInvalidAddress, "invalid authority address (%s)", msg.Authority)
	}
	if msg.Provider == "" {
		return errors.Wrap(sdkerrors.ErrInvalidRequest, "provider cannot be empty")
	}
	for _, r := range msg.Relayers {
		if _, err := sdk.AccAddressFromBech32(r); err != nil {
			return errors.Wrapf(sdkerrors.ErrInvalidAddress, "invalid relayer address (%s)", r)
		}
	}
	return nil
}
