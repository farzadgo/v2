import React from 'react'
import { Info } from 'react-feather'
import * as styles from '../styles/components/ImageInfo.module.css'


// toggles the image captions, shown next to the image counter
export const InfoButton = ({ active, onClick }) => (
  <button
    className={`${styles.button} ${active ? styles.active : ''}`}
    onClick={onClick}
    aria-label={active ? 'Hide image info' : 'Show image info'}
    aria-pressed={active}
  >
    <Info size="1.1em" strokeWidth={1.5} />
  </button>
)

// caption laid over the lower left of an image, desktop only
export const InfoCaption = ({ text, visible }) => (
  <figcaption className={`${styles.caption} ${visible ? styles.visible : ''}`}> {text} </figcaption>
)
