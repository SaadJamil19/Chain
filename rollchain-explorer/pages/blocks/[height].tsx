import { useRouter } from 'next/router';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { BlockMetaLite, useRollchainClient } from '../../hooks/useRollchainClient';

const formatTime = (iso?: string) => (iso ? new Date(iso).toLocaleString() : '—');

export default function BlockDetailPage() {
  const router = useRouter();
  const { height } = router.query;
  const displayHeight = Array.isArray(height) ? height[0] : height;
  const { getBlockByHeight } = useRollchainClient();
  const [block, setBlock] = useState<BlockMetaLite | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    if (!displayHeight) return;
    const load = async () => {
      try {
        const heightNum = Number(displayHeight);
        if (Number.isNaN(heightNum)) {
          throw new Error('Invalid block height');
        }
        const data = await getBlockByHeight(heightNum);
        if (!data) throw new Error('Block not found');
        setBlock(data);
      } catch (err: any) {
        setError(err?.message ?? 'Unable to load block');
      }
    };
    load();
  }, [getBlockByHeight, displayHeight]);

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">Block #{block?.height ?? displayHeight ?? '—'}</h1>
          <p className="page-subtitle">Full block diagnostics</p>
        </div>
        <div className="page-header-actions">
          <Link href="/blocks" className="btn-ghost">
            ← Blocks
          </Link>
        </div>
      </div>
      {error && <div className="alert">{error}</div>}
      {block && (
        <div className="card">
          <h3>Block Information</h3>
          <div className="balance">
            <div>
              <div className="small-text">Height</div>
              <div className="value mono">{block.height}</div>
            </div>
            <div>
              <div className="small-text">Hash</div>
              <div className="value mono">{block.hash}</div>
            </div>
            <div>
              <div className="small-text">Proposer</div>
              <div className="value mono">{block.proposer}</div>
            </div>
            <div>
              <div className="small-text">Tx Count</div>
              <div className="value">{block.txs}</div>
            </div>
            <div>
              <div className="small-text">Time</div>
              <div className="value">{formatTime(block.time)}</div>
            </div>
          </div>
          <div className="accordion">
            <div className="accordion-header" onClick={() => setShowAdvanced((v) => !v)}>
              <span>Advanced</span>
              <span className="small-text">{showAdvanced ? 'Hide' : 'Show'}</span>
            </div>
            {showAdvanced && (
              <div className="accordion-body mono">
                <div style={{ marginTop: 8 }}>Hash: {block.hash}</div>
                <div style={{ marginTop: 6 }}>Proposer: {block.proposer}</div>
                <div style={{ marginTop: 6 }}>Tx Count: {block.txs}</div>
                <div style={{ marginTop: 6 }}>Timestamp: {block.time}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
