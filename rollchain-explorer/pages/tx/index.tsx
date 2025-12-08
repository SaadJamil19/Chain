import Link from 'next/link';
import { useRollchainClient } from '../../hooks/useRollchainClient';

const formatTime = (iso?: string) => (iso ? new Date(iso).toLocaleString() : '—');

export default function TransactionsPage() {
  const { transactions, loading, error } = useRollchainClient();

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">Transactions</h1>
          <p className="page-subtitle">Latest activity rolling through the chain</p>
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
              <th>Hash</th>
              <th>Height</th>
              <th>Fee</th>
              <th>Gas</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.hash}>
                <td className="mono">
                  <Link href={`/tx/${tx.hash}`}>{tx.hash}</Link>
                </td>
                <td>#{tx.height}</td>
                <td>{tx.fee ?? '—'}</td>
                <td>{tx.gasUsed ? `${tx.gasUsed}/${tx.gasWanted ?? ''}` : '—'}</td>
                <td>{formatTime(tx.timestamp)}</td>
              </tr>
            ))}
            {!transactions.length && !loading && (
              <tr>
                <td colSpan={5} className="muted">
                  No transactions yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
