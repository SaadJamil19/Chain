import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  MsgDelegateEncodeObject,
  QueryClient,
  SigningStargateClient,
  StargateClient,
  StdFee,
  setupBankExtension,
  setupDistributionExtension,
  setupStakingExtension
} from '@cosmjs/stargate';
import { HttpEndpoint, Tendermint34Client } from '@cosmjs/tendermint-rpc';
import { MsgDelegate } from 'cosmjs-types/cosmos/staking/v1beta1/tx';
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { coins, decodeTxRaw } from '@cosmjs/proto-signing';

// ═══════════════ TYPES ═══════════════
export type NetworkStatus = {
  chainId: string;
  latestBlockHeight: number;
  latestBlockTime?: string;
  catchingUp: boolean;
  avgBlockTime?: number;
};

export type BlockMetaLite = {
  height: number;
  time: string;
  hash: string;
  proposer: string;
  txs: number;
};

export type TxLite = {
  hash: string;
  height: number;
  code?: number;
  gasUsed?: number;
  gasWanted?: number;
  fee?: string;
  timestamp?: string;
  type?: string;
  amount?: string;
};

export type WalletState = {
  address: string;
  balance: number;
  staked: number;
  rewards: number;
  signer: any;
};

export type SearchResult =
  | { type: 'block'; height: number }
  | { type: 'tx'; hash: string }
  | { type: 'account'; address: string };

// ═══════════════ CONSTANTS ═══════════════
const RPC_ENDPOINT = process.env.NEXT_PUBLIC_RPC || 'http://5.189.162.146:26657';
const CHAIN_ID = 'localchain_9000-1';
const BASE_DENOM = 'uroll';
const DISPLAY_DENOM = 'ROLL';
const AVERAGE_GAS_PRICE = 0.025;
const SIX_SECONDS = 6000;
const REST_ENDPOINT = process.env.NEXT_PUBLIC_REST || 'http://5.189.162.146:1317';
const GAS_PRICE_STEP = { low: 0.01, average: AVERAGE_GAS_PRICE, high: 0.04 };

// ═══════════════ HELPERS ═══════════════
async function rpcGet<T>(path: string): Promise<T> {
  const url = `${RPC_ENDPOINT}${path}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`RPC ${path} failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

function formatDenomAmount(amount?: string | number | bigint): number {
  if (!amount) return 0;
  const asString = typeof amount === 'bigint' ? amount.toString() : String(amount);
  const parsed = Number(asString);
  if (Number.isNaN(parsed)) return 0;
  return parsed / 1_000_000;
}

function extractAmountFromRawLog(rawLog?: string): string | undefined {
  if (!rawLog) return undefined;
  try {
    const logs = JSON.parse(rawLog);
    for (const log of logs) {
      const events = Array.isArray(log?.events) ? log.events : [];
      for (const event of events) {
        if (event?.type !== 'transfer') continue;
        const attrs = Array.isArray(event.attributes) ? event.attributes : [];
        const amountAttr = attrs.find((attr: any) => attr?.key === 'amount');
        if (amountAttr?.value) {
          const tokens = String(amountAttr.value).split(',');
          for (const token of tokens) {
            const match = token.match(/^(\d+)([a-zA-Z/]+)$/);
            if (match) {
              const value = formatDenomAmount(match[1]);
              const denom = match[2] === BASE_DENOM ? DISPLAY_DENOM : match[2]?.toUpperCase();
              return `${value} ${denom}`;
            }
          }
        }
      }
    }
  } catch {
    return undefined;
  }
  return undefined;
}

function buildKeplrChainConfig() {
  const prefix = 'roll';
  return {
    chainId: CHAIN_ID,
    chainName: 'Rollchain Local',
    rpc: RPC_ENDPOINT,
    rest: REST_ENDPOINT,
    bip44: { coinType: 118 },
    bech32Config: {
      bech32PrefixAccAddr: prefix,
      bech32PrefixAccPub: `${prefix}pub`,
      bech32PrefixValAddr: `${prefix}valoper`,
      bech32PrefixValPub: `${prefix}valoperpub`,
      bech32PrefixConsAddr: `${prefix}valcons`,
      bech32PrefixConsPub: `${prefix}valconspub`
    },
    currencies: [
      {
        coinDenom: DISPLAY_DENOM,
        coinMinimalDenom: BASE_DENOM,
        coinDecimals: 6
      }
    ],
    feeCurrencies: [
      {
        coinDenom: DISPLAY_DENOM,
        coinMinimalDenom: BASE_DENOM,
        coinDecimals: 6,
        gasPriceStep: GAS_PRICE_STEP
      }
    ],
    stakeCurrency: {
      coinDenom: DISPLAY_DENOM,
      coinMinimalDenom: BASE_DENOM,
      coinDecimals: 6
    },
    features: ['stargate', 'ibc-transfer', 'cosmwasm']
  };
}

function simplifyTypeUrl(typeUrl?: string): string | undefined {
  if (!typeUrl) return undefined;
  const sanitized = typeUrl.startsWith('/') ? typeUrl.slice(1) : typeUrl;
  const segments = sanitized.split('.');
  const last = segments[segments.length - 1];
  return last || sanitized;
}

// ═══════════════ MAIN HOOK ═══════════════
export function useRollchainClient() {
  // State
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    chainId: '',
    latestBlockHeight: 0,
    catchingUp: false,
    latestBlockTime: undefined,
    avgBlockTime: undefined
  });
  const [latestBlock, setLatestBlock] = useState<BlockMetaLite | null>(null);
  const [blocks, setBlocks] = useState<BlockMetaLite[]>([]);
  const [transactions, setTransactions] = useState<TxLite[]>([]);
  const [wallet, setWallet] = useState<WalletState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [delegationDraft, setDelegationDraft] = useState<{
    txBytes: Uint8Array;
    fee: StdFee;
    msg: MsgDelegateEncodeObject;
  } | null>(null);

  // Refs
  const stargateRef = useRef<StargateClient | null>(null);
  const tmRef = useRef<Tendermint34Client | null>(null);

  // Memos
  const bankDenomLabel = useMemo(() => DISPLAY_DENOM, []);

  // Calculate average block time from blocks
  const avgBlockTime = useMemo(() => {
    if (blocks.length < 2) return undefined;
    const times = blocks.slice(0, 10).map((b) => new Date(b.time).getTime());
    let totalDiff = 0;
    for (let i = 0; i < times.length - 1; i++) {
      totalDiff += times[i] - times[i + 1];
    }
    return totalDiff / (times.length - 1) / 1000;
  }, [blocks]);

  // Disconnect
  const disconnect = useCallback(async () => {
    if (stargateRef.current) {
      await stargateRef.current.disconnect();
      stargateRef.current = null;
    }
    if (tmRef.current) {
      await tmRef.current.disconnect();
      tmRef.current = null;
    }
  }, []);

  // Hydrate Tendermint client
  const hydrateTmClient = useCallback(async () => {
    if (tmRef.current) return tmRef.current;
    tmRef.current = await Tendermint34Client.connect({ url: RPC_ENDPOINT } as HttpEndpoint);
    return tmRef.current;
  }, []);

  // Hydrate Stargate client
  const hydrateStargateClient = useCallback(async () => {
    if (stargateRef.current) return stargateRef.current;
    stargateRef.current = await StargateClient.connect(RPC_ENDPOINT);
    return stargateRef.current;
  }, []);

  // Refresh network status
  const refreshStatus = useCallback(async () => {
    const statusRes = await rpcGet<{
      result: {
        node_info: { network: string };
        sync_info: {
          latest_block_height: string;
          latest_block_time: string;
          catching_up: boolean;
        };
      };
    }>('/status');

    const { latest_block_height, latest_block_time, catching_up } =
      statusRes.result.sync_info;
    
    setNetworkStatus((prev) => ({
      ...prev,
      chainId: statusRes.result.node_info.network,
      latestBlockHeight: Number(latest_block_height),
      latestBlockTime: latest_block_time,
      catchingUp: catching_up
    }));
    
    return Number(latest_block_height);
  }, []);

  // Load blocks
  const loadBlocks = useCallback(
    async (latestHeight?: number) => {
      const height = latestHeight ?? (await refreshStatus());
      const minHeight = Math.max(1, height - 9);
      const chainRes = await rpcGet<{
        result: { block_metas: any[] };
      }>(`/blockchain?minHeight=${minHeight}&maxHeight=${height}`);

      const metas: BlockMetaLite[] = (chainRes.result.block_metas || []).map(
        (meta) => ({
          height: Number(
            meta.header?.height ?? meta.block?.header?.height ?? 0
          ),
          time: meta.header?.time ?? meta.block?.header?.time ?? '',
          hash: meta.block_id?.hash ?? '',
          proposer: meta.header?.proposer_address ?? '',
          txs: Number(
            meta.header?.num_txs ?? meta.block?.data?.txs?.length ?? 0
          )
        })
      );

      metas.sort((a, b) => b.height - a.height);
      setBlocks(metas);
      if (metas[0]) {
        setLatestBlock(metas[0]);
      }
    },
    [refreshStatus]
  );

  // Load transactions
  const loadTransactions = useCallback(async () => {
    try {
      const query = '"tx.height>0"';
      const txsRes = await rpcGet<{
        result: { txs: any[] };
      }>(
        `/tx_search?query=${encodeURIComponent(query)}&per_page=10&order_by=${encodeURIComponent('"desc"')}`
      );

      const client = await hydrateStargateClient();

      const mapped: TxLite[] = await Promise.all(
        (txsRes.result.txs || []).map(async (tx) => {
          const hash = tx?.hash ?? '';
          try {
            const txDetails = await client.getTx(hash);
            if (!txDetails) {
              return {
                hash,
                height: Number(tx?.height ?? 0),
                code: undefined,
                gasUsed: undefined,
                gasWanted: undefined,
                fee: undefined,
                timestamp: undefined
              };
            }

            const decoded = txDetails.tx ? decodeTxRaw(txDetails.tx) : undefined;
            const feeCoin = decoded?.authInfo?.fee?.amount?.[0];
            const primaryMsgType = simplifyTypeUrl(decoded?.body?.messages?.[0]?.typeUrl);
            const amountDisplay = extractAmountFromRawLog(txDetails.rawLog);
            
            return {
              hash,
              height: Number(txDetails.height),
              code: txDetails.code,
              gasUsed: txDetails.gasUsed !== undefined ? Number(txDetails.gasUsed) : undefined,
              gasWanted: txDetails.gasWanted !== undefined ? Number(txDetails.gasWanted) : undefined,
              fee: feeCoin ? `${formatDenomAmount(feeCoin.amount)} ${bankDenomLabel}` : undefined,
              timestamp: undefined,
              type: primaryMsgType,
              amount: amountDisplay
            };
          } catch {
            return {
              hash,
              height: Number(tx?.height ?? 0),
              code: undefined,
              gasUsed: undefined,
              gasWanted: undefined,
              fee: undefined,
              timestamp: undefined,
              type: undefined,
              amount: undefined
            };
          }
        })
      );

      setTransactions(mapped);
    } catch (err: any) {
      console.error('Failed to load transactions:', err);
      setTransactions([]);
    }
  }, [bankDenomLabel, hydrateStargateClient]);

  // Fetch account snapshot
  const fetchAccountSnapshot = useCallback(
    async (address: string) => {
      const tm = await hydrateTmClient();
      const qc = QueryClient.withExtensions(
        tm,
        setupBankExtension,
        setupStakingExtension,
        setupDistributionExtension
      );

      const [balancesRes, delegationsRes, rewardsRes] = await Promise.all([
        qc.bank.allBalances(address),
        qc.staking.delegatorDelegations(address),
        qc.distribution.delegationTotalRewards(address)
      ]);

      // Handle both response formats (array or object with balances property)
      const balanceArray = Array.isArray((balancesRes as any)?.balances)
        ? (balancesRes as any).balances
        : Array.isArray(balancesRes)
        ? balancesRes
        : [];
      
      const baseBalance = (balanceArray as any[]).find(
        (b: any) => b.denom === BASE_DENOM
      );
      
      const stakedSum = delegationsRes.delegationResponses.reduce(
        (acc: number, d: any) => acc + Number(d.balance?.amount ?? 0),
          0
      );

      const rewardsSum = rewardsRes.total.reduce(
        (acc: number, r: any) => acc + Number(r.amount ?? 0),
          0
        );



      return {
        balance: formatDenomAmount(baseBalance?.amount),
        staked: formatDenomAmount(stakedSum.toString()),
        rewards: formatDenomAmount(rewardsSum.toString())
      };
    },
    [hydrateTmClient]
  );

  // Connect wallet
  const connectWallet = useCallback(async () => {
    if (typeof window === 'undefined')
      throw new Error('Wallet only available in browser');
    
    const w = window as typeof window & {
      keplr?: any;
      getOfflineSignerAuto?: any;
      experimentalSuggestChain?: any;
    };
    
    if (!w.keplr) throw new Error('Keplr extension is not available');

    try {
      await w.keplr.enable(CHAIN_ID);
    } catch (err) {
      if (w.keplr?.experimentalSuggestChain) {
        await w.keplr.experimentalSuggestChain(buildKeplrChainConfig());
        await w.keplr.enable(CHAIN_ID);
      } else {
        throw err;
      }
    }

    const signer = await w.keplr.getOfflineSignerAuto(CHAIN_ID);
    const accounts = await signer.getAccounts();
    const address = accounts[0]?.address;
    if (!address) throw new Error('No account found in Keplr');

    const snapshot = await fetchAccountSnapshot(address);

    setWallet({
      address,
      balance: snapshot.balance,
      staked: snapshot.staked,
      rewards: snapshot.rewards,
      signer
    });

    return address;
  }, [fetchAccountSnapshot]);

  // Prepare delegate transaction
  const prepareDelegateTx = useCallback(
    async (validatorAddress: string, amountRoll: number) => {
      if (!wallet?.signer || !wallet.address)
        throw new Error('Connect wallet first');

      const signingClient = await SigningStargateClient.connectWithSigner(
        RPC_ENDPOINT,
        wallet.signer
      );
      const amount = Math.floor(amountRoll * 1_000_000).toString();

      const msg: MsgDelegateEncodeObject = {
        typeUrl: '/cosmos.staking.v1beta1.MsgDelegate',
        value: MsgDelegate.fromPartial({
          delegatorAddress: wallet.address,
          validatorAddress,
          amount: { denom: BASE_DENOM, amount }
        })
      };

      const fee: StdFee = {
        amount: coins(25000, BASE_DENOM),
        gas: '200000'
      };

      const signed = await signingClient.sign(
        wallet.address,
        [msg],
        fee,
        ''
      );
      const txBytes = TxRaw.encode(signed).finish();

      const draft = { txBytes, fee, msg };
      setDelegationDraft(draft);
      return draft;
    },
    [wallet]
  );

  // Search
  const search = useCallback(
    async (term: string): Promise<SearchResult> => {
      const q = term.trim();
      if (!q) {
        throw new Error('Enter a search term');
      }

      const client = await hydrateStargateClient();

      // Check if it's a block height
      if (/^\d+$/.test(q)) {
        const height = Number(q);
        await rpcGet(`/block?height=${height}`);
        return { type: 'block', height };
      }

      // Check if it's a tx hash (40+ chars)
      if (q.length >= 40) {
        const hex = q.startsWith('0x') ? q.slice(2) : q;
        try {
          const tx = await client.getTx(hex);
          if (tx) return { type: 'tx', hash: hex };
        } catch {
          // Not a valid tx hash, continue
        }
      }

      // Check if it's an address
      if (q.startsWith('roll')) {
        await fetchAccountSnapshot(q);
        return { type: 'account', address: q };
      }

      throw new Error(
        'Input did not match block height, tx hash, or address'
      );
    },
    [fetchAccountSnapshot, hydrateStargateClient]
  );

  // Get block by height
  const getBlockByHeight = useCallback(
    async (height: number): Promise<BlockMetaLite | null> => {
      const res = await rpcGet<{
        result: {
          block_id: { hash: string };
          block: {
            header: {
              time: string;
              height: string;
              proposer_address: string;
            };
            data: { txs: any[] };
          };
        };
      }>(`/block?height=${height}`);

      if (!res?.result?.block) return null;
      return {
        height: Number(res.result.block.header.height),
        time: res.result.block.header.time,
        hash: res.result.block_id.hash,
        proposer: res.result.block.header.proposer_address,
        txs: res.result.block.data?.txs?.length ?? 0
      };
    },
    []
  );

  // Get tx by hash
  const getTxByHash = useCallback(
    async (hash: string): Promise<TxLite | null> => {
      const client = await hydrateStargateClient();
      const tx = await client.getTx(
        hash.startsWith('0x') ? hash.slice(2) : hash
      );
      if (!tx) return null;

      const decoded = tx.tx ? decodeTxRaw(tx.tx) : undefined;
      const feeCoin = decoded?.authInfo?.fee?.amount?.[0];
      const primaryMsgType = simplifyTypeUrl(decoded?.body?.messages?.[0]?.typeUrl);
      const amountDisplay = extractAmountFromRawLog(tx.rawLog);
      
      return {
        hash: tx.hash,
        height: tx.height,
        code: tx.code,
        gasUsed: tx.gasUsed !== undefined ? Number(tx.gasUsed) : undefined,
        gasWanted: tx.gasWanted !== undefined ? Number(tx.gasWanted) : undefined,
        fee: feeCoin ? `${formatDenomAmount(feeCoin.amount)} ${bankDenomLabel}` : undefined,
        timestamp: undefined,
        type: primaryMsgType,
        amount: amountDisplay
      };
    },
    [bankDenomLabel, hydrateStargateClient]
  );

  // Get account
  const getAccount = useCallback(
    async (address: string) => {
      const snapshot = await fetchAccountSnapshot(address);
      return {
        address,
        ...snapshot
      };
    },
    [fetchAccountSnapshot]
  );

  // Bootstrap effect
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    const bootstrap = async () => {
      try {
        await hydrateStargateClient();
        const latest = await refreshStatus();
        await Promise.all([loadBlocks(latest), loadTransactions()]);
        setLoading(false);

        timer = setInterval(() => {
          refreshStatus().catch(() => undefined);
          loadBlocks().catch(() => undefined);
          loadTransactions().catch(() => undefined);
        }, SIX_SECONDS);
      } catch (err: any) {
        setError(err?.message ?? 'Failed to initialize client');
        setLoading(false);
      }
    };

    bootstrap();

    return () => {
      if (timer) clearInterval(timer);
      disconnect();
    };
  }, [
    disconnect,
    hydrateStargateClient,
    loadBlocks,
    loadTransactions,
    refreshStatus
  ]);

  // Return all values and methods
  return {
    // Constants
    RPC_ENDPOINT,
    CHAIN_ID,
    BASE_DENOM,
    DISPLAY_DENOM,
    AVERAGE_GAS_PRICE,
    // State
    loading,
    error,
    networkStatus,
    latestBlock,
    blocks,
    transactions,
    wallet,
    delegationDraft,
    avgBlockTime,
    // Methods
    connectWallet,
    prepareDelegateTx,
    search,
    getBlockByHeight,
    getTxByHash,
    getAccount,
    refreshStatus
  };
}
