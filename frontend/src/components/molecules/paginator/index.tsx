import { Button, Container, Flex, Text } from '@chakra-ui/react'
import React from 'react'

import { NavLeftIcon, NavRightIcon } from 'components/icons'

interface IPaginator {
  changePage(page: number): void
  currentPage: number
  totalPages: number
}

export const Paginator: React.FC<IPaginator> = ({
  changePage,
  currentPage,
  totalPages,
}) => {
  return (
    <Flex justifyContent="flex-end">
      <Flex w="fit-content" alignItems="center">
        <Button
          variant={'menuButton'}
          border="0"
          w="min-content"
          leftIcon={
            <Flex w="1rem" justifyContent="center">
              <NavLeftIcon />
            </Flex>
          }
          isDisabled={currentPage === 1}
          onClick={(): void => {
            changePage(currentPage - 1)
          }}
        >
          Previous
        </Button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(
          (pageNumber, index) => (
            <Container
              key={index}
              w="fit-content"
              h="fit-content"
              cursor="pointer"
              borderRadius="full"
              bg={currentPage === pageNumber ? 'gray.200' : undefined}
              _dark={{
                bg: currentPage === pageNumber ? 'black.700' : undefined,
              }}
              onClick={(): void => {
                changePage(pageNumber)
              }}
            >
              <Text fontSize="sm">{pageNumber}</Text>
            </Container>
          )
        )}
        <Button
          variant={'menuButton'}
          border="0"
          w="min-content"
          rightIcon={
            <Flex w="1rem" justifyContent="center">
              <NavRightIcon />
            </Flex>
          }
          isDisabled={currentPage === totalPages}
          onClick={(): void => {
            changePage(currentPage + 1)
          }}
        >
          Next
        </Button>
      </Flex>
    </Flex>
  )
}
