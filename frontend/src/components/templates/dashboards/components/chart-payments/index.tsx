import {
  Text,
  Container,
  Flex,
  Box,
  useColorMode,
  Skeleton,
} from '@chakra-ui/react'
import React, { Dispatch, SetStateAction } from 'react'
import Chart from 'react-apexcharts'

import { getChartLabels, isEqualLabel } from 'utils/constants/dashboards'
import { toCrypto } from 'utils/formatter'

import { ChartPeriod, TChartPeriod } from 'components/molecules/chart-period'

interface IChartPayments {
  loadingChart: boolean
  paymentsAssets: Hooks.UseDashboardsTypes.IAsset[]
  chartPeriod: TChartPeriod
  setChartPeriod: Dispatch<SetStateAction<TChartPeriod>>
}

export const ChartPayments: React.FC<IChartPayments> = ({
  paymentsAssets,

  chartPeriod,
  loadingChart,
  setChartPeriod,
}) => {
  const { colorMode } = useColorMode()

  const series = paymentsAssets.map(paymentsAsset => ({
    name: paymentsAsset.asset.code,
    data: getChartLabels(chartPeriod).map(label => {
      const index = paymentsAsset.date.findIndex(date =>
        isEqualLabel(chartPeriod, date, label)
      )
      return index > -1 ? paymentsAsset.amount[index] : 0
    }),
  }))

  const options = {
    chart: {
      id: 'area',
      foreColor: colorMode === 'dark' ? 'white' : 'black',
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
    tooltip: {
      theme: colorMode,
    },
    xaxis: {
      categories: getChartLabels(chartPeriod),
      labels: {
        show: true,
        formatter: function (value: string): string {
          return `${chartPeriod === '24h' ? `${value}h` : `${value}`}`
        },
      },
    },
    yaxis: {
      labels: {
        show: true,
        formatter: function (value: number): string {
          return `${toCrypto(value)}`
        },
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
          Payments timeline
        </Text>
        <Flex>
          <ChartPeriod period={chartPeriod} setPeriod={setChartPeriod} />
        </Flex>
      </Flex>
      <Box>
        {loadingChart ? (
          <Skeleton h="12rem" w="full" />
        ) : (
          <Chart
            options={options}
            series={series}
            type="area"
            width="100%"
            height="240px"
          />
        )}
      </Box>
    </Container>
  )
}
