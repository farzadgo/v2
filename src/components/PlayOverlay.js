import React, { useState, useEffect } from 'react'
import * as styles from '../styles/components/SceneLauncher.module.css'
import Spinner from './Spinner'

const PlayOverlay = ({ pause, modelLoaded, hasStarted }) => {
  const [waited, setWaited] = useState(false)

  useEffect(() => {
    setWaited(false)
    if (pause) {
      setTimeout(() => {
        setWaited(true)
      }, 1000)
    }
  }, [pause])


  return (
   <>
      { pause && <div className={styles.overlayContainer}>
        { modelLoaded ?
        <div
          className={`play-btn ${styles.startButton}`}
          style={{opacity: waited ? '1' : '0', pointerEvents: waited ? 'auto' : 'none'}}
        >
          {hasStarted ? 'continue' : 'start'}
        </div> :
        <Spinner/> }
      </div> }
   </>
  )
}

export default PlayOverlay
