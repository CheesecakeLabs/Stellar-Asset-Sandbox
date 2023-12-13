import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Flex,
} from '@chakra-ui/react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import { PathRoute } from 'components/enums/path-route'
import { ChevronRight, ContractIcon } from 'components/icons'

interface IContractsBreadcrumb {
  title: string
}

export const ContractsBreadcrumb: React.FC<IContractsBreadcrumb> = ({
  title,
}) => {
  const navigate = useNavigate()

  return (
    <Flex h="3.5rem" alignItems="center">
      <Breadcrumb
        spacing="0.75rem"
        separator={<ChevronRight />}
        fontSize="sm"
        color="gray.900"
      >
        <BreadcrumbItem>
          <BreadcrumbLink
            onClick={(): void => {
              navigate(PathRoute.SOROBAN_SMART_CONTRACTS)
            }}
            flexDir="row"
            display="flex"
            alignItems="center"
            gap="0.5rem"
            fill="gray.650"
            _dark={{ fill: 'white' }}
          >
            <ContractIcon /> Smart Contracts
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>{title}</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
    </Flex>
  )
}
