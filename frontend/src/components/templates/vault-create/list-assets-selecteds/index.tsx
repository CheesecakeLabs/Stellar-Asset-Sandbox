import { Text, Flex, Img, Button } from '@chakra-ui/react'
import React, { Dispatch, SetStateAction } from 'react'

import { getCurrencyIcon } from 'utils/constants/constants'

interface IListAssetsSelecteds {
  assets: Hooks.UseAssetsTypes.IAssetDto[] | undefined
  setAssets: Dispatch<SetStateAction<Hooks.UseAssetsTypes.IAssetDto[]>>
}

export const ListAssetsSelecteds: React.FC<IListAssetsSelecteds> = ({
  assets,
  setAssets,
}) => {
  return (
    <Flex flexDir="column" mt="0.5rem">
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
              <Img src={asset.image} w="24px" h="24px" />
            ) : (
              getCurrencyIcon(asset.code, '1.5rem')
            )}
            <Text fontWeight="600" fontSize="sm">
              {asset.name}
            </Text>
          </Flex>
          <Button
            variant="delete"
            h="fit-content"
            p="0.15rem"
            fontSize="xs"
            onClick={(): void => {
              setAssets(prev =>
                prev.filter(selected => selected.id !== asset.id)
              )
            }}
          >
            Remove
          </Button>
        </Flex>
      ))}
    </Flex>
  )
}
