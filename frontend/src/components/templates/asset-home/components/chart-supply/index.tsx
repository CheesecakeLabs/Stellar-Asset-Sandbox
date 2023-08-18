import { Container, Flex, Text } from '@chakra-ui/react'
import { FunctionComponent, useState } from 'react'
import { Line } from 'react-chartjs-2'

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
} from 'chart.js'

import { HelpIcon } from 'components/icons'

export interface IChartGeneralProps {
  label: string
  isDarkMode: boolean | undefined
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const ChartSupply: FunctionComponent<IChartGeneralProps> = ({
  label,
  isDarkMode,
}) => {
  const [optionFilter, setOptionFilter] = useState<'MONTH' | 'YEAR' | 'ALL'>(
    'MONTH'
  )

  const options = {
    responsive: true,
    plugins: {
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
        label: 'Total supply',
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
      },
      {
        label: 'Main Vault',
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
      mt="1rem"
    >
      <Flex justifyContent="space-between" mb="1.25rem">
        <Text
          fontSize="xs"
          fontWeight="600"
          color="gray.650"
          _dark={{ color: 'white' }}
        >
          Total Supply and Main vault
        </Text>
        <Flex>
          <HelpIcon />
        </Flex>
      </Flex>
      <Flex>
        <Line options={options} data={data} />
      </Flex>
    </Container>
  )
}

export { ChartSupply }
