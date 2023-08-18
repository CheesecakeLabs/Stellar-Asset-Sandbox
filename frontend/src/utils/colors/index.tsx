import { vaultCategoryTheme } from 'utils/constants/constants';


export const getVaultCategoryTheme = (
  categories: Hooks.UseVaultsTypes.IVaultCategory[] | undefined
): string => {
  if (!categories) return vaultCategoryTheme[0]
  const countCategories = categories.length

  if (countCategories < vaultCategoryTheme.length) {
    return vaultCategoryTheme[countCategories]
  }

  return vaultCategoryTheme[countCategories % vaultCategoryTheme.length]
}