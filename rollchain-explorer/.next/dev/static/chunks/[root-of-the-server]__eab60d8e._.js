(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[turbopack]/browser/dev/hmr-client/hmr-client.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/// <reference path="../../../shared/runtime-types.d.ts" />
/// <reference path="../../runtime/base/dev-globals.d.ts" />
/// <reference path="../../runtime/base/dev-protocol.d.ts" />
/// <reference path="../../runtime/base/dev-extensions.ts" />
__turbopack_context__.s([
    "connect",
    ()=>connect,
    "setHooks",
    ()=>setHooks,
    "subscribeToUpdate",
    ()=>subscribeToUpdate
]);
function connect({ addMessageListener, sendMessage, onUpdateError = console.error }) {
    addMessageListener((msg)=>{
        switch(msg.type){
            case 'turbopack-connected':
                handleSocketConnected(sendMessage);
                break;
            default:
                try {
                    if (Array.isArray(msg.data)) {
                        for(let i = 0; i < msg.data.length; i++){
                            handleSocketMessage(msg.data[i]);
                        }
                    } else {
                        handleSocketMessage(msg.data);
                    }
                    applyAggregatedUpdates();
                } catch (e) {
                    console.warn('[Fast Refresh] performing full reload\n\n' + "Fast Refresh will perform a full reload when you edit a file that's imported by modules outside of the React rendering tree.\n" + 'You might have a file which exports a React component but also exports a value that is imported by a non-React component file.\n' + 'Consider migrating the non-React component export to a separate file and importing it into both files.\n\n' + 'It is also possible the parent component of the component you edited is a class component, which disables Fast Refresh.\n' + 'Fast Refresh requires at least one parent function component in your React tree.');
                    onUpdateError(e);
                    location.reload();
                }
                break;
        }
    });
    const queued = globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS;
    if (queued != null && !Array.isArray(queued)) {
        throw new Error('A separate HMR handler was already registered');
    }
    globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS = {
        push: ([chunkPath, callback])=>{
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    };
    if (Array.isArray(queued)) {
        for (const [chunkPath, callback] of queued){
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    }
}
const updateCallbackSets = new Map();
function sendJSON(sendMessage, message) {
    sendMessage(JSON.stringify(message));
}
function resourceKey(resource) {
    return JSON.stringify({
        path: resource.path,
        headers: resource.headers || null
    });
}
function subscribeToUpdates(sendMessage, resource) {
    sendJSON(sendMessage, {
        type: 'turbopack-subscribe',
        ...resource
    });
    return ()=>{
        sendJSON(sendMessage, {
            type: 'turbopack-unsubscribe',
            ...resource
        });
    };
}
function handleSocketConnected(sendMessage) {
    for (const key of updateCallbackSets.keys()){
        subscribeToUpdates(sendMessage, JSON.parse(key));
    }
}
// we aggregate all pending updates until the issues are resolved
const chunkListsWithPendingUpdates = new Map();
function aggregateUpdates(msg) {
    const key = resourceKey(msg.resource);
    let aggregated = chunkListsWithPendingUpdates.get(key);
    if (aggregated) {
        aggregated.instruction = mergeChunkListUpdates(aggregated.instruction, msg.instruction);
    } else {
        chunkListsWithPendingUpdates.set(key, msg);
    }
}
function applyAggregatedUpdates() {
    if (chunkListsWithPendingUpdates.size === 0) return;
    hooks.beforeRefresh();
    for (const msg of chunkListsWithPendingUpdates.values()){
        triggerUpdate(msg);
    }
    chunkListsWithPendingUpdates.clear();
    finalizeUpdate();
}
function mergeChunkListUpdates(updateA, updateB) {
    let chunks;
    if (updateA.chunks != null) {
        if (updateB.chunks == null) {
            chunks = updateA.chunks;
        } else {
            chunks = mergeChunkListChunks(updateA.chunks, updateB.chunks);
        }
    } else if (updateB.chunks != null) {
        chunks = updateB.chunks;
    }
    let merged;
    if (updateA.merged != null) {
        if (updateB.merged == null) {
            merged = updateA.merged;
        } else {
            // Since `merged` is an array of updates, we need to merge them all into
            // one, consistent update.
            // Since there can only be `EcmascriptMergeUpdates` in the array, there is
            // no need to key on the `type` field.
            let update = updateA.merged[0];
            for(let i = 1; i < updateA.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateA.merged[i]);
            }
            for(let i = 0; i < updateB.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateB.merged[i]);
            }
            merged = [
                update
            ];
        }
    } else if (updateB.merged != null) {
        merged = updateB.merged;
    }
    return {
        type: 'ChunkListUpdate',
        chunks,
        merged
    };
}
function mergeChunkListChunks(chunksA, chunksB) {
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    return chunks;
}
function mergeChunkUpdates(updateA, updateB) {
    if (updateA.type === 'added' && updateB.type === 'deleted' || updateA.type === 'deleted' && updateB.type === 'added') {
        return undefined;
    }
    if (updateA.type === 'partial') {
        invariant(updateA.instruction, 'Partial updates are unsupported');
    }
    if (updateB.type === 'partial') {
        invariant(updateB.instruction, 'Partial updates are unsupported');
    }
    return undefined;
}
function mergeChunkListEcmascriptMergedUpdates(mergedA, mergedB) {
    const entries = mergeEcmascriptChunkEntries(mergedA.entries, mergedB.entries);
    const chunks = mergeEcmascriptChunksUpdates(mergedA.chunks, mergedB.chunks);
    return {
        type: 'EcmascriptMergedUpdate',
        entries,
        chunks
    };
}
function mergeEcmascriptChunkEntries(entriesA, entriesB) {
    return {
        ...entriesA,
        ...entriesB
    };
}
function mergeEcmascriptChunksUpdates(chunksA, chunksB) {
    if (chunksA == null) {
        return chunksB;
    }
    if (chunksB == null) {
        return chunksA;
    }
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeEcmascriptChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    if (Object.keys(chunks).length === 0) {
        return undefined;
    }
    return chunks;
}
function mergeEcmascriptChunkUpdates(updateA, updateB) {
    if (updateA.type === 'added' && updateB.type === 'deleted') {
        // These two completely cancel each other out.
        return undefined;
    }
    if (updateA.type === 'deleted' && updateB.type === 'added') {
        const added = [];
        const deleted = [];
        const deletedModules = new Set(updateA.modules ?? []);
        const addedModules = new Set(updateB.modules ?? []);
        for (const moduleId of addedModules){
            if (!deletedModules.has(moduleId)) {
                added.push(moduleId);
            }
        }
        for (const moduleId of deletedModules){
            if (!addedModules.has(moduleId)) {
                deleted.push(moduleId);
            }
        }
        if (added.length === 0 && deleted.length === 0) {
            return undefined;
        }
        return {
            type: 'partial',
            added,
            deleted
        };
    }
    if (updateA.type === 'partial' && updateB.type === 'partial') {
        const added = new Set([
            ...updateA.added ?? [],
            ...updateB.added ?? []
        ]);
        const deleted = new Set([
            ...updateA.deleted ?? [],
            ...updateB.deleted ?? []
        ]);
        if (updateB.added != null) {
            for (const moduleId of updateB.added){
                deleted.delete(moduleId);
            }
        }
        if (updateB.deleted != null) {
            for (const moduleId of updateB.deleted){
                added.delete(moduleId);
            }
        }
        return {
            type: 'partial',
            added: [
                ...added
            ],
            deleted: [
                ...deleted
            ]
        };
    }
    if (updateA.type === 'added' && updateB.type === 'partial') {
        const modules = new Set([
            ...updateA.modules ?? [],
            ...updateB.added ?? []
        ]);
        for (const moduleId of updateB.deleted ?? []){
            modules.delete(moduleId);
        }
        return {
            type: 'added',
            modules: [
                ...modules
            ]
        };
    }
    if (updateA.type === 'partial' && updateB.type === 'deleted') {
        // We could eagerly return `updateB` here, but this would potentially be
        // incorrect if `updateA` has added modules.
        const modules = new Set(updateB.modules ?? []);
        if (updateA.added != null) {
            for (const moduleId of updateA.added){
                modules.delete(moduleId);
            }
        }
        return {
            type: 'deleted',
            modules: [
                ...modules
            ]
        };
    }
    // Any other update combination is invalid.
    return undefined;
}
function invariant(_, message) {
    throw new Error(`Invariant: ${message}`);
}
const CRITICAL = [
    'bug',
    'error',
    'fatal'
];
function compareByList(list, a, b) {
    const aI = list.indexOf(a) + 1 || list.length;
    const bI = list.indexOf(b) + 1 || list.length;
    return aI - bI;
}
const chunksWithIssues = new Map();
function emitIssues() {
    const issues = [];
    const deduplicationSet = new Set();
    for (const [_, chunkIssues] of chunksWithIssues){
        for (const chunkIssue of chunkIssues){
            if (deduplicationSet.has(chunkIssue.formatted)) continue;
            issues.push(chunkIssue);
            deduplicationSet.add(chunkIssue.formatted);
        }
    }
    sortIssues(issues);
    hooks.issues(issues);
}
function handleIssues(msg) {
    const key = resourceKey(msg.resource);
    let hasCriticalIssues = false;
    for (const issue of msg.issues){
        if (CRITICAL.includes(issue.severity)) {
            hasCriticalIssues = true;
        }
    }
    if (msg.issues.length > 0) {
        chunksWithIssues.set(key, msg.issues);
    } else if (chunksWithIssues.has(key)) {
        chunksWithIssues.delete(key);
    }
    emitIssues();
    return hasCriticalIssues;
}
const SEVERITY_ORDER = [
    'bug',
    'fatal',
    'error',
    'warning',
    'info',
    'log'
];
const CATEGORY_ORDER = [
    'parse',
    'resolve',
    'code generation',
    'rendering',
    'typescript',
    'other'
];
function sortIssues(issues) {
    issues.sort((a, b)=>{
        const first = compareByList(SEVERITY_ORDER, a.severity, b.severity);
        if (first !== 0) return first;
        return compareByList(CATEGORY_ORDER, a.category, b.category);
    });
}
const hooks = {
    beforeRefresh: ()=>{},
    refresh: ()=>{},
    buildOk: ()=>{},
    issues: (_issues)=>{}
};
function setHooks(newHooks) {
    Object.assign(hooks, newHooks);
}
function handleSocketMessage(msg) {
    sortIssues(msg.issues);
    handleIssues(msg);
    switch(msg.type){
        case 'issues':
            break;
        case 'partial':
            // aggregate updates
            aggregateUpdates(msg);
            break;
        default:
            // run single update
            const runHooks = chunkListsWithPendingUpdates.size === 0;
            if (runHooks) hooks.beforeRefresh();
            triggerUpdate(msg);
            if (runHooks) finalizeUpdate();
            break;
    }
}
function finalizeUpdate() {
    hooks.refresh();
    hooks.buildOk();
    // This is used by the Next.js integration test suite to notify it when HMR
    // updates have been completed.
    // TODO: Only run this in test environments (gate by `process.env.__NEXT_TEST_MODE`)
    if (globalThis.__NEXT_HMR_CB) {
        globalThis.__NEXT_HMR_CB();
        globalThis.__NEXT_HMR_CB = null;
    }
}
function subscribeToChunkUpdate(chunkListPath, sendMessage, callback) {
    return subscribeToUpdate({
        path: chunkListPath
    }, sendMessage, callback);
}
function subscribeToUpdate(resource, sendMessage, callback) {
    const key = resourceKey(resource);
    let callbackSet;
    const existingCallbackSet = updateCallbackSets.get(key);
    if (!existingCallbackSet) {
        callbackSet = {
            callbacks: new Set([
                callback
            ]),
            unsubscribe: subscribeToUpdates(sendMessage, resource)
        };
        updateCallbackSets.set(key, callbackSet);
    } else {
        existingCallbackSet.callbacks.add(callback);
        callbackSet = existingCallbackSet;
    }
    return ()=>{
        callbackSet.callbacks.delete(callback);
        if (callbackSet.callbacks.size === 0) {
            callbackSet.unsubscribe();
            updateCallbackSets.delete(key);
        }
    };
}
function triggerUpdate(msg) {
    const key = resourceKey(msg.resource);
    const callbackSet = updateCallbackSets.get(key);
    if (!callbackSet) {
        return;
    }
    for (const callback of callbackSet.callbacks){
        callback(msg);
    }
    if (msg.type === 'notFound') {
        // This indicates that the resource which we subscribed to either does not exist or
        // has been deleted. In either case, we should clear all update callbacks, so if a
        // new subscription is created for the same resource, it will send a new "subscribe"
        // message to the server.
        // No need to send an "unsubscribe" message to the server, it will have already
        // dropped the update stream before sending the "notFound" message.
        updateCallbackSets.delete(key);
    }
}
}),
"[project]/hooks/useRollchainClient.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useRollchainClient",
    ()=>useRollchainClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$cosmjs$2f$stargate$2f$build$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@cosmjs/stargate/build/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$cosmjs$2f$tendermint$2d$rpc$2f$build$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@cosmjs/tendermint-rpc/build/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cosmjs$2d$types$2f$cosmos$2f$staking$2f$v1beta1$2f$tx$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/cosmjs-types/cosmos/staking/v1beta1/tx.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cosmjs$2d$types$2f$cosmos$2f$tx$2f$v1beta1$2f$tx$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/cosmjs-types/cosmos/tx/v1beta1/tx.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$cosmjs$2f$proto$2d$signing$2f$build$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@cosmjs/proto-signing/build/index.js [client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
// ═══════════════ CONSTANTS ═══════════════
const RPC_ENDPOINT = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_RPC || 'http://5.189.162.146:26657';
const CHAIN_ID = 'localchain_9000-1';
const BASE_DENOM = 'uroll';
const DISPLAY_DENOM = 'ROLL';
const AVERAGE_GAS_PRICE = 0.025;
const SIX_SECONDS = 6000;
const REST_ENDPOINT = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_REST || 'http://5.189.162.146:1317';
const GAS_PRICE_STEP = {
    low: 0.01,
    average: AVERAGE_GAS_PRICE,
    high: 0.04
};
// ═══════════════ HELPERS ═══════════════
async function rpcGet(path) {
    const url = `${RPC_ENDPOINT}${path}`;
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`RPC ${path} failed: ${res.status}`);
    }
    return res.json();
}
function formatDenomAmount(amount) {
    if (!amount) return 0;
    const asString = typeof amount === 'bigint' ? amount.toString() : String(amount);
    const parsed = Number(asString);
    if (Number.isNaN(parsed)) return 0;
    return parsed / 1_000_000;
}
function extractAmountFromRawLog(rawLog) {
    if (!rawLog) return undefined;
    try {
        const logs = JSON.parse(rawLog);
        for (const log of logs){
            const events = Array.isArray(log?.events) ? log.events : [];
            for (const event of events){
                if (event?.type !== 'transfer') continue;
                const attrs = Array.isArray(event.attributes) ? event.attributes : [];
                const amountAttr = attrs.find((attr)=>attr?.key === 'amount');
                if (amountAttr?.value) {
                    const tokens = String(amountAttr.value).split(',');
                    for (const token of tokens){
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
    } catch  {
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
        bip44: {
            coinType: 118
        },
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
        features: [
            'stargate',
            'ibc-transfer',
            'cosmwasm'
        ]
    };
}
function simplifyTypeUrl(typeUrl) {
    if (!typeUrl) return undefined;
    const sanitized = typeUrl.startsWith('/') ? typeUrl.slice(1) : typeUrl;
    const segments = sanitized.split('.');
    const last = segments[segments.length - 1];
    return last || sanitized;
}
function useRollchainClient() {
    _s();
    // State
    const [networkStatus, setNetworkStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])({
        chainId: '',
        latestBlockHeight: 0,
        catchingUp: false,
        latestBlockTime: undefined,
        avgBlockTime: undefined
    });
    const [latestBlock, setLatestBlock] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [blocks, setBlocks] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [transactions, setTransactions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [wallet, setWallet] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [delegationDraft, setDelegationDraft] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Refs
    const stargateRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const tmRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Memos
    const bankDenomLabel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useRollchainClient.useMemo[bankDenomLabel]": ()=>DISPLAY_DENOM
    }["useRollchainClient.useMemo[bankDenomLabel]"], []);
    // Calculate average block time from blocks
    const avgBlockTime = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useRollchainClient.useMemo[avgBlockTime]": ()=>{
            if (blocks.length < 2) return undefined;
            const times = blocks.slice(0, 10).map({
                "useRollchainClient.useMemo[avgBlockTime].times": (b)=>new Date(b.time).getTime()
            }["useRollchainClient.useMemo[avgBlockTime].times"]);
            let totalDiff = 0;
            for(let i = 0; i < times.length - 1; i++){
                totalDiff += times[i] - times[i + 1];
            }
            return totalDiff / (times.length - 1) / 1000;
        }
    }["useRollchainClient.useMemo[avgBlockTime]"], [
        blocks
    ]);
    // Disconnect
    const disconnect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useRollchainClient.useCallback[disconnect]": async ()=>{
            if (stargateRef.current) {
                await stargateRef.current.disconnect();
                stargateRef.current = null;
            }
            if (tmRef.current) {
                await tmRef.current.disconnect();
                tmRef.current = null;
            }
        }
    }["useRollchainClient.useCallback[disconnect]"], []);
    // Hydrate Tendermint client
    const hydrateTmClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useRollchainClient.useCallback[hydrateTmClient]": async ()=>{
            if (tmRef.current) return tmRef.current;
            tmRef.current = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$cosmjs$2f$tendermint$2d$rpc$2f$build$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Tendermint34Client"].connect({
                url: RPC_ENDPOINT
            });
            return tmRef.current;
        }
    }["useRollchainClient.useCallback[hydrateTmClient]"], []);
    // Hydrate Stargate client
    const hydrateStargateClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useRollchainClient.useCallback[hydrateStargateClient]": async ()=>{
            if (stargateRef.current) return stargateRef.current;
            stargateRef.current = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$cosmjs$2f$stargate$2f$build$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["StargateClient"].connect(RPC_ENDPOINT);
            return stargateRef.current;
        }
    }["useRollchainClient.useCallback[hydrateStargateClient]"], []);
    // Refresh network status
    const refreshStatus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useRollchainClient.useCallback[refreshStatus]": async ()=>{
            const statusRes = await rpcGet('/status');
            const { latest_block_height, latest_block_time, catching_up } = statusRes.result.sync_info;
            setNetworkStatus({
                "useRollchainClient.useCallback[refreshStatus]": (prev)=>({
                        ...prev,
                        chainId: statusRes.result.node_info.network,
                        latestBlockHeight: Number(latest_block_height),
                        latestBlockTime: latest_block_time,
                        catchingUp: catching_up
                    })
            }["useRollchainClient.useCallback[refreshStatus]"]);
            return Number(latest_block_height);
        }
    }["useRollchainClient.useCallback[refreshStatus]"], []);
    // Load blocks
    const loadBlocks = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useRollchainClient.useCallback[loadBlocks]": async (latestHeight)=>{
            const height = latestHeight ?? await refreshStatus();
            const minHeight = Math.max(1, height - 9);
            const chainRes = await rpcGet(`/blockchain?minHeight=${minHeight}&maxHeight=${height}`);
            const metas = (chainRes.result.block_metas || []).map({
                "useRollchainClient.useCallback[loadBlocks].metas": (meta)=>({
                        height: Number(meta.header?.height ?? meta.block?.header?.height ?? 0),
                        time: meta.header?.time ?? meta.block?.header?.time ?? '',
                        hash: meta.block_id?.hash ?? '',
                        proposer: meta.header?.proposer_address ?? '',
                        txs: Number(meta.header?.num_txs ?? meta.block?.data?.txs?.length ?? 0)
                    })
            }["useRollchainClient.useCallback[loadBlocks].metas"]);
            metas.sort({
                "useRollchainClient.useCallback[loadBlocks]": (a, b)=>b.height - a.height
            }["useRollchainClient.useCallback[loadBlocks]"]);
            setBlocks(metas);
            if (metas[0]) {
                setLatestBlock(metas[0]);
            }
        }
    }["useRollchainClient.useCallback[loadBlocks]"], [
        refreshStatus
    ]);
    // Load transactions
    const loadTransactions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useRollchainClient.useCallback[loadTransactions]": async ()=>{
            try {
                const query = '"tx.height>0"';
                const txsRes = await rpcGet(`/tx_search?query=${encodeURIComponent(query)}&per_page=10&order_by=${encodeURIComponent('"desc"')}`);
                const client = await hydrateStargateClient();
                const mapped = await Promise.all((txsRes.result.txs || []).map({
                    "useRollchainClient.useCallback[loadTransactions]": async (tx)=>{
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
                            const decoded = txDetails.tx ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$cosmjs$2f$proto$2d$signing$2f$build$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["decodeTxRaw"])(txDetails.tx) : undefined;
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
                        } catch  {
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
                    }
                }["useRollchainClient.useCallback[loadTransactions]"]));
                setTransactions(mapped);
            } catch (err) {
                console.error('Failed to load transactions:', err);
                setTransactions([]);
            }
        }
    }["useRollchainClient.useCallback[loadTransactions]"], [
        bankDenomLabel,
        hydrateStargateClient
    ]);
    // Fetch account snapshot
    const fetchAccountSnapshot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useRollchainClient.useCallback[fetchAccountSnapshot]": async (address)=>{
            const tm = await hydrateTmClient();
            const qc = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$cosmjs$2f$stargate$2f$build$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["QueryClient"].withExtensions(tm, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$cosmjs$2f$stargate$2f$build$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["setupBankExtension"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$cosmjs$2f$stargate$2f$build$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["setupStakingExtension"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$cosmjs$2f$stargate$2f$build$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["setupDistributionExtension"]);
            const [balancesRes, delegationsRes, rewardsRes] = await Promise.all([
                qc.bank.allBalances(address),
                qc.staking.delegatorDelegations(address),
                qc.distribution.delegationTotalRewards(address)
            ]);
            // Handle both response formats (array or object with balances property)
            const balanceArray = Array.isArray(balancesRes?.balances) ? balancesRes.balances : Array.isArray(balancesRes) ? balancesRes : [];
            const baseBalance = balanceArray.find({
                "useRollchainClient.useCallback[fetchAccountSnapshot].baseBalance": (b)=>b.denom === BASE_DENOM
            }["useRollchainClient.useCallback[fetchAccountSnapshot].baseBalance"]);
            const stakedSum = delegationsRes.delegationResponses.reduce({
                "useRollchainClient.useCallback[fetchAccountSnapshot].stakedSum": (acc, d)=>acc + Number(d.balance?.amount ?? 0)
            }["useRollchainClient.useCallback[fetchAccountSnapshot].stakedSum"], 0);
            const rewardsSum = rewardsRes.total.reduce({
                "useRollchainClient.useCallback[fetchAccountSnapshot].rewardsSum": (acc, r)=>acc + Number(r.amount ?? 0)
            }["useRollchainClient.useCallback[fetchAccountSnapshot].rewardsSum"], 0);
            return {
                balance: formatDenomAmount(baseBalance?.amount),
                staked: formatDenomAmount(stakedSum.toString()),
                rewards: formatDenomAmount(rewardsSum.toString())
            };
        }
    }["useRollchainClient.useCallback[fetchAccountSnapshot]"], [
        hydrateTmClient
    ]);
    // Connect wallet
    const connectWallet = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useRollchainClient.useCallback[connectWallet]": async ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            const w = window;
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
        }
    }["useRollchainClient.useCallback[connectWallet]"], [
        fetchAccountSnapshot
    ]);
    // Prepare delegate transaction
    const prepareDelegateTx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useRollchainClient.useCallback[prepareDelegateTx]": async (validatorAddress, amountRoll)=>{
            if (!wallet?.signer || !wallet.address) throw new Error('Connect wallet first');
            const signingClient = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$cosmjs$2f$stargate$2f$build$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["SigningStargateClient"].connectWithSigner(RPC_ENDPOINT, wallet.signer);
            const amount = Math.floor(amountRoll * 1_000_000).toString();
            const msg = {
                typeUrl: '/cosmos.staking.v1beta1.MsgDelegate',
                value: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cosmjs$2d$types$2f$cosmos$2f$staking$2f$v1beta1$2f$tx$2e$js__$5b$client$5d$__$28$ecmascript$29$__["MsgDelegate"].fromPartial({
                    delegatorAddress: wallet.address,
                    validatorAddress,
                    amount: {
                        denom: BASE_DENOM,
                        amount
                    }
                })
            };
            const fee = {
                amount: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$cosmjs$2f$proto$2d$signing$2f$build$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["coins"])(25000, BASE_DENOM),
                gas: '200000'
            };
            const signed = await signingClient.sign(wallet.address, [
                msg
            ], fee, '');
            const txBytes = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cosmjs$2d$types$2f$cosmos$2f$tx$2f$v1beta1$2f$tx$2e$js__$5b$client$5d$__$28$ecmascript$29$__["TxRaw"].encode(signed).finish();
            const draft = {
                txBytes,
                fee,
                msg
            };
            setDelegationDraft(draft);
            return draft;
        }
    }["useRollchainClient.useCallback[prepareDelegateTx]"], [
        wallet
    ]);
    // Search
    const search = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useRollchainClient.useCallback[search]": async (term)=>{
            const q = term.trim();
            if (!q) {
                throw new Error('Enter a search term');
            }
            const client = await hydrateStargateClient();
            // Check if it's a block height
            if (/^\d+$/.test(q)) {
                const height = Number(q);
                await rpcGet(`/block?height=${height}`);
                return {
                    type: 'block',
                    height
                };
            }
            // Check if it's a tx hash (40+ chars)
            if (q.length >= 40) {
                const hex = q.startsWith('0x') ? q.slice(2) : q;
                try {
                    const tx = await client.getTx(hex);
                    if (tx) return {
                        type: 'tx',
                        hash: hex
                    };
                } catch  {
                // Not a valid tx hash, continue
                }
            }
            // Check if it's an address
            if (q.startsWith('roll')) {
                await fetchAccountSnapshot(q);
                return {
                    type: 'account',
                    address: q
                };
            }
            throw new Error('Input did not match block height, tx hash, or address');
        }
    }["useRollchainClient.useCallback[search]"], [
        fetchAccountSnapshot,
        hydrateStargateClient
    ]);
    // Get block by height
    const getBlockByHeight = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useRollchainClient.useCallback[getBlockByHeight]": async (height)=>{
            const res = await rpcGet(`/block?height=${height}`);
            if (!res?.result?.block) return null;
            return {
                height: Number(res.result.block.header.height),
                time: res.result.block.header.time,
                hash: res.result.block_id.hash,
                proposer: res.result.block.header.proposer_address,
                txs: res.result.block.data?.txs?.length ?? 0
            };
        }
    }["useRollchainClient.useCallback[getBlockByHeight]"], []);
    // Get tx by hash
    const getTxByHash = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useRollchainClient.useCallback[getTxByHash]": async (hash)=>{
            const client = await hydrateStargateClient();
            const tx = await client.getTx(hash.startsWith('0x') ? hash.slice(2) : hash);
            if (!tx) return null;
            const decoded = tx.tx ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$cosmjs$2f$proto$2d$signing$2f$build$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["decodeTxRaw"])(tx.tx) : undefined;
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
        }
    }["useRollchainClient.useCallback[getTxByHash]"], [
        bankDenomLabel,
        hydrateStargateClient
    ]);
    // Get account
    const getAccount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useRollchainClient.useCallback[getAccount]": async (address)=>{
            const snapshot = await fetchAccountSnapshot(address);
            return {
                address,
                ...snapshot
            };
        }
    }["useRollchainClient.useCallback[getAccount]"], [
        fetchAccountSnapshot
    ]);
    // Bootstrap effect
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useRollchainClient.useEffect": ()=>{
            let timer = null;
            const bootstrap = {
                "useRollchainClient.useEffect.bootstrap": async ()=>{
                    try {
                        await hydrateStargateClient();
                        const latest = await refreshStatus();
                        await Promise.all([
                            loadBlocks(latest),
                            loadTransactions()
                        ]);
                        setLoading(false);
                        timer = setInterval({
                            "useRollchainClient.useEffect.bootstrap": ()=>{
                                refreshStatus().catch({
                                    "useRollchainClient.useEffect.bootstrap": ()=>undefined
                                }["useRollchainClient.useEffect.bootstrap"]);
                                loadBlocks().catch({
                                    "useRollchainClient.useEffect.bootstrap": ()=>undefined
                                }["useRollchainClient.useEffect.bootstrap"]);
                                loadTransactions().catch({
                                    "useRollchainClient.useEffect.bootstrap": ()=>undefined
                                }["useRollchainClient.useEffect.bootstrap"]);
                            }
                        }["useRollchainClient.useEffect.bootstrap"], SIX_SECONDS);
                    } catch (err) {
                        setError(err?.message ?? 'Failed to initialize client');
                        setLoading(false);
                    }
                }
            }["useRollchainClient.useEffect.bootstrap"];
            bootstrap();
            return ({
                "useRollchainClient.useEffect": ()=>{
                    if (timer) clearInterval(timer);
                    disconnect();
                }
            })["useRollchainClient.useEffect"];
        }
    }["useRollchainClient.useEffect"], [
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
_s(useRollchainClient, "zuThQIBBhnaiWcG0bHaDtY8aCvo=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/context/ThemeContext.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThemeProvider",
    ()=>ThemeProvider,
    "useTheme",
    ()=>useTheme
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
;
const ThemeContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["createContext"])({
    theme: 'dark',
    setTheme: ()=>undefined,
    toggleTheme: ()=>undefined
});
const STORAGE_KEY = 'rollscan-theme';
const ThemeProvider = ({ children })=>{
    _s();
    const [themeState, setThemeState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('dark');
    const applyTheme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ThemeProvider.useCallback[applyTheme]": (next)=>{
            if (typeof document !== 'undefined') {
                document.documentElement.setAttribute('data-theme', next);
            }
            if ("TURBOPACK compile-time truthy", 1) {
                try {
                    localStorage.setItem(STORAGE_KEY, next);
                } catch  {
                // ignore write failures (private mode, etc.)
                }
            }
        }
    }["ThemeProvider.useCallback[applyTheme]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ThemeProvider.useEffect": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            try {
                const stored = localStorage.getItem(STORAGE_KEY);
                if (stored === 'dark' || stored === 'light') {
                    setThemeState(stored);
                    applyTheme(stored);
                    return;
                }
            } catch  {
            // ignore read failures
            }
            const prefersDark = ("TURBOPACK compile-time value", "object") !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            const inferred = prefersDark ? 'dark' : 'light';
            setThemeState(inferred);
            applyTheme(inferred);
        }
    }["ThemeProvider.useEffect"], [
        applyTheme
    ]);
    const setTheme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ThemeProvider.useCallback[setTheme]": (next)=>{
            setThemeState(next);
            applyTheme(next);
        }
    }["ThemeProvider.useCallback[setTheme]"], [
        applyTheme
    ]);
    const toggleTheme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ThemeProvider.useCallback[toggleTheme]": ()=>{
            setThemeState({
                "ThemeProvider.useCallback[toggleTheme]": (prev)=>{
                    const next = prev === 'dark' ? 'light' : 'dark';
                    applyTheme(next);
                    return next;
                }
            }["ThemeProvider.useCallback[toggleTheme]"]);
        }
    }["ThemeProvider.useCallback[toggleTheme]"], [
        applyTheme
    ]);
    const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ThemeProvider.useMemo[value]": ()=>({
                theme: themeState,
                setTheme,
                toggleTheme
            })
    }["ThemeProvider.useMemo[value]"], [
        setTheme,
        themeState,
        toggleTheme
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ThemeContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/context/ThemeContext.tsx",
        lineNumber: 81,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
_s(ThemeProvider, "BGiFVNfTeVsDUkMJ1qFUwb05mZA=");
_c = ThemeProvider;
const useTheme = ()=>{
    _s1();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useContext"])(ThemeContext);
};
_s1(useTheme, "gDsCjeeItUuvgOWf1v4qoK9RF6k=");
var _c;
__turbopack_context__.k.register(_c, "ThemeProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/NavBar.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>NavBar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useRollchainClient$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useRollchainClient.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$ThemeContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/ThemeContext.tsx [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
const links = [
    {
        href: '/dashboard',
        label: 'Home',
        icon: '🏠'
    },
    {
        href: '/blocks',
        label: 'Blocks',
        icon: '⛓️'
    },
    {
        href: '/tx',
        label: 'Transactions',
        icon: '💸'
    },
    {
        href: '/accounts',
        label: 'Accounts',
        icon: '👤'
    },
    {
        href: '/supply',
        label: 'Supply',
        icon: '📦'
    },
    {
        href: '/market',
        label: 'Market',
        icon: '💹'
    },
    {
        href: '/analytics',
        label: 'Analytics',
        icon: '📈'
    },
    {
        href: '/ecosystem',
        label: 'Ecosystem',
        icon: '🌱'
    },
    {
        href: '/network',
        label: 'Network',
        icon: '🌐'
    },
    {
        href: '/staking',
        label: 'Staking',
        icon: '🥩'
    },
    {
        href: '/alerts',
        label: 'Alerts',
        icon: '🔔'
    },
    {
        href: '/community',
        label: 'Community',
        icon: '🤝'
    }
];
function NavBar() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { networkStatus, wallet, connectWallet, search, DISPLAY_DENOM } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useRollchainClient$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["useRollchainClient"])();
    const { theme, toggleTheme } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$ThemeContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useTheme"])();
    const path = router.pathname === '/' ? '/dashboard' : router.pathname;
    const [scrolled, setScrolled] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [searchTerm, setSearchTerm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [searchError, setSearchError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [isSearching, setIsSearching] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "NavBar.useEffect": ()=>{
            const handleScroll = {
                "NavBar.useEffect.handleScroll": ()=>setScrolled(window.scrollY > 20)
            }["NavBar.useEffect.handleScroll"];
            window.addEventListener('scroll', handleScroll);
            return ({
                "NavBar.useEffect": ()=>window.removeEventListener('scroll', handleScroll)
            })["NavBar.useEffect"];
        }
    }["NavBar.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "NavBar.useEffect": ()=>{
            const handleKeyDown = {
                "NavBar.useEffect.handleKeyDown": (e)=>{
                    if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
                        e.preventDefault();
                        document.getElementById('global-search')?.focus();
                    }
                }
            }["NavBar.useEffect.handleKeyDown"];
            window.addEventListener('keydown', handleKeyDown);
            return ({
                "NavBar.useEffect": ()=>window.removeEventListener('keydown', handleKeyDown)
            })["NavBar.useEffect"];
        }
    }["NavBar.useEffect"], []);
    const handleSearch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "NavBar.useCallback[handleSearch]": async ()=>{
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
            } catch (err) {
                setSearchError(err?.message || 'Not found');
            } finally{
                setIsSearching(false);
            }
        }
    }["NavBar.useCallback[handleSearch]"], [
        searchTerm,
        search,
        router
    ]);
    const handleConnectWallet = async ()=>{
        try {
            await connectWallet();
        } catch (err) {
            alert(err?.message || 'Failed to connect wallet');
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: `main-header ${scrolled ? 'header-scrolled' : ''}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "header-top",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/dashboard",
                        className: "brand-link",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "brand-container",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "logo",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        width: "40",
                                        height: "40",
                                        viewBox: "0 0 100 100",
                                        fill: "none",
                                        xmlns: "http://www.w3.org/2000/svg",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("linearGradient", {
                                                    id: "logoGrad",
                                                    x1: "0%",
                                                    y1: "0%",
                                                    x2: "100%",
                                                    y2: "100%",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                                            offset: "0%",
                                                            stopColor: "var(--accent-primary)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/NavBar.tsx",
                                                            lineNumber: 87,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                                            offset: "50%",
                                                            stopColor: "var(--accent-tertiary)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/NavBar.tsx",
                                                            lineNumber: 88,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                                            offset: "100%",
                                                            stopColor: "var(--accent-secondary)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/NavBar.tsx",
                                                            lineNumber: 89,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/NavBar.tsx",
                                                    lineNumber: 86,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/NavBar.tsx",
                                                lineNumber: 85,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                cx: "50",
                                                cy: "50",
                                                r: "42",
                                                stroke: "url(#logoGrad)",
                                                strokeWidth: "3",
                                                fill: "none"
                                            }, void 0, false, {
                                                fileName: "[project]/components/NavBar.tsx",
                                                lineNumber: 92,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                cx: "50",
                                                cy: "50",
                                                r: "28",
                                                stroke: "url(#logoGrad)",
                                                strokeWidth: "2",
                                                fill: "none",
                                                opacity: "0.5"
                                            }, void 0, false, {
                                                fileName: "[project]/components/NavBar.tsx",
                                                lineNumber: 93,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                cx: "50",
                                                cy: "50",
                                                r: "10",
                                                fill: "url(#logoGrad)"
                                            }, void 0, false, {
                                                fileName: "[project]/components/NavBar.tsx",
                                                lineNumber: 94,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M50 20 L50 35",
                                                stroke: "url(#logoGrad)",
                                                strokeWidth: "3",
                                                strokeLinecap: "round"
                                            }, void 0, false, {
                                                fileName: "[project]/components/NavBar.tsx",
                                                lineNumber: 95,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M50 65 L50 80",
                                                stroke: "url(#logoGrad)",
                                                strokeWidth: "3",
                                                strokeLinecap: "round"
                                            }, void 0, false, {
                                                fileName: "[project]/components/NavBar.tsx",
                                                lineNumber: 96,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M20 50 L35 50",
                                                stroke: "url(#logoGrad)",
                                                strokeWidth: "3",
                                                strokeLinecap: "round"
                                            }, void 0, false, {
                                                fileName: "[project]/components/NavBar.tsx",
                                                lineNumber: 97,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M65 50 L80 50",
                                                stroke: "url(#logoGrad)",
                                                strokeWidth: "3",
                                                strokeLinecap: "round"
                                            }, void 0, false, {
                                                fileName: "[project]/components/NavBar.tsx",
                                                lineNumber: 98,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/NavBar.tsx",
                                        lineNumber: 84,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/NavBar.tsx",
                                    lineNumber: 83,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "brand-text",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                            className: "brand-name",
                                            children: "RollScan"
                                        }, void 0, false, {
                                            fileName: "[project]/components/NavBar.tsx",
                                            lineNumber: 102,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "brand-tagline",
                                            children: "Blockchain Explorer"
                                        }, void 0, false, {
                                            fileName: "[project]/components/NavBar.tsx",
                                            lineNumber: 103,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/NavBar.tsx",
                                    lineNumber: 101,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/NavBar.tsx",
                            lineNumber: 82,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/NavBar.tsx",
                        lineNumber: 81,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "header-search-inline",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "search-container",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                className: `search-compact ${searchError ? 'search-error' : ''}`,
                                onSubmit: (e)=>{
                                    e.preventDefault();
                                    handleSearch();
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "search-icon",
                                        width: "18",
                                        height: "18",
                                        viewBox: "0 0 24 24",
                                        fill: "none",
                                        stroke: "currentColor",
                                        strokeWidth: "2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                cx: "11",
                                                cy: "11",
                                                r: "8"
                                            }, void 0, false, {
                                                fileName: "[project]/components/NavBar.tsx",
                                                lineNumber: 118,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "m21 21-4.35-4.35"
                                            }, void 0, false, {
                                                fileName: "[project]/components/NavBar.tsx",
                                                lineNumber: 119,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/NavBar.tsx",
                                        lineNumber: 117,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        id: "global-search",
                                        type: "text",
                                        placeholder: "Search by Block / Tx Hash / Address",
                                        value: searchTerm,
                                        onChange: (e)=>{
                                            setSearchTerm(e.target.value);
                                            setSearchError('');
                                        },
                                        disabled: isSearching
                                    }, void 0, false, {
                                        fileName: "[project]/components/NavBar.tsx",
                                        lineNumber: 121,
                                        columnNumber: 15
                                    }, this),
                                    searchTerm && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        className: "search-clear",
                                        onClick: ()=>setSearchTerm(''),
                                        children: "×"
                                    }, void 0, false, {
                                        fileName: "[project]/components/NavBar.tsx",
                                        lineNumber: 130,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "submit",
                                        className: "search-btn",
                                        disabled: isSearching,
                                        children: isSearching ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "search-spinner"
                                        }, void 0, false, {
                                            fileName: "[project]/components/NavBar.tsx",
                                            lineNumber: 133,
                                            columnNumber: 32
                                        }, this) : 'Search'
                                    }, void 0, false, {
                                        fileName: "[project]/components/NavBar.tsx",
                                        lineNumber: 132,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/NavBar.tsx",
                                lineNumber: 110,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/NavBar.tsx",
                            lineNumber: 109,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/NavBar.tsx",
                        lineNumber: 108,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "header-actions",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: "theme-toggle",
                                onClick: toggleTheme,
                                "aria-label": `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`,
                                title: theme === 'dark' ? 'Enable light mode' : 'Enable dark mode',
                                children: theme === 'dark' ? '☀️' : '🌙'
                            }, void 0, false, {
                                fileName: "[project]/components/NavBar.tsx",
                                lineNumber: 140,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `network-badge ${networkStatus.catchingUp ? 'syncing' : ''}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "pulse-dot"
                                    }, void 0, false, {
                                        fileName: "[project]/components/NavBar.tsx",
                                        lineNumber: 150,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "network-info",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "network-name",
                                                children: networkStatus.catchingUp ? 'Syncing...' : 'Connected'
                                            }, void 0, false, {
                                                fileName: "[project]/components/NavBar.tsx",
                                                lineNumber: 152,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "network-height",
                                                children: networkStatus.chainId || 'Connecting...'
                                            }, void 0, false, {
                                                fileName: "[project]/components/NavBar.tsx",
                                                lineNumber: 153,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/NavBar.tsx",
                                        lineNumber: 151,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/NavBar.tsx",
                                lineNumber: 149,
                                columnNumber: 11
                            }, this),
                            wallet ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "wallet-connected",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "wallet-icon",
                                        children: "👛"
                                    }, void 0, false, {
                                        fileName: "[project]/components/NavBar.tsx",
                                        lineNumber: 158,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "wallet-info",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "wallet-address",
                                                children: [
                                                    wallet.address.slice(0, 8),
                                                    "...",
                                                    wallet.address.slice(-4)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/NavBar.tsx",
                                                lineNumber: 160,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "wallet-balance",
                                                children: [
                                                    wallet.balance.toFixed(2),
                                                    " ",
                                                    DISPLAY_DENOM
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/NavBar.tsx",
                                                lineNumber: 161,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/NavBar.tsx",
                                        lineNumber: 159,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/NavBar.tsx",
                                lineNumber: 157,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "btn-connect",
                                onClick: handleConnectWallet,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "🔗"
                                    }, void 0, false, {
                                        fileName: "[project]/components/NavBar.tsx",
                                        lineNumber: 166,
                                        columnNumber: 15
                                    }, this),
                                    " Connect Wallet"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/NavBar.tsx",
                                lineNumber: 165,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/NavBar.tsx",
                        lineNumber: 139,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/NavBar.tsx",
                lineNumber: 80,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "header-bottom",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "network-toggle locked",
                        "aria-label": "Network scope",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "network-toggle-label",
                                children: "Network"
                            }, void 0, false, {
                                fileName: "[project]/components/NavBar.tsx",
                                lineNumber: 174,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "network-toggle-chip",
                                children: "Testnet"
                            }, void 0, false, {
                                fileName: "[project]/components/NavBar.tsx",
                                lineNumber: 175,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/NavBar.tsx",
                        lineNumber: 173,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                        className: "navbar",
                        children: links.map((link)=>{
                            const active = path.startsWith(link.href);
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                href: link.href,
                                className: `nav-link ${active ? 'nav-active' : ''}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "nav-icon",
                                        children: link.icon
                                    }, void 0, false, {
                                        fileName: "[project]/components/NavBar.tsx",
                                        lineNumber: 186,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "nav-label",
                                        children: link.label
                                    }, void 0, false, {
                                        fileName: "[project]/components/NavBar.tsx",
                                        lineNumber: 187,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, link.href, true, {
                                fileName: "[project]/components/NavBar.tsx",
                                lineNumber: 181,
                                columnNumber: 15
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/components/NavBar.tsx",
                        lineNumber: 177,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/NavBar.tsx",
                lineNumber: 172,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/NavBar.tsx",
        lineNumber: 79,
        columnNumber: 5
    }, this);
}
_s(NavBar, "0lGZ9/Fg+MFkFERT5aqIB/Or9iw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useRollchainClient$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["useRollchainClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$ThemeContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useTheme"]
    ];
});
_c = NavBar;
var _c;
__turbopack_context__.k.register(_c, "NavBar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/pages/_app.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MyApp
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/head.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$NavBar$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/NavBar.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$ThemeContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/ThemeContext.tsx [client] (ecmascript)");
;
;
;
;
;
function MyApp({ Component, pageProps }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$context$2f$ThemeContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["ThemeProvider"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("title", {
                            children: "RollScan — Blockchain Explorer"
                        }, void 0, false, {
                            fileName: "[project]/pages/_app.tsx",
                            lineNumber: 12,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                            name: "description",
                            content: "RollScan is a premium blockchain explorer for Rollchain. Track blocks, transactions, accounts, and staking in real-time."
                        }, void 0, false, {
                            fileName: "[project]/pages/_app.tsx",
                            lineNumber: 13,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                            name: "viewport",
                            content: "width=device-width, initial-scale=1"
                        }, void 0, false, {
                            fileName: "[project]/pages/_app.tsx",
                            lineNumber: 14,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/_app.tsx",
                    lineNumber: 11,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$NavBar$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/pages/_app.tsx",
                    lineNumber: 16,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                    className: "app-shell",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Component, {
                        ...pageProps
                    }, void 0, false, {
                        fileName: "[project]/pages/_app.tsx",
                        lineNumber: 18,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/pages/_app.tsx",
                    lineNumber: 17,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
                    className: "footer",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "footer-content",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "footer-brand",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "footer-logo",
                                        children: "◈"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/_app.tsx",
                                        lineNumber: 23,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "RollScan"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/_app.tsx",
                                        lineNumber: 24,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/_app.tsx",
                                lineNumber: 22,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "© 2025 RollScan. The most powerful Rollchain explorer."
                            }, void 0, false, {
                                fileName: "[project]/pages/_app.tsx",
                                lineNumber: 26,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "footer-links",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: "https://github.com",
                                        target: "_blank",
                                        rel: "noopener noreferrer",
                                        children: "GitHub"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/_app.tsx",
                                        lineNumber: 28,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: "https://docs.rollchain.io",
                                        target: "_blank",
                                        rel: "noopener noreferrer",
                                        children: "Docs"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/_app.tsx",
                                        lineNumber: 29,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: "https://discord.gg",
                                        target: "_blank",
                                        rel: "noopener noreferrer",
                                        children: "Discord"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/_app.tsx",
                                        lineNumber: 30,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/_app.tsx",
                                lineNumber: 27,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/_app.tsx",
                        lineNumber: 21,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/pages/_app.tsx",
                    lineNumber: 20,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true)
    }, void 0, false, {
        fileName: "[project]/pages/_app.tsx",
        lineNumber: 9,
        columnNumber: 5
    }, this);
}
_c = MyApp;
var _c;
__turbopack_context__.k.register(_c, "MyApp");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/pages/_app.tsx [client] (ecmascript)\" } [client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const PAGE_PATH = "/_app";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_context__.r("[project]/pages/_app.tsx [client] (ecmascript)");
    }
]);
// @ts-expect-error module.hot exists
if (module.hot) {
    // @ts-expect-error module.hot exists
    module.hot.dispose(function() {
        window.__NEXT_P.push([
            PAGE_PATH
        ]);
    });
}
}),
"[hmr-entry]/hmr-entry.js { ENTRY => \"[project]/pages/_app\" }", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.r("[next]/entry/page-loader.ts { PAGE => \"[project]/pages/_app.tsx [client] (ecmascript)\" } [client] (ecmascript)");
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__eab60d8e._.js.map