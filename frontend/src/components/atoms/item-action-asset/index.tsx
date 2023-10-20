import { Button, Flex, useMediaQuery } from '@chakra-ui/react'
import React, { ReactNode } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

interface IItemActionAsset {
  isCurrentAction: boolean
  havePermission: boolean
  title: string
  path: string
  icon: ReactNode
  borderTopRadius?: string
}

export const ItemActionAsset: React.FC<IItemActionAsset> = ({
  isCurrentAction,
  havePermission,
  title,
  path,
  icon,
  borderTopRadius = 'none',
}) => {
  const navigate = useNavigate()
  const [isLargerThanMd] = useMediaQuery('(min-width: 768px)')
  const { id } = useParams()

  return (
    <>
      {havePermission && (
        <Button
          variant={isCurrentAction ? 'menuButtonSelected' : 'menuButton'}
          borderTopRadius={borderTopRadius}
          leftIcon={
            isLargerThanMd ? (
              <Flex w="1rem" justifyContent="center">
                {icon}
              </Flex>
            ) : undefined
          }
          isDisabled={!id}
          onClick={(): void => {
            navigate(path)
          }}
        >
          {isLargerThanMd ? (
            title
          ) : (
            <Flex w="full" justifyContent="center">
              {icon}
            </Flex>
          )}
        </Button>
      )}
    </>
  )
}
