import {
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Table,
  TableContainer,
  Tbody,
  Text,
} from '@chakra-ui/react'
import React from 'react'

import { mockupAssets } from 'utils/mockups'

import { SearchIcon } from 'components/icons'

import { ItemAsset } from '../item-asset'

export const AssetsManagement: React.FC = () => {

  return (
    <Flex
      borderRadius="1rem"
      m="1rem"
      bg="white"
      w="full"
      p="2rem"
      flexDir="column"
    >
      <Text size="sm" color="primary.light">
        Assets Management
      </Text>
      <InputGroup mt="1rem" mb="2rem" maxW="416px">
        <InputLeftElement pointerEvents="none" h="2.5rem">
          <SearchIcon />
        </InputLeftElement>
        <Input
          px="3rem"
          type="text"
          placeholder="Asset Name"
          bg="gray.100"
          borderRadius="1rem"
          fontSize="xs"
          h="2.5rem"
        />
      </InputGroup>
      <TableContainer>
        <Table>
          <Tbody>
            {mockupAssets.map(asset => (
              <ItemAsset asset={asset} />
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Flex>
  )
}
