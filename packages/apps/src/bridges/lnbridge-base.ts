import { ChainConfig } from "@/types/chain";
import { BaseBridge } from "./base";
import { TransactionReceipt } from "viem";
import { Token } from "@/types/token";
import { BridgeCategory, BridgeLogo } from "@/types/bridge";
import { PublicClient, WalletClient } from "wagmi";

export class LnBridgeBase extends BaseBridge {
  constructor(args: {
    walletClient?: WalletClient | null;
    publicClient?: PublicClient;
    category: BridgeCategory;
    logo?: BridgeLogo;

    sourceChain?: ChainConfig;
    targetChain?: ChainConfig;
    sourceToken?: Token;
    targetToken?: Token;
  }) {
    super(args);

    this.logo = args.logo ?? {
      horizontal: "helix-horizontal.svg",
      symbol: "helix-symbol.svg",
    };
    this.name = "Helix LnBridge";
    this.estimateTime = { min: 1, max: 30 };
  }

  isLnBridge() {
    return true;
  }

  async getFee(args?: { baseFee?: bigint; protocolFee?: bigint; liquidityFeeRate?: bigint; transferAmount?: bigint }) {
    if (this.sourceToken) {
      return {
        value:
          (args?.baseFee || 0n) +
          (args?.protocolFee || 0n) +
          ((args?.liquidityFeeRate || 0n) * (args?.transferAmount || 0n)) / 100000n,
        token: this.sourceToken,
      };
    }
  }

  async transfer(
    _sender: string,
    _recipient: string,
    _amount: bigint,
    _options?: Object | undefined,
  ): Promise<TransactionReceipt | undefined> {
    return;
  }
}