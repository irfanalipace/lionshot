import React, { useState } from 'react'
import MUIButton from '../../../Components/Button/MUIButton'
import Modal from '../../../Components/Modal/Dialog'

const PayNow = () => {
  const[openPay , setOpenPay] = useState(false)
  const handlePay = () => {
    setOpenPay(!openPay)
  } 
  return (
    <>
        <MUIButton size='large' onClick={handlePay}>Pay Now</MUIButton>
        <Modal title='Payment' open={openPay} onClose={handlePay}>

        </Modal>
    </>

  )
}

export default PayNow