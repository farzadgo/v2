import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import Carousel from '../components/Carousel'
import Video from '../components/Video'
import { getImage } from 'gatsby-plugin-image'
import * as styles from '../styles/pages/WorkDetails.module.css'
import { graphql } from 'gatsby'
import { Helmet } from 'react-helmet'


// empty-div placeholders in the markdown:
// <div class="gallery [prefix]" data-credits="..."></div>
// <div class="video" data-src="https://player.vimeo.com/video/..." data-ratio="16/9" data-credits="..."></div>
const PLACEHOLDER_PATTERN = /<div class="(gallery|video)(?=[\s"])\s*([^"]*)"([^>]*)>\s*<\/div>/g

const attribute = (attrs, name) => {
  const match = attrs.match(new RegExp(`data-${name}="([^"]*)"`))
  return match ? match[1] : ''
}

// splits the markdown html into html chunks and placeholders, in order
const splitHtml = (html) => {
  const parts = []
  let last = 0
  for (const match of html.matchAll(PLACEHOLDER_PATTERN)) {
    const [whole, type, classes, attrs] = match
    parts.push({ type: 'html', html: html.slice(last, match.index) })
    if (type === 'gallery') {
      parts.push({ type, prefix: classes.trim().split(/\s+/)[0], credits: attribute(attrs, 'credits') })
    } else {
      parts.push({ type, src: attribute(attrs, 'src'), ratio: attribute(attrs, 'ratio'), credits: attribute(attrs, 'credits') })
    }
    last = match.index + whole.length
  }
  parts.push({ type: 'html', html: html.slice(last) })
  return parts.filter(part => part.type !== 'html' || part.html.trim())
}

// with a single gallery it takes every image, otherwise each takes the images whose
// filename starts with its prefix followed by '_', e.g. 'neustadt' -> neustadt_adrift-01.jpg
const imagesFor = (gallery, galleryCount, images) => {
  if (galleryCount === 1) return images
  return images.filter(img => img.name.split('_')[0] === gallery.prefix)
}


// const Cover = ({ image }) => {
//   const width = useWindowSize()
//   const [opened, setOpened] = useState(false)
//   const [showInfo, setShowInfo] = useState(false)
//   const canOpen = width && width < 1000

//   // on mobile captions live in the lightbox, so the info button opens it
//   const handleInfo = () => canOpen ? setOpened(true) : setShowInfo(!showInfo)

//   return (
//     <figure className={styles.cover} style={{ '--ratio': image.ratio }}>
//       <div className={styles.coverFrame} onClick={canOpen ? () => setOpened(true) : undefined}>
//         <GatsbyImage image={image.image} alt={image.alt} className={styles.coverImage} loading="eager" />
//         {image.caption && <InfoCaption text={image.caption} visible={showInfo} />}
//       </div>
//       {image.caption && (
//         <div className={styles.coverControls}>
//           <InfoButton active={showInfo} onClick={handleInfo} />
//         </div>
//       )}
//       {opened && <Lightbox images={[image]} startIndex={0} onClose={() => setOpened(false)} />}
//     </figure>
//   )
// }


const WorkDetails = ({ data }) => {

  const { html } = data.markdownRemark
  const { title, subtitle, date, cover, captions } = data.markdownRemark.frontmatter

  const year = date ? new Date(date).getFullYear() : ''

  const info = { workTitle: title }

  const [show, setShow] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setShow(1), 100)
    return () => clearTimeout(timer)
  }, [])

  // captions can be keyed by filename with or without extension
  const captionFor = (node) => {
    const entry = (captions || []).find(c => c.file === node.base || c.file === node.name)
    return entry ? entry.text : null
  }

  const allImages = data.allFile.nodes.map(node => {
    const image = getImage(node)
    const caption = captionFor(node)
    return {
      id: node.id,
      name: node.name,
      base: node.base,
      image,
      ratio: image.width / image.height,
      caption,
      alt: caption || title,
    }
  })

  const coverImage = cover ? allImages.find(img => img.base === cover || img.name === cover) : null
  const galleryImages = allImages.filter(img => img !== coverImage)

  const parts = splitHtml(html)
  const galleryCount = parts.filter(part => part.type === 'gallery').length

  return (
    <Layout info={info} >
      <Helmet title={title} />
      <main className="main">
        <div className={styles.container} style={{opacity: show}}>
          <header>
            <h1 className={styles.pageTitle}> {title} </h1>
            <h2 className={styles.pageSubtitle}> {subtitle} <i> {subtitle && '—'} {year} </i></h2>
          </header>
          {/* {coverImage && <Cover image={coverImage} />} */}
          {parts.map((part, i) => {
            if (part.type === 'html') {
              return <div key={i} className={styles.pageHtml} dangerouslySetInnerHTML={{__html: part.html}} />
            }
            if (part.type === 'video') {
              return part.src && <Video key={i} src={part.src} title={title} ratio={part.ratio} credits={part.credits} />
            }
            const images = imagesFor(part, galleryCount, galleryImages)
            return images.length > 0 && <Carousel key={i} images={images} credits={part.credits} />
          })}
        </div>
      </main>
    </Layout>
  )
}

export default WorkDetails


export const query = graphql`
  query WorkPage($slug: String, $dir: String) {
    markdownRemark(frontmatter: {slug: {eq: $slug}}) {
      html
      frontmatter {
        title
        subtitle
        date
        cover
        captions {
          file
          text
        }
      }
    }
    allFile(filter: {
      extension: {regex: "/(jpg)|(png)|(jpeg)/"}, relativeDirectory: {eq: $dir}}
      sort: {name: ASC}
    ) {
      nodes {
        name
        base
        id
        childImageSharp {
          gatsbyImageData(
            quality: 90,
            layout: CONSTRAINED,
            placeholder: BLURRED,
          )
        }
      }
    }
  }
`
