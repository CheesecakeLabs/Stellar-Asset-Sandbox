import { FormLabel, Input, Flex, useColorMode } from '@chakra-ui/react'

import { MoonIcon, SunIcon } from 'components/icons'

export const SwitchTheme: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <FormLabel
      htmlFor="theme-switcher"
      as={'label'}
      display="flex"
      alignItems="center"
      justifyContent="center"
      gap={2}
      position="relative"
      mt="0.5rem"
    >
      <Input
        id="theme-switcher"
        type="checkbox"
        checked={colorMode.includes('light') ? true : false}
        onChange={(): void => toggleColorMode()}
        display="inline-block"
        appearance="none"
        cursor="pointer"
        height="0.75rem"
        width="2rem"
        bg={'gray.600'}
        _dark={{ bg: 'black.800' }}
        borderRadius="full"
        mt="0.285rem"
      />
      <Flex
        className={`iconMove`}
        transition="all 0.2s ease-in"
        transform={`${
          colorMode.includes('light') ? 'translateX(0)' : 'translateX(12px)'
        }`}
        position="absolute"
        cursor="pointer"
        top={'1px'}
        left={'1px'}
        w={'20px'}
        h={'20px'}
        bg="white"
        border="1px solid"
        borderColor="gray.350"
        borderRadius="full"
        justifyContent="center"
        alignItems="center"
      >
        {colorMode === 'light' ? (
          <SunIcon width="11px" />
        ) : (
          <MoonIcon width="11px" />
        )}
      </Flex>
    </FormLabel>
  )
}
