import NavBar from '../components/NavBar';
import { useRollchainClient } from '../hooks/useRollchainClient';

const formatTime = (iso?: string) => (iso ? new Date(iso).toLocaleString() : '—');

export default function NetworkPage() {
  const { networkStatus, latestBlock, blocks, loading, error } = useRollchainClient();

  return (
    <div className="app-shell">
      <div className="top-bar" style={{ marginBottom: 18 }}>
        <div className="brand">
          <h1>Network</h1>
          <p className="subtitle">Live status for {networkStatus.chainId || 'localchain_9000-1'}</p>
        </div>
        <div className="status-pill">
          <span className={networkStatus.catchingUp ? 'dot-syncing' : 'dot-online'} />
          <span>{networkStatus.catchingUp ? 'Syncing' : 'Online'}</span>
          <span className="small-text">#{networkStatus.latestBlockHeight}</span>
        </div>
      </div>
      <NavBar />
      {error && <div className="alert">{error}</div>}

      <div className="grid">
        <div className="card">
          <h3>Chain ID</h3>
          <div className="value mono">{networkStatus.chainId || '—'}</div>
          <div className="helper">Latest block: #{networkStatus.latestBlockHeight}</div>
        </div>
        <div className="card">
          <h3>Latest Block</h3>
          <div className="value">{latestBlock?.height ?? '—'}</div>
          <div className="helper">{formatTime(latestBlock?.time)}</div>
        </div>
        <div className="card">
          <h3>Sync</h3>
          <div className="value">{networkStatus.catchingUp ? 'Catching up' : 'Healthy'}</div>
          <div className="helper">Updated: {formatTime(networkStatus.latestBlockTime)}</div>
        </div>
      </div>

      <div className="section-title">
        <h2>Recent Blocks</h2>
      </div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Height</th>
              <th>Hash</th>
              <th>Txs</th>
              <th>Proposer</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {blocks.map((block) => (
              <tr key={block.hash}>
                <td>#{block.height}</td>
                <td className="mono">{block.hash.slice(0, 16)}...</td>
                <td>{block.txs}</td>
                <td className="mono">{block.proposer.slice(0, 12)}...</td>
                <td>{formatTime(block.time)}</td>
              </tr>
            ))}
            {!blocks.length && !loading && (
              <tr>
                <td colSpan={5} className="muted">
                  No blocks available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
