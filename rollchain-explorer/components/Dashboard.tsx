import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useRollchainClient } from '../hooks/useRollchainClient';

const formatTime = (iso?: string) => {
  if (!iso) return '—';
  const date = new Date(iso);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return date.toLocaleDateString();
};

const formatTimeAgo = (iso?: string) => {
  if (!iso) return '—';
  return formatTime(iso);
};

export default function Dashboard() {
  const {
    networkStatus,
    blocks,
    transactions,
    loading,
    error,
    DISPLAY_DENOM: displayDenom
  } = useRollchainClient();
  const [isPaused, setIsPaused] = useState(false);

  const avgBlockTimeSeconds = useMemo(() => {
    if (blocks.length < 2) return null;
    const times = blocks.slice(0, 10).map(b => new Date(b.time).getTime());
    let totalDiff = 0;
    for (let i = 0; i < times.length - 1; i++) {
      totalDiff += times[i] - times[i + 1];
    }
    return totalDiff / (times.length - 1) / 1000;
  }, [blocks]);

  const avgBlockTime = useMemo(() => {
    if (avgBlockTimeSeconds === null) return '—';
    return `${avgBlockTimeSeconds.toFixed(1)}s`;
  }, [avgBlockTimeSeconds]);

  const blocksPerMinute = useMemo(() => {
    if (!avgBlockTimeSeconds || avgBlockTimeSeconds === 0) return null;
    return 60 / avgBlockTimeSeconds;
  }, [avgBlockTimeSeconds]);

  const avgTxPerBlock = useMemo(() => {
    if (!blocks.length) return null;
    const slice = blocks.slice(0, 10);
    const sumTxs = slice.reduce((sum, block) => sum + block.txs, 0);
    return sumTxs / slice.length;
  }, [blocks]);

  const txSuccessRate = useMemo(() => {
    const sample = transactions.slice(0, 10);
    if (!sample.length) return null;
    const success = sample.filter((tx) => tx.code === 0).length;
    return success / sample.length;
  }, [transactions]);

  const avgFeeEstimate = useMemo(() => {
    const sample = transactions.slice(0, 10).map((tx) => tx.fee).filter(Boolean) as string[];
    if (!sample.length) return null;
    const total = sample.reduce((sum, fee) => {
      const numeric = parseFloat(fee.split(' ')[0] ?? '0');
      return sum + (Number.isFinite(numeric) ? numeric : 0);
    }, 0);
    return total / sample.length;
  }, [transactions]);

  const blockQualityRows = useMemo(() => {
    return blocks.slice(0, 5).map((block, index, arr) => {
      const next = arr[index + 1];
      let interval = '—';
      if (next?.time) {
        const delta = Math.abs(new Date(block.time).getTime() - new Date(next.time).getTime()) / 1000;
        interval = `${delta.toFixed(1)}s`;
      }
      return {
        height: block.height,
        proposer: block.proposer ? `${block.proposer.slice(0, 6)}...${block.proposer.slice(-4)}` : '—',
        txs: block.txs,
        interval
      };
    });
  }, [blocks]);

  const transactionHealthRows = useMemo(() => {
    return transactions.slice(0, 5).map((tx) => ({
      hash: tx.hash,
      type: tx.type || 'Unknown',
      gasUsed: tx.gasUsed ?? null,
      gasWanted: tx.gasWanted ?? null,
      fee: tx.fee || '—',
      status: tx.code === 0 ? 'Success' : 'Failed'
    }));
  }, [transactions]);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner large"></div>
        <p>Connecting to Rollchain...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <div className="error-icon">⚠️</div>
        <h2>Connection Error</h2>
        <p>{error}</p>
        <button className="btn-primary" onClick={() => window.location.reload()}>
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Real-time network overview for {networkStatus.chainId}</p>
        </div>
        <div className="page-header-actions">
          <button 
            className={`btn-icon ${isPaused ? 'paused' : ''}`} 
            onClick={() => setIsPaused(!isPaused)}
            title={isPaused ? 'Resume updates' : 'Pause updates'}
          >
            {isPaused ? '▶️' : '⏸️'}
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🧑‍💻</div>
          <div className="stat-content">
            <span className="stat-label">Latest Proposer</span>
            <span className="stat-value">
              {blocks[0]?.proposer
                ? `${blocks[0].proposer.slice(0, 8)}...${blocks[0].proposer.slice(-6)}`
                : '—'}
            </span>
            <span className="stat-helper">
              {blocks[0] ? `Block #${blocks[0].height.toLocaleString()}` : 'Awaiting first block'}
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🚀</div>
          <div className="stat-content">
            <span className="stat-label">Throughput</span>
            <span className="stat-value">
              {blocksPerMinute ? blocksPerMinute.toFixed(1) : '—'}
            </span>
            <span className="stat-helper">
              {avgBlockTimeSeconds ? `${avgBlockTimeSeconds.toFixed(1)}s avg block` : 'Awaiting data'}
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <span className="stat-label">Avg TX / Block</span>
            <span className="stat-value">
              {avgTxPerBlock !== null ? avgTxPerBlock.toFixed(1) : '—'}
            </span>
            <span className="stat-helper">
              {blocks.length ? `Across last ${Math.min(blocks.length, 10)} blocks` : 'Awaiting blocks'}
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <span className="stat-label">TX Success Rate</span>
            <span className="stat-value">
              {txSuccessRate !== null ? `${Math.round(txSuccessRate * 100)}%` : '—'}
            </span>
            <span className="stat-helper">
              {transactions.length
                ? `Past ${Math.min(transactions.length, 10)} txs${avgFeeEstimate !== null ? ` • Avg fee ${avgFeeEstimate.toFixed(3)} ${displayDenom}` : ''}`
                : 'Awaiting activity'}
            </span>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="dashboard-grid">
        {/* Latest Blocks */}
        <div className="dashboard-section">
          <div className="section-header">
            <div className="section-title">
              <h2>⛓️ Latest Blocks</h2>
            </div>
            <Link href="/blocks" className="btn-ghost">
              View All →
            </Link>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Height</th>
                  <th>Hash</th>
                  <th>Txs</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {blocks.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="empty-row">
                      <div className="empty-state-inline">
                        <span>📭</span> No blocks available
                      </div>
                    </td>
                  </tr>
                ) : (
                  blocks.slice(0, 8).map((block) => (
                    <tr key={block.height}>
                      <td>
                        <Link href={`/blocks/${block.height}`} className="block-height">
                          #{block.height.toLocaleString()}
                        </Link>
                      </td>
                      <td>
                        <span className="mono hash-cell">{block.hash.slice(0, 12)}...</span>
                      </td>
                      <td>
                        <span className={`tx-count ${block.txs > 0 ? 'has-txs' : ''}`}>
                          {block.txs}
                        </span>
                      </td>
                      <td>
                        <span className="time-cell">{formatTime(block.time)}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Latest Transactions */}
        <div className="dashboard-section">
          <div className="section-header">
            <div className="section-title">
              <h2>💸 Latest Transactions</h2>
            </div>
            <Link href="/tx" className="btn-ghost">
              View All →
            </Link>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Hash</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Block</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="empty-row">
                      <div className="empty-state-inline">
                        <span>📭</span> No transactions found
                      </div>
                    </td>
                  </tr>
                ) : (
                  transactions.slice(0, 8).map((tx) => (
                    <tr key={tx.hash}>
                      <td>
                        <Link href={`/tx/${tx.hash}`} className="tx-hash">
                          <span className="mono">{tx.hash.slice(0, 12)}...</span>
                        </Link>
                      </td>
                      <td>
                        <span className="tx-type">{tx.type || '—'}</span>
                      </td>
                      <td>
                        <span className="tx-amount">{tx.amount || '—'}</span>
                      </td>
                      <td>
                        <Link href={`/blocks/${tx.height}`} className="block-link">
                          #{tx.height.toLocaleString()}
                        </Link>
                      </td>
                      <td>
                        <span className="time-cell">{formatTime(tx.timestamp)}</span>
                      </td>
                      <td>
                        <span className={`badge ${tx.code === 0 ? 'badge-success' : 'badge-error'}`}>
                          {tx.code === 0 ? '✓ Success' : '✗ Failed'}
                        </span>
                      </td>
                    </tr>
                  ))
              )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="dashboard-grid dashboard-grid-wide">
        <div className="dashboard-section span-2">
          <div className="section-header">
            <div className="section-title">
              <h2>📌 Network Insights</h2>
            </div>
          </div>
          <div className="dual-card">
            <div className="card">
              <h3>Block Quality</h3>
              <div className="table-wrapper compact">
                <table>
                  <thead>
                    <tr>
                      <th>Height</th>
                      <th>Txs</th>
                      <th>Interval</th>
                      <th>Proposer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blockQualityRows.map((row) => (
                      <tr key={`quality-${row.height}`}>
                        <td>
                          <Link href={`/blocks/${row.height}`} className="block-height">
                            #{row.height.toLocaleString()}
                          </Link>
                        </td>
                        <td>{row.txs}</td>
                        <td>{row.interval}</td>
                        <td className="mono small-text">{row.proposer}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="card">
              <h3>Tx Health</h3>
              <div className="table-wrapper compact">
                <table>
                  <thead>
                    <tr>
                      <th>Hash</th>
                      <th>Type</th>
                      <th>Gas (used / wanted)</th>
                      <th>Fee</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactionHealthRows.map((row) => (
                      <tr key={`health-${row.hash}`}>
                        <td>
                          <Link href={`/tx/${row.hash}`} className="tx-hash">
                            {row.hash.slice(0, 10)}...
                          </Link>
                        </td>
                        <td className="mono small-text">{row.type}</td>
                        <td>
                          {row.gasUsed !== null && row.gasWanted !== null
                            ? `${row.gasUsed}/${row.gasWanted}`
                            : '—'}
                        </td>
                        <td>{row.fee}</td>
                        <td>
                          <span className={`badge ${row.status === 'Success' ? 'badge-success' : 'badge-error'}`}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
