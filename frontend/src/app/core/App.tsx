import { ChakraProvider } from '@chakra-ui/react'

import { AppProvider } from 'hooks'

import { CoreRouter } from 'app/core/routes'

import ErrorBoundary from './error-boundary'
import theme from 'config/theme'
import ReactGA from "react-ga4";

ReactGA.initialize("G-BG0BH1YW4P");

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
