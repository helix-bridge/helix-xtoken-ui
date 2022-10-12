import { BridgeBase } from 'shared/core/bridge';
import { crabConfig, pangolinConfig } from 'shared/config/network';
import { crabParachainConfig } from 'shared/config/network/crab-parachain';
import { pangolinParachainConfig } from 'shared/config/network/pangolin-parachain';
import { SubstrateSubstrateParachainBridgeConfig } from '../model';

const crabCrabParachainConfig: SubstrateSubstrateParachainBridgeConfig = {
  contracts: {
    backing: '',
    issuing: '',
  },
};

export const crabCrabParachain = new BridgeBase<SubstrateSubstrateParachainBridgeConfig>(
  crabConfig,
  crabParachainConfig,
  crabCrabParachainConfig,
  {
    category: 'helix',
    activeArrivalConnection: true,
    name: 'substrate-substrateParachain',
    issueCompName: 'Substrate2Parachain',
    redeemCompName: 'Parachain2Substrate',
  }
);

const pangolinPangolinParachainConfig: SubstrateSubstrateParachainBridgeConfig = {
  contracts: {
    backing: '',
    issuing: '',
  },
};

export const pangolinPangolinParachain = new BridgeBase<SubstrateSubstrateParachainBridgeConfig>(
  pangolinConfig,
  pangolinParachainConfig,
  pangolinPangolinParachainConfig,
  {
    category: 'helix',
    activeArrivalConnection: true,
    name: 'substrate-substrateParachain',
    issueCompName: 'Substrate2Parachain',
    redeemCompName: 'Parachain2Substrate',
  }
);
