import { Box, Flex, FlexProps, Link } from '@chakra-ui/react'
import { ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const REQUESTS_PATH_PREFIX = '/requests/'
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
    return location.pathname.includes(REQUESTS_PATH_PREFIX) &&
      path.includes(REQUESTS_PATH_PREFIX)
      ? true
      : location.pathname === path
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
        p="4"
        cursor="pointer"
        fontSize="sm"
        mb={2}
        fontWeight={400}
        color={isCurrent() ? 'white' : 'purple.100'}
        _hover={{
          bg: 'purple.200',
          color: 'white',
          borderEndRadius: '4rem',
        }}
        me={4}
        borderColor={isCurrent() ? 'purple.150' : 'none'}
        borderEndRadius={isCurrent() ? '4rem' : 'none'}
        bg={isCurrent() ? 'purple.200' : 'none'}
        gap={4}
        {...rest}
      >
        {icon && (
          <Flex
            width="2.5rem"
            fontSize="6"
            color="white"
            _groupHover={{
              color: 'white',
            }}
            justifyContent="center"
          >
            {icon}
          </Flex>
        )}
        {children}
      </Flex>
    </Link>
  )
}
