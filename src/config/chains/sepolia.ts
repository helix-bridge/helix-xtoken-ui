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
      inner: "0x0000000000000000000000000000000000000000",
      outer: "0x0000000000000000000000000000000000000000",
      logo: "eth.svg",
      cross: [],
    },
    {
      decimals: 18,
      symbol: "xPRING",
      name: "xPRING",
      type: "erc20",
      address: "0xBC43cb6175FcC8E577a0846256eA699b87eFcEE5",
      inner: "0xBC43cb6175FcC8E577a0846256eA699b87eFcEE5",
      outer: "0xBC43cb6175FcC8E577a0846256eA699b87eFcEE5",
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
