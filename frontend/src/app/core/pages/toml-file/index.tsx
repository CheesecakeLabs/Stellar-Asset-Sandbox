import { Flex } from '@chakra-ui/react'
import React, { useEffect } from 'react'

import { useAssets } from 'hooks/useAssets'

export const TomlFile: React.FC = () => {
  const { retrieveToml } = useAssets()

  useEffect(() => {
    retrieveToml()
  }, [retrieveToml])

  return <Flex></Flex>
}
