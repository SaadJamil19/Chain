import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect, useCallback } from 'react';
import { useRollchainClient } from '../hooks/useRollchainClient';
import { useTheme } from '../context/ThemeContext';

const links = [
  { href: '/dashboard', label: 'Home', icon: '🏠' },
  { href: '/blocks', label: 'Blocks', icon: '⛓️' },
  { href: '/tx', label: 'Transactions', icon: '💸' },
  { href: '/accounts', label: 'Accounts', icon: '👤' },
  { href: '/supply', label: 'Supply', icon: '📦' },
  { href: '/market', label: 'Market', icon: '💹' },
  { href: '/analytics', label: 'Analytics', icon: '📈' },
  { href: '/ecosystem', label: 'Ecosystem', icon: '🌱' },
  { href: '/network', label: 'Network', icon: '🌐' },
  { href: '/staking', label: 'Staking', icon: '🥩' },
  { href: '/alerts', label: 'Alerts', icon: '🔔' },
  { href: '/community', label: 'Community', icon: '🤝' }
];

export default function NavBar() {
  const router = useRouter();
  const { networkStatus, wallet, connectWallet, search, DISPLAY_DENOM } = useRollchainClient();
  const { theme, toggleTheme } = useTheme();
  const path = router.pathname === '/' ? '/dashboard' : router.pathname;
  const [scrolled, setScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchError, setSearchError] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        document.getElementById('global-search')?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearch = useCallback(async () => {
    if (!searchTerm.trim()) return;
    setIsSearching(true);
    setSearchError('');
    try {
      const result = await search(searchTerm.trim());
      if (result.type === 'block') {
        router.push(`/blocks/${result.height}`);
      } else if (result.type === 'tx') {
        router.push(`/tx/${result.hash}`);
      } else if (result.type === 'account') {
        router.push(`/account/${result.address}`);
      }
      setSearchTerm('');
    } catch (err: any) {
      setSearchError(err?.message || 'Not found');
    } finally {
      setIsSearching(false);
    }
  }, [searchTerm, search, router]);

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
    } catch (err: any) {
      alert(err?.message || 'Failed to connect wallet');
    }
  };

  return (
    <header className={`main-header ${scrolled ? 'header-scrolled' : ''}`}>
      <div className="header-top">
        <Link href="/dashboard" className="brand-link">
          <div className="brand-container">
            <div className="logo">
              <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--accent-primary)" />
                    <stop offset="50%" stopColor="var(--accent-tertiary)" />
                    <stop offset="100%" stopColor="var(--accent-secondary)" />
                  </linearGradient>
                </defs>
                <circle cx="50" cy="50" r="42" stroke="url(#logoGrad)" strokeWidth="3" fill="none" />
                <circle cx="50" cy="50" r="28" stroke="url(#logoGrad)" strokeWidth="2" fill="none" opacity="0.5" />
                <circle cx="50" cy="50" r="10" fill="url(#logoGrad)" />
                <path d="M50 20 L50 35" stroke="url(#logoGrad)" strokeWidth="3" strokeLinecap="round" />
                <path d="M50 65 L50 80" stroke="url(#logoGrad)" strokeWidth="3" strokeLinecap="round" />
                <path d="M20 50 L35 50" stroke="url(#logoGrad)" strokeWidth="3" strokeLinecap="round" />
                <path d="M65 50 L80 50" stroke="url(#logoGrad)" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>
            <div className="brand-text">
              <h1 className="brand-name">RollScan</h1>
              <span className="brand-tagline">Blockchain Explorer</span>
            </div>
          </div>
        </Link>

        <div className="header-search-inline">
          <div className="search-container">
            <form
              className={`search-compact ${searchError ? 'search-error' : ''}`}
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
              }}
            >
              <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                id="global-search"
                type="text"
                placeholder="Search by Block / Tx Hash / Address"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setSearchError(''); }}
                disabled={isSearching}
              />
              {searchTerm && (
                <button type="button" className="search-clear" onClick={() => setSearchTerm('')}>×</button>
              )}
              <button type="submit" className="search-btn" disabled={isSearching}>
                {isSearching ? <span className="search-spinner"></span> : 'Search'}
              </button>
            </form>
          </div>
        </div>

        <div className="header-actions">
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={theme === 'dark' ? 'Enable light mode' : 'Enable dark mode'}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <div className={`network-badge ${networkStatus.catchingUp ? 'syncing' : ''}`}>
            <span className="pulse-dot"></span>
            <div className="network-info">
              <span className="network-name">{networkStatus.catchingUp ? 'Syncing...' : 'Connected'}</span>
              <span className="network-height">{networkStatus.chainId || 'Connecting...'}</span>
            </div>
          </div>
          {wallet ? (
            <div className="wallet-connected">
              <span className="wallet-icon">👛</span>
              <div className="wallet-info">
                <span className="wallet-address">{wallet.address.slice(0, 8)}...{wallet.address.slice(-4)}</span>
                <span className="wallet-balance">{wallet.balance.toFixed(2)} {DISPLAY_DENOM}</span>
              </div>
            </div>
          ) : (
            <button className="btn-connect" onClick={handleConnectWallet}>
              <span>🔗</span> Connect Wallet
            </button>
          )}
        </div>
      </div>

      <div className="header-bottom">
        <div className="network-toggle locked" aria-label="Network scope">
          <span className="network-toggle-label">Network</span>
          <span className="network-toggle-chip">Testnet</span>
        </div>
        <nav className="navbar">
          {links.map((link) => {
            const active = path.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link ${active ? 'nav-active' : ''}`}
              >
                <span className="nav-icon">{link.icon}</span>
                <span className="nav-label">{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
