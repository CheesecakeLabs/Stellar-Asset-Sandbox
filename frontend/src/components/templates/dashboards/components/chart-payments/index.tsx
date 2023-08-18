import { Text, Container, Flex, Box } from '@chakra-ui/react'
import React from 'react'
import Chart from 'react-apexcharts'

import { HelpIcon } from 'components/icons'

interface IChartPayments {
  height?: number
  label: string
}

export const ChartPayments: React.FC<IChartPayments> = ({
  height = 188,
  label,
}) => {
  const series = [
    {
      name: 'USDC',
      data: [10, 20, 50, 230, 1239],
    },
    {
      name: 'EURC',
      data: [423, 2154, 1500, 234, 1045],
    },
    {
      name: 'FIFO',
      data: [53, 342, 725, 945, 440],
    },
  ]

  const options = {
    chart: {
      id: 'area',
    },
    xaxis: {
      categories: [
        '10 Mar',
        '11 Mar',
        '12 Mar',
        '13 Mar',
        '14 Mar',
        '15 Mar',
        '16 Mar',
      ],
      labels: {
        show: true,
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
