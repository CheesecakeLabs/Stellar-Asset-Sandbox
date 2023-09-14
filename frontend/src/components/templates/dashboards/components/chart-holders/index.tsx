import {
  Text,
  Container,
  Flex,
  Box,
  useColorMode,
  Skeleton,
} from '@chakra-ui/react'
import React from 'react'
import Chart from 'react-apexcharts'

import { toCrypto } from 'utils/formatter'

interface IChartHolders {
  loadingChart: boolean
  groupedValues: number[]
  groupValue: number
}

export const ChartHolders: React.FC<IChartHolders> = ({
  groupedValues,
  loadingChart,
  groupValue,
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
      enabled: true,
      enabledOnSeries: [1],
    },
    xaxis: {
      categories: [1, 2, 3, 4, 5].map(
        position =>
          `${toCrypto(groupValue * (position - 1))} - ${toCrypto(
            groupValue * position
          )}`
      ),
      labels: {
        show: true,
        formatter: function (value: string): string {
          return `${value}`
        },
      },
    },
    yaxis: [
      {
        labels: {
          formatter: function (value: number): string {
            return `${toCrypto(value)}`
          },
        },
      },
    ],
  }

  const series = [
    {
      type: 'column',
      data: groupedValues,
    },
  ]

  return (
    <Container
      justifyContent="center"
      py="0.5rem"
      px="0.75rem"
      w="full"
      maxW="full"
      mt="1rem"
    >
      <Flex justifyContent="space-between" mb="1.25rem">
        <Text fontSize="xs" fontWeight="600">
          Holders
        </Text>
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
