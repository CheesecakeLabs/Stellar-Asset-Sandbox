import { Button, Container, Flex } from '@chakra-ui/react'
import React, { Dispatch, SetStateAction } from 'react'

export type TChartPeriod = '24h' | '7d' | '30d'

interface IChartPeriod {
  period: TChartPeriod
  setPeriod: Dispatch<SetStateAction<TChartPeriod>>
}

export const ChartPeriod: React.FC<IChartPeriod> = ({ period, setPeriod }) => {
  return (
    <Container variant="primary" p="0" h="2rem">
      <Flex>
        <Button
          variant={period === '24h' ? 'menuButtonSelected' : 'menuButton'}
          borderStartRadius="0.25rem"
          border={0}
          fontSize="xs"
          h="2rem"
          onClick={(): void => {
            setPeriod('24h')
          }}
        >
          Last 24h
        </Button>
        <Button
          variant={period === '7d' ? 'menuButtonSelected' : 'menuButton'}
          h="2rem"
          border={0}
          fontSize="xs"
          onClick={(): void => {
            setPeriod('7d')
          }}
        >
          7 days
        </Button>
        <Button
          variant={period === '30d' ? 'menuButtonSelected' : 'menuButton'}
          h="2rem"
          border={0}
          fontSize="xs"
          borderEndRadius="0.25rem"
          onClick={(): void => {
            setPeriod('30d')
          }}
        >
          30 days
        </Button>
      </Flex>
    </Container>
  )
}
