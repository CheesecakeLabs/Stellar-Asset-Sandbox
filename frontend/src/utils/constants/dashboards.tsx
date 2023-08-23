import { formatDateMD } from 'utils/formatter'

import { TChartPeriod } from 'components/molecules/chart-period'

export const getChartLabels = (type: '24h' | '7d' | '30d'): string[] => {
  let labels: string[] = []

  if (type === '24h') {
    const date = new Date()
    date.setHours(new Date().getHours() - 24)

    labels = Array(24)
      .fill(0)
      .map(() => {
        date.setHours(date.getHours() + 1)
        return date.getHours().toString()
      })
  }

  if (type === '7d') {
    const date = new Date()
    date.setDate(new Date().getDate() - 7)

    labels = Array(7)
      .fill(0)
      .map(() => {
        date.setDate(date.getDate() + 1)
        return formatDateMD(date.toString())
      })
  }

  if (type === '30d') {
    const date = new Date()
    date.setDate(new Date().getDate() - 30)

    labels = Array(30)
      .fill(0)
      .map(() => {
        date.setDate(date.getDate() + 1)
        return formatDateMD(date.toString())
      })
  }

  return labels
}

export const isEqualLabel = (
  period: TChartPeriod,
  date: string,
  label: string
): boolean => {
  if (period === '24h') {
    return new Date(date).getHours().toString() === label
  }
  return formatDateMD(date) === label
}
