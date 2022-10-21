import { TransactionReceipt, TransactionRequest, TransactionResponse } from '@ethersproject/abstract-provider';
import { Modal, ModalFuncProps, ModalProps } from 'antd';
import BN from 'bn.js';
import type { BigNumber } from 'ethers';
import { Contract } from 'ethers';
import type { Deferrable } from 'ethers/lib/utils';
import isFunction from 'lodash/isFunction';
import noop from 'lodash/noop';
import omitBy from 'lodash/omitBy';
import { i18n } from 'next-i18next';
import { initReactI18next, Trans } from 'react-i18next';
import { Observable } from 'rxjs/internal/Observable';
import { EMPTY } from 'rxjs/internal/observable/empty';
import { finalize } from 'rxjs/internal/operators/finalize';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { tap } from 'rxjs/internal/operators/tap';
import type { Observer } from 'rxjs/internal/types';
import { Icon } from '../../components/widget/Icon';
import { abi } from '../../config/abi';
import { RequiredPartial, Tx } from '../../model';
import { entrance } from '../connection';
import { toWei } from '../helper/balance';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ModalSpyFn<T = any> = (observer: Observer<T>, closeFn: () => void) => void;

type TxFn<T> = (value: T) => Observable<Tx>;

type IModalFuncs = {
  afterDisappear?: ModalSpyFn;
  handleOk?: ModalSpyFn;
  handleCancel?: ModalSpyFn;
};

export const txModalConfig: (props: Partial<ModalFuncProps>) => ModalProps = (props) => ({
  okCancel: true,
  okText: <Trans i18n={i18n?.use(initReactI18next)}>Confirm</Trans>,
  cancelText: <Trans i18n={i18n?.use(initReactI18next)}>Cancel</Trans>,
  closable: false,
  closeIcon: <Icon name="close" />,
  okButtonProps: { size: 'large', className: 'flex-1', style: { margin: 0 } },
  cancelButtonProps: { size: 'large', className: 'flex-1', style: { margin: 0 } },
  width: 620,
  centered: true,
  className: 'confirm-modal',
  icon: null,
  destroyOnClose: true,
  title: (
    <h3 className="mb-0">
      <Trans i18n={i18n?.use(initReactI18next)}>Transfer</Trans>
    </h3>
  ),
  ...props,
});

const { confirm } = Modal;

export function buf2hex(buffer: ArrayBuffer) {
  const pos = -2;
  const radix = 16;

  return '0x' + Array.prototype.map.call(new Uint8Array(buffer), (x) => ('00' + x.toString(radix)).slice(pos)).join('');
}

export function applyModal(props: RequiredPartial<ModalFuncProps, 'content'> & IModalFuncs): { destroy: () => void } {
  const config = txModalConfig(props);

  return confirm(config);
}

export function applyModalObs<T = boolean>(
  props: RequiredPartial<ModalFuncProps, 'content'> & IModalFuncs
): Observable<T | boolean> {
  const { handleOk } = props;
  const config = txModalConfig(props);
  const { afterClose, ...others } = config;

  return new Observable((observer) => {
    confirm({
      ...others,
      onCancel: () => {
        observer.next(false);
        observer.error({ status: 'error', error: new Error('Unconfirmed') });
      },
      onOk: (close) => {
        if (handleOk) {
          handleOk(observer, close);
        } else {
          observer.next(true);
          close();
        }
        observer.complete();
      },
      afterClose: () => {
        if (afterClose) {
          afterClose();
        }
      },
    });
  });
}

export type AfterTxCreator = (tx: Tx) => () => void;

type ExecObsCreator = () => Observable<Tx>;

export function createTxWorkflow(
  before: Observable<boolean>,
  txObs: Observable<Tx> | ExecObsCreator,
  after: AfterTxCreator
): Observable<Tx> {
  let finish: () => void = noop;

  return before.pipe(
    switchMap((confirmed) => {
      const obs = isFunction(txObs) ? txObs() : txObs;

      return confirmed
        ? obs.pipe(
            tap((tx) => {
              if (tx.status === 'finalized') {
                finish = after(tx);
              }
            }),
            finalize(() => finish())
          )
        : EMPTY;
    })
  );
}

/**
 * @param contractAddress - Contract address in ethereum
 * @param fn - Contract method to be call, will receive the contract instance as the incoming parameter;
 * @param contractAbi - Contract ABI
 * @returns An Observable which will emit the tx events that includes signing, queued, finalized and error.
 */
export function genEthereumContractTxObs(
  contractAddress: string,
  fn: (contract: Contract) => Promise<TransactionResponse>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  contractAbi: any = abi.tokenABI
): Observable<Tx> {
  return new Observable((observer) => {
    try {
      const signer = entrance.web3.currentProvider.getSigner();
      const contract = new Contract(contractAddress, contractAbi, signer);

      observer.next({ status: 'signing' });

      fn(contract)
        .then((tx: TransactionResponse) => {
          observer.next({ status: 'queued', hash: tx.hash });

          return tx.wait();
        })
        .then((receipt: TransactionReceipt) => {
          observer.next({ status: 'finalized', hash: receipt.transactionHash });
          observer.complete();
        })
        .catch((error: { code: number; message: string; data?: { data: string; message: string } }) => {
          observer.error({ status: 'error', error: error.message + '\n' + error.data?.message ?? '' });
        });
    } catch (error) {
      console.warn('%c contract tx observable error', 'font-size:13px; background:pink; color:#bf2c9f;', error);
      observer.error({ status: 'error', error: 'Contract construction/call failed!' });
    }
  });
}

export function genEthereumTransactionObs(params: Deferrable<TransactionRequest>): Observable<Tx> {
  const provider = entrance.web3.currentProvider;
  const signer = provider.getSigner();

  return new Observable((observer) => {
    signer.sendTransaction(params).then((res) => {
      observer.next({ status: 'finalized', hash: res.hash });
      observer.complete();
    });

    provider
      .on('transactionHash', (hash) => {
        observer.next({ status: 'queued', hash });
      })
      .on('error', (error) => {
        observer.error({ status: 'error', error: error.message });
      });
  });
}

export const approveToken: TxFn<{
  sender: string;
  tokenAddress?: string;
  spender?: string;
  sendOptions?: { gas?: string; gasPrice?: string };
}> = ({ sender, tokenAddress, spender, sendOptions }) => {
  if (!tokenAddress) {
    throw new Error(`Can not approve the token with address ${tokenAddress}`);
  }

  if (!spender) {
    throw new Error(`No spender account set`);
  }

  const hardCodeAmount = '100000000000000000000000000';
  const params = sendOptions ? { from: sender, ...omitBy(sendOptions, (value) => !value) } : { from: sender };

  return genEthereumContractTxObs(tokenAddress, (contract) =>
    contract.approve(spender, toWei({ value: hardCodeAmount }), params)
  );
};

export async function getAllowance(
  sender: string,
  spender: string,
  tokenAddress: string,
  provider: string
): Promise<BN | null> {
  const contract = new Contract(tokenAddress, abi.tokenABI, entrance.web3.getInstance(provider));

  try {
    const allowanceAmount = await contract.allowance(sender, spender).then((res: BigNumber) => res.toString());

    return new BN(allowanceAmount);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log('⚠ ~ file: allowance.ts getIssuingAllowance ~ error', error.message);

    return null;
  }
}
