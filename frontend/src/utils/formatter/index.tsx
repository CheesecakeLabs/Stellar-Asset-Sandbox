export const toCurrency = (value: number): string => {
  const formatter = new Intl.NumberFormat('en-US')
  return formatter.format(value)
}

export const toCrypto = (value?: number, prefix?: string): string => {
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

export const formatAccount = (account: string): string => {
  return `${account.substring(0, 4)}...${account.substring(
    account.length - 4,
    account.length
  )}`
}

export const toNumber = (number: string): string => {
  return number.replaceAll(',', '')
}
