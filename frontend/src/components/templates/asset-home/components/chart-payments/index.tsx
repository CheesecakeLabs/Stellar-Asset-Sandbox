import { Container, Flex, Text } from '@chakra-ui/react'
import { FunctionComponent, useState } from 'react'
import { Bar, Line } from 'react-chartjs-2'
import { Chart } from 'react-chartjs-2'

import { faker } from '@faker-js/faker'
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
  label: string
  isDarkMode: boolean | undefined
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
  label,
  isDarkMode,
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
    labels: [
      '10 Mar',
      '11 Mar',
      '12 Mar',
      '13 Mar',
      '14 Mar',
      '15 Mar',
      '16 Mar',
      '17 Mar',
    ],
    datasets: [
      {
        label: 'Amount',
        data: [
          '10 Mar',
          '11 Mar',
          '12 Mar',
          '13 Mar',
          '14 Mar',
          '15 Mar',
          '16 Mar',
          '17 Mar',
        ].map(() => faker.datatype.number({ min: 0, max: 1000 })),
        borderColor: 'rgb(56,147,138)',
        backgroundColor: 'rgba(56,147,138,0.5)',
        order: 1,
      },
      {
        label: 'Volume',
        data: [
          '10 Mar',
          '11 Mar',
          '12 Mar',
          '13 Mar',
          '14 Mar',
          '15 Mar',
          '16 Mar',
          '17 Mar',
        ].map(() => faker.datatype.number({ min: 0, max: 1000 })),
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
        <Text
          fontSize="xs"
          fontWeight="600"
          color="gray.650"
          _dark={{ color: 'white' }}
        >
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
