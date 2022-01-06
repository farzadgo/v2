import React, { useEffect, useState } from 'react'
import * as styles from '../styles/components/Spinner.module.css'


const Spinner = () => {

  const [message, setMessage] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setMessage(true)
    }, 30000);
    return () => clearTimeout(timer);
  }, [])

  return (
    <div className={styles.spinContainer}>
      { message === false ?
				<div className={styles.spinner}></div> :
				<div className={styles.message}>
					Model couldn't load, please continue to the website!
				</div>
			}
    </div>
  )
}

export default Spinner