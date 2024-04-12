import { Token } from "@/types";
import TransferInformation from "./transfer-information";
import TransferSection from "./transfer-section";
import { BaseBridge } from "@/bridges";

interface Props {
  bridge: BaseBridge | undefined;
  fee: { token: Token; value: bigint } | null | undefined;
  dailyLimit: { token: Token; limit: bigint } | null | undefined;
  isLoadingFee: boolean;
  isLoadingDailyLimit: boolean;
}

export default function TransferInformationSection({
  bridge,
  fee,
  dailyLimit,
  isLoadingFee,
  isLoadingDailyLimit,
}: Props) {
  return (
    <TransferSection>
      <TransferInformation
        estimatedTime={bridge ? { loading: false, value: bridge.formatEstimateTime() } : undefined}
        fee={{
          warning: fee ? undefined : "Liquidity is not enough",
          loading: isLoadingFee,
          value: fee?.value,
          token: fee?.token,
        }}
        dailyLimit={
          dailyLimit ? { loading: isLoadingDailyLimit, value: dailyLimit.limit, token: dailyLimit.token } : undefined
        }
      />
    </TransferSection>
  );
}
