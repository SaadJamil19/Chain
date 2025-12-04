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
