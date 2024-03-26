import { BridgeConstructorArgs, GetFeeArgs, HistoryRecord, Token, TransferOptions } from "@/types";
import { BaseBridge } from "./base";
import { Address, Hash, Hex, TransactionReceipt, encodeAbiParameters, encodeFunctionData } from "viem";
import { fetchMsglineFeeAndParams } from "@/utils";

export class XTokenNextBridge extends BaseBridge {
  private guard: Address | undefined;
  private convertor: { source: Address; target: Address } | undefined;

  constructor(args: BridgeConstructorArgs) {
    super(args);
    this.logo = {
      horizontal: "helix-horizontal.svg",
      symbol: "helix-symbol.svg",
    };
    this.name = "xToken";
    this._initContract();
  }

  private _initContract() {
    let backing: Address = "0x94eAb0CB67AB7edaf9A280aCa097F70e4BD780ac";
    let issuing: Address = "0x371019523b25Ff4F26d977724f976566b08bf741";
    if (
      (this.sourceChain?.network === "pangolin-dvm" && this.targetChain?.network === "sepolia") ||
      (this.sourceChain?.network === "sepolia" && this.targetChain?.network === "pangolin-dvm")
    ) {
      this.guard = "0x4CA75992d2750BEC270731A72DfDedE6b9E71cC7";
      backing = "0x7E3105E3A13D55d824b6322cbD2049f098a097F6";
      issuing = "0x3B36c2Db4CC5E92Af015Eb572A1C95C95599a8bF";
    }
    this.initContractByBackingIssuing(backing, issuing);

    if (this.sourceChain?.network === "pangolin-dvm" && this.targetChain?.network === "sepolia") {
      this.convertor = {
        source: "0x3ACEb55AAD4CDFE1531A9C6F6416753e6a7BDD49",
        target: "0x917CB26BfCf9F6bE65f387903AA9180613A40f41",
      };
    } else if (this.sourceChain?.network === "sepolia" && this.targetChain?.network === "pangolin-dvm") {
      this.convertor = {
        source: "0x917CB26BfCf9F6bE65f387903AA9180613A40f41",
        target: "0x3ACEb55AAD4CDFE1531A9C6F6416753e6a7BDD49",
      };
    }
  }

  protected async _transfer(
    sender: `0x${string}`,
    recipient: `0x${string}`,
    amount: bigint,
    _options?: (TransferOptions & { askEstimateGas?: boolean | undefined }) | undefined,
  ): Promise<bigint | TransactionReceipt | undefined> {
    const nonce = BigInt(Date.now());
    const feeAndParams = await this._getTransferFeeAndParams(sender, recipient, amount, nonce);

    if (
      feeAndParams &&
      this.contract &&
      this.sourceToken &&
      this.targetChain &&
      this.walletClient &&
      this.publicClient
    ) {
      const value = this.sourceToken.type === "native" ? amount + feeAndParams.fee : feeAndParams.fee;
      const address = this.contract.sourceAddress;
      const gas = this.getTxGasLimit();

      if (this.crossInfo?.action === "issue") {
        if (this.sourceToken?.type === "native") {
          if (this.guard && this.convertor) {
            // Guard, convertor
            const hash = await this.walletClient.writeContract({
              abi: (await import("@/abi/wtoken-convertor")).default,
              functionName: "lockAndXIssue",
              args: [
                BigInt(this.targetChain.id),
                this.guard,
                sender,
                amount,
                nonce,
                encodeAbiParameters(
                  [
                    { name: "x", type: "address" },
                    { name: "y", type: "bytes" },
                  ],
                  [this.convertor.target, recipient],
                ),
                feeAndParams.extParams,
              ],
              address,
              value,
              gas,
            });
            return this.publicClient.waitForTransactionReceipt({ hash });
          } else if (this.convertor) {
            // No guard, convertor
            const hash = await this.walletClient.writeContract({
              abi: (await import("@/abi/wtoken-convertor")).default,
              functionName: "lockAndXIssue",
              args: [
                BigInt(this.targetChain.id),
                this.convertor.target,
                sender,
                amount,
                nonce,
                recipient,
                feeAndParams.extParams,
              ],
              address,
              value,
              gas,
            });
            return this.publicClient.waitForTransactionReceipt({ hash });
          }
        } else {
          if (this.guard) {
            // Guard, no convertor
            const hash = await this.walletClient.writeContract({
              abi: (await import("@/abi/xtoken-backing-next")).default,
              functionName: "lockAndXIssue",
              args: [
                BigInt(this.targetChain.id),
                this.sourceToken.address,
                this.guard,
                sender,
                amount,
                nonce,
                encodeAbiParameters(
                  [
                    { name: "x", type: "address" },
                    { name: "y", type: "bytes" },
                  ],
                  [recipient, "0x"],
                ),
                feeAndParams.extParams,
              ],
              address,
              value,
              gas,
            });
            return this.publicClient.waitForTransactionReceipt({ hash });
          } else {
            // No guard, no convertor
            const hash = await this.walletClient.writeContract({
              abi: (await import("@/abi/xtoken-backing-next")).default,
              functionName: "lockAndXIssue",
              args: [
                BigInt(this.targetChain.id),
                this.sourceToken.address,
                recipient,
                sender,
                amount,
                nonce,
                "0x",
                feeAndParams.extParams,
              ],
              address,
              value,
              gas,
            });
            return this.publicClient.waitForTransactionReceipt({ hash });
          }
        }
      } else if (this.crossInfo?.action === "redeem") {
        if (this.targetToken?.type === "native") {
          if (this.guard && this.convertor) {
            const hash = await this.walletClient.writeContract({
              abi: (await import("@/abi/xtoken-convertor")).default,
              functionName: "burnAndXUnlock",
              args: [
                this.guard,
                sender,
                amount,
                nonce,
                encodeAbiParameters(
                  [
                    { name: "x", type: "address" },
                    { name: "x", type: "bytes" },
                  ],
                  [this.convertor.target, recipient],
                ),
                feeAndParams.extParams,
              ],
              address,
              value,
              gas,
            });
            return this.publicClient.waitForTransactionReceipt({ hash });
          } else if (this.convertor) {
            const hash = await this.walletClient.writeContract({
              abi: (await import("@/abi/xtoken-convertor")).default,
              functionName: "burnAndXUnlock",
              args: [this.convertor.target, sender, amount, nonce, recipient, feeAndParams.extParams],
              address,
              value,
              gas,
            });
            return this.publicClient.waitForTransactionReceipt({ hash });
          }
        } else {
          if (this.guard) {
            const hash = await this.walletClient.writeContract({
              abi: (await import("@/abi/xtoken-issuing-next")).default,
              functionName: "burnAndXUnlock",
              args: [
                this.sourceToken.address,
                this.guard,
                sender,
                amount,
                nonce,
                encodeAbiParameters(
                  [
                    { name: "x", type: "address" },
                    { name: "x", type: "bytes" },
                  ],
                  [recipient, "0x"],
                ),
                feeAndParams.extParams,
              ],
              address,
              value,
              gas,
            });
            return this.publicClient.waitForTransactionReceipt({ hash });
          } else {
            const hash = await this.walletClient.writeContract({
              abi: (await import("@/abi/xtoken-issuing-next")).default,
              functionName: "burnAndXUnlock",
              args: [this.sourceToken.address, recipient, sender, amount, nonce, "0x", feeAndParams.extParams],
              address,
              value,
              gas,
            });
            return this.publicClient.waitForTransactionReceipt({ hash });
          }
        }
      }
    }
  }

  private async _getTransferFeeAndParams(sender: Address, recipient: Address, amount: bigint, nonce: bigint) {
    const sourceMessager = this.sourceChain?.messager?.msgline;
    const targetMessager = this.targetChain?.messager?.msgline;

    if (sourceMessager && targetMessager && this.contract && this.sourceToken && this.sourcePublicClient) {
      let message: Hash | undefined;
      let originalSender = sender;
      let extData: Hash = "0x";

      if (this.sourceToken.type === "native") {
        if (this.guard && this.convertor) {
          extData = encodeAbiParameters(
            [
              { name: "x", type: "address" },
              { name: "y", type: "bytes" },
            ],
            [this.convertor.target, recipient],
          );
        } else if (this.convertor) {
          extData = recipient;
        }
        originalSender = this.convertor?.source ?? sender;
      } else {
        if (this.guard) {
          extData = encodeAbiParameters(
            [
              { name: "x", type: "address" },
              { name: "y", type: "bytes" },
            ],
            [recipient, "0x"],
          );
        } else {
          extData = "0x";
        }
      }
      const args = [
        BigInt(this.sourceChain.id),
        this.sourceToken.address,
        originalSender,
        recipient,
        sender,
        amount,
        nonce,
        extData,
      ] as const;

      if (this.crossInfo?.action === "issue") {
        message = encodeFunctionData({
          abi: (await import("@/abi/xtoken-issuing-next")).default,
          functionName: "issue",
          args,
        });
      } else if (this.crossInfo?.action === "redeem") {
        message = encodeFunctionData({
          abi: (await import("@/abi/xtoken-backing-next")).default,
          functionName: "unlock",
          args,
        });
      }

      if (message) {
        const payload = encodeFunctionData({
          abi: (await import("@/abi/msgline-messager")).default,
          functionName: "receiveMessage",
          args: [BigInt(this.sourceChain.id), this.contract.sourceAddress, this.contract.targetAddress, message],
        });

        return fetchMsglineFeeAndParams(
          this.sourceChain.id,
          this.targetChain.id,
          sourceMessager,
          targetMessager,
          sender,
          payload,
        );
      }
    }
  }

  async getFee(args?: GetFeeArgs | undefined): Promise<{ value: bigint; token: Token } | undefined> {
    if (this.sourceNativeToken) {
      const nonce = BigInt(Date.now());
      const sender = args?.sender ?? "0x0000000000000000000000000000000000000000";
      const recipient = args?.recipient ?? "0x0000000000000000000000000000000000000000";
      const feeAndParams = await this._getTransferFeeAndParams(sender, recipient, args?.transferAmount ?? 0n, nonce);
      if (feeAndParams) {
        return { value: feeAndParams.fee, token: this.sourceNativeToken };
      }
    }
  }

  async getDailyLimit(): Promise<{ limit: bigint; spent: bigint; token: Token } | undefined> {
    if (this.contract && this.sourceToken && this.targetToken && this.targetPublicClient) {
      const limit = await this.targetPublicClient.readContract({
        address: this.contract.targetAddress,
        abi: (await import("@/abi/xtoken-issuing-next")).default,
        functionName: "dailyLimit",
        args: [this.targetToken.address],
      });
      return { limit, spent: 0n, token: this.sourceToken };
    }
  }

  async claim(record: HistoryRecord): Promise<TransactionReceipt | undefined> {
    await this.validateNetwork("target");

    if (record.recvTokenAddress && this.guard && this.contract && this.walletClient && this.publicClient) {
      const hash = await this.walletClient.writeContract({
        abi: (await import("@/abi/guard-next")).default,
        functionName: "claim",
        args: [
          this.contract.targetAddress,
          BigInt(record.id.split("-").slice(-1)[0]),
          BigInt(record.endTime || 0),
          record.recvTokenAddress,
          BigInt(record.recvAmount || 0),
          record.extData,
          record.guardSignatures?.split("-").slice(1) as Hex[],
        ],
        address: this.guard,
        gas: this.getTxGasLimit(),
      });
      return this.publicClient.waitForTransactionReceipt({ hash });
    }
  }

  async refund(record: HistoryRecord): Promise<TransactionReceipt | undefined> {
    await this.validateNetwork("target");
    const sourceMessager = this.sourceChain?.messager?.msgline;
    const targetMessager = this.targetChain?.messager?.msgline;
    const nonce = record.messageNonce?.split("-").at(0);

    if (sourceMessager && targetMessager && this.contract && this.publicClient && this.walletClient) {
      let originalSender =
        this.sourceToken?.type === "native" && this.convertor ? this.convertor.source : record.sender;

      if (this.crossInfo?.action === "issue") {
        const message = encodeFunctionData({
          abi: (await import("@/abi/xtoken-backing-next")).default,
          functionName: "rollbackLockAndXIssue",
          args: [
            BigInt(this.targetChain.id),
            record.sendTokenAddress,
            originalSender,
            record.recipient,
            record.sender,
            BigInt(record.sendAmount),
            BigInt(nonce ?? 0),
          ],
        });

        const payload = encodeFunctionData({
          abi: (await import("@/abi/msgline-messager")).default,
          functionName: "receiveMessage",
          args: [BigInt(this.targetChain.id), this.contract.targetAddress, this.contract.sourceAddress, message],
        });

        const feeAndParams = await fetchMsglineFeeAndParams(
          this.targetChain.id,
          this.sourceChain.id,
          targetMessager,
          sourceMessager,
          record.sender,
          payload,
        );

        if (feeAndParams) {
          const hash = await this.walletClient.writeContract({
            address: this.contract.targetAddress,
            abi: (await import("@/abi/xtoken-issuing-next")).default,
            functionName: "xRollbackLockAndXIssue",
            args: [
              BigInt(this.sourceChain.id),
              record.sendTokenAddress,
              originalSender,
              record.recipient,
              record.sender,
              BigInt(record.sendAmount),
              BigInt(nonce ?? 0),
              feeAndParams.extParams,
            ],
          });
          return this.publicClient.waitForTransactionReceipt({ hash });
        }
      } else if (this.crossInfo?.action === "redeem") {
        const message = encodeFunctionData({
          abi: (await import("@/abi/xtoken-issuing-next")).default,
          functionName: "rollbackBurnAndXUnlock",
          args: [
            BigInt(this.targetChain.id),
            record.sendTokenAddress,
            originalSender,
            record.recipient,
            record.sender,
            BigInt(record.sendAmount),
            BigInt(nonce ?? 0),
          ],
        });

        const payload = encodeFunctionData({
          abi: (await import("@/abi/msgline-messager")).default,
          functionName: "receiveMessage",
          args: [BigInt(this.targetChain.id), this.contract.targetAddress, this.contract.sourceAddress, message],
        });

        const feeAndParams = await fetchMsglineFeeAndParams(
          this.targetChain.id,
          this.sourceChain.id,
          targetMessager,
          sourceMessager,
          record.sender,
          payload,
        );

        if (feeAndParams) {
          const hash = await this.walletClient.writeContract({
            address: this.contract.targetAddress,
            abi: (await import("@/abi/xtoken-backing-next")).default,
            functionName: "xRollbackBurnAndXUnlock",
            args: [
              BigInt(this.sourceChain.id),
              record.sendTokenAddress,
              originalSender,
              record.recipient,
              record.sender,
              BigInt(record.sendAmount),
              BigInt(nonce ?? 0),
              feeAndParams.extParams,
            ],
          });
          return this.publicClient.waitForTransactionReceipt({ hash });
        }
      }
    }
  }
}
