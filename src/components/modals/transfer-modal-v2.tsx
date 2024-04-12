import { BaseBridge } from "@/bridges";
import { ChainConfig, Token } from "@/types";
import { formatBalance, getChainLogoSrc, toShortAdrress } from "@/utils";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Address, Hex } from "viem";

const Modal = dynamic(() => import("@/ui/modal"), { ssr: false });

interface Props {
  sender?: `0x${string}` | null;
  recipient?: `0x${string}` | null;
  sourceChain: ChainConfig;
  sourceToken: Token;
  targetChain: ChainConfig;
  targetToken: Token;
  txHash: Hex | null | undefined;
  fee: { token: Token; value: bigint } | null | undefined;
  bridge: BaseBridge | undefined;
  amount: bigint;
  busy: boolean;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function TransferModalV2({
  sender,
  recipient,
  busy,
  fee,
  bridge,
  sourceChain,
  sourceToken,
  targetChain,
  targetToken,
  txHash,
  amount,
  isOpen,
  onClose,
  onConfirm,
}: Props) {
  return (
    <Modal
      title="Cross-chain Review"
      isOpen={isOpen}
      className="w-full lg:w-[34rem]"
      okText="Confirm"
      disabledCancel={busy}
      busy={busy}
      forceFooterHidden={!!txHash}
      onClose={onClose}
      onCancel={onClose}
      onOk={onConfirm}
    >
      {/* From-To */}
      <div className="flex flex-col gap-small">
        <SourceTarget type="source" address={sender} chain={sourceChain} token={sourceToken} amount={amount} />
        <div className="relative">
          <div className="absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center">
            <Image width={36} height={36} alt="Transfer to" src="images/transfer-to.svg" className="shrink-0" />
          </div>
        </div>
        <SourceTarget type="target" address={recipient} chain={targetChain} token={targetToken} amount={amount} />
      </div>

      {/* information */}
      <div className="flex flex-col gap-medium">
        <span className="text-sm font-bold text-white/50">Information</span>
        <Information fee={fee} bridge={bridge} />
      </div>

      {txHash ? (
        <div className="inline-flex items-center justify-center px-medium text-sm font-semibold italic text-white lg:px-3">
          View tx on &nbsp;
          <a
            className="text-primary hover:underline"
            target="_blank"
            href={`${new URL(`tx/${txHash}`, sourceChain?.blockExplorers?.default.url).href}`}
          >
            Explorer
          </a>
          .
        </div>
      ) : null}
    </Modal>
  );
}

function SourceTarget({
  type,
  address,
  chain,
  token,
  amount,
}: {
  type: "source" | "target";
  amount: bigint;
  chain?: ChainConfig;
  token?: Token;
  address?: Address | null;
}) {
  return chain && token ? (
    <div className="flex items-center justify-between rounded-xl bg-background p-3 lg:rounded-2xl lg:p-large">
      {/* Left */}
      <div className="flex items-center gap-medium">
        <Image width={36} height={36} alt="Chain" src={getChainLogoSrc(chain.logo)} className="shrink-0 rounded-full" />
        <div className="flex flex-col items-start gap-1">
          <span className="text-base font-bold text-white">{chain.name}</span>
          <span className="hidden text-sm font-semibold text-white/50 lg:inline">{address}</span>
          {address ? (
            <span className="text-sm font-semibold text-white/50 lg:hidden">{toShortAdrress(address, 8, 6)}</span>
          ) : null}
        </div>
      </div>

      {/* Right */}
      <div className="flex flex-col items-end">
        <span className={`text-base font-semibold ${type === "source" ? "text-app-red" : "text-app-green"}`}>
          {type === "source" ? "-" : "+"}
          {formatBalance(amount, token.decimals)}
        </span>
        <span className="text-base font-semibold text-white">{token.symbol}</span>
      </div>
    </div>
  ) : null;
}

function Information({ fee, bridge }: { fee?: { value: bigint; token: Token } | null; bridge?: BaseBridge | null }) {
  return (
    <div className="flex flex-col gap-small rounded-xl bg-background p-3 lg:rounded-2xl lg:p-large">
      <Item
        label="Transaction Fee"
        value={fee ? `${formatBalance(fee.value, fee.token.decimals, { precision: 6 })} ${fee.token.symbol}` : null}
      />
      <Item label="Estimated Arrival Time" value={bridge?.formatEstimateTime()} />
    </div>
  );
}

function Item({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex items-center justify-between gap-medium text-sm font-semibold italic text-white">
      <span>{label}</span>
      <span className="truncate">{value}</span>
    </div>
  );
}
