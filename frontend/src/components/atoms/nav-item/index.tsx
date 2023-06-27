import { Flex, FlexProps, Link } from '@chakra-ui/react'
import { ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

interface INavItemProps extends FlexProps {
  icon: ReactNode
  children: ReactNode
  path: string
}
export const NavItem: React.FC<INavItemProps> = ({
  icon,
  path,
  children,
  ...rest
}: INavItemProps) => {
  const navigate = useNavigate()
  const location = useLocation()

  const isCurrent = (): boolean => {
    return location.pathname === path
  }

  return (
    <Link
      onClick={(): void => {
        navigate(path)
      }}
      style={{ textDecoration: 'none', color: 'white', fontSize: 'sm' }}
      _focus={{ boxShadow: 'none' }}
    >
      <Flex
        align="center"
        cursor="pointer"
        fontSize="sm"
        mb={2}
        fontWeight={400}
        color={isCurrent() ? 'black' : 'gray.900'}
        _dark={isCurrent() ? { color: 'white' } : { color: 'gray.900' }}
        _hover={{
          cursor: 'pointer',
        }}
        pl="2rem"
        py="0.375rem"
        {...rest}
      >
        {icon && (
          <Flex
            fontSize="6"
            width="2rem"
            fill={isCurrent() ? 'black' : 'gray.900'}
            _dark={isCurrent() ? { fill: 'white' } : { fill: 'gray.900' }}
          >
            {icon}
          </Flex>
        )}
        {children}
      </Flex>
    </Link>
  )
}
