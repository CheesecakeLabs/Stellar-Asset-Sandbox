import { Container, Flex, Img, Spacer, Text } from '@chakra-ui/react'
import React from 'react'

interface IItemCase {
  title: string
  subTitle: string
  bg: string
  img: string
  onClick: () => void
}

export const ItemCase: React.FC<IItemCase> = ({
  title,
  subTitle,
  bg,
  img,
  onClick,
}) => {
  return (
    <Container
      onClick={onClick}
      display="flex"
      h="550px"
      bg={bg}
      px="2rem"
      pt="3rem"
      flexDir="column"
      alignItems="center"
      transition="1s"
      _hover={{
        img: {
          transform: 'scale(1.05, 1.05)',
          transition: '1s',
          transformOrigin: 'bottom',
        },
      }}
      cursor="pointer"
      justifyContent="space-between"
      css={{
        img: {
          transform: 'scale(1, 1)',
          transition: '1s',
          transformOrigin: 'bottom',
        },
      }}
    >
      <Flex flexDir="column">
        <Text
          color="white"
          fontSize="2rem"
          fontWeight="400"
          lineHeight="36px"
          textAlign="center"
          mb="1.5rem"
        >
          {title}
        </Text>
        <Text color="white" textAlign="center" fontSize="18px" opacity="0.7">
          {subTitle}
        </Text>
      </Flex>
      <Spacer />
      <Img src={img} w="70%" />
    </Container>
  )
}
