import { FrownOutlined, MehOutlined } from '@ant-design/icons';
import { Badge, Radio, Result, Space, Tooltip } from 'antd';
import matches from 'lodash/matches';
import { useTranslation } from 'next-i18next';
import { useCallback, useEffect, useMemo } from 'react';
import { DEFAULT_DIRECTION } from 'shared/config/constant';
import { BridgeBase } from 'shared/core/bridge';
import { BridgeConfig, ChainConfig, CrossChainDirection, CrossToken, CustomFormControlProps } from 'shared/model';
import { getBridges } from 'utils/bridge';
import { bridgeFactory } from '../../bridges/bridges';
import { Bridge } from '../../core/bridge';
import { BridgeArrow } from '../bridge/BridgeArrow';
import { BridgeState } from '../bridge/BridgeState';
import { TokenOnChain } from '../widget/TokenOnChain';

type BridgeSelectorProps = CustomFormControlProps<Bridge<BridgeConfig, ChainConfig, ChainConfig>> & {
  direction: CrossChainDirection;
};

export function BridgeSelector({ direction, value, onChange }: BridgeSelectorProps) {
  const { t } = useTranslation();
  const bridges = useMemo(() => {
    const configs = getBridges(direction);

    return configs.map((config) => bridgeFactory(config));
  }, [direction]);

  const needClaim = useMemo(() => {
    const overview = direction.from?.cross.find((item) => item.partner.name === direction.to?.meta.name);

    return !!overview?.partner.claim;
  }, [direction]);

  const { from, to } = DEFAULT_DIRECTION;
  const origin = { from: { name: from.name, type: from.type }, to: { name: to.name, type: to.type } };
  const isDefault = matches(origin);

  // const isCBridgeStableCoin = useCallback(
  //   (bridge: Bridge) => bridge.category === 'cBridge' && ['USDT', 'USDC', 'BUSD'].includes(direction.from.symbol),
  //   [direction.from.symbol]
  // );

  const isDisabled = useCallback<(bridge: BridgeBase) => boolean>(
    // eslint-disable-next-line complexity
    (bridge: BridgeBase) => {
      return (
        !!direction.from &&
        !!direction.to &&
        ((bridge.disableIssue && bridge.isIssue(direction.from.meta, direction.to.meta)) ||
          (bridge.disableRedeem && bridge.isRedeem(direction.from.meta, direction.to.meta)))
      );
    },
    [direction.from, direction.to]
  );

  useEffect(() => {
    if (!value && bridges.length && onChange && !isDisabled(bridges[0])) {
      onChange(bridges[0]);
    }
  }, [bridges, isDisabled, onChange, value]);

  return (
    <div className="p-5 overflow-auto" style={{ maxHeight: '65vh', minHeight: '20vh' }}>
      <BridgeState className="w-full mb-2" />

      {!bridges.length ? (
        isDefault(direction) ? (
          <Result
            icon={<MehOutlined style={{ fontSize: '3rem' }} />}
            subTitle={t('Please select the parameters for your desired transfer and enter an amount.')}
          />
        ) : (
          <Result
            icon={<FrownOutlined style={{ fontSize: '3rem' }} />}
            subTitle={t('No bridge found for selected tokens')}
          />
        )
      ) : (
        <Radio.Group
          className="w-full"
          size="large"
          value={value}
          onChange={(event) => {
            const nValue = event.target.value;

            if (onChange) {
              onChange(nValue);
            }
          }}
        >
          <Space direction="vertical" className="w-full" size="middle">
            {/* eslint-disable-next-line complexity */}
            {bridges.map((item, index) => (
              <Badge.Ribbon
                text={
                  needClaim ? (
                    <Tooltip
                      title={t(
                        'Please perform a claim asset operation in the history section after the transfer is submitted.'
                      )}
                    >
                      {t('Need Claim')}
                    </Tooltip>
                  ) : null
                }
                color={needClaim ? 'cyan' : 'transparent'}
                placement="start"
                className="z-50 cursor-help"
                key={index}
              >
                <Radio.Button
                  key={index}
                  className="w-full relative bridger-selector-item"
                  value={item}
                  disabled={isDisabled(item)}
                >
                  <div className={`relative flex justify-between items-center pr-3 py-3 ${needClaim ? 'pt-8' : ''}`}>
                    <TokenOnChain token={direction.from as CrossToken} isFrom />

                    <BridgeArrow category={item?.category ?? 'helix'}>
                      {isDisabled(item) ? <span>{t('COMING SOON')}</span> : null}
                    </BridgeArrow>

                    <TokenOnChain token={direction.to as CrossToken} />
                  </div>
                </Radio.Button>
              </Badge.Ribbon>
            ))}
          </Space>
        </Radio.Group>
      )}
    </div>
  );
}
