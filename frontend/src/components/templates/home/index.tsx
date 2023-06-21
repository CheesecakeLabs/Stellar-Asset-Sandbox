import {
  Container,
  Flex,
  Table,
  Tbody,
  Th,
  Thead,
  Tr,
  Text,
  Td,
  Button,
} from '@chakra-ui/react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import { Loading } from 'components/atoms'
import { PathRoute } from 'components/enums/path-route'
import { ArrowRightIcon, CoinIcon, JoinIcon } from 'components/icons'

interface IHomeTemplate {
  loading: boolean
  assets: Hooks.UseAssetsTypes.IAsset[] | undefined
}

export const HomeTemplate: React.FC<IHomeTemplate> = ({ loading, assets }) => {
  const navigate = useNavigate()

  return (
    <Flex flexDir="column" w="full">
      <Flex maxW="584px" alignSelf="center" flexDir="column" w="full">
        <Flex mb="1.5rem" justifyContent="space-between">
          <Text fontSize="2xl" fontWeight="400">
            Asset Management
          </Text>
          <Button
            variant="primary"
            leftIcon={<JoinIcon fill="white" />}
            onClick={(): void => navigate(PathRoute.FORGE_ASSET)}
          >
            Forge asset
          </Button>
        </Flex>
        <Container variant="primary" p={0} maxW="full">
          {loading || !assets ? (
            <Loading />
          ) : (
            <Table w="full">
              <Thead w="full">
                <Tr>
                  <Th
                    color={'gray.700'}
                    borderColor={'gray.400'}
                    _dark={{ borderColor: 'black.800' }}
                    w="2rem"
                    p={0}
                  />
                  <Th
                    color={'gray.700'}
                    borderColor={'gray.400'}
                    _dark={{ borderColor: 'black.800' }}
                  >
                    Code
                  </Th>
                  <Th
                    color={'gray.700'}
                    borderColor={'gray.400'}
                    _dark={{ borderColor: 'black.800' }}
                  >
                    Name
                  </Th>
                  <Th
                    color={'gray.700'}
                    borderColor={'gray.400'}
                    _dark={{ borderColor: 'black.800' }}
                  >
                    Supply
                  </Th>
                  <Th
                    borderColor={'gray.400'}
                    _dark={{ borderColor: 'black.800' }}
                    w="2rem"
                    p={0}
                  />
                </Tr>
              </Thead>
              <Tbody>
                {assets.map(asset => (
                  <Tr
                    borderColor="red"
                    cursor="pointer"
                    onClick={(): void => navigate(PathRoute.MINT_ASSET)}
                    fill="black"
                    stroke="black"
                    _dark={{ fill: 'white', stroke: 'white' }}
                  >
                    <Td
                      borderColor={'gray.400'}
                      _dark={{ borderColor: 'black.800' }}
                    >
                      <CoinIcon width="2rem" />
                    </Td>
                    <Td
                      borderColor={'gray.400'}
                      _dark={{ borderColor: 'black.800' }}
                    >
                      {asset.code}
                    </Td>
                    <Td
                      borderColor={'gray.400'}
                      _dark={{ borderColor: 'black.800' }}
                    >
                      {asset.name}
                    </Td>
                    <Td
                      borderColor={'gray.400'}
                      _dark={{ borderColor: 'black.800' }}
                    >
                      {asset.supply}
                    </Td>
                    <Td
                      borderColor={'gray.400'}
                      _dark={{ borderColor: 'black.800', fill: 'white' }}
                      w="2rem"
                      p={0}
                    >
                      <ArrowRightIcon width="12px" />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </Container>
      </Flex>
    </Flex>
  )
}
