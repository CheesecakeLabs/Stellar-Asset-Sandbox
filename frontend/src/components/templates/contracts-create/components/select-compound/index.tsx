import { Button, Container, Flex } from '@chakra-ui/react'
import React, { Dispatch, SetStateAction } from 'react'

export enum CompoundTime {
  '10 min' = 600,
  '30 min' = 1800,
  '1 hour' = 3600,
  '24 hours' = 86400,
  '7 days' = 604800,
  '30 days' = 18144000,
}

interface ISelectCompound {
  compound: CompoundTime
  setCompound: Dispatch<SetStateAction<CompoundTime>>
}

export const SelectCompound: React.FC<ISelectCompound> = ({
  compound,
  setCompound,
}) => {
  return (
    <Container variant="primary" p="0" h="2rem">
      <Flex>
        {[
          CompoundTime['10 min'],
          CompoundTime['30 min'],
          CompoundTime['1 hour'],
          CompoundTime['24 hours'],
          CompoundTime['7 days'],
          CompoundTime['30 days'],
        ].map((time, index) => (
          <Button
            key={index}
            variant={
              CompoundTime[compound] === CompoundTime[time]
                ? 'menuButtonSelected'
                : 'menuButton'
            }
            bg={compound === time ? 'black.800' : undefined}
            borderRadius="0.25rem"
            border={0}
            fontSize="xs"
            h="2rem"
            onClick={(): void => {
              setCompound(time as CompoundTime)
            }}
            textAlign="center"
            justifyContent="center"
          >
            {CompoundTime[time]}
          </Button>
        ))}
      </Flex>
    </Container>
  )
}
