import {
  Alert,
  AlertIcon,
  Button,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  Text,
  Tooltip,
  useColorMode,
} from '@chakra-ui/react'
import React, { Dispatch, SetStateAction, useState } from 'react'
import { FieldValues, UseFormSetValue, useForm } from 'react-hook-form'
import Joyride, { CallBackProps, STATUS } from 'react-joyride'
import { NumericFormat } from 'react-number-format'

import { assetFlags, typesAsset } from 'utils/constants/data-constants'
import { MAX_PAGE_WIDTH } from 'utils/constants/sizes'
import { TooltipsData } from 'utils/constants/tooltips-data'
import { toNumber } from 'utils/formatter'

import { UploadImage } from './components/upload-image'
import { RadioCard } from 'components/atoms'
import { HelpIcon } from 'components/icons'

interface IForgeAssetTemplate {
  onSubmit(
    data: FieldValues,
    setValue: UseFormSetValue<FieldValues>
  ): Promise<void>
  setSelectedFile: Dispatch<SetStateAction<File | null>>
  loading: boolean
  selectedFile: File | null
}

export const ForgeAssetTemplate: React.FC<IForgeAssetTemplate> = ({
  onSubmit,
  setSelectedFile,
  loading,
  selectedFile,
}) => {
  const [errorSubmit] = useState<string | null>(null)
  const [runTour, setRunTour] = useState(false)
  const { colorMode } = useColorMode()
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    getValues,
  } = useForm()

  const handleJoyrideCallback = (data: CallBackProps): void => {
    const { status } = data
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED]

    if (finishedStatuses.includes(status)) {
      setRunTour(false)
    }
  }

  const steps = [
    {
      target: '.asset-name',
      content: 'This will be the name of your token, for example "USD Coin".',
      disableBeacon: true,
    },
    {
      target: '.asset-code',
      content: 'This will be your token code, for example "USDC".',
      disableBeacon: true,
    },
  ]

  return (
    <>
      <Joyride
        steps={steps}
        continuous
        run={runTour}
        showProgress
        showSkipButton
        hideCloseButton
        callback={handleJoyrideCallback}
        styles={{
          options: {
            arrowColor: colorMode === 'light' ? 'white' : '#3a3e4d',
            backgroundColor: colorMode === 'light' ? 'white' : '#3a3e4d',
            primaryColor: '#6E56CF',
            textColor: colorMode === 'light' ? '#004a14' : 'white',
            zIndex: 10000,
          },
        }}
      />
      <Flex flexDir="column" w="full">
        <Flex
          maxW={MAX_PAGE_WIDTH}
          alignSelf="center"
          flexDir="column"
          w="full"
        >
          <Flex justifyContent="space-between" alignItems="center">
            <Text fontSize="2xl" fontWeight="400" mb="1.5rem">
              Forge Asset
            </Text>
            {/*<Button
              variant="secondary"
              onClick={(): void => {
                setRunTour(true)
              }}
            >
              Help to create my first asset
            </Button>*/}
          </Flex>
          {errorSubmit && (
            <Alert mb="0.75rem" status="error">
              <AlertIcon />
              {errorSubmit}
            </Alert>
          )}
          <Container
            variant="primary"
            justifyContent="center"
            p="2rem"
            w="full"
            maxW="full"
          >
            <form
              onSubmit={handleSubmit(data => {
                onSubmit(data, setValue)
              })}
            >
              <Flex>
                <Flex flexDir="column" mr="1rem">
                  <Flex justifyContent="space-between" alignItems="center">
                    <FormLabel>Asset Icon</FormLabel>
                    {selectedFile && (
                      <Button
                        variant="secondary"
                        h="fit-content"
                        p="0.15rem"
                        fontSize="xs"
                        mr="1.5rem"
                        onClick={(): void => {
                          setSelectedFile(null)
                        }}
                      >
                        Remove
                      </Button>
                    )}
                  </Flex>
                  <UploadImage
                    setSelectedFile={setSelectedFile}
                    selectedFile={selectedFile}
                  />
                </Flex>
                <Flex flexDir="column" w="full">
                  <FormControl isInvalid={errors?.name !== undefined}>
                    <FormLabel>Asset name</FormLabel>
                    <Input
                      type="text"
                      placeholder="Asset name"
                      autoComplete="off"
                      {...register('name', {
                        required: true,
                        minLength: 3,
                      })}
                      className="asset-name"
                    />
                    <FormErrorMessage>
                      Name must be more than 2 characters
                    </FormErrorMessage>
                  </FormControl>

                  <Flex
                    flexDir={{ md: 'row', base: 'column' }}
                    gap="1.5rem"
                    mt="1.5rem"
                  >
                    <FormControl isInvalid={errors?.code !== undefined}>
                      <FormLabel>Code</FormLabel>
                      <Input
                        type="text"
                        placeholder="Code"
                        autoComplete="off"
                        {...register('code', {
                          required: true,
                          minLength: 3,
                          maxLength: 12,
                        })}
                        className="asset-code"
                      />
                      <FormErrorMessage>
                        Code must be 3 characters
                      </FormErrorMessage>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Initial supply</FormLabel>
                      <Input
                        as={NumericFormat}
                        decimalScale={7}
                        thousandSeparator=","
                        placeholder="Initial supply"
                        autoComplete="off"
                        value={getValues('initial_supply')}
                        onChange={(event): void => {
                          setValue(
                            'initial_supply',
                            toNumber(event.target.value)
                          )
                        }}
                      />
                    </FormControl>
                  </Flex>

                  <Flex
                    flexDir={{ md: 'row', base: 'column' }}
                    gap="1.5rem"
                    mt="1.5rem"
                  >
                    <FormControl>
                      <FormLabel>
                        <Flex gap={1} alignItems="center">
                          {`Limit (optional)`}
                          <Tooltip label={TooltipsData.limit}>
                            <HelpIcon width="20px" />
                          </Tooltip>
                        </Flex>
                      </FormLabel>
                      <Input
                        as={NumericFormat}
                        decimalScale={7}
                        thousandSeparator=","
                        placeholder="Limit"
                        autoComplete="off"
                        value={getValues('initilimital_supply')}
                        onChange={(event): void => {
                          setValue('limit', toNumber(event.target.value))
                        }}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Asset type</FormLabel>
                      <Select
                        {...register('asset_type', { required: true })}
                        defaultValue={typesAsset[0].id}
                      >
                        {typesAsset.map(typeAsset => (
                          <option value={typeAsset.id}>{typeAsset.name}</option>
                        ))}
                      </Select>
                    </FormControl>
                  </Flex>
                </Flex>
              </Flex>

              <FormControl>
                <FormLabel mt="1.5rem">Control mechanisms</FormLabel>
                <Flex flexDir="column">
                  {assetFlags.map(assetFlag => (
                    <RadioCard
                      register={register}
                      title={assetFlag.title}
                      description={assetFlag.description}
                      value={assetFlag.flag}
                      isDisabled={assetFlag.isDisabled}
                      link={assetFlag.link}
                      isComing={assetFlag.isComing}
                    />
                  ))}
                </Flex>
              </FormControl>

              <Flex justifyContent="flex-end">
                <Button
                  type="submit"
                  variant="primary"
                  mt="1.5rem"
                  isLoading={loading}
                >
                  Forge asset
                </Button>
              </Flex>
            </form>
          </Container>
        </Flex>
      </Flex>
    </>
  )
}
