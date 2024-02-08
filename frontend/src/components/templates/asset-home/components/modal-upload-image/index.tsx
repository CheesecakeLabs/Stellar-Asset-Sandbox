import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react'
import React, { Dispatch, SetStateAction } from 'react'

import { UploadImage } from 'components/molecules/upload-image'

interface IModalUploadImage {
  isOpen: boolean
  loading: boolean
  selectedFile: File | null
  handleUploadImage(): Promise<boolean>
  onClose(): void
  setSelectedFile: Dispatch<SetStateAction<File | null>>
}

export const ModalUploadImage: React.FC<IModalUploadImage> = ({
  isOpen,
  loading,
  selectedFile,
  handleUploadImage,
  onClose,
  setSelectedFile,
}) => {
  const onSubmit = (): void => {
    handleUploadImage().then(isSuccess => {
      if (isSuccess) {
        onClose()
      }
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit asset logo</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex justifyContent="center">
            <UploadImage
              setSelectedFile={setSelectedFile}
              selectedFile={selectedFile}
            />
          </Flex>
          <Button
            w="full"
            mb="1.5rem"
            type="submit"
            variant="primary"
            mt="2rem"
            isLoading={loading}
            onClick={onSubmit}
            isDisabled={!selectedFile}
          >
            Update logo
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
