import React, { useEffect, useState } from 'react'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import * as styles from '../styles/components/WorkPreview.module.css'


// a work's thumb that, while `active`, loops through its preview images
// with a crossfade and shows the subtitle and year on top
const WorkPreview = ({ work, active, interval = 1000, className = '' }) => {

  const { title, subtitle, date, previews } = work
  const images = previews || []
  const year = date ? date.split('-')[0] : ''

  const [index, setIndex] = useState(0)
  // the other images only load once the preview has been active
  const [primed, setPrimed] = useState(active)

  useEffect(() => {
    if (!active) {
      setIndex(0)
      return
    }
    setPrimed(true)
    if (images.length < 2) return
    const timer = setInterval(() => setIndex(i => (i + 1) % images.length), interval)
    return () => clearInterval(timer)
  }, [active, images.length, interval])

  return (
    <div className={`${styles.preview} ${active ? styles.active : ''} ${className}`}>
      {images.map((img, i) => (i === 0 || primed) && (
        <GatsbyImage
          key={img.id}
          image={getImage(img)}
          alt={i === 0 ? title : ''}
          loading={i === 0 ? 'lazy' : 'eager'}
          className={`${styles.image} ${i === index ? styles.current : ''}`}
          draggable={false}
        />
      ))}
      <div className={styles.infoDiv}>
        <p> {subtitle} </p>
        <p> {year} </p>
      </div>
    </div>
  )
}

export default WorkPreview
