import { ChakraProvider } from '@chakra-ui/react'

import { AppProvider } from 'hooks'

import { CoreRouter } from 'app/core/routes'

import ErrorBoundary from './error-boundary'
import theme from 'config/theme'

const App = (): JSX.Element => (
  <ErrorBoundary displayMessage="Ooooppss... An unexpected error occured">
    <ChakraProvider theme={theme}>
      <AppProvider>
        <CoreRouter />
      </AppProvider>
    </ChakraProvider>
  </ErrorBoundary>
)

export default App
