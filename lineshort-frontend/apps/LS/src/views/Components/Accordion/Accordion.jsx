import React from 'react'

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

export function Accordions({childeren , ...otherProps}) {
  return (
    <Accordion {...otherProps}> {childeren}</Accordion>
  )
}
export function AccordionSummarys({childeren , ...otherProps}) {
  return (
    <AccordionSummary {...otherProps}> {childeren}</AccordionSummary>
  )
}
export function AccordionDetails1({childeren , ...otherProps}) {
  return (
    <AccordionDetails {...otherProps}> {childeren}</AccordionDetails>
  )
}

