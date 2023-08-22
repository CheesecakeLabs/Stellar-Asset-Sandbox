import { Box, Container, Flex, Text } from '@chakra-ui/react'
import { FunctionComponent, useState } from 'react'
import Chart from 'react-apexcharts'

import { getChartLabels } from 'utils/constants/dashboards'

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
    },
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
      },
      {
        opposite: true,
        title: {
          text: 'Payments',
        },
        formatter: function (value: string): string {
          return `${value}h`
        },
      },
    ],
  }

  const series = [
    {
      name: 'Volume',
      type: 'column',
      data: getChartLabels('24h').map(label => {
        const index =
          paymentsAsset.date?.findIndex(
            date => new Date(date).getHours().toString() === label
          ) || -1
        return index > -1 ? paymentsAsset.amount[index] : 0
      }),
    },
    {
      name: 'Payments',
      type: 'line',
      data: getChartLabels('24h').map(label => {
        const index =
          paymentsAsset.date?.findIndex(
            date => new Date(date).getHours().toString() === label
          ) || -1
        return index > -1 ? paymentsAsset.quantity[index] : 0
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
