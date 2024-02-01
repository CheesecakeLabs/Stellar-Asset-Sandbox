import {
  Button,
  ButtonGroup,
  Flex,
  FocusLock,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Popover,
  PopoverArrow,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Stack,
  Tag,
  Text,
  useDisclosure,
  useMediaQuery,
} from '@chakra-ui/react'
import React, { useState } from 'react'

import { vaultCategoryTheme } from 'utils/constants/constants'

import { ChevronDownIcon, EditIcon } from 'components/icons'
import { IOption } from 'components/templates/vault-create'
import { SelectCategory } from 'components/templates/vault-create/select-category'

interface IHeader {
  vault: Hooks.UseVaultsTypes.IVault
  vaultCategories: Hooks.UseVaultsTypes.IVaultCategory[] | undefined
  category: Hooks.UseVaultsTypes.IVaultCategory | undefined
  updatingVault: boolean
  deletingVault: boolean
  createVaultCategory(
    vaultCategory: Hooks.UseVaultsTypes.IVaultCategoryRequest
  ): Promise<Hooks.UseVaultsTypes.IVaultCategory | undefined>
  onUpdateVault(params: Hooks.UseVaultsTypes.IVaultUpdateParams): Promise<void>
  onCancel?(): void
  onDeleteVault(): Promise<void>
}

const Form: React.FC<IHeader> = ({
  vaultCategories,
  vault,
  category,
  updatingVault,
  onCancel,
  createVaultCategory,
  onUpdateVault,
}) => {
  const [categorySelected, setCategorySelected] = useState<
    IOption | null | undefined
  >(category && { label: category?.name, value: category?.id, disabled: false })

  const [name, setName] = useState<string | undefined>(vault.name)

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
  deletingVault,
  createVaultCategory,
  onUpdateVault,
  onDeleteVault,
}) => {
  const { onOpen, onClose, isOpen } = useDisclosure()
  const {
    isOpen: isOpenModal,
    onOpen: onOpenModal,
    onClose: onCloseModal,
  } = useDisclosure()
  const firstFieldRef = React.useRef(null)
  const [isLargerThanSm] = useMediaQuery('(min-width: 480px)')

  return (
    <>
      <Modal isOpen={isOpenModal} onClose={onCloseModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Vault {vault.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Are you sure you want to delete this vault?</ModalBody>

          <ModalFooter>
            <Button variant="secondary" mr={3} onClick={onCloseModal}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={onDeleteVault}
              isLoading={deletingVault}
            >
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Flex w="full" justifyContent="space-between" alignItems="center" mb="1.5rem">
        <Flex alignItems="center">
          <Text fontSize={isLargerThanSm ? '2xl' : 'lg'} fontWeight="400">
            {vault.name}
          </Text>
          <Tag
            variant={vault.vault_category?.theme || vaultCategoryTheme[0]}
            ms="1rem"
            me="0.25rem"
            textAlign="center"
            fontSize="xs"
            fontWeight="700"
            w="fit-content"
          >
            {vault.vault_category?.name || 'Wallet'}
          </Tag>
          <Popover
            isOpen={isOpen}
            initialFocusRef={firstFieldRef}
            closeOnBlur={false}
            onOpen={onOpen}
            onClose={onClose}
          >
            <PopoverTrigger>
              <IconButton size="sm" icon={<EditIcon />} aria-label="Edit" />
            </PopoverTrigger>
            <PopoverContent p={5} _dark={{ bg: 'black.700' }}>
              <FocusLock persistentFocus={false}>
                <PopoverArrow />
                <PopoverCloseButton />
                <Form
                  vaultCategories={vaultCategories}
                  vault={vault}
                  category={category}
                  updatingVault={updatingVault}
                  deletingVault={deletingVault}
                  onCancel={onClose}
                  createVaultCategory={createVaultCategory}
                  onDeleteVault={onDeleteVault}
                  onUpdateVault={onUpdateVault}
                />
              </FocusLock>
            </PopoverContent>
          </Popover>
        </Flex>
        {!vault.owner_id && (
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<ChevronDownIcon />}
              fontSize="sm"
              _dark={{ fill: 'white' }}
            >
              Actions
            </MenuButton>
            <MenuList>
              <MenuItem onClick={onOpenModal}>Delete Vault</MenuItem>
            </MenuList>
          </Menu>
        )}
      </Flex>
    </>
  )
}
