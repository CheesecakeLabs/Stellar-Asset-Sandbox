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

interface IChartHolders {
  loadingChart: boolean
  groupedValues: number[]
  groupValue: number
  assetCode: string
}

export const ChartHolders: React.FC<IChartHolders> = ({
  groupedValues,
  loadingChart,
  assetCode,
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
    },
    xaxis: {
      categories: [
        `0 - 1k ${assetCode}`,
        `1k - 10k ${assetCode}`,
        `10k - 100k ${assetCode}`,
        `100k - 1M ${assetCode}`,
        `1M - 10M ${assetCode}`,
        `10M - 100M ${assetCode}`,
        `> 100M ${assetCode}`,
      ],
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
            return `${value}`
          },
        },
      },
    ],
  }

  const series = [
    {
      type: 'column',
      data: groupedValues,
      name: 'Holders',
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
          Holders distribution
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
