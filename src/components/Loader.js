import React, { useState, useEffect } from 'react'
import logo from '../images/favicon.png'

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
    backgroundColor: isMounted ? 'black' : 'black',
    zIndex: '10',
    transition: 'all 0.5s ease',
  }

  const logoStyle = {
    position:'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: '150px'
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
