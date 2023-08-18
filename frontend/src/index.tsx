import { ColorModeScript } from '@chakra-ui/react'
import React from 'react'
import { createRoot } from 'react-dom/client'

import reportWebVitals from './config/reportWebVitals'
import App from 'app/core/App'
import theme from 'config/theme'

import './index.css'

const container = document.getElementById('root')
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!)
root.render(
  <>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <App />
  </>
)

reportWebVitals()
