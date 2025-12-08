import { useMemo } from 'react';
import { useRollchainClient } from '../hooks/useRollchainClient';

const mockGrowth = [
  { label: '7d TX Count', value: 128_500, change: '+5.6%' },
  { label: '30d TX Count', value: 512_200, change: '+12.1%' },
  { label: 'Active Accounts (30d)', value: 23_840, change: '+3.2%' },
  { label: 'Contracts Deployed (30d)', value: 1_460, change: '+9.7%' }
];

const trendData = [
  { label: 'Day -6', txs: 17_200 },
  { label: 'Day -5', txs: 18_310 },
  { label: 'Day -4', txs: 19_850 },
  { label: 'Day -3', txs: 18_640 },
  { label: 'Day -2', txs: 19_120 },
  { label: 'Day -1', txs: 20_210 },
  { label: 'Today', txs: 21_170 }
];

const chainSupport = [
  { name: 'Rollchain Testnet', status: 'Live', tps: 22 },
  { name: 'Rollchain Devnet', status: 'Pilot', tps: 11 },
  { name: 'Rollchain Mainnet', status: 'Incoming', tps: 0 }
];

export default function AnalyticsPage() {
  const { blocks, transactions } = useRollchainClient();

  const avgTxPerBlock = useMemo(() => {
    if (!blocks.length) return '—';
    const slice = blocks.slice(0, 20);
    const sum = slice.reduce((total, block) => total + block.txs, 0);
    return (sum / slice.length).toFixed(2);
  }, [blocks]);

  const successRate = useMemo(() => {
    if (!transactions.length) return '—';
    const success = transactions.filter((tx) => tx.code === 0).length;
    return `${((success / transactions.length) * 100).toFixed(1)}%`;
  }, [transactions]);

  const maxTxs = Math.max(...trendData.map((point) => point.txs));
  const chartScale = 100 / maxTxs;

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">Analytics</h1>
          <p className="page-subtitle">Transaction velocity, growth trends, and chain health insights</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">⚙️</div>
          <div className="stat-content">
            <span className="stat-label">Avg TX per Block</span>
            <span className="stat-value">{avgTxPerBlock}</span>
            <span className="stat-helper">Last 20 blocks</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <span className="stat-label">Success Rate</span>
            <span className="stat-value">{successRate}</span>
            <span className="stat-helper">Recent mempool sample</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📡</div>
          <div className="stat-content">
            <span className="stat-label">API Latency</span>
            <span className="stat-value">620ms p95</span>
            <span className="stat-helper">Explorer API gateway</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📱</div>
          <div className="stat-content">
            <span className="stat-label">Mobile Usage</span>
            <span className="stat-value">42% of sessions</span>
            <span className="stat-helper">Responsive charts + alerts</span>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-section">
          <div className="section-header">
            <div className="section-title">
              <h2>Growth Overview</h2>
            </div>
          </div>
          <div className="card">
            <div className="supply-list">
              {mockGrowth.map((item) => (
                <div key={item.label} className="supply-row">
                  <div>
                    <div className="small-text">{item.label}</div>
                    <div className="value">{item.value.toLocaleString()}</div>
                  </div>
                  <div className="badge-info">{item.change}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <div className="section-title">
              <h2>Transactions (7d)</h2>
            </div>
          </div>
          <div className="card chart-card">
            <div className="chart-grid compact">
              {trendData.map((point) => (
                <div key={point.label} className="chart-column">
                  <div className="chart-bar total" style={{ height: `${point.txs * chartScale}%` }}>
                    <span>{point.txs.toLocaleString()}</span>
                  </div>
                  <div className="chart-label">{point.label}</div>
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
              <h2>Multi-chain Support</h2>
            </div>
          </div>
          <div className="card">
            <div className="chain-grid">
              {chainSupport.map((chain) => (
                <div key={chain.name} className="chain-card">
                  <div className="small-text">{chain.name}</div>
                  <div className="value">{chain.status}</div>
                  <div className="helper">{chain.tps ? `${chain.tps} TPS observed` : 'Launching soon'}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <div className="section-title">
              <h2>API Insights</h2>
            </div>
          </div>
          <div className="card insights">
            <ul>
              <li>REST + gRPC endpoints stream telemetry for ecosystem dashboards.</li>
              <li>API keys provide per-project quotas with alerting hooks.</li>
              <li>Interactive charts render on desktop & mobile with reduced-motion support.</li>
              <li>Alert engine can trigger webhook, email, or Push notifications.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
