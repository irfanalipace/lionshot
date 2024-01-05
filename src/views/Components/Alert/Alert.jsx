import React from 'react'
import { Alert } from "@mui/material"

export default function Alert({children, ...otherProps}) {
  return (
    <Alert {...otherProps}>{children}</Alert>
  )
}
