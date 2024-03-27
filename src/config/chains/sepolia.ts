import { ChainConfig } from "@/types";
import { sepolia } from "viem/chains";

export const sepoliaChain: ChainConfig = {
  /**
   * Chain
   */
  ...sepolia,
  network: "sepolia",
  name: "Sepolia",
  rpcUrls: {
    default: {
      http: ["https://1rpc.io/sepolia"],
      webSocket: ["wss://ethereum-sepolia.publicnode.com"],
    },
    public: {
      http: ["https://1rpc.io/sepolia"],
      webSocket: ["wss://ethereum-sepolia.publicnode.com"],
    },
  },

  /**
   * Custom
   */
  logo: "sepolia.png",
  tokens: [
    {
      decimals: 18,
      symbol: "ETH",
      name: "ETH",
      type: "native",
      address: "0x0000000000000000000000000000000000000000",
      outer: "0x0000000000000000000000000000000000000000",
      inner: "0x0000000000000000000000000000000000000000",
      logo: "eth.svg",
      cross: [],
    },
    {
      decimals: 18,
      symbol: "xPRING",
      name: "xPRING",
      type: "erc20",
      address: "0xBD50868F36Eb46355eC5a153AbD3a7eA094A5c37",
      outer: "0xBD50868F36Eb46355eC5a153AbD3a7eA094A5c37",
      inner: "0xF874fad204757588e67EE55cE93D654b6f5C39C6",
      logo: "ring.svg",
      cross: [
        {
          target: { network: "pangolin-dvm", symbol: "PRING" },
          bridge: { category: "xtoken-sepolia" },
          action: "redeem",
        },
      ],
    },
  ],
  messager: {
    msgline: "0xf7F461728DC89de5EF6615715678b5f5b12bb98A",
  },
  convertor: "0x917CB26BfCf9F6bE65f387903AA9180613A40f41",
};
