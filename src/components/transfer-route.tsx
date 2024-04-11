import Tooltip from "@/ui/tooltip";
import { getChainConfig } from "@/utils/chain";
import { getChainLogoSrc } from "@/utils/misc";
import Image from "next/image";
import { HistoryRecord } from "@/types/graphql";

interface Props {
  record?: HistoryRecord | null;
}

export default function TransferRoute({ record }: Props) {
  const sourceChain = getChainConfig(record?.fromChain);
  const targetChain = getChainConfig(record?.toChain);

  return (
    <div className="flex items-center gap-large">
      <ChainIcon logo={getChainLogoSrc(sourceChain?.logo)} name={sourceChain?.name || "Unknown"} />
      <div className="flex items-center">
        <CaretRight />
        <CaretRight />
        <CaretRight />
      </div>
      <ChainIcon logo={getChainLogoSrc(targetChain?.logo)} name={targetChain?.name || "Unknown"} />
    </div>
  );
}

function ChainIcon({ logo, name }: { logo: string; name: string }) {
  return (
    <Tooltip content={name} className="shrink-0">
      <Image width={32} height={32} alt={name} src={logo} className="rounded-full" />
    </Tooltip>
  );
}

function CaretRight() {
  return <Image width={9} height={12} alt="Caret right" src="/images/caret-right.svg" className="shrink-0" />;
}
