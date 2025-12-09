import React from 'react'
import * as styles from '../styles/components/Menu.module.css'

const Spinner = ({ mobile }) => {
  if (mobile) return null
  return (
    <div className={styles.spinnerContainer}>
      <div className={styles.spinner}></div>
    </div>
  )
}

export default Spinner