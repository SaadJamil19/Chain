import { useState } from 'react';

const initialSettings = {
  price: true,
  validator: false,
  txVolume: true,
  security: true
};

const apiEndpoints = [
  { method: 'GET', path: '/api/v1/blocks/latest', desc: 'Latest block + validator data' },
  { method: 'GET', path: '/api/v1/tx/{hash}', desc: 'Transaction details & logs' },
  { method: 'GET', path: '/api/v1/accounts/{address}', desc: 'Balances, staking, rewards' },
  { method: 'POST', path: '/api/v1/alerts', desc: 'Create or update alert rules' }
];

export default function AlertsPage() {
  const [settings, setSettings] = useState(initialSettings);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [apiKey, setApiKey] = useState('rollscan_pk_demo_123');
  const [status, setStatus] = useState<string | null>(null);

  const toggle = (name: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleSave = () => {
    setStatus('Alert preferences updated (local preview).');
    setTimeout(() => setStatus(null), 3000);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">Alerts & API</h1>
          <p className="page-subtitle">Configure notifications, webhook targets, and developer access.</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-section">
          <div className="section-header">
            <div className="section-title">
              <h2>Alert Channels</h2>
            </div>
          </div>
          <div className="card">
            {Object.entries(settings).map(([key, value]) => (
              <label key={key} className="alert-row">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={() => toggle(key as keyof typeof settings)}
                />
                <span className="alert-label">
                  {key === 'price' && 'Token price deviation'}
                  {key === 'validator' && 'Validator uptime drop'}
                  {key === 'txVolume' && 'Transaction surge'}
                  {key === 'security' && 'Security advisories'}
                </span>
              </label>
            ))}
            <div className="input-group" style={{ marginTop: 16 }}>
              <label className="input-label">Webhook URL</label>
              <input
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://hooks.service.dev/rollscan"
              />
            </div>
            <button className="btn-primary" type="button" style={{ marginTop: 16 }} onClick={handleSave}>
              Save preferences
            </button>
            {status && <div className="info" style={{ marginTop: 12 }}>{status}</div>}
          </div>
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <div className="section-title">
              <h2>API Access</h2>
            </div>
          </div>
          <div className="card">
            <div className="input-group">
              <label className="input-label">API Key</label>
              <input value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
            </div>
            <div className="small-text" style={{ marginTop: 8 }}>
              Keep keys private. Rotate from the developer console to enforce per-project quotas.
            </div>
            <div className="table-wrapper" style={{ marginTop: 16 }}>
              <table>
                <thead>
                  <tr>
                    <th>Method</th>
                    <th>Endpoint</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {apiEndpoints.map((endpoint) => (
                    <tr key={endpoint.path}>
                      <td>{endpoint.method}</td>
                      <td className="mono">{endpoint.path}</td>
                      <td>{endpoint.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="card insights">
        <h3>Ecosystem Alerts</h3>
        <ul>
          <li>Subscribe to validator, price, and network health events with email/webhook delivery.</li>
          <li>Community section highlights incident responses and upgrade schedules.</li>
          <li>Mobile-ready alerts keep operators informed even when on the go.</li>
        </ul>
      </div>
    </div>
  );
}
