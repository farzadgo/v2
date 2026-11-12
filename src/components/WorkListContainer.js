import React, { useEffect, useState, useRef, useCallback } from 'react'
import * as styles from '../styles/components/WorkList.module.css'
import useWindowSize from '../hooks/useWindowSize'
import { throttle } from '../utilities/helpers'
import WorkList from './WorkList'
import WorkPreview from './WorkPreview'


const WorkListContainer = () => {

  const width = useWindowSize()
  const container = useRef(null)

  const [hovered, setHovered] = useState(null)
  const [visible, setVisible] = useState(false)

  const [yPos, setYPos] = useState(50)
  const [shiftThumb, setShiftThumb] = useState(false)

  const containerStyle = {
    width: visible ? '100%' : 'var(--nav-width)',
  }

  const handleMouseMove = throttle((event) => {
    setYPos(event.clientY - 40)
    if (event.clientY > window.innerHeight - 330) {
      setShiftThumb(true)
    } else {
      setShiftThumb(false)
    }
  }, 20)

  const handleHover = useCallback((work) => {
    if (work && work.previews && work.previews.length) {
      setHovered(work)
      setVisible(true)
    } else {
      // leave `hovered` as-is so the image stays mounted while it fades
      // out, instead of clearing it and popping the content away instantly
      setVisible(false)
    }
  }, [])

  useEffect(() => {
    let listContainer = null
    if (container.current) {
      container.current.addEventListener('mousemove', handleMouseMove)
      listContainer = container.current
    }
    return () => {
      if (listContainer) {
        listContainer.removeEventListener('mousemove', handleMouseMove)
      }
    }
  }, [handleMouseMove])

  if (width < 1000) return null

  return (
    <div className={styles.container} ref={container} style={containerStyle}>

      <WorkList className={styles.workList} onHover={handleHover} />

      <div className={`${styles.thumbContainer} ${visible ? styles.visible : ''}`}>
        <div className={styles.thumbImage} style={{top: `${shiftThumb ? yPos - 270 : yPos}px`}}>
          {hovered && <WorkPreview key={hovered.slug} work={hovered} active={visible} firstDelay={400} />}
        </div>
      </div>

    </div>
  )
}


export default WorkListContainer