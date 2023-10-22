import { ChainConfig, ChainID } from "@/types/chain";

export const crabChain: ChainConfig = {
  id: ChainID.CRAB,
  network: "crab-dvm",
  name: "Crab",
  logo: "crab.svg",
  nativeCurrency: {
    name: "CRAB",
    symbol: "CRAB",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://crab-rpc.darwinia.network"],
      webSocket: ["wss://crab-rpc.darwinia.network"],
    },
    public: {
      http: ["https://crab-rpc.darwinia.network"],
      webSocket: ["wss://crab-rpc.darwinia.network"],
    },
  },
  blockExplorers: {
    default: {
      name: "Subscan",
      url: "https://crab.subscan.io/",
    },
  },
  tokens: [
    {
      decimals: 18,
      symbol: "CRAB",
      name: "CRAB",
      type: "native",
      address: "0x2D2b97EA380b0185e9fDF8271d1AFB5d2Bf18329",
      logo: "crab.svg",
      cross: [
        {
          target: { network: "darwinia-dvm", symbol: "xWCRAB" },
          bridge: { category: "helix-sub2subv21(lock)" },
          action: "issue",
        },
      ],
    },
    {
      decimals: 18,
      symbol: "xWRING",
      name: "xWRING",
      type: "erc20",
      address: "0x273131F7CB50ac002BDd08cA721988731F7e1092",
      logo: "ring.svg",
      cross: [
        {
          target: { network: "darwinia-dvm", symbol: "RING" },
          bridge: { category: "helix-sub2subv21(unlock)" },
          action: "redeem",
        },
      ],
    },
  ],
};