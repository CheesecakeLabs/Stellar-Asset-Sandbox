import { AssetStatus } from 'components/enums';
import { TypeTransaction } from 'components/enums/type-transaction';



import BitcoinImg from 'app/core/resources/bitcoin.png';
import DollarImg from 'app/core/resources/dollar.png';
import EuroImg from 'app/core/resources/euro.png';


export const mockupAssets = [
  {
    icon: DollarImg,
    asset: 'USD',
    name: 'USD Coin',
    circulating_supply: 100.323,
    treasury: 10.555,
    trustlines: 460,
    status: AssetStatus.LIVE,
  },
  {
    icon: EuroImg,
    asset: 'EURC',
    name: 'Euro Coin',
    circulating_supply: 0,
    treasury: 0,
    trustlines: 0,
    status: AssetStatus.PENDING,
  },
  {
    icon: BitcoinImg,
    asset: 'BTC',
    name: 'Bitcoin',
    circulating_supply: 860.323,
    treasury: 2.555,
    trustlines: 5142,
    status: AssetStatus.LIVE,
  },
]

export const mockupTransactions = [
  {
    icon: DollarImg,
    asset: 'USD',
    name: 'USD Coin',
    date: '2023-04-25T13:53:14.018Z',
    type: TypeTransaction.MINT,
    amount: 523.331,
  },
  {
    icon: EuroImg,
    asset: 'EUR',
    name: 'EURC',
    date: '2023-04-25T13:53:14.018Z',
    type: TypeTransaction.BURN,
    amount: 200.94,
  },
  {
    icon: DollarImg,
    asset: 'USD',
    name: 'USD Coin',
    date: '2023-04-25T13:53:14.018Z',
    type: TypeTransaction.PAYMENT,
    amount: 5123.523,
  },
  {
    icon: BitcoinImg,
    asset: 'BTC',
    name: 'Bitcoin',
    date: '2023-04-25T13:53:14.018Z',
    type: TypeTransaction.MINT,
    amount: 5002.324,
  },
  {
    icon: EuroImg,
    asset: 'EUR',
    name: 'EURC',
    date: '2023-04-25T13:53:14.018Z',
    type: TypeTransaction.BURN,
    amount: 602.123,
  },
  {
    icon: BitcoinImg,
    asset: 'BTC',
    name: 'Bitcoin',
    date: '2023-04-25T13:53:14.018Z',
    type: TypeTransaction.PAYMENT,
    amount: 403.235,
  },
]