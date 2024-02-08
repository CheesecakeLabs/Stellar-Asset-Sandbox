import { ChakraProvider } from '@chakra-ui/react'
import ReactGA from 'react-ga4'

import { AppProvider } from 'hooks'

import { Survey } from 'components/organisms/survey'

import { CoreRouter } from 'app/core/routes'
import theme from 'config/theme'

import ErrorBoundary from './error-boundary'

ReactGA.initialize('G-BG0BH1YW4P')

const App = (): JSX.Element => (
  <ErrorBoundary displayMessage="Ooooppss... An unexpected error occured">
    <ChakraProvider theme={theme}>
      <AppProvider>
        <div>
          <Survey />
          <CoreRouter />
        </div>
      </AppProvider>
    </ChakraProvider>
  </ErrorBoundary>
)

export default App
