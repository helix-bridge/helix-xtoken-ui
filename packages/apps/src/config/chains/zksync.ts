import { ChainConfig, ChainID } from "@/types/chain";

export const zksyncChain: ChainConfig = {
  id: ChainID.ZKSYNC,
  network: "zksync",
  name: "zkSync era",
  logo: "zksync.png",
  nativeCurrency: {
    name: "ETH",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://mainnet.era.zksync.io"],
      webSocket: ["wss://mainnet.era.zksync.io/ws"],
    },
    public: {
      http: ["https://mainnet.era.zksync.io"],
      webSocket: ["wss://mainnet.era.zksync.io/ws"],
    },
  },
  blockExplorers: {
    default: {
      name: "Zksync",
      url: "https://explorer.zksync.io/",
    },
  },
  tokens: [
    {
      decimals: 18,
      symbol: "ETH",
      name: "ETH",
      type: "native",
      address: "0x0000000000000000000000000000000000000000",
      logo: "eth.svg",
      cross: [],
    },
    {
      decimals: 6,
      symbol: "USDT",
      name: "USDT",
      type: "erc20",
      address: "0x493257fD37EDB34451f62EDf8D2a0C418852bA4C",
      logo: "usdt.svg",
      cross: [
        { target: { network: "arbitrum", symbol: "USDT" }, bridge: { category: "lnbridgev20-default" } },
        { target: { network: "mantle", symbol: "USDT" }, bridge: { category: "lnbridgev20-default" } },
        { target: { network: "scroll", symbol: "USDT" }, bridge: { category: "lnbridgev20-default" } },
      ],
    },
    {
      decimals: 6,
      symbol: "USDC",
      name: "USDC",
      type: "erc20",
      address: "0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4",
      logo: "usdc.svg",
      cross: [],
    },
  ],
};
