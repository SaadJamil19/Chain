import { useRouter } from 'next/router';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { TxLite, useRollchainClient } from '../../hooks/useRollchainClient';

const formatTime = (iso?: string) => (iso ? new Date(iso).toLocaleString() : '—');

export default function TxDetailPage() {
  const router = useRouter();
  const { hash } = router.query;
  const displayHash = Array.isArray(hash) ? hash[0] : hash;
  const { getTxByHash } = useRollchainClient();
  const [tx, setTx] = useState<TxLite | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    if (!displayHash) return;
    const load = async () => {
      try {
        const found = await getTxByHash(displayHash);
        if (!found) throw new Error('Transaction not found');
        setTx(found);
      } catch (err: any) {
        setError(err?.message ?? 'Unable to load transaction');
      }
    };
    load();
  }, [getTxByHash, displayHash]);

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">Transaction {displayHash ?? '—'}</h1>
          <p className="page-subtitle">Execution trace and delivery info</p>
        </div>
        <div className="page-header-actions">
          <Link href="/tx" className="btn-ghost">
            ← Transactions
          </Link>
        </div>
      </div>
      {error && <div className="alert">{error}</div>}
      {tx && (
        <div className="card">
          <h3>Transaction Details</h3>
          <div className="balance">
            <div>
              <div className="small-text">Hash</div>
              <div className="value mono">{tx.hash}</div>
            </div>
            <div>
              <div className="small-text">Height</div>
              <div className="value">#{tx.height}</div>
            </div>
            <div>
              <div className="small-text">Code</div>
              <div className="value">{tx.code ?? 0}</div>
            </div>
            <div>
              <div className="small-text">Gas</div>
              <div className="value">
                {tx.gasUsed ? `${tx.gasUsed}/${tx.gasWanted ?? ''}` : '—'}
              </div>
            </div>
            <div>
              <div className="small-text">Fee</div>
              <div className="value">{tx.fee ?? '—'}</div>
            </div>
            <div>
              <div className="small-text">Time</div>
              <div className="value">{formatTime(tx.timestamp)}</div>
            </div>
          </div>
          <div className="accordion">
            <div className="accordion-header" onClick={() => setShowAdvanced((v) => !v)}>
              <span>Advanced</span>
              <span className="small-text">{showAdvanced ? 'Hide' : 'Show'}</span>
            </div>
            {showAdvanced && (
              <div className="accordion-body mono">
                <div style={{ marginTop: 8 }}>Hash: {tx.hash}</div>
                <div style={{ marginTop: 6 }}>Gas Used/Wanted: {tx.gasUsed}/{tx.gasWanted}</div>
                <div style={{ marginTop: 6 }}>Code: {tx.code ?? 0}</div>
                <div style={{ marginTop: 6 }}>Timestamp: {tx.timestamp}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
