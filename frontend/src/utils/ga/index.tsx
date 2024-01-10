import ReactGA from 'react-ga4'

const GAPageView = (title: string): void => {
  ReactGA.initialize('G-BG0BH1YW4P')
  ReactGA.send({
    hitType: 'pageview',
    page: `v2-${window.location.pathname + window.location.search}`,
    title: title,
  })
}

const GAEvent = (action: string): void => {
  ReactGA.initialize('G-BG0BH1YW4P')
  ReactGA.event({
    category: 'click',
    action: action,
  })
}

export const GAService = {
  GAPageView,
  GAEvent,
}
