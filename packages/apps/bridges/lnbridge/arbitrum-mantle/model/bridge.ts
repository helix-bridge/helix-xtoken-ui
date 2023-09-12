import { BridgeConfig } from 'shared/model';
import { ContractConfig } from 'shared/model';
import { CrossToken, DVMChainConfig } from 'shared/model';
import { Bridge } from '../../../../core/bridge';
import { CrossChainPayload } from '../../../../model/tx';

type ArbitrumMantleContractConfig = ContractConfig;

export type ArbitrumMantleBridgeConfig = Required<BridgeConfig<ArbitrumMantleContractConfig>>;

export type IssuingPayload = CrossChainPayload<
  Bridge<ArbitrumMantleBridgeConfig, DVMChainConfig, DVMChainConfig>,
  CrossToken<DVMChainConfig>,
  CrossToken<DVMChainConfig>
>;

export type RedeemPayload = CrossChainPayload<
  Bridge<ArbitrumMantleBridgeConfig, DVMChainConfig, DVMChainConfig>,
  CrossToken<DVMChainConfig>,
  CrossToken<DVMChainConfig>
>;
