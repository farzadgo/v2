import React, { useEffect, useState } from 'react'
import * as styles from '../styles/components/Footer.module.css'
import GitHubButton from 'react-github-btn'


const Footer = ({ info }) => {

  const { directory, workTitle } = info
  const [home, setHome] = useState(false)
  const style = {
    display: home ? 'none' : 'flex',
  }

  useEffect(() => {
    if (!workTitle && !directory) {
      setHome(true)
    }
  }, [workTitle, directory])

  return (
    <footer className={styles.footer} style={style}>
      <p className={styles.note}> Designed & developed by Farzad Golghasemi </p>
      <GitHubButton href="https://github.com/farzadgo/v2" data-color-scheme="no-preference: dark; light: dark; dark: dark;" data-icon="octicon-star" data-size="large" data-show-count="true" aria-label="Star farzadgo/v2 on GitHub"></GitHubButton>
    </footer>
  )
}

export default Footer
