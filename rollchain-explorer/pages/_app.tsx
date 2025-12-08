import type { AppProps } from 'next/app';
import Head from 'next/head';
import NavBar from '../components/NavBar';
import { ThemeProvider } from '../context/ThemeContext';
import '../styles/App.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <>
        <Head>
          <title>RollScan — Blockchain Explorer</title>
          <meta name="description" content="RollScan is a premium blockchain explorer for Rollchain. Track blocks, transactions, accounts, and staking in real-time." />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <NavBar />
        <main className="app-shell">
          <Component {...pageProps} />
        </main>
        <footer className="footer">
          <div className="footer-content">
            <div className="footer-brand">
              <span className="footer-logo">◈</span>
              <span>RollScan</span>
            </div>
            <p>© 2025 RollScan. The most powerful Rollchain explorer.</p>
            <div className="footer-links">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>
              <a href="https://docs.rollchain.io" target="_blank" rel="noopener noreferrer">Docs</a>
              <a href="https://discord.gg" target="_blank" rel="noopener noreferrer">Discord</a>
            </div>
          </div>
        </footer>
      </>
    </ThemeProvider>
  );
}
