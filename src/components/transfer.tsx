"use client";

import { useToggle, useTransfer } from "@/hooks";
import {
  bridgeFactory,
  getAvailableBridges,
  getAvailableSourceTokens,
  getAvailableTargetChains,
  getAvailableTargetTokens,
  getCrossDefaultValue,
  isProduction,
} from "@/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useDeferredValue, useEffect, useMemo, useState } from "react";
import { Address, useAccount, usePublicClient, useWalletClient } from "wagmi";
import { Subscription, from } from "rxjs";
import Label from "@/ui/label";
import ChainSelect from "./chain-select";
import SwitchCrossIcon from "@/ui/switch-cross-icon";
import Faucet from "./faucet";
import { BalanceInput } from "./balance-input";
import BridgeSelect from "./bridge-select";
import TransferInfo from "./transfer-info";
import TransferAction from "./transfer-action";
import TransferModal from "./modals/transfer-modal";
import DisclaimerModal from "./modals/disclaimer-modal";

const { defaultSourceChains } = getCrossDefaultValue();

export default function Transfer() {
  const {
    bridgeFee,
    sourceChain,
    targetChain,
    sourceToken,
    targetToken,
    sourceBalance,
    bridgeInstance,
    bridgeCategory,
    transferAmount,
    setSourceChain,
    setTargetChain,
    setSourceToken,
    setTargetToken,
    setTransferAmount,
    setBridgeFee,
    setBridgeCategory,
    setBridgeInstance,
    updateSourceBalance,
    updateUrlParams,
  } = useTransfer();
  const deferredTransferAmount = useDeferredValue(transferAmount);

  const { state: isOpen, setTrue: setIsOpenTrue, setFalse: setIsOpenFalse } = useToggle(false);
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  const [recipient, _setRecipient] = useState<Address>();
  const [isLoadingFee, setIsLoadingFee] = useState(false);
  const [estimateGasFee, setEstimateGasFee] = useState(0n);
  const [balanceLoading, setBalanceLoading] = useState(false);

  const alert = useMemo(() => {
    if (
      (sourceChain?.network === "darwinia-dvm" && targetChain?.network === "ethereum") ||
      (sourceChain?.network === "ethereum" && targetChain?.network === "darwinia-dvm")
    ) {
      return (
        <div className="flex flex-wrap items-center justify-center rounded-2xl bg-inner px-3 py-middle text-center text-sm font-medium text-app-orange">
          <span>
            {`Due to the Ethereum upgrade, the Darwinia<>Ethereum bridge is temporarily unavailable. Please use the official`}
            &nbsp;
          </span>
          <a
            href="https://bridge.arbitrum.io/?destinationChain=ethereum&sourceChain=arbitrum-one"
            rel="noopener noreferrer"
            target="_blank"
            className=" text-primary hover:underline"
          >
            Arbitrum bridge
          </a>
          <span>&nbsp;{`to route to Darwinia or Ethereum instead.`}</span>
        </div>
      );
    }
    return null;
  }, [sourceChain?.network, targetChain?.network]);

  const bridgeOptions = useMemo(
    () => getAvailableBridges(sourceChain, targetChain, sourceToken),
    [sourceChain, targetChain, sourceToken],
  );

  const transferable = useMemo(() => {
    let result: bigint | undefined;
    let fee = 0n;

    if (sourceBalance) {
      const { token, value: balance } = sourceBalance;
      result = result === undefined ? balance : result < balance ? result : balance;
      if (bridgeFee?.token.symbol === token.symbol) {
        fee = bridgeFee.value;
        result = fee < result ? result - fee : 0n;
      }
    }
    if (result !== undefined) {
      result = estimateGasFee < result ? result - estimateGasFee : 0n;
    }
    return result;
  }, [bridgeFee, estimateGasFee, sourceBalance]);

  const searchParams = useSearchParams();
  const router = useRouter();

  const refreshBalance = useCallback(async () => {
    if (address && bridgeInstance) {
      setBalanceLoading(true);
      await updateSourceBalance(address, bridgeInstance);
      setBalanceLoading(false);
    }
  }, [address, bridgeInstance, updateSourceBalance]);

  useEffect(() => {
    setBridgeCategory((prevValue) => prevValue ?? bridgeOptions.at(0));
  }, [bridgeOptions, setBridgeCategory]);

  useEffect(() => {
    setBridgeInstance(
      bridgeCategory
        ? bridgeFactory({
            category: bridgeCategory,
            sourceChain,
            targetChain,
            sourceToken,
            targetToken,
            walletClient,
            publicClient,
          })
        : undefined,
    );
  }, [
    sourceChain,
    targetChain,
    sourceToken,
    targetToken,
    walletClient,
    publicClient,
    bridgeCategory,
    setBridgeInstance,
  ]);

  useEffect(() => {
    let sub$$: Subscription | undefined;

    if (bridgeInstance) {
      setIsLoadingFee(true);
      sub$$ = from(
        bridgeInstance.getFee({
          sender: address,
          recipient,
          transferAmount: deferredTransferAmount.value,
        }),
      ).subscribe({
        next: setBridgeFee,
        error: (err) => {
          console.error(err);
          setBridgeFee(undefined);
          setIsLoadingFee(false);
        },
        complete: () => setIsLoadingFee(false),
      });
    } else {
      setBridgeFee(undefined);
    }

    return () => {
      sub$$?.unsubscribe();
    };
  }, [address, recipient, bridgeInstance, deferredTransferAmount, setBridgeFee]);

  useEffect(() => {
    let sub$$: Subscription | undefined;

    // Note: native token

    if (bridgeInstance && sourceToken?.type === "native" && address && deferredTransferAmount.value) {
      sub$$ = from(
        bridgeInstance.estimateTransferGasFee(address, recipient ?? address, deferredTransferAmount.value, {
          totalFee: bridgeFee?.value,
        }),
      ).subscribe({
        next: (gasFee) => {
          setEstimateGasFee(gasFee ?? 0n);
        },
        error: (err) => {
          console.error(err);
          setEstimateGasFee(0n);
        },
      });
    } else {
      setEstimateGasFee(0n);
    }

    return () => sub$$?.unsubscribe();
  }, [bridgeInstance, sourceToken, bridgeFee, address, recipient, deferredTransferAmount]);

  return (
    <>
      <div className="mx-auto flex w-full flex-col gap-large rounded-3xl bg-component p-middle lg:mt-20 lg:w-[30rem] lg:gap-5 lg:p-5">
        {/* From-To */}
        <div className="mt-8 flex items-center justify-between gap-small lg:gap-large">
          <Label text="From" className="w-[45%] lg:w-full" textClassName="font-medium text-sm" needAbsolute>
            <ChainSelect
              className="w-full bg-inner p-middle"
              placement="bottom-start"
              value={sourceChain}
              options={defaultSourceChains}
              onChange={(_sourceChain) => {
                const _targetChains = getAvailableTargetChains(_sourceChain);
                const _targetChain = _targetChains.at(0);
                const _sourceTokens = getAvailableSourceTokens(_sourceChain, _targetChain);
                const _sourceToken = _sourceTokens.at(0);
                const _targetTokens = getAvailableTargetTokens(_sourceChain, _targetChain, _sourceToken);
                const _targetToken = _targetTokens.at(0);
                const _category = getAvailableBridges(_sourceChain, _targetChain, _sourceToken).at(0);

                setBridgeCategory(_category);
                setSourceChain(_sourceChain);
                setTargetChain(_targetChain);
                setSourceToken(_sourceToken);
                setTargetToken(_targetToken);
                updateUrlParams(router, searchParams, {
                  _category,
                  _sourceChain,
                  _targetChain,
                  _sourceToken,
                  _targetToken,
                });
              }}
            />
          </Label>
          <SwitchCrossIcon
            disabled={!getAvailableBridges(targetChain, sourceChain, targetToken).length}
            onClick={() => {
              const _sourceChain = targetChain ? { ...targetChain } : undefined;
              const _targetChain = sourceChain ? { ...sourceChain } : undefined;
              const _sourceToken = targetToken ? { ...targetToken } : undefined;
              const _targetToken = sourceToken ? { ...sourceToken } : undefined;
              const _category = getAvailableBridges(_sourceChain, _targetChain, _sourceToken).at(0);

              setBridgeCategory(_category);
              setSourceChain(_sourceChain);
              setTargetChain(_targetChain);
              setSourceToken(_sourceToken);
              setTargetToken(_targetToken);
              updateUrlParams(router, searchParams, {
                _category,
                _sourceChain,
                _targetChain,
                _sourceToken,
                _targetToken,
              });
            }}
          />
          <Label text="To" className="w-[45%] lg:w-full" textClassName="font-medium text-sm" needAbsolute>
            <ChainSelect
              className="w-full bg-inner p-middle"
              placement="bottom-end"
              value={targetChain}
              options={getAvailableTargetChains(sourceChain)}
              onChange={(_targetChain) => {
                const _sourceTokens = getAvailableSourceTokens(sourceChain, _targetChain);
                const _sourceToken = _sourceTokens.at(0);
                const _targetTokens = getAvailableTargetTokens(sourceChain, _targetChain, _sourceToken);
                const _targetToken = _targetTokens.at(0);
                const _category = getAvailableBridges(sourceChain, _targetChain, _sourceToken).at(0);

                setBridgeCategory(_category);
                setTargetChain(_targetChain);
                setSourceToken(_sourceToken);
                setTargetToken(_targetToken);
                updateUrlParams(router, searchParams, { _category, _targetChain, _sourceToken, _targetToken });
              }}
            />
          </Label>
        </div>

        {/* Amount */}
        <Label text="Amount" textClassName="font-medium text-sm" extra={isProduction() ? null : <Faucet />}>
          <BalanceInput
            autoFocus
            placeholder="0"
            enabledDynamicStyle
            balance={sourceBalance?.value}
            min={bridgeInstance?.getCrossInfo()?.min}
            value={transferAmount}
            token={sourceToken}
            balanceLoading={balanceLoading}
            tokenOptions={getAvailableSourceTokens(sourceChain, targetChain)}
            onBalanceRefresh={refreshBalance}
            onChange={setTransferAmount}
            onTokenChange={(_sourceToken) => {
              const _targetTokens = getAvailableTargetTokens(sourceChain, targetChain, _sourceToken);
              const _targetToken = _targetTokens.at(0);
              const _category = getAvailableBridges(sourceChain, targetChain, _sourceToken).at(0);
              setBridgeCategory(_category);
              setSourceToken(_sourceToken);
              setTargetToken(_targetToken);
              updateUrlParams(router, searchParams, { _category, _sourceToken, _targetToken });
            }}
          />
        </Label>

        {/* Bridge */}
        <Label
          text="Bridge"
          className={`${bridgeOptions.length > 1 ? "" : "hidden"}`}
          textClassName="font-medium text-sm"
        >
          <BridgeSelect
            options={bridgeOptions}
            value={bridgeCategory}
            onChange={(_category) => {
              setBridgeCategory(_category);
              updateUrlParams(router, searchParams, { _category });
            }}
          />
        </Label>

        {/* Information */}
        <Label text="Information" textClassName="font-medium text-sm">
          {alert ?? (
            <TransferInfo
              fee={bridgeFee ? { ...bridgeFee, loading: isLoadingFee } : undefined}
              bridge={bridgeInstance}
            />
          )}
        </Label>

        {/* Action */}
        <TransferAction
          forceDisabled={!!alert}
          transferable={transferable}
          transferAmount={deferredTransferAmount}
          recipient={recipient || address}
          onTransfer={setIsOpenTrue}
        />
      </div>

      <TransferModal
        sender={address}
        recipient={recipient || address}
        transferAmount={deferredTransferAmount}
        isOpen={isOpen}
        onClose={() => {
          setIsOpenFalse();
          setTransferAmount({ input: "", valid: true, value: 0n });
        }}
      />

      <DisclaimerModal />
    </>
  );
}
