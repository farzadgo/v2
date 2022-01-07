import React, { useEffect, useState } from 'react'
import { colors, sizes } from '../config'


const Footer = ({ info }) => {

  const { directory, workTitle } = info
  const [home, setHome] = useState(false)

  const footStyle = {
    display: home ? 'none' : 'flex',
    height: sizes.navHeight,
    backgroundColor: colors.darkGray,
    color: colors.lightWhite,
    alignItems: 'center',
    padding: '0 var(--gap)',
    fontFamily: 'var(--code-font)',
    fontWeight: 300,
    fontSize: 'var(--font-sm)',
  }

  const noteStyle = {
    whiteSpace: 'nowrap',
    overflow: 'hidden'
  }

  useEffect(() => {
    if (!workTitle && !directory) {
      setHome(true)
    }
  }, [workTitle, directory])

  return (
    <footer style={footStyle}>
      <p style={noteStyle}> Designed /developed by Farzad Golghasemi - 2021 </p>
    </footer>
  )
}

export default Footer
