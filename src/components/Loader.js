import React, { useEffect } from 'react'

const Loader = ({ finishLoading }) => {

  const style = {
    position: 'fixed',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    backgroundColor: 'tomato',
    zIndex: '10',
    transition: 'all 0.6s ease',
  }

  useEffect(() => {
    const timeout = setTimeout(() => finishLoading(), 1000)
    return () => clearTimeout(timeout)
  }, [finishLoading])

  return (
    <div style={style}></div>
  )
}

export default Loader