import { AssetStatus } from 'components/enums';



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