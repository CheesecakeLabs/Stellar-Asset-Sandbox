import {
  Button,
  ButtonGroup,
  Flex,
  FocusLock,
  IconButton,
  Input,
  Popover,
  PopoverArrow,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Stack,
  Tag,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import React, { useState } from 'react'

import { EditIcon } from 'components/icons'
import { IOption } from 'components/templates/vault-create'
import { SelectCategory } from 'components/templates/vault-create/select-category'

interface IHeader {
  vault: Hooks.UseVaultsTypes.IVault
  vaultCategories: Hooks.UseVaultsTypes.IVaultCategory[] | undefined
  category: Hooks.UseVaultsTypes.IVaultCategory | undefined
  updatingVault: boolean
  createVaultCategory(
    vaultCategory: Hooks.UseVaultsTypes.IVaultCategoryRequest
  ): Promise<Hooks.UseVaultsTypes.IVaultCategory | undefined>
  onUpdateVault(params: Hooks.UseVaultsTypes.IVaultUpdateParams): Promise<void>
  onCancel?(): void
}

const Form: React.FC<IHeader> = ({
  onCancel,
  createVaultCategory,
  onUpdateVault,
  vaultCategories,
  vault,
  category,
  updatingVault,
}) => {
  const [categorySelected, setCategorySelected] = useState<
    IOption | null | undefined
  >(category && { label: category?.name, value: category?.id })

  const [name, setName] = useState<string | undefined>(category?.name)

  const onSubmit = (): void => {
    if (!name || !categorySelected) return

    onUpdateVault({
      name: name,
      vault_category_id: categorySelected?.value,
    })
  }

  return (
    <Stack spacing={4} zIndex={100}>
      <Input
        id="name"
        defaultValue={vault.name}
        placeholder="Name"
        onChange={(event): void => setName(event.target.value)}
        mt="1rem"
      />
      <SelectCategory
        vaultCategories={vaultCategories}
        createVaultCategory={createVaultCategory}
        setCategorySelected={setCategorySelected}
        categorySelected={categorySelected}
      />
      <ButtonGroup display="flex" justifyContent="flex-end">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={onSubmit}
          isDisabled={!name || !categorySelected}
          isLoading={updatingVault}
        >
          Save
        </Button>
      </ButtonGroup>
    </Stack>
  )
}

export const Header: React.FC<IHeader> = ({
  vault,
  vaultCategories,
  category,
  updatingVault,
  createVaultCategory,
  onUpdateVault,
}) => {
  const { onOpen, onClose, isOpen } = useDisclosure()
  const firstFieldRef = React.useRef(null)

  const tagColors = ['blue_sky', 'purple_powder', 'blue_moonstone']

  return (
    <>
      <Flex alignItems="center" mb="1.5rem">
        <Text fontSize="2xl" fontWeight="400">
          {vault.name}
        </Text>
        <Tag
          variant={
            vault.vault_category.id > tagColors.length
              ? tagColors[vault.vault_category.id / tagColors.length]
              : tagColors[vault.vault_category.id % 2] || 'black'
          }
          ms="1rem"
          me="0.25rem"
          textAlign="center"
          fontSize="xs"
          fontWeight="700"
          w="fit-content"
        >
          {vault.vault_category.name}
        </Tag>
        <Popover
          isOpen={isOpen}
          initialFocusRef={firstFieldRef}
          onOpen={onOpen}
          onClose={onClose}
          closeOnBlur={false}
        >
          <PopoverTrigger>
            <IconButton size="sm" icon={<EditIcon />} aria-label="Edit" />
          </PopoverTrigger>
          <PopoverContent p={5}>
            <FocusLock persistentFocus={false}>
              <PopoverArrow />
              <PopoverCloseButton />
              <Form
                onCancel={onClose}
                createVaultCategory={createVaultCategory}
                vaultCategories={vaultCategories}
                vault={vault}
                category={category}
                onUpdateVault={onUpdateVault}
                updatingVault={updatingVault}
              />
            </FocusLock>
          </PopoverContent>
        </Popover>
      </Flex>
    </>
  )
}
