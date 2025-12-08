import Link from 'next/link';

const activeAccounts = [
  { address: 'roll1xyz...', balance: 120_340, staked: 85_000, txs: 142 },
  { address: 'roll1abc...', balance: 54_120, staked: 42_300, txs: 88 },
  { address: 'roll1def...', balance: 32_780, staked: 15_900, txs: 64 },
  { address: 'roll1ghi...', balance: 21_200, staked: 10_400, txs: 52 }
];

export default function AccountsIndexPage() {
  return (
    <div className="page">
      <div className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">Accounts</h1>
          <p className="page-subtitle">Balances, staking exposure, and active user history.</p>
        </div>
      </div>

      <div className="card">
        <div className="section-header">
          <div className="section-title">
            <h2>Active Accounts</h2>
          </div>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Address</th>
                <th>Balance</th>
                <th>Staked</th>
                <th>Recent TXs</th>
              </tr>
            </thead>
            <tbody>
              {activeAccounts.map((account) => (
                <tr key={account.address}>
                  <td>
                    <Link href={`/account/${account.address}`} className="block-link">
                      {account.address}
                    </Link>
                  </td>
                  <td>{account.balance.toLocaleString()} ROLL</td>
                  <td>{account.staked.toLocaleString()} ROLL</td>
                  <td>{account.txs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
