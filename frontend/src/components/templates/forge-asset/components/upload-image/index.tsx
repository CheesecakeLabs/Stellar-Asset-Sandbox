import { Box, Container, Heading, Input, Stack, Text } from '@chakra-ui/react'
import { Dispatch, SetStateAction } from 'react'

import { motion, useAnimation } from 'framer-motion'

import { CoinIcon } from 'components/icons'

interface IUploadImage {
  selectedFile: File | null
  setSelectedFile: Dispatch<SetStateAction<File | null>>
}

export const UploadImage: React.FC<IUploadImage> = ({
  selectedFile,
  setSelectedFile,
}) => {
  const controls = useAnimation()
  const startAnimation = (): Promise<unknown> => controls.start('hover')
  const stopAnimation = (): void => controls.stop()
  return (
    <Container my="12" w="240px" m="0" mr="1.5rem" p="0">
      <Box
        borderColor="gray.300"
        borderStyle="dashed"
        borderWidth="1px"
        rounded="md"
        shadow="sm"
        role="group"
        transition="all 150ms ease-in-out"
        _hover={{
          shadow: 'md',
        }}
        as={motion.div}
        initial="rest"
        animate="rest"
        whileHover="hover"
      >
        <Box height="100%" width="100%" position="relative">
          <Box height="100%" width="100%" display="flex" flexDirection="column">
            <Stack
              height="100%"
              width="100%"
              display="flex"
              alignItems="center"
              justify="center"
              spacing="4"
            >
              {selectedFile ? (
                <Box
                  height="64px"
                  width="64px"
                  borderWidth="1px"
                  borderStyle="solid"
                  rounded="sm"
                  borderColor="gray.400"
                  as={motion.div}
                  backgroundSize="cover"
                  backgroundRepeat="no-repeat"
                  backgroundPosition="center"
                  mt="1rem"
                  backgroundImage={URL.createObjectURL(selectedFile)}
                />
              ) : (
                <Box
                  w="64px"
                  fill="black"
                  stroke="black"
                  borderWidth="1px"
                  borderStyle="solid"
                  mt="1rem"
                  _dark={{ fill: 'white', stroke: 'white' }}
                >
                  <CoinIcon />
                </Box>
              )}
              <Stack textAlign="center" spacing="1" mb="1rem">
                <Heading fontSize="sm" color="gray.700" fontWeight="bold">
                  Drop image here
                </Heading>
                <Text fontWeight="light" fontSize="sm">
                  or click to upload
                </Text>
              </Stack>
            </Stack>
          </Box>
          <Input
            type="file"
            height="100%"
            width="100%"
            position="absolute"
            top="0"
            left="0"
            opacity="0"
            aria-hidden="true"
            accept="image/*"
            onDragEnter={startAnimation}
            onDragLeave={stopAnimation}
            onChange={(e): void =>
              setSelectedFile(e.target?.files ? e.target?.files[0] : null)
            }
          />
        </Box>
      </Box>
    </Container>
  )
}
