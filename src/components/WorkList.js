import React, { useEffect, useState, useRef, useCallback } from 'react'
import * as styles from '../styles/components/WorkList.module.css'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import useWindowSize from '../hooks/useWindowSize'
import { throttle } from '../utilities/helpers'
import WorkListItems from './WorkListItems'


const WorkList = () => {

  const width = useWindowSize()
  const container = useRef(null)

  const active = {title: '', thumb: '', date: ''}
  const [hovered, setHovered] = useState(active)
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

  const handleHover = useCallback((title, thumb, date) => {
    if (thumb) {
      setHovered({ title, thumb, date })
      setVisible(true)
    } else {
      // leave `hovered` as-is so the image stays mounted while it fades
      // out, instead of clearing it and popping the content away instantly
      setVisible(false)
    }
  }, [])

  useEffect(() => {
    let workListContainer = null
    if (container.current) {
      container.current.addEventListener('mousemove', handleMouseMove)
      workListContainer = container.current
    }
    return () => {
      if (workListContainer) {
        workListContainer.removeEventListener('mousemove', handleMouseMove)
      }
    }
  }, [handleMouseMove])

  if (width < 1000) return null

  return (
    <div className={styles.container} ref={container} style={containerStyle}>

      <WorkListItems className={styles.workList} onHover={handleHover} />

      <div className={`${styles.thumbContainer} ${visible ? styles.visible : ''}`}>
        <div className={styles.thumbImage} style={{top: `${shiftThumb ? yPos - 270 : yPos}px`}}>
          <GatsbyImage image={getImage(hovered.thumb)} alt={hovered.title} />
        </div>
      </div>

    </div>
  )
}


export default WorkList