export const toCurrency = (value: number): string => {
  const formatter = new Intl.NumberFormat('en-US')
  return formatter.format(value)
}

export const toCrypto = (
  value: number | undefined,
  prefix?: string,
  convertStroops?: boolean
): string => {
  if (value && convertStroops) {
    value = value / 10000000
  }

  const moneyFormatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 7,
  })
  const formatted = moneyFormatter.format(value || 0)

  return prefix ? `${prefix} ${formatted}` : formatted
}

export const formatDateMY = (date: string): string => {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
  })

  return formattedDate
}

export const formatDateMD = (date: string): string => {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
  })

  return formattedDate
}

export const formatHour = (date: string): string => {
  const formattedDate = new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
  })

  return formattedDate
}

export const formatDateY = (date: string): string => {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
  })

  return formattedDate
}

export const formatDateFull = (date: string): string => {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })

  return formattedDate
}

export const formatDateFullClean = (date: string): string => {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })

  return formattedDate
}

export const formatAccount = (
  account: string,
  wallet?: string,
  distributor?: string
): string => {
  if (wallet && distributor && wallet === distributor) {
    return 'Main vault'
  }
  return `${account.substring(0, 4)}...${account.substring(
    account.length - 4,
    account.length
  )}`
}

export const toNumber = (number: string): string => {
  return number.replaceAll(',', '')
}

export const toFixedCrypto = (amount: string): string => {
  return Number(amount).toFixed(7)
}

export const formatName = (name: string): string => {
  const words = name.split(' ')
  return `${words[0]} ${words.length > 1 ? `${words[1].substring(0, 1)}.` : ''}`
}

export const formatVaultName = (name: string): string => {
  const words = name.split(' ')
  return `${words[0]}${words.length > 1 ? `${words[1].substring(0, 1)}` : ''}`
}
