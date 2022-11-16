import { BridgeBase } from 'shared/core/bridge';
import { crabDVMConfig, darwiniaDVMConfig, pangolinDVMConfig, pangoroDVMConfig } from 'shared/config/network';
import { DarwiniaDVMCrabDVMBridgeConfig } from '../model';

const darwiniaDVMcrabDVMConfig: DarwiniaDVMCrabDVMBridgeConfig = {
  contracts: {
    backing: '0xF3c1444CD449bD66Ef6DA7CA6c3E7884840A3995',
    issuing: '0x8738A64392b71617aF4C685d0E827855c741fDF7',
  },
};

export const darwiniaDVMCrabDVM = new BridgeBase(darwiniaDVMConfig, crabDVMConfig, darwiniaDVMcrabDVMConfig, {
  name: 'darwiniaDVM-crabDVM',
  category: 'helix',
});

const darwiniaDVMDarwiniaDVMConfig: DarwiniaDVMCrabDVMBridgeConfig = {
  contracts: {
    backing: '0xE7578598Aac020abFB918f33A20faD5B71d670b4',
    issuing: '0xE7578598Aac020abFB918f33A20faD5B71d670b4',
  },
};

export const darwiniaDVMDarwiniaDVM = new BridgeBase(
  darwiniaDVMConfig,
  darwiniaDVMConfig,
  darwiniaDVMDarwiniaDVMConfig,
  {
    name: 'darwiniaDVM-crabDVM',
    category: 'helix',
    issueCompName: 'DarwiniaDVMInner',
    redeemCompName: 'DarwiniaDVMInner',
  }
);

const pangoroDVMpangolinDVMConfig: DarwiniaDVMCrabDVMBridgeConfig = {
  contracts: {
    backing: '0x91Cdd894aD5cC203A026115B33e30670E5166504',
    issuing: '0x0793e2726360224dA8cf781c048dF7acCa3Bb049',
  },
};

export const pangoroDVMPangolinDVM = new BridgeBase(pangoroDVMConfig, pangolinDVMConfig, pangoroDVMpangolinDVMConfig, {
  name: 'darwiniaDVM-crabDVM',
  category: 'helix',
});

const pangoroDVMPangoroDVMConfig: DarwiniaDVMCrabDVMBridgeConfig = {
  contracts: {
    backing: '0x46f01081e800BF47e43e7bAa6D98d45F6a0251E4',
    issuing: '0x46f01081e800BF47e43e7bAa6D98d45F6a0251E4',
  },
};

export const pangoroDVMPangoroDVM = new BridgeBase(pangoroDVMConfig, pangoroDVMConfig, pangoroDVMPangoroDVMConfig, {
  name: 'darwiniaDVM-crabDVM',
  category: 'helix',
  issueCompName: 'DarwiniaDVMInner',
  redeemCompName: 'DarwiniaDVMInner',
});