import { FormLabel, Input, Flex } from '@chakra-ui/react'
import { useState } from 'react'

import { MoonIcon, SunIcon } from 'components/icons'

export const SwitchTheme: React.FC = () => {
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('dark')

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
        checked={themeMode.includes('light') ? true : false}
        onChange={(): void =>
          setThemeMode(themeMode.includes('light') ? 'dark' : 'light')
        }
        display="inline-block"
        appearance="none"
        cursor="pointer"
        height="12px"
        width="32px"
        backgroundColor="gray.600"
        borderRadius="full"
        mt="0.285rem"
      />
      <Flex
        className={`iconMove`}
        transition="all 0.2s ease-in"
        transform={`${
          themeMode.includes('light') ? 'translateX(0)' : 'translateX(12px)'
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
        {themeMode === 'light' ? <SunIcon width="11px"/> : <MoonIcon width="11px"/>}
      </Flex>
    </FormLabel>
  )
}
