export const toCurrency = (value: number): string => {
  const formatter = new Intl.NumberFormat('en-US')
  return formatter.format(value)
}

export const toCrypto = (value?: number, prefix?: string): string => {
  const moneyFormatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 3,
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

export const formatDateY = (date: string): string => {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
  })

  return formattedDate
}
