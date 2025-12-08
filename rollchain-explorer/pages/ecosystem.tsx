const partnerProjects = [
  { name: 'Nova Wallet', category: 'Wallet · Mobile', desc: 'Mobile-first Rollchain wallet with staking + alerts', status: 'Live', link: 'https://example.com' },
  { name: 'Orbital DEX', category: 'DeFi · DEX', desc: 'Cross-pool swaps + concentrated liquidity on Rollchain', status: 'Beta', link: 'https://example.com' },
  { name: 'Drift Labs', category: 'R&D · Infrastructure', desc: 'Indexing, API access, and developer tooling', status: 'Live', link: 'https://example.com' },
  { name: 'Rise Gaming', category: 'Gaming · NFTs', desc: 'On-chain gaming primitives and NFT launchpad', status: 'Pilot', link: 'https://example.com' }
];

const dapps = [
  { name: 'RollPay', type: 'Payments', dailyUsers: '12.4k', tvl: '$8.2M' },
  { name: 'YieldBay', type: 'Yield Aggregator', dailyUsers: '3.1k', tvl: '$22.0M' },
  { name: 'ArcBridge', type: 'Cross-chain Bridge', dailyUsers: '4.2k', tvl: '$41.7M' }
];

export default function EcosystemPage() {
  return (
    <div className="page">
      <div className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">Ecosystem</h1>
          <p className="page-subtitle">Projects, partners, and dApps building on Rollchain</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-section">
          <div className="section-header">
            <div className="section-title">
              <h2>Partner Programs</h2>
            </div>
          </div>
          <div className="ecosystem-grid">
            {partnerProjects.map((project) => (
              <div key={project.name} className="ecosystem-card">
                <div className="small-text">{project.category}</div>
                <div className="value">{project.name}</div>
                <p className="helper">{project.desc}</p>
                <div className="badge-info">{project.status}</div>
                <a className="btn-ghost" href={project.link} target="_blank" rel="noreferrer">Visit →</a>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <div className="section-title">
              <h2>dApp Snapshot</h2>
            </div>
          </div>
          <div className="card">
            {dapps.map((app) => (
              <div key={app.name} className="supply-row">
                <div>
                  <div className="small-text">{app.type}</div>
                  <div className="value">{app.name}</div>
                </div>
                <div>
                  <div className="small-text">Daily Users</div>
                  <div className="value">{app.dailyUsers}</div>
                </div>
                <div>
                  <div className="small-text">TVL</div>
                  <div className="value">{app.tvl}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card insights">
        <h3>Community & Builder Programs</h3>
        <ul>
          <li>Grants program now accepting proposals for DeFi, gaming, and infra.</li>
          <li>Monthly ecosystem calls covering roadmap, analytics, and partner demos.</li>
          <li>Community alerts provide release, upgrade, and incident notifications.</li>
          <li>API partners receive dedicated support and shared marketing assets.</li>
        </ul>
      </div>
    </div>
  );
}
