import Link from 'next/link';
import { useMemo } from 'react';
import { useRollchainClient } from '../../hooks/useRollchainClient';

const formatTime = (iso?: string) => (iso ? new Date(iso).toLocaleString() : '—');

export default function BlocksPage() {
  const { blocks, loading, error } = useRollchainClient();

  const rows = useMemo(() => blocks, [blocks]);

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">Blocks</h1>
          <p className="page-subtitle">Live Rollchain finality feed</p>
        </div>
        <div className="page-header-actions">
          <Link href="/dashboard" className="btn-ghost">
            ← Dashboard
          </Link>
        </div>
      </div>
      {error && <div className="alert">{error}</div>}
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
            {rows.map((block) => (
              <tr key={block.hash}>
                <td>
                  <Link href={`/blocks/${block.height}`}>#{block.height}</Link>
                </td>
                <td className="mono">{block.hash}</td>
                <td>{block.txs}</td>
                <td className="mono">{block.proposer}</td>
                <td>{formatTime(block.time)}</td>
              </tr>
            ))}
            {!rows.length && !loading && (
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
