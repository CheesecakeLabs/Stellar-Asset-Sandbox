import { Container, Text, Flex } from '@chakra-ui/react';
import React from 'react';
import { Pie } from 'react-chartjs-2';



import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';



import { HelpIcon } from 'components/icons';


ChartJS.register(ArcElement, Tooltip, Legend)

interface IAccountsChart {
  authorized: number
  unauthorized: number
}

export const AccountsChart: React.FC<IAccountsChart> = ({
  authorized,
  unauthorized,
}) => {
  const data = {
    labels: ['Authorized', 'Unauthorized'],
    datasets: [
      {
        label: 'accounts',
        data: [authorized, unauthorized],
        backgroundColor: ['#55efc4', '#ff7675'],
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
    >
      <Flex justifyContent="space-between" mb="1.25rem">
        <Text
          fontSize="xs"
          fontWeight="600"
          color="gray.650"
          _dark={{ color: 'white' }}
        >
          Accounts
        </Text>
        <Flex>
          <HelpIcon />
        </Flex>
      </Flex>

      <Pie data={data} width="5rem" height="5rem" />
    </Container>
  )
}