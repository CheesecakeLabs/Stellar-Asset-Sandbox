import { Button, Container, Flex } from '@chakra-ui/react'
import React, { Dispatch, SetStateAction } from 'react'

export type TSelectCompoundType = 'Simple interest' | 'Compound interest'

interface ISelectCompoundType {
  compoundType: TSelectCompoundType
  setCompoundType: Dispatch<SetStateAction<TSelectCompoundType>>
}

export const SelectCompoundType: React.FC<ISelectCompoundType> = ({ compoundType, setCompoundType }) => {
  return (
    <Container variant="primary" p="0" h="2rem" mb="1rem">
      <Flex>
        {['Simple interest', 'Compound interest'].map(type => <Button
          variant={compoundType === type ? 'menuButtonSelected' : 'menuButton'}
          borderRadius="0.25rem"
          border={0}
          fontSize="sm"
          h="2rem"
          onClick={(): void => {
            setCompoundType(type as TSelectCompoundType)
          }}
          textAlign="center"
          justifyContent="center"
        >
          {type}
        </Button>)}

      </Flex>
    </Container>
  )
}
