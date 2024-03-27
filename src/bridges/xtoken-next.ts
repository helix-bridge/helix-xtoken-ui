import { BridgeConstructorArgs, GetFeeArgs, HistoryRecord, Token, TransferOptions } from "@/types";
import { BaseBridge } from "./base";
import { Address, Hash, Hex, TransactionReceipt, encodeAbiParameters, encodeFunctionData, isAddressEqual } from "viem";
import { fetchMsglineFeeAndParams } from "@/utils";

export class XTokenNextBridge extends BaseBridge {
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
      backing = "0x7E3105E3A13D55d824b6322cbD2049f098a097F6";
      issuing = "0x3B36c2Db4CC5E92Af015Eb572A1C95C95599a8bF";
    }
    this.initContractByBackingIssuing(backing, issuing);
  }

  protected async _transfer(
    sender: Address,
    recipient: Address,
    amount: bigint,
    options?: (TransferOptions & { askEstimateGas?: boolean | undefined }) | undefined,
  ): Promise<bigint | TransactionReceipt | undefined> {
    const askEstimateGas = options?.askEstimateGas ?? false;
    if (askEstimateGas) {
      return undefined;
    }

    const nonce = BigInt(Date.now());
    const { recipient: pRecipient, extData } = await this._getExtDataAndRecipient(recipient);
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
      const guard = await this._getTargetGuard();
      const gas = this.getTxGasLimit();

      if (this.crossInfo?.action === "issue") {
        if (this.sourceToken?.type === "native") {
          if (guard && this.sourceChain?.convertor) {
            const hash = await this.walletClient.writeContract({
              abi: (await import("@/abi/wtoken-convertor")).default,
              functionName: "lockAndXIssue",
              args: [BigInt(this.targetChain.id), pRecipient, sender, amount, nonce, extData, feeAndParams.extParams],
              address: this.sourceChain.convertor,
              value,
              gas,
            });
            return this.publicClient.waitForTransactionReceipt({ hash });
          } else if (this.sourceChain?.convertor) {
            const hash = await this.walletClient.writeContract({
              abi: (await import("@/abi/wtoken-convertor")).default,
              functionName: "lockAndXIssue",
              args: [BigInt(this.targetChain.id), pRecipient, sender, amount, nonce, extData, feeAndParams.extParams],
              address: this.sourceChain.convertor,
              value,
              gas,
            });
            return this.publicClient.waitForTransactionReceipt({ hash });
          }
        } else {
          if (guard) {
            const hash = await this.walletClient.writeContract({
              abi: (await import("@/abi/xtoken-backing-next")).default,
              functionName: "lockAndXIssue",
              args: [
                BigInt(this.targetChain.id),
                this.sourceToken.address,
                pRecipient,
                sender,
                amount,
                nonce,
                extData,
                feeAndParams.extParams,
              ],
              address: this.contract.sourceAddress,
              value,
              gas,
            });
            return this.publicClient.waitForTransactionReceipt({ hash });
          } else {
            const hash = await this.walletClient.writeContract({
              abi: (await import("@/abi/xtoken-backing-next")).default,
              functionName: "lockAndXIssue",
              args: [
                BigInt(this.targetChain.id),
                this.sourceToken.address,
                pRecipient,
                sender,
                amount,
                nonce,
                extData,
                feeAndParams.extParams,
              ],
              address: this.contract.sourceAddress,
              value,
              gas,
            });
            return this.publicClient.waitForTransactionReceipt({ hash });
          }
        }
      } else if (this.crossInfo?.action === "redeem") {
        if (this.targetToken?.type === "native") {
          if (guard && this.sourceChain?.convertor) {
            const hash = await this.walletClient.writeContract({
              abi: (await import("@/abi/xtoken-convertor")).default,
              functionName: "burnAndXUnlock",
              args: [pRecipient, sender, amount, nonce, extData, feeAndParams.extParams],
              address: this.sourceChain.convertor,
              value,
              gas,
            });
            return this.publicClient.waitForTransactionReceipt({ hash });
          } else if (this.sourceChain?.convertor) {
            const hash = await this.walletClient.writeContract({
              abi: (await import("@/abi/xtoken-convertor")).default,
              functionName: "burnAndXUnlock",
              args: [pRecipient, sender, amount, nonce, extData, feeAndParams.extParams],
              address: this.sourceChain.convertor,
              value,
              gas,
            });
            return this.publicClient.waitForTransactionReceipt({ hash });
          }
        } else {
          if (guard) {
            const hash = await this.walletClient.writeContract({
              abi: (await import("@/abi/xtoken-issuing-next")).default,
              functionName: "burnAndXUnlock",
              args: [this.sourceToken.inner, pRecipient, sender, amount, nonce, extData, feeAndParams.extParams],
              address: this.contract.sourceAddress,
              value,
              gas,
            });
            return this.publicClient.waitForTransactionReceipt({ hash });
          } else {
            const hash = await this.walletClient.writeContract({
              abi: (await import("@/abi/xtoken-issuing-next")).default,
              functionName: "burnAndXUnlock",
              args: [this.sourceToken.inner, pRecipient, sender, amount, nonce, extData, feeAndParams.extParams],
              address: this.contract.sourceAddress,
              value,
              gas,
            });
            return this.publicClient.waitForTransactionReceipt({ hash });
          }
        }
      }
    }
  }

  private async _getExtDataAndRecipient(defaultRecipient: Address) {
    const guard = await this._getTargetGuard();
    let recipient = defaultRecipient;
    let extData: Hash = "0x";

    if (this.sourceToken?.type === "native" || this.targetToken?.type === "native") {
      if (guard && this.targetChain?.convertor) {
        // Guard, convertor
        recipient = guard;
        extData = encodeAbiParameters(
          [
            { name: "x", type: "address" },
            { name: "y", type: "bytes" },
          ],
          [this.targetChain.convertor, defaultRecipient],
        );
      } else if (this.targetChain?.convertor) {
        // No guard, convertor
        recipient = this.targetChain.convertor;
        extData = defaultRecipient;
      }
    } else {
      if (guard) {
        // Guard, no convertor
        recipient = guard;
        extData = encodeAbiParameters(
          [
            { name: "x", type: "address" },
            { name: "y", type: "bytes" },
          ],
          [defaultRecipient, "0x"],
        );
      } else {
        // No guard, no convertor
        recipient = defaultRecipient;
        extData = "0x";
      }
    }
    return { recipient, extData };
  }

  private async _getTransferFeeAndParams(sender: Address, recipient: Address, amount: bigint, nonce: bigint) {
    const sourceMessager = this.sourceChain?.messager?.msgline;
    const targetMessager = this.targetChain?.messager?.msgline;

    if (sourceMessager && targetMessager && this.contract && this.sourceToken && this.sourcePublicClient) {
      let message: Hash | undefined;
      let originalSender = sender;
      if (this.sourceToken.type === "native" || this.targetToken?.type === "native") {
        originalSender = this.sourceChain.convertor ?? sender;
      }
      const { recipient: pRecipient, extData } = await this._getExtDataAndRecipient(recipient);

      const args = [
        BigInt(this.sourceChain.id),
        this.sourceToken.inner,
        originalSender,
        pRecipient,
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
        args: [this.targetToken.inner],
      });
      return { limit, spent: 0n, token: this.sourceToken };
    }
  }

  async claim(record: HistoryRecord): Promise<TransactionReceipt | undefined> {
    await this.validateNetwork("target");
    const guard = await this._getTargetGuard();

    if (record.recvTokenAddress && guard && this.contract && this.walletClient && this.publicClient) {
      const hash = await this.walletClient.writeContract({
        abi: (await import("@/abi/guard-next")).default,
        functionName: "claim",
        args: [
          this.contract.targetAddress,
          BigInt(record.id.split("-").slice(-1)[0]),
          BigInt(record.endTime || 0),
          record.recvTokenAddress, // TODO: inner address
          BigInt(record.recvAmount || 0),
          record.extData,
          record.guardSignatures?.split("-").slice(1) as Hex[],
        ],
        address: guard,
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

    if (
      sourceMessager &&
      targetMessager &&
      this.contract &&
      this.publicClient &&
      this.walletClient &&
      this.sourceToken
    ) {
      let originalSender = record.sender;
      if (this.sourceToken?.type === "native" || this.targetToken?.type === "native") {
        originalSender = this.sourceChain.convertor ?? record.sender;
      }
      const { recipient: pRecipient } = await this._getExtDataAndRecipient(record.recipient);

      if (this.crossInfo?.action === "issue") {
        const message = encodeFunctionData({
          abi: (await import("@/abi/xtoken-backing-next")).default,
          functionName: "rollbackLockAndXIssue",
          args: [
            BigInt(this.targetChain.id),
            this.sourceToken.inner,
            originalSender,
            pRecipient,
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
              this.sourceToken.inner,
              originalSender,
              pRecipient,
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
            this.sourceToken.inner,
            originalSender,
            pRecipient,
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
              this.sourceToken.inner,
              originalSender,
              pRecipient,
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

  // private async _getSourceGuard() {
  //   if (this.contract && this.sourcePublicClient) {
  //     const guard = await this.sourcePublicClient.readContract({
  //       abi: (await import("@/abi/xtoken-issuing-next")).default,
  //       functionName: "guard",
  //       address: this.contract.sourceAddress,
  //     });
  //     return isAddressEqual(guard, "0x0000000000000000000000000000000000000000") ? undefined : guard;
  //   }
  // }

  private async _getTargetGuard() {
    if (this.contract && this.targetPublicClient) {
      const guard = await this.targetPublicClient.readContract({
        abi: (await import("@/abi/xtoken-issuing-next")).default,
        functionName: "guard",
        address: this.contract.targetAddress,
      });
      return isAddressEqual(guard, "0x0000000000000000000000000000000000000000") ? undefined : guard;
    }
  }
}
