import { useMemo } from 'react';
import { useRollchainClient } from '../hooks/useRollchainClient';

const supplyBreakdown = [
  { label: 'Total Supply', value: 120_000_000, helper: '+0.8% MoM', tone: 'primary' },
  { label: 'Circulating', value: 86_500_000, helper: '72.0% of total', tone: 'success' },
  { label: 'Non-Circulating', value: 33_500_000, helper: 'Foundation, vesting, reserves', tone: 'warning' },
  { label: 'Community Pool', value: 4_200_000, helper: 'Grants + ecosystem growth', tone: 'info' }
];

const reserveAllocations = [
  { name: 'Validator Incentives', amount: 12_000_000 },
  { name: 'Treasury', amount: 8_500_000 },
  { name: 'Strategic Partners', amount: 6_000_000 },
  { name: 'Emergency Liquidity', amount: 7_000_000 }
];

const stakeChannels = [
  { label: 'Bonded', value: 48_250_000, change: '+2.1% WoW' },
  { label: 'Unbonding', value: 1_150_000, change: '-0.4% WoW' },
  { label: 'Liquid Staking', value: 5_560_000, change: '+4.3% WoW' }
];

const supplyTimeline = [
  { label: 'Day -6', total: 118.4, circulating: 84.7 },
  { label: 'Day -5', total: 118.7, circulating: 85.1 },
  { label: 'Day -4', total: 119.1, circulating: 85.4 },
  { label: 'Day -3', total: 119.5, circulating: 85.9 },
  { label: 'Day -2', total: 119.8, circulating: 86.1 },
  { label: 'Day -1', total: 120.0, circulating: 86.3 },
  { label: 'Today', total: 120.2, circulating: 86.5 }
];

export default function SupplyPage() {
  const { networkStatus } = useRollchainClient();

  const stakingRatio = useMemo(() => {
    const bonded = stakeChannels[0].value;
    return `${((bonded / supplyBreakdown[0].value) * 100).toFixed(1)}%`;
  }, []);

  const chartScale = useMemo(() => {
    const max = Math.max(...supplyTimeline.map((point) => point.total));
    return 100 / max;
  }, []);

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">Supply Dashboard</h1>
          <p className="page-subtitle">
            Visibility into circulating, locked, and staked ROLL on {networkStatus.chainId || 'Rollchain Testnet'}
          </p>
        </div>
      </div>

      <div className="stats-grid supply-grid">
        {supplyBreakdown.map((card) => (
          <div key={card.label} className="stat-card">
            <div className="stat-icon">{card.tone === 'success' ? '✅' : card.tone === 'warning' ? '⚠️' : '📦'}</div>
            <div className="stat-content">
              <span className="stat-label">{card.label}</span>
              <span className="stat-value">{card.value.toLocaleString()} ROLL</span>
              <span className="stat-helper">{card.helper}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-section">
          <div className="section-header">
            <div className="section-title">
              <h2>Supply Trend (7d)</h2>
            </div>
          </div>
          <div className="card chart-card">
            <div className="chart-grid">
              {supplyTimeline.map((point) => (
                <div key={point.label} className="chart-column">
                  <div className="chart-bar total" style={{ height: `${point.total * chartScale}%` }}>
                    <span>{point.total.toFixed(1)}M</span>
                  </div>
                  <div className="chart-bar circulating" style={{ height: `${point.circulating * chartScale}%` }}>
                    <span>{point.circulating.toFixed(1)}M</span>
                  </div>
                  <div className="chart-label">{point.label}</div>
                </div>
              ))}
            </div>
            <div className="chart-legend">
              <span className="legend-item"><i className="dot dot-total" />Total Supply</span>
              <span className="legend-item"><i className="dot dot-circulating" />Circulating</span>
            </div>
          </div>
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <div className="section-title">
              <h2>Staking Composition</h2>
            </div>
          </div>
          <div className="card">
            <div className="helper">Network staking ratio: {stakingRatio}</div>
            <div className="supply-list">
              {stakeChannels.map((item) => (
                <div key={item.label} className="supply-row">
                  <div>
                    <div className="small-text">{item.label}</div>
                    <div className="value">{item.value.toLocaleString()} ROLL</div>
                  </div>
                  <div className="badge-info">{item.change}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-section">
          <div className="section-header">
            <div className="section-title">
              <h2>Reserve Allocations</h2>
            </div>
          </div>
          <div className="card">
            <div className="supply-list">
              {reserveAllocations.map((bucket) => (
                <div key={bucket.name} className="supply-row">
                  <div>
                    <div className="small-text">{bucket.name}</div>
                    <div className="value">{bucket.amount.toLocaleString()} ROLL</div>
                  </div>
                  <div className="bar-track">
                    <div
                      className="bar-fill"
                      style={{ width: `${(bucket.amount / supplyBreakdown[0].value) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <div className="section-title">
              <h2>Key Takeaways</h2>
            </div>
          </div>
          <div className="card insights">
            <ul>
              <li>Circulating supply grew steadily with 0.4% weekly expansion.</li>
              <li>Bonded stake crossed 48M ROLL keeping security ratio above 40%.</li>
              <li>Community pool now controls 3.5% of supply for ecosystem grants.</li>
              <li>Reserve allocations remain diversified across incentives and strategic partners.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
