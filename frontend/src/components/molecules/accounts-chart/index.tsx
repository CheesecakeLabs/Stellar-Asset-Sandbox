import { Container, Text, Flex, useColorMode } from '@chakra-ui/react'
import React from 'react'
import Chart from 'react-apexcharts'

import { HelpIcon } from 'components/icons'

interface IAccountsChart {
  authorized: number
  unauthorized: number
}

export const AccountsChart: React.FC<IAccountsChart> = ({
  authorized,
  unauthorized,
}) => {
  const { colorMode } = useColorMode()

  const series = [unauthorized, authorized]

  const options = {
    chart: {
      id: 'donut',
      foreColor: colorMode === 'dark' ? 'white' : 'black',
    },
    labels: ['Unauthorized', 'Authorized'],
    colors: ['#f55025', '#195a63'],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
  }

  return (
    <Container
      variant="primary"
      justifyContent="center"
      py="0.5rem"
      px="0.75rem"
      w="full"
      maxW="full"
      mt="1rem"
    >
      <Flex justifyContent="space-between" mb="1.25rem">
        <Text fontSize="xs" fontWeight="600">
          Accounts
        </Text>
        <Flex>
          <HelpIcon />
        </Flex>
      </Flex>

      <Chart
        options={options}
        series={series}
        type="donut"
        width="100%"
        height="240px"
        data-testid="area-chart"
      />
    </Container>
  )
}