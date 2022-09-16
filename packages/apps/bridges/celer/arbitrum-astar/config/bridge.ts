import { arbitrumConfig, astarConfig } from 'shared/config/network';
import { Bridge } from 'shared/model';
import { ArbitrumAstarBridgeConfig } from '../model';

const arbitrumAstarConfig: ArbitrumAstarBridgeConfig = {
  contracts: {
    backing: '0x1619DE6B6B20eD217a58d00f37B9d47C7663feca',
    issuing: '0x841ce48F9446C8E281D3F1444cB859b4A6D0738C',
    stablecoinIssuing: '0xBB7684Cc5408F4DD0921E5c2Cadd547b8f1AD573',
  },
};

export const arbitrumAstar = new Bridge(arbitrumConfig, astarConfig, arbitrumAstarConfig, {
  name: 'arbitrum-astar',
  category: 'cBridge',
});