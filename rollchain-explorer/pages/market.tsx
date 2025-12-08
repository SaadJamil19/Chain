import { useMemo } from 'react';
import { useRollchainClient } from '../hooks/useRollchainClient';

const topTokens = [
  { symbol: 'ROLL', name: 'Rollchain', price: 1.92, change: 3.4, cap: 215_000_000, volume: 12_800_000 },
  { symbol: 'uROLL', name: 'Roll Utility', price: 0.42, change: -1.2, cap: 62_000_000, volume: 4_600_000 },
  { symbol: 'RUSD', name: 'Roll Stable', price: 0.99, change: 0.1, cap: 48_000_000, volume: 6_200_000 },
  { symbol: 'BRIDGE', name: 'Bridge Token', price: 3.51, change: 8.7, cap: 96_000_000, volume: 18_100_000 },
  { symbol: 'SPARK', name: 'Spark Credit', price: 0.13, change: 14.2, cap: 32_500_000, volume: 1_400_000 }
];

const moverList = [
  { symbol: 'THROB', value: 0.008, change: 21.5 },
  { symbol: 'HELLO', value: 0.42, change: 12.3 },
  { symbol: 'STZIG', value: 14.8, change: -6.4 }
];

const liquidityPools = [
  { name: 'ROLL / uROLL', tvl: 18_400_000, apr: 12.5 },
  { name: 'ROLL / RUSD', tvl: 12_100_000, apr: 10.3 },
  { name: 'SPARK / RUSD', tvl: 4_900_000, apr: 18.2 }
];

export default function MarketPage() {
  const { networkStatus } = useRollchainClient();

  const marketCap = useMemo(
    () => topTokens.reduce((sum, token) => sum + token.cap, 0),
    []
  );

  const volume24h = useMemo(
    () => topTokens.reduce((sum, token) => sum + token.volume, 0),
    []
  );

  const avgChange = useMemo(
    () => topTokens.reduce((sum, token) => sum + token.change, 0) / topTokens.length,
    []
  );

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">Market Dashboard</h1>
          <p className="page-subtitle">Token performance across the Rollchain ecosystem ({networkStatus.chainId || 'Testnet'})</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <span className="stat-label">Tracked Market Cap</span>
            <span className="stat-value">${marketCap.toLocaleString()}</span>
            <span className="stat-helper">Across {topTokens.length} tokens</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <span className="stat-label">24h Volume</span>
            <span className="stat-value">${volume24h.toLocaleString()}</span>
            <span className="stat-helper">DEX + CEX feeds</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <span className="stat-label">Avg Daily Change</span>
            <span className="stat-value">{avgChange.toFixed(2)}%</span>
            <span className="stat-helper">Top market movers</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🌐</div>
          <div className="stat-content">
            <span className="stat-label">Price Oracles</span>
            <span className="stat-value">CMC · DexScreener · Custom feeds</span>
            <span className="stat-helper">Realtime aggregator</span>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="section-header">
          <div className="section-title">
            <h2>Top Tokens</h2>
          </div>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Token</th>
                <th>Price</th>
                <th>24h Change</th>
                <th>Market Cap</th>
                <th>Volume (24h)</th>
              </tr>
            </thead>
            <tbody>
              {topTokens.map((token) => (
                <tr key={token.symbol}>
                  <td>
                    <div className="token-meta">
                      <span className="token-symbol">{token.symbol}</span>
                      <span className="token-name">{token.name}</span>
                    </div>
                  </td>
                  <td>${token.price.toFixed(2)}</td>
                  <td>
                    <span className={token.change >= 0 ? 'badge-success' : 'badge-error'}>
                      {token.change >= 0 ? '+' : ''}{token.change.toFixed(2)}%
                    </span>
                  </td>
                  <td>${token.cap.toLocaleString()}</td>
                  <td>${token.volume.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-section">
          <div className="section-header">
            <div className="section-title">
              <h2>Top Movers</h2>
            </div>
          </div>
          <div className="card movers">
            {moverList.map((mover) => (
              <div key={mover.symbol} className="mover-row">
                <div>
                  <div className="token-symbol">{mover.symbol}</div>
                  <div className="small-text">${mover.value.toFixed(4)}</div>
                </div>
                <div className={mover.change >= 0 ? 'text-success' : 'text-error'}>
                  {mover.change >= 0 ? '+' : ''}{mover.change.toFixed(2)}%
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <div className="section-title">
              <h2>Liquidity Pools</h2>
            </div>
          </div>
          <div className="card">
            {liquidityPools.map((pool) => (
              <div key={pool.name} className="supply-row">
                <div>
                  <div className="small-text">{pool.name}</div>
                  <div className="value">TVL ${pool.tvl.toLocaleString()}</div>
                </div>
                <div className="badge-info">APR {pool.apr.toFixed(1)}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
