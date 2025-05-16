export const NetworkDetails = [
  {
    chainId: process.env.REACT_APP_ACTIVE_CHAIN == "56" ? "0x38" : "0x61",
    chainName:
      process.env.REACT_APP_ACTIVE_CHAIN == "56"
        ? "Smart Chain"
        : "Smart Chain - Testnet",
    nativeCurrency: {
      name: "BNB",
      symbol: "BNB",
      decimals: 18,
    },
    rpcUrls: [process.env.REACT_APP_RPC_URL],
    blockExplorerUrls: [
      process.env.REACT_APP_ACTIVE_CHAIN == "56"
        ? "https://bscscan.com/"
        : "https://testnet.bscscan.com/",
    ],
  },
];
