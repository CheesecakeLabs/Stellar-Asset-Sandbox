import { Stack, Input, ButtonGroup, Button } from '@chakra-ui/react'
import { useState } from 'react'

interface IProps {
  asset: Hooks.UseAssetsTypes.IAssetDto
  updatingAsset: boolean
  handleUpdate(name: string, code: string): void
  onClose(): void
}

export const FormEditAsset: React.FC<IProps> = ({
  asset,
  updatingAsset,
  handleUpdate,
  onClose,
}) => {
  const [name, setName] = useState<string | undefined>(asset.name)
  const [code, setCode] = useState<string | undefined>(asset.code)

  const onSubmit = (): void => {
    if (!name || !code) return

    handleUpdate(name, code)
  }

  return (
    <Stack spacing={4} zIndex={100}>
      <Input
        id="name"
        defaultValue={asset.name}
        placeholder="Name"
        onChange={(event): void => setName(event.target.value)}
        mt="1rem"
      />
      <Input
        id="code"
        defaultValue={asset.code}
        placeholder="Code"
        onChange={(event): void => setCode(event.target.value)}
      />
      <ButtonGroup display="flex" justifyContent="flex-end">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={onSubmit}
          isDisabled={!name || !code}
          isLoading={updatingAsset}
        >
          Save
        </Button>
      </ButtonGroup>
    </Stack>
  )
}
