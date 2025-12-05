package types

import (
	"encoding/json"
	"fmt"
)

// DefaultParams returns default module parameters.
func DefaultParams() Params {
	return Params{
		MinValidatorsForMedian: 1,
		MaxPriceAge:            3600, // seconds; matches 60 min refresh target
		AllowNegativeSettlement: false,
	}
}

// Stringer method for Params.
func (p Params) String() string {
	bz, err := json.Marshal(p)
	if err != nil {
		panic(err)
	}

	return string(bz)
}

// Validate does the sanity check on the params.
func (p Params) Validate() error {
	if p.MinValidatorsForMedian == 0 {
		return fmt.Errorf("min_validators_for_median must be > 0")
	}
	if p.MaxPriceAge <= 0 {
		return fmt.Errorf("max_price_age must be > 0")
	}
	return nil
}
