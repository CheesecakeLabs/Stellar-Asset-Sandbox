import { Box, Container, Flex, Input, Text } from '@chakra-ui/react'

import { KeyIcon, SettingsIcon } from 'components/icons'

import { ItemFilter } from '../item-filter'
import { Flag } from 'react-feather'

export const Filter: React.FC = () => {
  return (
    <Container variant="primary" p={1} maxW="full" mb={2}>
      <Flex justifyContent="space-between" alignItems="center">
        <Flex>
          <Flex alignItems="center" justifyContent="center" flexDir="column" w={16}>
            <Flag/>
          </Flex>
          <ItemFilter title="Authorize" />
          <ItemFilter title="Freeze" />
          <ItemFilter title="Clawback" />

          <ItemFilter title="Security" />
          <ItemFilter title="Payment" />
          <ItemFilter title="Utility" />
        </Flex>
        <Input
          type="search"
          placeholder="Search"
          bg="gray.100"
          maxW="196px"
          border="none"
        />
      </Flex>
    </Container>
  )
}
