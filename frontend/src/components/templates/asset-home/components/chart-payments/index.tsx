import { Box, Container, Flex, Text } from '@chakra-ui/react'
import { FunctionComponent } from 'react'
import Chart from 'react-apexcharts'

import { getChartLabels } from 'utils/constants/dashboards'
import { toCrypto } from 'utils/formatter'

import { HelpIcon } from 'components/icons'

export interface IChartPayments {
  loadingChart: boolean
  paymentsAsset: Hooks.UseDashboardsTypes.IAsset
}

const ChartPayments: FunctionComponent<IChartPayments> = ({
  paymentsAsset,
}) => {
  const options = {
    chart: {
      id: 'line',
      toolbar: {
        show: true,
        offsetX: 0,
        offsetY: 0,
        tools: {
          download: false,
          selection: false,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: false,
          reset: true,
        },
      },
    },
    colors: ['#6E56CF', '#E91E63'],
    stroke: {
      width: [0, 4],
    },
    dataLabels: {
      enabled: true,
      enabledOnSeries: [1],
    },
    labels: getChartLabels('24h'),
    xaxis: {
      categories: getChartLabels('24h'),
      labels: {
        show: true,
        formatter: function (value: string): string {
          return `${value}h`
        },
      },
    },
    yaxis: [
      {
        title: {
          text: 'Volume',
        },
        labels: {
          formatter: function (value: number): string {
            return `${toCrypto(value)} ${paymentsAsset.asset.code}`
          },
        },
      },
      {
        opposite: true,
        title: {
          text: 'Payments',
        },
        labels: {
          formatter: function (value: number): string {
            return value?.toFixed(0)
          },
        },
      },
    ],
  }

  const series = [
    {
      name: 'Volume',
      type: 'column',
      data: getChartLabels('24h').map(label => {
        if (!paymentsAsset.date) return 0
        const index = paymentsAsset.date?.findIndex(
          date => new Date(date).getHours().toString() === label
        )
        return index > -1 ? paymentsAsset.amount[index] : 0
      }),
    },
    {
      name: 'Payments',
      type: 'line',
      data: getChartLabels('24h').map(label => {
        if (!paymentsAsset.date) return 0
        const index = paymentsAsset.date?.findIndex(
          date => new Date(date).getHours().toString() === label
        )
        return index > -1 ? paymentsAsset.quantity[index] : null
      }),
    },
  ]

  return (
    <Container
      variant="primary"
      justifyContent="center"
      py="0.5rem"
      px="0.75rem"
      w="full"
      maxW="full"
      my="1rem"
    >
      <Flex justifyContent="space-between" mb="1.25rem">
        <Text fontSize="xs" fontWeight="600">
          Payments timeline
        </Text>
        <Flex>
          <HelpIcon />
        </Flex>
      </Flex>
      <Box>
        <Chart options={options} series={series} type="area" width="100%" />
      </Box>
    </Container>
  )
}

export { ChartPayments }
