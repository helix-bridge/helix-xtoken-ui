import { CHAIN_TYPE } from 'shared/config/env';
import { arbitrumAstar } from '../bridges/celer/arbitrum-astar/config';
import { arbitrumAvalanche } from '../bridges/celer/arbitrum-avalanche/config';
import { arbitrumOptimism } from '../bridges/celer/arbitrum-optimism/config';
import { arbitrumPolygon } from '../bridges/celer/arbitrum-polygon/config';
import { astarAvalanche } from '../bridges/celer/astar-avalanche/config';
import { astarOptimism } from '../bridges/celer/astar-optimism/config';
import { avalancheOptimism } from '../bridges/celer/avalanche-optimism/config';
import { avalanchePolygon } from '../bridges/celer/avalanche-polygon/config';
import { bscArbitrum } from '../bridges/celer/bsc-arbitrum/config';
import { bscAstar } from '../bridges/celer/bsc-astar/config';
import { bscAvalanche } from '../bridges/celer/bsc-avalanche/config';
import { bscOptimism } from '../bridges/celer/bsc-optimism/config';
import { bscPolygon } from '../bridges/celer/bsc-polygon/config';
import { crabDVMAstar } from '../bridges/celer/crabDVM-astar/config';
import { crabDVMEthereum } from '../bridges/celer/crabDVM-ethereum/config';
import { crabDVMHeco } from '../bridges/celer/crabDVM-heco/config';
import { crabDVMPolygon } from '../bridges/celer/crabDVM-polygon/config';
import { ethereumArbitrum } from '../bridges/celer/ethereum-arbitrum/config';
import { ethereumAstar } from '../bridges/celer/ethereum-astar/config';
import { ethereumAvalanche } from '../bridges/celer/ethereum-avalanche/config';
import { ethereumBSC } from '../bridges/celer/ethereum-bsc/config';
import { ethereumHeco } from '../bridges/celer/ethereum-heco/config';
import { ethereumOptimism } from '../bridges/celer/ethereum-optimism/config';
import { ethereumPolygon } from '../bridges/celer/ethereum-polygon/config';
import { hecoPolygon } from '../bridges/celer/heco-polygon/config';
import { polygonAstar } from '../bridges/celer/polygon-astar/config';
import { polygonOptimism } from '../bridges/celer/polygon-optimism/config';
import { ethereumDarwinia, ropstenPangolin } from '../bridges/helix/ethereum-darwinia/config/bridge';
import { crabCrabDVM, darwiniaDarwiniaDVM, pangolinPangolinDVM } from '../bridges/helix/substrate-dvm/config/bridge';
import { darwiniaCrabDVM, pangoroPangolinDVM } from '../bridges/helix/substrate-substrateDVM/config/bridge';
import {
  crabCrabParachain,
  pangolinPangolinParachain,
} from '../bridges/helix/substrate-substrateParachain/config/bridge';
import {
  darwiniaDVMCrabDVM,
  darwiniaDVMDarwiniaDVM,
  pangoroDVMPangolinDVM,
} from '../bridges/helix/substrateDVM-substrateDVM/config/bridge';
import { crabParachainKarura } from '../bridges/xcm/crabParachain-karura/config';
import { crabParachainMoonriver } from '../bridges/xcm/crabParachain-moonriver/config/bridge';

const formalBridges = [
  arbitrumAstar,
  arbitrumAvalanche,
  arbitrumOptimism,
  astarAvalanche,
  astarOptimism,
  avalancheOptimism,
  bscArbitrum,
  bscAstar,
  bscAvalanche,
  bscOptimism,
  crabCrabDVM,
  crabDVMEthereum,
  crabDVMHeco,
  crabDVMPolygon,
  darwiniaDarwiniaDVM,
  darwiniaCrabDVM,
  darwiniaDVMCrabDVM,
  darwiniaDVMDarwiniaDVM,
  ethereumDarwinia,
  ethereumHeco,
  ethereumPolygon,
  hecoPolygon,
  crabCrabParachain,
  polygonAstar,
  ethereumAstar,
  ethereumBSC,
  ethereumAvalanche,
  ethereumArbitrum,
  ethereumOptimism,
  bscPolygon,
  avalanchePolygon,
  arbitrumPolygon,
  polygonOptimism,
  crabDVMAstar,
  crabParachainKarura,
  crabParachainMoonriver,
];

const testBridges = [
  pangolinPangolinDVM,
  pangoroDVMPangolinDVM,
  pangoroPangolinDVM,
  pangolinPangolinParachain,
  ropstenPangolin,
];

export const BRIDGES = (() => {
  switch (CHAIN_TYPE) {
    case 'all':
      return [...formalBridges, ...testBridges];
    case 'formal':
      return formalBridges;
    case 'test':
      return testBridges;
    default:
      return [];
  }
})();