import ReactGA from 'react-ga4'

const KEY = 'G-BG0BH1YW4P'

const GAPageView = (title: string): void => {
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    return
  }
  ReactGA.initialize(KEY)
  ReactGA.send({
    hitType: 'pageview',
    page: `v2-${window.location.pathname + window.location.search}`,
    title: title,
  })
}

const GAEvent = (action: string): void => {
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    return
  }
  ReactGA.initialize(KEY)
  ReactGA.event({
    category: 'click',
    action: action,
  })
}

export const GAService = {
  GAPageView,
  GAEvent,
}
