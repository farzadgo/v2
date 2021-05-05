import React, { useState, useEffect } from 'react'
import { colors } from '../config'
import logo from '../images/favicons/fagosemi_logo_192.png'

const Loader = ({ finishLoading }) => {

  const [isMounted, setIsMounted] = useState(false)

  // const animate = () => {
  //   setTimeout(() => finishLoading(), 2000)
  // }

  const style = {
    position: 'fixed',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    backgroundColor: isMounted ? 'black' : colors.darkGray,
    zIndex: '10',
    transition: 'all 0.5s ease',
  }

  const logoStyle = {
    position:'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
  }

  useEffect(() => {
    // setIsMounted(true)
    const timeout = setTimeout(() => setIsMounted(true), 10)
    const animate = () => {
      setTimeout(() => finishLoading(), 2000)
    }
    animate()
    return () => clearTimeout(timeout)
  }, [finishLoading])


  return (
    <div style={style}>
      <img src={logo} alt="Logo" style={logoStyle}/>
    </div>
  )
}

export default Loader
