import { hecoConfig, polygonConfig } from 'shared/config/network';
import { Bridge } from 'shared/model';
import { HecoPolygonBridgeConfig } from 'shared/model';

const hecoPolygonConfig: HecoPolygonBridgeConfig = {
  contracts: {
    issuing: '0xbb7684cc5408f4dd0921e5c2cadd547b8f1ad573',
    redeem: '0x88DCDC47D2f83a99CF0000FDF667A468bB958a78',
  },
};

export const hecoPolygon = new Bridge(hecoConfig, polygonConfig, hecoPolygonConfig, {
  name: 'heco-polygon',
  category: 'cBridge',
});
