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

import { formatDateMD, formatHour, toCrypto } from 'utils/formatter'

import { ChartPeriod, TChartPeriod } from 'components/molecules/chart-period'

interface IChartSupply {
  loadingChart: boolean
  supplyAsset: Hooks.UseDashboardsTypes.ISupply
  chartPeriod: TChartPeriod
  setChartPeriod: Dispatch<SetStateAction<TChartPeriod>>
}

export const ChartSupply: React.FC<IChartSupply> = ({
  supplyAsset,
  chartPeriod,
  loadingChart,
  setChartPeriod,
}) => {
  const { colorMode } = useColorMode()

  const series = [
    {
      name: 'Supply',
      data: supplyAsset.current_supply,
    },
    {
      name: 'Main vault',
      data: supplyAsset.current_main_vault,
    },
  ]

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
      categories: supplyAsset.date,
      labels: {
        show: true,
        formatter: function (value: string): string {
          return chartPeriod === '24h' ? formatHour(value) : formatDateMD(value)
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
