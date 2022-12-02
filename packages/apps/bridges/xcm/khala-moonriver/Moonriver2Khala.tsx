import { ChainConfig, CrossToken } from 'shared/model';
import { Bridge } from '../../../components/bridge/Bridge';
import { CrossChainComponentProps } from '../../../model/component';
import { KhalaMoonriverBridge } from './utils';

export function Moonriver2Khala(
  props: CrossChainComponentProps<KhalaMoonriverBridge, CrossToken<ChainConfig>, CrossToken<ChainConfig>>
) {
  return <Bridge {...props} />;
}
