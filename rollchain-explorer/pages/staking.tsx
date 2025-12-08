import { useState } from 'react';
import { useRollchainClient } from '../hooks/useRollchainClient';

export default function StakingPage() {
  const { wallet, DISPLAY_DENOM, connectWallet, prepareDelegateTx, delegationDraft } = useRollchainClient();
  const [validatorAddress, setValidatorAddress] = useState('');
  const [delegateAmount, setDelegateAmount] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    setError(null);
    setStatus(null);
    try {
      await connectWallet();
      setStatus('Wallet connected');
    } catch (err: any) {
      setError(err?.message ?? 'Wallet connect failed');
    }
  };

  const handleDelegate = async () => {
    setError(null);
    setStatus(null);
    try {
      const amount = Number(delegateAmount);
      if (!validatorAddress || Number.isNaN(amount) || amount <= 0) {
        throw new Error('Enter validator address and a positive amount');
      }
      const draft = await prepareDelegateTx(validatorAddress.trim(), amount);
      setStatus(`Draft ready (bytes: ${draft.txBytes.length}). Sign & broadcast in Keplr.`);
    } catch (err: any) {
      setError(err?.message ?? 'Could not create delegation');
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">Staking</h1>
          <p className="page-subtitle">Manage delegation drafts with Keplr</p>
        </div>
        <div className="page-header-actions">
          <button className="btn-primary" onClick={handleConnect}>
            {wallet ? 'Wallet Connected' : 'Connect Keplr'}
          </button>
        </div>
      </div>

      <div className="card">
        <h3>Your Balances</h3>
        {wallet ? (
          <div className="balance">
            <div>
              <div className="small-text">Available</div>
              <div className="value">{wallet.balance.toFixed(4)} {DISPLAY_DENOM}</div>
            </div>
            <div>
              <div className="small-text">Staked</div>
              <div className="value">{wallet.staked.toFixed(4)} {DISPLAY_DENOM}</div>
            </div>
            <div>
              <div className="small-text">Rewards</div>
              <div className="value">{wallet.rewards.toFixed(4)} {DISPLAY_DENOM}</div>
            </div>
            <div>
              <div className="small-text">Address</div>
              <div className="value mono" style={{ fontSize: 12 }}>{wallet.address}</div>
            </div>
          </div>
        ) : (
          <div className="helper">Connect Keplr to load balances.</div>
        )}
      </div>

      <div className="card">
        <h3>Delegate</h3>
        <div className="input-row">
          <input
            placeholder="Validator address"
            value={validatorAddress}
            onChange={(e) => setValidatorAddress(e.target.value)}
          />
          <input
            placeholder={`Amount in ${DISPLAY_DENOM}`}
            value={delegateAmount}
            onChange={(e) => setDelegateAmount(e.target.value)}
          />
          <button className="primary-action" type="button" onClick={handleDelegate}>
            Prepare Delegate
          </button>
        </div>
        {delegationDraft && (
          <div className="info" style={{ marginTop: 10 }}>
            Msg ready (not broadcast). Validator: {delegationDraft.msg.value.validatorAddress}
          </div>
        )}
        {status && <div className="info">{status}</div>}
        {error && <div className="alert">{error}</div>}
      </div>
    </div>
  );
}
