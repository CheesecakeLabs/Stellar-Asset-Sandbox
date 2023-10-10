import { Image } from '@chakra-ui/react'
import { ReactNode } from 'react'

import arsPng from './../../components/icons/fonts/ars.png'
import brazilPng from './../../components/icons/fonts/brazil_flag.png'
import { CoinIcon, EurocIcon, UsdcIcon } from 'components/icons'

export const STELLAR_EXPERT_TX_URL =
  'https://stellar.expert/explorer/testnet/tx'

export const STELLAR_EXPERT_ASSET =
  'https://stellar.expert/explorer/testnet/asset'

export const STELLAR_EXPERT_URL = 'https://stellar.expert/explorer/testnet'

export const getCurrencyIcon = (
  assetCode: string,
  width = '1.5rem'
): ReactNode => {
  switch (width) {
    case '1rem':
      width = '16px'
      break
    case '1.5rem':
      width = '24px'
      break
    case '2rem':
      width = '32px'
      break
    case '2.5rem':
      width = '40px'
      break
    case '3rem':
      width = '48px'
      break
  }

  switch (assetCode) {
    case 'USDC':
      return <UsdcIcon width={width} height={width} />
    case 'EUROC':
      return <EurocIcon width={width} height={width} />
    case 'DREX':
      return <Image src={brazilPng} width={width} height={width} />
    case 'BRL':
      return <Image src={brazilPng} width={width} height={width} />
    case 'MBRL':
      return <Image src={brazilPng} width={width} height={width} />
    case 'ARS':
      return <Image src={arsPng} width={width} height={width} />

    default:
      return <CoinIcon width={width} height={width} />
  }
}

export const vaultCategoryTheme = [
  'blue_sky',
  'purple_powder',
  'blue_moonstone',
  'red',
  'green',
  'yellow',
]
