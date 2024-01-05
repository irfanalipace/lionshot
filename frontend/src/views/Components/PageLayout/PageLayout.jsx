import {Box } from '@mui/material'
import React from 'react'

const PageLayout = ({children}) => {
  return (
    <Box padding='1rem'>
      {children}
    </Box>
  )
}

export default PageLayout