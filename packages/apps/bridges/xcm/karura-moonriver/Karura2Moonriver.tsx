import { ChainConfig, CrossToken } from 'shared/model';
import { Bridge } from '../../../components/bridge/Bridge';
import { CrossChainComponentProps } from '../../../model/component';
import { KaruraMoonriverBridge } from './utils';

export function Karura2Moonriver(
  props: CrossChainComponentProps<KaruraMoonriverBridge, CrossToken<ChainConfig>, CrossToken<ChainConfig>>
) {
  return <Bridge {...props} />;
}
