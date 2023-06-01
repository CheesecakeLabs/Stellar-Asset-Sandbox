import { Box, Drawer, DrawerContent, useDisclosure } from '@chakra-ui/react'
import React, { ReactNode } from 'react'

import { PathRoute } from 'components/enums/path-route'
import {
  ContractIcon,
  DashboardIcon,
  ExplorerIcon,
  HomeIcon,
  PaymentsIcon,
  SecurityIcon,
} from 'components/icons'
import { SidebarContent } from 'components/molecules'
import { Header } from 'components/molecules/header'

interface IProps {
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
    name: 'Payment Tokens',
    icon: <PaymentsIcon />,
    path: `${PathRoute.PAYMENT_TOKENS}`,
  },
  {
    name: 'Securities Tokens',
    icon: <SecurityIcon />,
    path: PathRoute.SECURITIES_TOKENS,
  },
  {
    name: 'Soroban Smart Contracts',
    icon: <ContractIcon />,
    path: PathRoute.SOROBAN_SMART_CONTRACTS,
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

export const Sidebar: React.FC<IProps> = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Box>
      <Header onOpen={onOpen} />
      <SidebarContent
        items={linkItems}
        onClose={(): void => onClose()}
        display={{ base: 'none', md: 'block' }}
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
          <SidebarContent items={linkItems} onClose={onClose} />
        </DrawerContent>
      </Drawer>
      <Box ml={{ base: 0, md: 60 }} p="4" data-testid="sidebar-overlay">
        {children}
      </Box>
    </Box>
  )
}
