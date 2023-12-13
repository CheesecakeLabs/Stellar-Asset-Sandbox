import { formatDateMD } from 'utils/formatter'

import { TChartPeriod } from 'components/molecules/chart-period'

export interface ITypeFilter {
  time_range: 'hour' | 'day'
  period_initial: string
  interval: string
}

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

export const filterChart = (period: TChartPeriod | undefined): ITypeFilter => {
  if (period === '24h') {
    return {
      time_range: 'hour',
      period_initial: '24 hours',
      interval: '1 hour',
    }
  }
  if (period === '7d') {
    return {
      time_range: 'day',
      period_initial: '7 days',
      interval: '1 day',
    }
  }
  return {
    time_range: 'day',
    period_initial: '30 day',
    interval: '1 day',
  }
}
