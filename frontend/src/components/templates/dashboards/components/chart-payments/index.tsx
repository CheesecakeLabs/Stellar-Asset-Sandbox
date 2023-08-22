import { Text, Container, Flex, Box } from '@chakra-ui/react'
import React from 'react'
import Chart from 'react-apexcharts'

import { getChartLabels } from 'utils/constants/dashboards'

import { HelpIcon } from 'components/icons'

interface IChartPayments {
  loadingChart: boolean
  paymentsAssets: Hooks.UseDashboardsTypes.IAsset[]
}

export const ChartPayments: React.FC<IChartPayments> = ({ paymentsAssets }) => {
  const series = paymentsAssets.map(paymentsAsset => ({
    name: paymentsAsset.asset.code,
    data: getChartLabels('24h').map(label => {
      const index = paymentsAsset.date.findIndex(
        date => new Date(date).getHours().toString() === label
      )
      return index > -1 ? paymentsAsset.amount[index] : 0
    }),
  }))

  const options = {
    chart: {
      id: 'area',
    },
    xaxis: {
      categories: getChartLabels('24h'),
      labels: {
        show: true,
        formatter: function (value: string): string {
          return `${value}h`
        },
      },
    },
    yaxis: {
      labels: {
        show: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.5,
        opacityTo: 0.4,
        stops: [0, 90, 100],
      },
    },
    stroke: {
      width: 2,
    },
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
          Supply over time
        </Text>
        <Flex>
          <HelpIcon />
        </Flex>
      </Flex>
      <Box>
        <Chart
          options={options}
          series={series}
          type="area"
          width="100%"
          height="240px"
          data-testid="area-chart"
        />
      </Box>
    </Container>
  )
}
