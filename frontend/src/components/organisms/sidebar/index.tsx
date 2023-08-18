import {
  Box,
  Drawer,
  DrawerContent,
  Flex,
  useDisclosure,
} from '@chakra-ui/react'
import React, { ReactNode } from 'react'

import { PathRoute } from 'components/enums/path-route'
import {
  ContractIcon,
  DashboardIcon,
  ExplorerIcon,
  HomeIcon,
  PaymentsIcon,
  VaultIcon,
} from 'components/icons'
import { SidebarContent } from 'components/molecules'
import { Header } from 'components/molecules/header'

interface IProps {
  highlightMenu: PathRoute
  children: ReactNode
}

export interface ILinkItemProps {
  name: string
  icon: ReactNode
  path: string
  alerts?: number
}
const linkItems: ILinkItemProps[] = [
  {
    name: 'Home',
    icon: <HomeIcon />,
    path: PathRoute.HOME,
  },
  {
    name: 'Asset Management',
    icon: <PaymentsIcon />,
    path: PathRoute.ASSET_MANAGEMENT,
  },
  // {
  //   name: 'Payment Tokens',
  //   icon: <PaymentsIcon />,
  //   path: `${PathRoute.PAYMENTS_TOKENS}`,
  // },
  // {
  //   name: 'Securities Tokens',
  //   icon: <SecurityIcon />,
  //   path: PathRoute.SECURITIES_TOKENS,
  // },
  {
    name: 'Soroban Smart Contracts',
    icon: <ContractIcon />,
    path: PathRoute.SOROBAN_SMART_CONTRACTS,
  },
  {
    name: 'Treasury',
    icon: <VaultIcon />,
    path: `${PathRoute.VAULTS}`,
  },
  {
    name: 'Assets Dashboard',
    icon: <DashboardIcon />,
    path: PathRoute.ASSETS_DASHBOARD,
  },
  {
    name: 'Blockchain Explorer',
    icon: <ExplorerIcon />,
    path: PathRoute.BLOCKCHAIN_EXPLORER,
  },
]

export const Sidebar: React.FC<IProps> = ({ children, highlightMenu }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Box w="full">
      <Header onOpen={onOpen} />
      <Flex pt="5rem">
        <SidebarContent
          items={linkItems}
          onClose={(): void => onClose()}
          display={{ base: 'none', md: 'block' }}
          highlightMenu={highlightMenu}
        />
        <Drawer
          autoFocus={false}
          isOpen={isOpen}
          placement="left"
          onClose={onClose}
          returnFocusOnClose={false}
          onOverlayClick={onClose}
          size="full"
        >
          <DrawerContent>
            <SidebarContent
              items={linkItems}
              onClose={onClose}
              highlightMenu={highlightMenu}
            />
          </DrawerContent>
        </Drawer>
        <Box ml={{ base: 0, md: '282px' }} p="4" w="full">
          {children}
        </Box>
      </Flex>
    </Box>
  )
}
