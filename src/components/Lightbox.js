import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { GatsbyImage } from 'gatsby-plugin-image'
import { X, ChevronLeft, ChevronRight } from 'react-feather'
import * as styles from '../styles/components/Lightbox.module.css'


// full-screen, swipeable view of a set of images, opened at `startIndex`
const Lightbox = ({ images, startIndex, onClose }) => {

  const track = useRef(null)
  const [index, setIndex] = useState(startIndex)

  const goTo = (i) => {
    const el = track.current
    if (!el) return
    const target = Math.min(Math.max(i, 0), images.length - 1)
    el.scrollTo({ left: target * el.clientWidth, behavior: 'smooth' })
  }

  const handleScroll = () => {
    const el = track.current
    if (el) setIndex(Math.round(el.scrollLeft / el.clientWidth))
  }

  // jump to the tapped image before the first paint
  useLayoutEffect(() => {
    const el = track.current
    if (el) el.scrollLeft = startIndex * el.clientWidth
  }, [startIndex])

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') goTo(index + 1)
      if (e.key === 'ArrowLeft') goTo(index - 1)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  })

  return createPortal(
    <div className={styles.overlay} role="dialog" aria-modal="true">

      <div className={styles.track} ref={track} onScroll={handleScroll}>
        {images.map((img) => (
          // tapping the empty area around an image closes the modal
          <div key={img.id} className={styles.slide} onClick={(e) => e.target === e.currentTarget && onClose()}>
            <figure className={styles.figure} style={{ '--ratio': img.ratio }}>
              <GatsbyImage image={img.image} alt={img.alt} className={styles.image} draggable={false} />
              {img.caption && <figcaption className={styles.caption}> {img.caption} </figcaption>}
            </figure>
          </div>
        ))}
      </div>

      <div className={styles.bar}>
        <span className={styles.counter}> {images.length > 1 && `${index + 1} / ${images.length}`} </span>
        <button className={styles.button} onClick={onClose} aria-label="Close">
          <X size={26} strokeWidth={1.5} />
        </button>
      </div>

      {images.length > 1 && <>
        <button className={`${styles.button} ${styles.prev}`} onClick={() => goTo(index - 1)} disabled={index === 0} aria-label="Previous image">
          <ChevronLeft size={30} strokeWidth={1.5} />
        </button>
        <button className={`${styles.button} ${styles.next}`} onClick={() => goTo(index + 1)} disabled={index === images.length - 1} aria-label="Next image">
          <ChevronRight size={30} strokeWidth={1.5} />
        </button>
      </>}

    </div>,
    document.body
  )
}

export default Lightbox
