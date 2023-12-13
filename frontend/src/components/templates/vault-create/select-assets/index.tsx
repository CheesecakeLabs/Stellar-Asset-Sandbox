import { Text, Flex, Switch, Img } from '@chakra-ui/react'
import React, { Dispatch, SetStateAction } from 'react'

import { getCurrencyIcon } from 'utils/constants/constants'
import { base64ToImg } from 'utils/converter'

interface ISelectAssets {
  assets: Hooks.UseAssetsTypes.IAssetDto[] | undefined
  assetsSelecteds: number[]
  setAssetsSelecteds: Dispatch<SetStateAction<number[]>>
}

export const SelectAssets: React.FC<ISelectAssets> = ({
  assets,
  setAssetsSelecteds,
  assetsSelecteds,
}) => {
  return (
    <Flex flexDir="column">
      {assets?.map((asset, index) => (
        <Flex
          key={index}
          justifyContent="space-between"
          alignItems="center"
          borderBottom="1px solid"
          borderColor={'gray.600'}
          color="gray.700"
          h="3rem"
          _dark={{ borderColor: 'white', color: 'white' }}
        >
          <Flex
            gap={3}
            fill="black"
            stroke="black"
            _dark={{ fill: 'white', stroke: 'white' }}
            alignItems="center"
          >
            {asset.image ? (
              <Img src={base64ToImg(asset.image)} w="24px" h="24px" />
            ) : (
              getCurrencyIcon(asset.code, '1.5rem')
            )}
            <Text fontWeight="600" fontSize="sm">
              {asset.name}
            </Text>
          </Flex>
          <Switch
            onChange={(event): void => {
              if (event.target.checked) {
                setAssetsSelecteds([asset.id, ...assetsSelecteds])
                return
              }
              setAssetsSelecteds(assetsSelecteds.filter(id => id !== asset.id))
            }}
          />
        </Flex>
      ))}
    </Flex>
  )
}
