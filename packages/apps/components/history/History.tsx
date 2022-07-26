import { LoadingOutlined, PaperClipOutlined, ReloadOutlined, SwapOutlined } from '@ant-design/icons';
import { Badge, Button, Empty, Pagination, Radio, Result, Spin, Tabs, Tooltip } from 'antd';
import { format } from 'date-fns';
import request from 'graphql-request';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { EMPTY, from, map } from 'rxjs';
import { SubscanLink } from 'shared/components/widget/SubscanLink';
import { DATE_TIME_FORMAT, RecordStatus } from 'shared/config/constant';
import { ENDPOINT } from 'shared/config/env';
import { HelixHistoryRecord } from 'shared/model';
import { convertToDvm, gqlName, isValidAddress } from 'shared/utils/helper';
import { getChainConfig } from 'shared/utils/network';
import {
  getReceivedAmountFromHelixRecord,
  getSentAmountFromHelixRecord,
  getTokenNameFromHelixRecord,
} from 'shared/utils/record';
import { Darwinia2EthereumHistoryRes } from '../../bridges/ethereum-darwinia/model';
import { HISTORY_RECORDS, STATUS_STATISTICS } from '../../config/gql';
import { useITranslation } from '../../hooks';
import { Paginator } from '../../model';
import { useAccount, useApi } from '../../providers';
import { useClaim } from '../../providers/claim';
import { fetchDarwinia2EthereumRecords, fetchEthereum2DarwiniaRecords } from '../../utils/records';
import { BridgeArrow } from '../bridge/BridgeArrow';
import { TokenOnChain } from '../widget/TokenOnChain';
import { Pending } from './Pending';
import { PendingToClaim } from './PendingToClaim';
import { PendingToRefund } from './PendingToRefund';
import { Refunded } from './Refunded';

enum HistoryType {
  ethereumDarwinia = 1,
  normal,
}

// eslint-disable-next-line complexity
export function History() {
  const { t } = useITranslation();
  const [activeTab, setActiveTab] = useState<number>(-1);
  const { account } = useAccount();
  const { connectDepartureNetwork, departure, isConnecting, departureConnection } = useApi();
  const [historyType, setHistoryType] = useState<HistoryType>(HistoryType.normal);
  const [total, setTotal] = useState(0);
  const [source, setSource] = useState<HelixHistoryRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [paginator, setPaginator] = useState<Paginator>({ row: 10, page: 0 });
  const { claimedList, refundedList } = useClaim();
  const [claimMeta, setClaimMeta] = useState<Omit<Darwinia2EthereumHistoryRes, 'list' | 'count'> | null>(null);
  const [goOnAmount, setGoOnAmount] = useState(0);

  const records = useMemo<HelixHistoryRecord[]>(() => {
    if (historyType === HistoryType.ethereumDarwinia && departureConnection.type === 'polkadot') {
      return source.map((item) => {
        const target = claimedList.find((claimed) => claimed.id === item.id);

        return target ? { ...item, targetTxHash: target.hash, result: 1 } : item;
      });
    }

    return source.map((record) => {
      if (refundedList.find((item) => item.id === record.id)) {
        record.result = RecordStatus.refunded;
      }

      return record;
    });
  }, [claimedList, departureConnection.type, historyType, refundedList, source]);

  const results = useMemo(() => {
    if (activeTab < 0) {
      return null;
    } else if (activeTab === 0) {
      return [RecordStatus.pending, RecordStatus.pendingToClaim, RecordStatus.pendingToRefund];
    } else if (activeTab === 1) {
      return [RecordStatus.success];
    } else {
      return [RecordStatus.refunded];
    }
  }, [activeTab]);

  const fetchData = useCallback(() => {
    const sender = isValidAddress(account, 'ethereum') ? account : convertToDvm(account);
    const args = {
      ...paginator,
      sender,
      results: results === null ? undefined : results,
    };

    setLoading(true);

    return from(request(ENDPOINT, HISTORY_RECORDS, args))
      .pipe(map((res) => res && res[gqlName(HISTORY_RECORDS)]))
      .subscribe({
        next(response) {
          setTotal(response.total);
          setSource(response.records);
        },
        complete() {
          setLoading(false);
        },
      });
  }, [account, paginator, results]);

  const fetchEthereumDarwiniaData = useCallback(() => {
    const params = {
      address: account,
      paginator,
      confirmed: Array.isArray(results) ? results.length === 1 : null,
    };

    if (departureConnection.type === 'polkadot') {
      return fetchDarwinia2EthereumRecords(params, departure).subscribe({
        next: (response) => {
          const { list, count, ...rest } = response;
          setTotal(count);
          setSource(list);
          setClaimMeta(rest);
        },
        error: () => setLoading(false),
        complete: () => setLoading(false),
      });
    }

    if (departureConnection.type === 'metamask') {
      return fetchEthereum2DarwiniaRecords(params, departure).subscribe({
        next: (response) => {
          const { list, count } = response;

          setTotal(count);
          setSource(list);
        },
        error: () => setLoading(false),
        complete: () => setLoading(false),
      });
    }

    return EMPTY.subscribe();
  }, [account, departure, departureConnection.type, paginator, results]);

  const fetchGoOnAmount = useCallback((address: string) => {
    const sender = isValidAddress(address, 'ethereum') ? address : convertToDvm(address);
    return from(
      request(ENDPOINT, STATUS_STATISTICS, {
        results: [RecordStatus.pendingToClaim, RecordStatus.pendingToRefund],
        sender,
      })
    )
      .pipe(map((res) => res && res[gqlName(STATUS_STATISTICS)]))
      .subscribe((res) => {
        setGoOnAmount(res.total);
      });
  }, []);

  useEffect(() => {
    const sub$$ = fetchGoOnAmount(account);

    return () => sub$$.unsubscribe();
  }, [account, fetchGoOnAmount]);

  useEffect(() => {
    if (!account) {
      setSource([]);
      setClaimMeta(null);
      return;
    }

    const sub$$ = historyType === HistoryType.normal ? fetchData() : fetchEthereumDarwiniaData();

    return () => sub$$?.unsubscribe();
  }, [account, fetchData, fetchEthereumDarwiniaData, historyType]);

  if (!account) {
    return (
      <Result
        status="warning"
        title={t('You must connect the wallet to fetch the records')}
        extra={
          <Button
            onClick={() => {
              connectDepartureNetwork(departure);
            }}
            disabled={isConnecting}
            icon={isConnecting ? <LoadingOutlined /> : undefined}
          >
            {t('Connect to Wallet')}
          </Button>
        }
      />
    );
  }

  return (
    <>
      <Radio.Group
        onChange={(event) => setHistoryType(+event.target.value)}
        defaultValue={historyType}
        buttonStyle="solid"
        size="large"
        className="w-full mb-4"
      >
        <Radio.Button value={HistoryType.ethereumDarwinia} className="w-1/2 text-center bg-transparent">
          <div className="flex items-center justify-center">
            <span>Ethereum</span>
            <SwapOutlined className="mx-4" />
            <span>Darwinia</span>
          </div>
        </Radio.Button>

        <Radio.Button value={HistoryType.normal} className="w-1/2 text-center bg-transparent">
          {t('Others')}
        </Radio.Button>
      </Radio.Group>

      <Tabs
        defaultActiveKey="-1"
        onTabClick={(key) => {
          const res = Number(key) - 1;

          setActiveTab(res);

          setPaginator({ row: 10, page: 0 });
        }}
        tabBarExtraContent={{
          right: (
            <ReloadOutlined
              onClick={() => {
                setTotal(0);
                setSource([]);
                setClaimMeta(null);

                if (historyType === HistoryType.ethereumDarwinia) {
                  fetchEthereumDarwiniaData();
                } else {
                  fetchData();
                }

                fetchGoOnAmount(account);
              }}
            />
          ),
        }}
      >
        {['All', 'Pending', 'Success']
          .concat(historyType === HistoryType.ethereumDarwinia ? [] : ['Refunded'])
          .map((label, index) => (
            <Tabs.TabPane
              tab={
                label === 'Pending' ? (
                  <Badge count={goOnAmount} offset={[10, 0]} color="red">
                    <span>{t(label)}</span>
                  </Badge>
                ) : (
                  t(label)
                )
              }
              key={index}
            >
              <Spin spinning={loading} className="mt-12 mx-auto w-full">
                {/*  eslint-disable-next-line complexity*/}
                {records.map((record) => {
                  const { fromChain, toChain, bridge } = record;
                  const dep = getChainConfig(fromChain);
                  const arrival = getChainConfig(toChain);
                  const symbol = getTokenNameFromHelixRecord(record);
                  const fromToken = dep.tokens.find((item) => item.symbol.toLowerCase() === symbol.toLowerCase())!;
                  const overview = fromToken.cross.find(
                    (item) => item.category === bridge && item.partner.name === toChain
                  );
                  const toToken = arrival.tokens.find(
                    (item) => item.symbol.toLowerCase() === overview?.partner.symbol.toLowerCase()
                  )!;
                  const [d2eHeight, d2dIndex] = record.requestTxHash.split('-');
                  const [e2dHeight, e2dIndex] = record.targetTxHash.split('-');

                  return (
                    <div className="flex justify-between items-center " key={record.id}>
                      <div className="flex-1 grid grid-cols-3 self-stretch pr-8 p-4 border border-gray-800 mb-4 bg-gray-900 rounded-xs">
                        <TokenOnChain
                          token={{ ...fromToken, meta: dep, amount: getSentAmountFromHelixRecord(record) }}
                          isFrom
                          asHistory
                        >
                          <SubscanLink
                            network={dep}
                            txHash={record.requestTxHash}
                            extrinsic={d2eHeight && d2dIndex ? { height: d2eHeight, index: d2dIndex } : undefined}
                          >
                            <PaperClipOutlined className="hover:text-pangolin-main cursor-pointer" />
                          </SubscanLink>
                        </TokenOnChain>

                        <BridgeArrow category={record.bridge} showName={false} />

                        <TokenOnChain
                          token={{ ...toToken, meta: arrival, amount: getReceivedAmountFromHelixRecord(record) }}
                          asHistory
                          className="justify-end"
                        >
                          {record.targetTxHash || (e2dHeight && e2dIndex) ? (
                            <SubscanLink
                              network={arrival}
                              txHash={record.targetTxHash}
                              extrinsic={e2dHeight && e2dIndex ? { height: e2dHeight, index: e2dIndex } : undefined}
                            >
                              <PaperClipOutlined className="hover:text-pangolin-main cursor-pointer" />
                            </SubscanLink>
                          ) : (
                            record.result !== RecordStatus.refunded && (
                              <Tooltip
                                title={t('When the transaction is successful, the extrinsic message will be provided')}
                              >
                                <PaperClipOutlined className="cursor-pointer" />
                              </Tooltip>
                            )
                          )}
                        </TokenOnChain>
                      </div>

                      <div className="text-right pl-4 pr-6 py-4  border border-gray-800 mb-4 bg-gray-900 rounded-xs">
                        <div className="mb-2 whitespace-nowrap text-xs">
                          {format(record.startTime * 1000, DATE_TIME_FORMAT)}
                        </div>

                        {record.result === RecordStatus.pending && <Pending record={record} />}

                        {record.result === RecordStatus.pendingToClaim && (
                          <PendingToClaim record={record} claimMeta={claimMeta} />
                        )}

                        {record.result === RecordStatus.pendingToRefund && <PendingToRefund record={record} />}

                        {record.result === RecordStatus.success && (
                          <div className="text-helix-green">{t('Success')}</div>
                        )}

                        {record.result === RecordStatus.refunded && <Refunded record={record} />}
                      </div>
                    </div>
                  );
                })}

                <div className="flex justify-end items-center">
                  {!!total && (
                    <Pagination
                      onChange={(page: number, pageSize: number) => {
                        setPaginator({ row: pageSize, page: page - 1 });
                      }}
                      current={paginator.page + 1}
                      pageSize={paginator.row}
                      total={total ?? 0}
                      showTotal={() => t('Total {{total}}', { total })}
                    />
                  )}
                </div>
              </Spin>

              {!records.length && <Empty description={t('No Data')} />}
            </Tabs.TabPane>
          ))}
      </Tabs>
    </>
  );
}