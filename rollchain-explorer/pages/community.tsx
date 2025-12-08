const events = [
  { name: 'Validator AMA', date: 'Apr 10', desc: 'Live Q&A on monitoring, upgrades, and alerting.' },
  { name: 'Ecosystem Demo Day', date: 'Apr 24', desc: 'Showcase of new dApps + partner integrations.' },
  { name: 'Developer Workshop', date: 'May 02', desc: 'Deep dive on APIs, analytics, and RollScan SDK.' }
];

const resources = [
  { title: 'Docs', link: 'https://docs.rollchain.io', summary: 'Getting started, API references, and tutorials.' },
  { title: 'GitHub', link: 'https://github.com', summary: 'Source code, issues, and contribution guidelines.' },
  { title: 'Discord', link: 'https://discord.gg', summary: 'Community chat, support, and governance proposals.' }
];

export default function CommunityPage() {
  return (
    <div className="page">
      <div className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">Community</h1>
          <p className="page-subtitle">Stay in sync with ecosystem updates, events, and resources.</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-section">
          <div className="section-header">
            <div className="section-title">
              <h2>Upcoming Events</h2>
            </div>
          </div>
          <div className="card">
            {events.map((event) => (
              <div key={event.name} className="supply-row">
                <div>
                  <div className="small-text">{event.date}</div>
                  <div className="value">{event.name}</div>
                  <div className="helper">{event.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <div className="section-title">
              <h2>Resources</h2>
            </div>
          </div>
          <div className="card">
            {resources.map((resource) => (
              <div key={resource.title} className="resource-row">
                <div>
                  <div className="value">{resource.title}</div>
                  <div className="helper">{resource.summary}</div>
                </div>
                <a className="btn-ghost" href={resource.link} target="_blank" rel="noreferrer">Open →</a>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card insights">
        <h3>Community Highlights</h3>
        <ul>
          <li>Launch new alerts directly from the community dashboard.</li>
          <li>Interactive charts support mobile access for on-the-go monitoring.</li>
          <li>API access provides builders with data needed for custom dashboards.</li>
        </ul>
      </div>
    </div>
  );
}
