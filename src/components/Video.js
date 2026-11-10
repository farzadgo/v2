import React from 'react'
import * as styles from '../styles/components/Video.module.css'


// '16/9' or '1.78' -> number, defaults to 16:9
const parseRatio = (value) => {
  if (!value) return 16 / 9
  const [w, h] = value.split('/').map(Number)
  const ratio = h ? w / h : w
  return ratio > 0 ? ratio : 16 / 9
}

// embedded player (e.g. vimeo), sized like the carousel images
const Video = ({ src, title, ratio, credits }) => {

  // keep vimeo from setting tracking cookies
  const url = new URL(src)
  if (url.hostname.includes('vimeo')) url.searchParams.set('dnt', '1')

  return (
    <figure className={styles.video} style={{ '--ratio': parseRatio(ratio) }}>
      <div className={styles.frame}>
        <iframe
          src={url.toString()}
          title={title}
          loading="lazy"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </div>
      {credits && <figcaption className={styles.credits} dangerouslySetInnerHTML={{ __html: credits }} />}
    </figure>
  )
}

export default Video
