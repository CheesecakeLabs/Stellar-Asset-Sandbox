import {
  Box,
  Container,
  Flex,
  Skeleton,
  Text,
  useColorMode,
} from '@chakra-ui/react'
import { Dispatch, FunctionComponent, SetStateAction } from 'react'
import Chart from 'react-apexcharts'

import { getChartLabels, isEqualLabel } from 'utils/constants/dashboards'
import { toCrypto } from 'utils/formatter'

import { ChartPeriod, TChartPeriod } from 'components/molecules/chart-period'

export interface IChartPayments {
  loadingChart: boolean
  paymentsAsset: Hooks.UseDashboardsTypes.IAsset
  chartPeriod: TChartPeriod
  setChartPeriod: Dispatch<SetStateAction<TChartPeriod>>
  cleanMode?: boolean
}

const ChartPayments: FunctionComponent<IChartPayments> = ({
  paymentsAsset,
  chartPeriod,
  loadingChart,
  setChartPeriod,
  cleanMode = false,
}) => {
  const { colorMode } = useColorMode()

  const options = {
    chart: {
      id: 'line',
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
    colors: ['#6E56CF', '#E91E63'],
    stroke: {
      width: [0, 4],
    },
    dataLabels: {
      enabled: false,
      enabledOnSeries: [1],
    },
    labels: getChartLabels(chartPeriod),
    xaxis: {
      categories: getChartLabels(chartPeriod),
      labels: {
        show: true,
        formatter: function (value: string): string {
          return `${chartPeriod === '24h' ? `${value}h` : `${value}`}`
        },
      },
    },
    yaxis: [
      {
        title: {
          text: !cleanMode ? 'Volume' : undefined,
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
          text: !cleanMode ? 'Payments' : undefined,
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
      data: getChartLabels(chartPeriod).map(label => {
        if (!paymentsAsset.date) return 0
        const index = paymentsAsset.date?.findIndex(date =>
          isEqualLabel(chartPeriod, date, label)
        )
        return index > -1 ? paymentsAsset.amount[index] : 0
      }),
    },
    {
      name: 'Payments',
      type: 'line',
      data: getChartLabels(chartPeriod).map(label => {
        if (!paymentsAsset.date) return 0
        const index = paymentsAsset.date?.findIndex(date =>
          isEqualLabel(chartPeriod, date, label)
        )
        return index > -1 ? paymentsAsset.quantity[index] : null
      }),
    },
  ]

  return (
    <Container
      variant={!cleanMode ? 'primary' : undefined}
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
          <ChartPeriod period={chartPeriod} setPeriod={setChartPeriod} />
        </Flex>
      </Flex>
      <Box>
        {loadingChart ? (
          <Skeleton h="22rem" w="full" />
        ) : (
          <Chart
            options={options}
            series={series}
            type="area"
            width="100%"
            height="320px"
          />
        )}
      </Box>
    </Container>
  )
}

export { ChartPayments }
