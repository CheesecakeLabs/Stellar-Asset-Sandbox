import { Flex, Tag } from '@chakra-ui/react'
import React from 'react'

import { FilterIcon } from 'components/icons'

interface IFilters {
  vaultCategories: Hooks.UseVaultsTypes.IVaultCategory[]
}

export const Filters: React.FC<IFilters> = ({ vaultCategories }) => {
  return (
    <Flex
      w="full"
      bg="gray.400"
      mb="1rem"
      alignItems="center"
      px="0.5rem"
      py="0.25rem"
      fill="gray.650"
      borderRadius="0.25rem"
    >
      <FilterIcon />
      <Flex ms="1rem">
        {vaultCategories.map((vaultCategory, index) => (
          <Tag
            fontSize="xs"
            fontWeight="500"
            mr="0.35rem"
            py={0}
            px={4}
            key={index}
          >
            {vaultCategory.name}
          </Tag>
        ))}
      </Flex>
    </Flex>
  )
}
