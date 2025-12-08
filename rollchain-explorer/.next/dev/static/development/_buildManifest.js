self.__BUILD_MANIFEST = {
  "/analytics": [
    "static/chunks/pages/analytics.js"
  ],
  "/blocks": [
    "static/chunks/pages/blocks.js"
  ],
  "/dashboard": [
    "static/chunks/pages/dashboard.js"
  ],
  "/ecosystem": [
    "static/chunks/pages/ecosystem.js"
  ],
  "/staking": [
    "static/chunks/pages/staking.js"
  ],
  "/tx": [
    "static/chunks/pages/tx.js"
  ],
  "__rewrites": {
    "afterFiles": [],
    "beforeFiles": [],
    "fallback": []
  },
  "sortedPages": [
    "/",
    "/_app",
    "/_error",
    "/account/[address]",
    "/accounts",
    "/alerts",
    "/analytics",
    "/blocks",
    "/blocks/[height]",
    "/community",
    "/dashboard",
    "/ecosystem",
    "/market",
    "/network",
    "/staking",
    "/supply",
    "/tx",
    "/tx/[hash]"
  ]
};self.__BUILD_MANIFEST_CB && self.__BUILD_MANIFEST_CB()