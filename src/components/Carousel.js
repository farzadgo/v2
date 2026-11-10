import React, { useRef, useState, useCallback } from 'react'
import { GatsbyImage } from 'gatsby-plugin-image'
import * as styles from '../styles/components/Carousel.module.css'
import useDragScroll from '../hooks/useDragScroll'
import useWindowSize from '../hooks/useWindowSize'
import Lightbox from './Lightbox'
import { InfoButton, InfoCaption } from './ImageInfo'


const Carousel = ({ images, credits }) => {

  const carousel = useRef(null)
  const frame = useRef(null)
  const width = useWindowSize()

  const [current, setCurrent] = useState(0)
  const [opened, setOpened] = useState(null)
  const [showInfo, setShowInfo] = useState(false)

  useDragScroll(carousel)

  // every image shares one row height, set by the widest one, so portraits end up narrower
  const rowRatio = Math.max(...images.map(img => img.ratio))

  // the current image is the first one that is at least half in view
  const handleScroll = useCallback(() => {
    cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(() => {
      const el = carousel.current
      if (!el) return
      const items = el.children
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 2) {
        setCurrent(images.length - 1)
        return
      }
      const start = items[0].offsetLeft
      for (let i = 0; i < images.length; i++) {
        const item = items[i]
        if (item.offsetLeft + item.offsetWidth / 2 - el.scrollLeft > start) {
          setCurrent(i)
          return
        }
      }
    })
  }, [images.length])

  // the lightbox is a mobile thing, on desktop clicks belong to dragging
  const canOpen = width && width < 1000

  const hasCaptions = images.some(img => img.caption)

  // on mobile captions live in the lightbox, so the info button opens it at the current image
  const handleInfo = () => canOpen ? setOpened(current) : setShowInfo(!showInfo)

  return (
    <div className={styles.gallery}>

      <div className={styles.carousel} ref={carousel} onScroll={handleScroll} style={{ '--row-ratio': rowRatio }}>
        {images.map((img, i) => (
          <figure key={img.id} className={styles.item} style={{ '--ratio': img.ratio }}>
            <div className={styles.frame} onClick={canOpen ? () => setOpened(i) : undefined}>
              <GatsbyImage image={img.image} alt={img.alt} className={styles.image} draggable={false} />
              {img.caption && <InfoCaption text={img.caption} visible={showInfo} />}
            </div>
          </figure>
        ))}
      </div>

      <div className={styles.footer}>
        {credits && <span className={styles.credits} dangerouslySetInnerHTML={{ __html: credits }} />}
        <div className={styles.controls}>
          {hasCaptions && <InfoButton active={showInfo} onClick={handleInfo} />}
          {images.length > 1 && <span className={styles.counter}> {current + 1} / {images.length} </span>}
        </div>
      </div>

      {opened !== null && <Lightbox images={images} startIndex={opened} onClose={() => setOpened(null)} />}

    </div>
  )
}

export default Carousel
