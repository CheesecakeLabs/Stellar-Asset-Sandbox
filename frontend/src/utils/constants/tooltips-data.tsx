export const TooltipsData = {
  limit:
    'This specifies the maximum amount of minted supply the distribution account (main vault) can hold at any given time. It determines the capacity of the asset management to distribute this asset to other vaults and accounts. When not defined, it assumes the maximum limit.',
  totalSupply:
    'Represents the total amount of this asset that has been minted and is currently in circulation.',
  mainVault:
    ' All newly minted tokens are added to, and all burned tokens are removed from, this account. Managed exclusively by the asset manager, it serves the primary purpose of regulating the circulating supply of the asset.',
  mint: 'Amount of tokens that will be created, increasing the circulating supply. All minted tokens are directly sent to the main vault.',
  burn: 'Amount of tokens that will be permanently removed, reducing the circulating supply. All burned tokens are taken directly from the main vault.',
  distribute:
    'This indicates how much of the asset is currently available in the main vault compared to the entire circulating supply . It serves as a reference when distributing tokens from the main vault to other vaults or accounts.',
  yieldRate:
    "For simple interest, the yield rate is applicable per term, whereas for compound interest, it's determined per compound interval.",
  penaltyRate:
    'Calculated as a percentage over the yield, this fee applies when redeeming before the agreed maturity date',
}
