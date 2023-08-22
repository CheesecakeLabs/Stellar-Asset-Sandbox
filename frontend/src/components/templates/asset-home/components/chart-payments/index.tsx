import { Container, Flex, Text } from '@chakra-ui/react'
import { FunctionComponent, useState } from 'react'
import { Chart } from 'react-chartjs-2'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from 'chart.js'

import { HelpIcon } from 'components/icons'

export interface IChartPayments {
  loadingChart: boolean
  paymentsAsset: Hooks.UseDashboardsTypes.IAsset | undefined
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const ChartPayments: FunctionComponent<IChartPayments> = ({
  loadingChart,
  paymentsAsset,
}) => {
  const [optionFilter, setOptionFilter] = useState<'MONTH' | 'YEAR' | 'ALL'>(
    'MONTH'
  )

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
  }

  const data = {
    labels: paymentsAsset?.date,
    datasets: [
      {
        label: 'Amount',
        data: paymentsAsset?.amount,
        borderColor: 'rgb(56,147,138)',
        backgroundColor: 'rgba(56,147,138,0.5)',
        order: 1,
      },
      {
        label: 'Volume',
        data: paymentsAsset?.quantity,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        type: 'line' as never,
        order: 0,
      },
    ],
  }

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
      <Flex>
        <Chart type="bar" options={options} data={data} />
      </Flex>
    </Container>
  )
}

export { ChartPayments }
