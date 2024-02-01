import { useColorMode } from '@chakra-ui/react'
import React from 'react'
import Chart from 'react-apexcharts'

interface IAccountsChart {
  authorized: number
  unauthorized: number
  authorizedLabel: string
  unauthorizedLabel: string
}

export const AccountsChart: React.FC<IAccountsChart> = ({
  authorized,
  unauthorized,
  authorizedLabel,
  unauthorizedLabel,
}) => {
  const { colorMode } = useColorMode()

  const series = [authorized, unauthorized]

  const options = {
    chart: {
      id: 'donut',
      foreColor: colorMode === 'dark' ? 'white' : 'black',
    },
    legend: {
      show: true,
      position: 'bottom' as 'top' | 'right' | 'bottom' | 'left',
    },
    labels: [authorizedLabel, unauthorizedLabel],
    colors: ['#195a63', '#f55025'],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: '200',
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
  }

  return (
    <Chart
      options={options}
      series={series}
      type="donut"
      width="100%"
      height="240px"
      data-testid="area-chart"
    />
  )
}
