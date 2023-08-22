export const getChartLabels = (type: '24h' | '7d' | '30d'): string[] => {
  let labels: string[] = []

  if (type === '24h') {
    labels = Array(24)
      .fill(0)
      .map((_, i) => {
        return i.toString()
      })
  }

  return labels
}
