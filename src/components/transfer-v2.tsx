"use client";

import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import TransferTokenSection from "./transfer-token-section";
import {
  bridgeFactory,
  getSourceTokenOptions,
  getTargetTokenOptions,
  getTokenOptions,
  notifyError,
  notifyTransaction,
} from "@/utils";
import TransferChainSection from "./transfer-chain-section";
import TransferAmountSection from "./transfer-amount-section";
import TransferInformationSection from "./transfer-information-section";
import Button from "@/ui/button";
import { useAllowance, useBalance, useDailyLimit, useMessageFee, useTransferV2 } from "@/hooks";
import { useAccount, useNetwork, usePublicClient, useSwitchNetwork, useWalletClient } from "wagmi";
import TransferProviderV2 from "@/providers/transfer-provider-v2";
import DisclaimerModal from "./modals/disclaimer-modal";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { Address, Hex } from "viem";
import TransferModalV2 from "./modals/transfer-modal-v2";
import BridgeTabs from "./bridge-tabs";
import ThirdPartyBridge from "./third-party-bridge";

interface Recipient {
  input: string;
  value: Address | undefined;
  alert?: string;
}

enum BridgeTab {
  OFFICIAL,
  THIRD_PARTY,
}

function Component() {
  const [txHash, setTxHash] = useState<Hex | null>();
  const [isOpen, setIsOpen] = useState(false);
  const [isTransfering, setIsTransfering] = useState(false);
  const [bridgeTab, setBridgeTab] = useState(BridgeTab.OFFICIAL);
  const {
    amount,
    token,
    sourceChain,
    sourceToken,
    targetChain,
    targetToken,
    sourceChainOptions,
    targetChainOptions,
    setAmount,
    isSwitchAvailable,
    handleTokenChange,
    handleSourceChainChange,
    handleSourceTokenChange,
    handleTargetChainChange,
    handleTargetTokenChange,
    handleSwitch,
  } = useTransferV2();
  const deferredAmount = useDeferredValue(amount);

  const account = useAccount();
  const { chain } = useNetwork();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const { switchNetwork } = useSwitchNetwork();
  const { openConnectModal } = useConnectModal();

  const [recipient, setRecipient] = useState<Recipient>({
    input: account.address ?? "",
    value: account.address,
    alert: undefined,
  });
  const [expandRecipient, setExpandRecipient] = useState(false);
  const isCustomRecipient = useRef(false); // After input recipient manually, set to `true`
  useEffect(() => {
    if (!isCustomRecipient.current) {
      if (account.address) {
        setRecipient({ input: account.address, value: account.address, alert: undefined });
      } else {
        setRecipient({ input: "", value: undefined, alert: undefined });
      }
    }
  }, [account.address]);
  const handleRecipientChange = useCallback((value: Recipient) => {
    setRecipient(value);
    isCustomRecipient.current = true;
  }, []);
  const handleExpandRecipient = useCallback(() => setExpandRecipient((prev) => !prev), []);

  const {
    balance,
    loading: loadingBalance,
    refresh: refreshBalance,
  } = useBalance(sourceChain, sourceToken, account.address);

  const [bridge, cross] = useMemo(() => {
    const cross = sourceToken.cross.find(
      (c) => c.target.network === targetChain.network && c.target.symbol === targetToken.symbol,
    );
    const bridge = cross
      ? bridgeFactory({
          category: cross.bridge.category,
          walletClient,
          publicClient,
          sourceChain,
          sourceToken,
          targetChain,
          targetToken,
        })
      : undefined;
    return [bridge, cross];
  }, [publicClient, sourceChain, sourceToken, targetChain, targetToken, walletClient]);

  const { loading: loadingDailyLimit, dailyLimit } = useDailyLimit(bridge);
  const { loading: loadingFee, fee } = useMessageFee(bridge, account.address, account.address, deferredAmount.value);

  const {
    allowance,
    loading: loadingAllowance,
    busy: isApproving,
    approve,
    refresh: refreshAllowance,
  } = useAllowance(sourceChain, sourceToken, account.address, bridge?.getContract()?.sourceAddress);

  const [actionText, disableAction] = useMemo(() => {
    let text: "Connect Wallet" | "Switch Chain" | "Approve" | "Deposit" | "Withdraw" = "Deposit";
    let disabled = false;

    if (chain?.id) {
      if (chain.id !== sourceChain.id) {
        text = "Switch Chain";
        disabled = false;
      } else if (
        allowance < (fee?.token.type === "native" ? deferredAmount.value : deferredAmount.value + (fee?.value ?? 0n))
      ) {
        text = "Approve";
        disabled = false;
      } else {
        text = cross?.action === "redeem" ? "Withdraw" : "Deposit";
        disabled =
          loadingAllowance ||
          fee?.value === undefined ||
          !deferredAmount.input ||
          !deferredAmount.valid ||
          !recipient.value ||
          !!recipient.alert;
      }
    } else {
      text = "Connect Wallet";
      disabled = false;
    }

    return [text, disabled];
  }, [
    cross,
    allowance,
    loadingAllowance,
    chain?.id,
    deferredAmount,
    sourceChain.id,
    fee?.value,
    fee?.token.type,
    recipient.alert,
    recipient.value,
  ]);

  const handleAction = useCallback(async () => {
    if (actionText === "Connect Wallet") {
      openConnectModal?.();
    } else if (actionText === "Switch Chain") {
      switchNetwork?.(sourceChain.id);
    } else if (actionText === "Approve") {
      const receipt = await approve(
        fee?.token.type === "native" ? deferredAmount.value : deferredAmount.value + (fee?.value ?? 0n),
      );
      notifyTransaction(receipt, sourceChain);
    } else if (actionText === "Deposit" || actionText === "Withdraw") {
      setIsOpen(true);
    }
  }, [
    actionText,
    sourceChain,
    deferredAmount.value,
    fee?.value,
    fee?.token.type,
    approve,
    openConnectModal,
    switchNetwork,
  ]);

  const handleTransfer = useCallback(async () => {
    if (bridge && account.address && recipient.value) {
      try {
        setIsTransfering(true);
        const receipt = await bridge.transfer(account.address, recipient.value, deferredAmount.value, {
          totalFee: fee?.value,
        });
        notifyTransaction(receipt, sourceChain);
        setTxHash(receipt?.transactionHash);
        if (receipt?.status === "success") {
          setIsTransfering(false);
          refreshBalance();
          refreshAllowance();
        }
      } catch (err) {
        console.error(err);
        notifyError(err);
        setIsTransfering(false);
      }
    }
  }, [
    account.address,
    recipient.value,
    bridge,
    sourceChain,
    fee?.value,
    deferredAmount.value,
    refreshBalance,
    refreshAllowance,
  ]);

  return (
    <>
      <div className="mx-auto flex w-full flex-col gap-medium rounded-large bg-[#1F282C] p-medium lg:mt-5 lg:w-[27.5rem] lg:gap-5 lg:rounded-[1.25rem] lg:p-5">
        <TransferTokenSection token={token} options={getTokenOptions()} onChange={handleTokenChange} />
        <TransferChainSection
          recipient={recipient}
          expandRecipient={expandRecipient}
          recipientOptions={account.address ? [account.address] : []}
          sourceChain={sourceChain}
          targetChain={targetChain}
          sourceToken={sourceToken}
          targetToken={targetToken}
          sourceChainOptions={sourceChainOptions}
          targetChainOptions={targetChainOptions}
          disableSwitch={!isSwitchAvailable(sourceChain, targetChain)}
          sourceTokenOptions={getSourceTokenOptions(sourceChain, token.category)}
          targetTokenOptions={getTargetTokenOptions(sourceToken, targetChain)}
          onSourceChainChange={handleSourceChainChange}
          onSourceTokenChange={handleSourceTokenChange}
          onTargetChainChange={handleTargetChainChange}
          onTargetTokenChange={handleTargetTokenChange}
          onSwitch={handleSwitch}
          onRecipientChange={handleRecipientChange}
          onExpandRecipient={handleExpandRecipient}
        />
        <BridgeTabs<BridgeTab>
          options={[
            {
              children: (
                <>
                  <TransferAmountSection
                    amount={amount}
                    loading={loadingBalance}
                    balance={balance}
                    token={sourceToken}
                    chain={sourceChain}
                    min={bridge?.getCrossInfo()?.min}
                    max={dailyLimit?.limit}
                    onChange={setAmount}
                    onRefresh={refreshBalance}
                  />
                  <TransferInformationSection
                    bridge={bridge}
                    fee={fee}
                    dailyLimit={dailyLimit}
                    isLoadingFee={loadingFee}
                    isLoadingDailyLimit={loadingDailyLimit}
                  />

                  <div className="flex flex-col items-center gap-2 lg:gap-3">
                    <Button
                      className="inline-flex h-12 w-full items-center justify-center rounded-full"
                      kind="primary"
                      busy={isApproving}
                      disabled={disableAction}
                      onClick={handleAction}
                    >
                      <span className="text-base font-bold text-white">{actionText}</span>
                    </Button>
                    <span className="text-xs font-semibold text-white/50">
                      © {new Date().getFullYear()} Powered by{" "}
                      <a
                        href="https://xtoken.helixbridge.app"
                        rel="noopener noreferrer"
                        target="_blank"
                        className="text-primary hover:underline"
                      >
                        xToken
                      </a>
                    </span>
                  </div>
                </>
              ),
              tab: BridgeTab.OFFICIAL,
              label: "Official Brigde",
            },
            {
              children: <ThirdPartyBridge />,
              tab: BridgeTab.THIRD_PARTY,
              label: "Third Party Bridge",
            },
          ]}
          activeTab={bridgeTab}
          onChange={setBridgeTab}
        />
      </div>

      <TransferModalV2
        sender={account.address}
        recipient={recipient.value}
        sourceChain={sourceChain}
        sourceToken={sourceToken}
        targetChain={targetChain}
        targetToken={targetToken}
        txHash={txHash}
        fee={fee}
        bridge={bridge}
        amount={deferredAmount.value}
        busy={isTransfering}
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          if (txHash) {
            setAmount({ input: "", valid: true, value: 0n, alert: "" });
          }
          setTxHash(null);
        }}
        onConfirm={handleTransfer}
      />

      <DisclaimerModal />
    </>
  );
}

export default function TransferV2() {
  return (
    <TransferProviderV2>
      <Component />
    </TransferProviderV2>
  );
}
