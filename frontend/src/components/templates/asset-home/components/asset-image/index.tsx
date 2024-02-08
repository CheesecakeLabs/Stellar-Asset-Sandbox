import { Flex, Img, useDisclosure } from '@chakra-ui/react'
import React, { Dispatch, SetStateAction } from 'react'

import { getCurrencyIcon } from 'utils/constants/constants'

import { EditIcon } from 'components/icons'

import { ModalUploadImage } from '../modal-upload-image'

interface IAssetImage {
  asset: Hooks.UseAssetsTypes.IAssetDto
  havePermission: boolean
  selectedFile: File | null
  setSelectedFile: Dispatch<SetStateAction<File | null>>
  handleUploadImage(): Promise<boolean>
}

export const AssetImage: React.FC<IAssetImage> = ({
  asset,
  selectedFile,
  havePermission,
  setSelectedFile,
  handleUploadImage,
}) => {
  const { isOpen, onClose, onOpen } = useDisclosure()

  return (
    <>
      <ModalUploadImage
        isOpen={isOpen}
        loading={false}
        selectedFile={selectedFile}
        handleUploadImage={handleUploadImage}
        setSelectedFile={setSelectedFile}
        onClose={onClose}
      />
      <Flex me="1rem" pos="relative" w="62px" h="54px">
        <Flex
          gap="1rem"
          alignItems="center"
          fill="black"
          stroke="black"
          mt="6px"
          _dark={{ fill: 'white', stroke: 'white' }}
        >
          {asset.image ? (
            <Img src={asset.image} w="48px" h="48px" />
          ) : (
            getCurrencyIcon(asset.code, '2.5rem')
          )}
        </Flex>
        {havePermission && (
          <Flex
            pos="absolute"
            zIndex="100"
            cursor="pointer"
            w="full"
            h="full"
            justifyContent="flex-end"
            onClick={onOpen}
          >
            <Flex
              bg="gray.200"
              borderRadius="full"
              w="20px"
              h="20px"
              fill="black.600"
              _dark={{ fill: 'white', bg: 'black.800' }}
              justifyContent="center"
              alignItems="center"
            >
              <EditIcon width="12px" height="12px" />
            </Flex>
          </Flex>
        )}
      </Flex>
    </>
  )
}
