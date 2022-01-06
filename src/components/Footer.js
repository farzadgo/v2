import React, { useEffect, useState } from 'react'
import * as styles from '../styles/components/Footer.module.css'
import { colors, sizes } from '../config'


const Footer = ({ info }) => {

  const { directory, workTitle } = info
  const [home, setHome] = useState(false)

  const style = {
    display: home ? 'none' : 'flex',
    height: sizes.navHeight,
    backgroundColor: colors.darkGray,
    color: colors.lightWhite,
  }

  useEffect(() => {
    if (!workTitle && !directory) {
      setHome(true)
    }
  }, [workTitle, directory])

  return (
    <footer className={styles.footer} style={style}>
      <p className={styles.note}> Designed /developed by Farzad Golghasemi - 2021 </p>
    </footer>
  )
}

export default Footer
