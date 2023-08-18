import { useColorMode } from '@chakra-ui/react'

import { LoadingIcon } from 'components/icons'

export const Loading: React.FC = () => {
  const { colorMode } = useColorMode()

  return <LoadingIcon stroke={colorMode === 'dark' ? 'white' : 'black'} />
}
