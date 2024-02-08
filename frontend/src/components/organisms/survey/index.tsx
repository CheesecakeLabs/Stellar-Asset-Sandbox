import { Box, Button, useMediaQuery } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { Clipboard } from 'react-feather'

import SurveyStore from 'utils/survey'

export interface ISubmissionPayload {
  id: string
  respondentId: string
  formId: string
  formName: string
  createdAt: Date
}

export const Survey: React.FC = () => {
  const [showSurvey, setShowSurvey] = useState(!SurveyStore.isAnswered())
  const [isLargerThanMd] = useMediaQuery('(min-width: 768px)')

  function isJsonString(str: string): boolean {
    try {
      JSON.parse(str)
    } catch (e) {
      return false
    }
    return true
  }

  useEffect(() => {
    window.addEventListener('message', (e): void => {
      if (typeof e?.data === 'string' && isJsonString(e?.data)) {
        const data = JSON.parse(e?.data)

        if (data.event === 'Tally.FormSubmitted') {
          SurveyStore.addAnswer(data.payload)
          setShowSurvey(false)
        }
      }
    })
  }, [])

  return (
    <Box position="fixed" bottom="0" right="0" m={6} zIndex="9999">
      {showSurvey && (
        <Button
          variant="primary"
          bg="purple.500"
          boxShadow="lower"
          borderRadius="full"
          fontWeight="semibold"
          data-tally-open="wzYj21"
          data-tally-width="380"
          iconSpacing={isLargerThanMd ? '0.5rem' : '0'}
          leftIcon={<Clipboard size="16px" color="white" />}
        >
          {isLargerThanMd ? 'Asset Sandbox Survey' : ''}
        </Button>
      )}
    </Box>
  )
}
