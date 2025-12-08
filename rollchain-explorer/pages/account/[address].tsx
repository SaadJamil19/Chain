import { useRouter } from 'next/router';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRollchainClient } from '../../hooks/useRollchainClient';

export default function AccountPage() {
  const router = useRouter();
  const { address } = router.query;
  const normalizedAddress = Array.isArray(address) ? address[0] : address;
  const { getAccount, DISPLAY_DENOM } = useRollchainClient();
  const [state, setState] = useState<{ balance: number; staked: number; rewards: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    if (!normalizedAddress) return;
    const load = async () => {
      try {
        const result = await getAccount(String(normalizedAddress));
        setState({ balance: result.balance, staked: result.staked, rewards: result.rewards });
      } catch (err: any) {
        setError(err?.message ?? 'Unable to load account');
      }
    };
    load();
  }, [normalizedAddress, getAccount]);

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">Account {normalizedAddress ?? '—'}</h1>
          <p className="page-subtitle">Balances and staking footprint</p>
        </div>
        <div className="page-header-actions">
          <Link href="/dashboard" className="btn-ghost">
            ← Dashboard
          </Link>
        </div>
      </div>
      {error && <div className="alert">{error}</div>}
      {state && (
        <div className="card">
          <h3>Balances</h3>
          <div className="balance">
            <div>
              <div className="small-text">Available</div>
              <div className="value">{state.balance.toFixed(4)} {DISPLAY_DENOM}</div>
            </div>
            <div>
              <div className="small-text">Staked</div>
              <div className="value">{state.staked.toFixed(4)} {DISPLAY_DENOM}</div>
            </div>
            <div>
              <div className="small-text">Rewards</div>
              <div className="value">{state.rewards.toFixed(4)} {DISPLAY_DENOM}</div>
            </div>
          </div>
          <div className="accordion">
            <div className="accordion-header" onClick={() => setShowAdvanced((v) => !v)}>
              <span>Advanced</span>
              <span className="small-text">{showAdvanced ? 'Hide' : 'Show'}</span>
            </div>
            {showAdvanced && (
              <div className="accordion-body mono">
                <div style={{ marginTop: 8 }}>Address: {normalizedAddress}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
