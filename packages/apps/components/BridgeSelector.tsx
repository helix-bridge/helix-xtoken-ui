import Image from 'next/image';
import { Radio, Space, Result, Typography } from 'antd';
import { useState } from 'react';
import { CheckSquareFilled, SmileOutlined, ArrowRightOutlined, SyncOutlined } from '@ant-design/icons';

type TokenOnChainData = {
  tokenIcon: string;
  chainIcon: string;
  chainName: string;
  from?: boolean;
};

const TokenOnChain = ({ tokenIcon, chainIcon, chainName, from }: TokenOnChainData) => (
  <div className="flex items-center">
    <div className={`hidden lg:block relative w-14 h-14 ${from ? 'order-1' : 'order-2 ml-3'}`}>
      <Image src={tokenIcon} alt="..." layout="fill" />
      <span className="w-7 h-7 absolute top-auto bottom-1 left-auto -right-3">
        <Image src={chainIcon} alt="..." layout="fill" />
      </span>
    </div>
    <div className={`flex flex-col space-y-1 ${from ? 'order-2 lg:ml-6' : 'order-1 items-end'}`}>
      <strong className={`font-medium text-sm ${from ? 'text-left' : 'text-right'}`}>33,456.3762 RING</strong>
      <small className="font-light text-xs opacity-70">on {chainName}</small>
    </div>
  </div>
);

const SelectorItem = ({ value, theSelected }: { value: number; theSelected: number }) => {
  return (
    <Radio.Button className="w-full bg-gray-900" style={{ height: 'fit-content' }} value={value}>
      <div className="relative flex justify-between items-center pr-3 py-3">
        {value === theSelected && <CheckSquareFilled className="absolute -top-px left-auto -right-4" />}
        <TokenOnChain tokenIcon="/image/ring.svg" chainIcon="/image/darwinia.png" chainName="Darwinia" from />
        <div className="relative w-56 hidden lg:flex justify-center">
          <div className="py-1 w-24 rounded-3xl bg-gray-700 flex justify-center items-center space-x-2 z-10">
            <Image alt="..." src="/image/helix-bridge.svg" width={28} height={28} />
            <strong>Helix</strong>
          </div>
          <Image alt="..." src="/image/bridge-to.svg" layout="fill" />
        </div>
        <div className="absolute top-0 bottom-0 left-0 right-0 m-auto w-7 flex lg:hidden items-end justify-center pb-3 opacity-40">
          <ArrowRightOutlined />
        </div>
        <TokenOnChain tokenIcon="/image/ring.svg" chainIcon="/image/ethereum.png" chainName="Ethereum" />
      </div>
    </Radio.Button>
  );
};

export function BridgeSelector() {
  const [theSelected, setTheSelected] = useState<number>(0);

  return (
    <div className="dark:bg-antDark p-5 overflow-auto" style={{ maxHeight: '65vh', minHeight: '20vh' }}>
      <div className="flex items-center space-x-2 mb-2 ml-px">
        <SyncOutlined />
        <Typography.Text>Latest bridge data</Typography.Text>
      </div>
      {theSelected === 1 ? (
        <Result
          icon={<SmileOutlined />}
          title="Please select the parameters for your desired transfer and enter an amount."
        />
      ) : (
        <Radio.Group
          className="w-full"
          size="large"
          defaultValue={theSelected}
          onChange={(e) => setTheSelected(e.target.value)}
        >
          <Space direction="vertical" className="w-full" size="middle">
            {new Array(10).fill(1).map((_, index) => (
              <SelectorItem key={index} value={index} theSelected={theSelected} />
            ))}
          </Space>
        </Radio.Group>
      )}
    </div>
  );
}