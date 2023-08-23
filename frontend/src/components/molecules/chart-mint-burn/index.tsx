import {
  Box,
  Container,
  Flex,
  Skeleton,
  Text,
  useColorMode,
} from '@chakra-ui/react'
import { Dispatch, SetStateAction } from 'react'
import Chart from 'react-apexcharts'

import { getChartLabels, isEqualLabel } from 'utils/constants/dashboards'
import { toCrypto } from 'utils/formatter'

import { ChartPeriod, TChartPeriod } from '../chart-period'

interface IChartMintBurn {
  loadingChart: boolean
  mintOperations: Hooks.UseDashboardsTypes.IAsset
  burnOperations: Hooks.UseDashboardsTypes.IAsset
  chartPeriod: TChartPeriod
  setChartPeriod: Dispatch<SetStateAction<TChartPeriod>>
}

export const ChartMintBurn: React.FC<IChartMintBurn> = ({
  mintOperations,
  burnOperations,
  chartPeriod,
  loadingChart,
  setChartPeriod,
}) => {
  const { colorMode } = useColorMode()

  const series = [
    {
      name: 'Mint',
      data: getChartLabels(chartPeriod).map(label => {
        const index = mintOperations.date?.findIndex(date =>
          isEqualLabel(chartPeriod, date, label)
        )
        return index > -1 ? mintOperations.amount[index] : 0
      }),
    },
    {
      name: 'Burn',
      data: getChartLabels(chartPeriod).map(label => {
        const index = burnOperations.date?.findIndex(date =>
          isEqualLabel(chartPeriod, date, label)
        )
        return index > -1 ? burnOperations.amount[index] : 0
      }),
    },
  ]

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
      stroke: {
        curve: 'smooth',
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
          Mint/Burn timeline
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
            type="line"
            width="100%"
            height="320px"
          />
        )}
      </Box>
    </Container>
  )
}
