const LOCAL_STORAGE_KEY = 'survey-answer10'

const addAnswer = (answer: string): void => {
  localStorage.setItem(LOCAL_STORAGE_KEY, answer)
}

const clearAnswer = (): void => {
  return localStorage.removeItem(LOCAL_STORAGE_KEY)
}

const isAnswered = (): boolean => {
  return localStorage.getItem(LOCAL_STORAGE_KEY) != undefined
}

const SurveyStore = {
  addAnswer,
  clearAnswer,
  isAnswered,
}

export default SurveyStore
