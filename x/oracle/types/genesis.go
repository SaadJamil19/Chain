package types

import (
	"fmt"

	"cosmossdk.io/math"
)

// DefaultIndex is the default global index
const DefaultIndex uint64 = 1

// DefaultGenesis returns the default genesis state
func DefaultGenesis() *GenesisState {
	return &GenesisState{

		Params: DefaultParams(),
	}
}

// Validate performs basic genesis state validation returning an error upon any
// failure.
func (gs GenesisState) Validate() error {

	if err := gs.Params.Validate(); err != nil {
		return err
	}

	// Track seen keys to avoid duplicates
	priceSeen := make(map[string]struct{})
	for _, p := range gs.Prices {
		if p.Asset == "" {
			return fmt.Errorf("price asset cannot be empty")
		}
		if _, err := math.LegacyNewDecFromStr(p.Price); err != nil {
			return fmt.Errorf("invalid price for asset %s: %w", p.Asset, err)
		}
		if _, ok := priceSeen[p.Asset]; ok {
			return fmt.Errorf("duplicate price entry for asset %s", p.Asset)
		}
		priceSeen[p.Asset] = struct{}{}
	}

	providerSeen := make(map[string]struct{})
	for _, p := range gs.Providers {
		if p.Provider == "" {
			return fmt.Errorf("provider name cannot be empty")
		}
		if _, ok := providerSeen[p.Provider]; ok {
			return fmt.Errorf("duplicate provider entry for %s", p.Provider)
		}
		providerSeen[p.Provider] = struct{}{}
	}

	validatorPriceSeen := make(map[string]struct{})
	for _, vp := range gs.ValidatorPrices {
		if vp.Validator == "" {
			return fmt.Errorf("validator address cannot be empty")
		}
		if vp.Asset == "" {
			return fmt.Errorf("validator price asset cannot be empty")
		}
		if _, err := math.LegacyNewDecFromStr(vp.Price); err != nil {
			return fmt.Errorf("invalid validator price for asset %s: %w", vp.Asset, err)
		}
		key := fmt.Sprintf("%s-%s", vp.Validator, vp.Asset)
		if _, ok := validatorPriceSeen[key]; ok {
			return fmt.Errorf("duplicate validator price entry for %s/%s", vp.Validator, vp.Asset)
		}
		validatorPriceSeen[key] = struct{}{}
	}

	oracleSeen := make(map[string]struct{})
	for _, oi := range gs.OracleInfos {
		if oi.Symbol == "" {
			return fmt.Errorf("oracle info symbol cannot be empty")
		}
		if _, ok := oracleSeen[oi.Symbol]; ok {
			return fmt.Errorf("duplicate oracle info for symbol %s", oi.Symbol)
		}
		oracleSeen[oi.Symbol] = struct{}{}
	}

	return nil
}
