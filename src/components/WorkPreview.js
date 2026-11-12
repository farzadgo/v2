import React, { useEffect, useState } from 'react'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import * as styles from '../styles/components/WorkPreview.module.css'


// a work's thumb that, while `active`, loops through its preview images
// with a crossfade. `firstDelay` is how long the thumb stays before the
// first switch (defaults to `interval`), `interval` the time per image after that
const WorkPreview = ({ work, active, interval = 1500, firstDelay = interval, className = '' }) => {

  const { title, previews } = work
  const images = previews || []

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
    const next = () => setIndex(i => (i + 1) % images.length)
    let timer
    // the first switch comes after `firstDelay`, then every `interval`
    const first = setTimeout(() => {
      next()
      timer = setInterval(next, interval)
    }, firstDelay)
    return () => {
      clearTimeout(first)
      clearInterval(timer)
    }
  }, [active, images.length, interval, firstDelay])

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
    </div>
  )
}

export default WorkPreview
