import { astarConfig, avalancheConfig } from 'shared/config/network';
import { Bridge } from 'shared/model';
import { AstarAvalancheBridgeConfig } from 'shared/model';

const astarAvalancheConfig: AstarAvalancheBridgeConfig = {
  contracts: {
    issuing: '0x841ce48F9446C8E281D3F1444cB859b4A6D0738C',
    redeem: '0xef3c714c9425a8F3697A9C969Dc1af30ba82e5d4',
  },
};

export const astarAvalanche = new Bridge(astarConfig, avalancheConfig, astarAvalancheConfig, {
  name: 'astar-avalanche',
  category: 'cBridge',
});
