import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import Img from 'gatsby-image'
import LightBox from '../components/Lightbox'
import * as styles from '../styles/pages/WorkDetails.module.css'
import { graphql } from 'gatsby'
import { Helmet } from 'react-helmet'


const WorkDetails = ({ data }) => {

  const [gallery, setGallery] = useState([])
  const { html } = data.markdownRemark
  const {
    categories,
    collabs,
    date, exhibition,
    imagenotes,
    links,
    location,
    photocredits,
    title,
    videos
  } = data.markdownRemark.frontmatter
  const info = { directory: 'works', workTitle: title }
  const images = data.allFile.nodes
  const cover = images[0]
  // console.log(data)

  const [showLightbox, setShowLightbox] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)

  const handleOpen = i => {
    setShowLightbox(true)
    setSelectedImage(i)
  }
  const handleClose = () => {
    setShowLightbox(false)
    setSelectedImage(null)
  }
  const handlePrevRequest = (i, length) => e => {
    setSelectedImage((i - 1 + length) % length)
  }
  const handleNextRequest = (i, length) => e => {
    setSelectedImage((i + 1) % length)
  }

  useEffect(() => {
    videos ? setGallery(images) : setGallery(images.slice(1, images.length))

    if (showLightbox) {
      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = '15px'
      // document.addEventListener('wheel', e => e.preventDefault(), { passive: false })
    }
    return () => {
      document.body.style.overflow = 'unset'
      document.body.style.paddingRight = '0px'
      // document.removeEventListener('wheel', e => e.preventDefault(), { passive: false })
    }
  }, [showLightbox, images, videos])


  return (
    <Layout info={info} >
      <Helmet title={title} />
      <main className="main">

        <header className={styles.header}>
          <h1>{title}</h1>
        </header>
  
        <div className={styles.firstContainer}>
          <div
            className={styles.html}
            dangerouslySetInnerHTML={{__html: html}}
          />
          {/* <ul>
            {links.map((e, i) => (
            <li><a key={i} href={e} target='_blank'>click</a></li>
            ))}
          </ul> */}
          <Cover videos={videos} cover={cover}/>
        </div>
  
        <div className={styles.secondContainer}>
          {gallery.map((image, i) => (
            <div
              key={image.id}
              className={styles.image}
              role="button"
              tabIndex="0"
              onClick={() => handleOpen(i + 1)}
              onKeyDown={() => handleOpen(i + 1)}
            >
              <Img fluid={image.childImageSharp.fluid} />
            </div>
          ))}
        </div>
  
        {showLightbox && selectedImage !== null && (
          <LightBox
            images={images}
            handleClose={handleClose}
            handleNextRequest={handleNextRequest}
            handlePrevRequest={handlePrevRequest}
            selectedImage={selectedImage}
          />
        )}
      </main>

    </Layout>
  )
}

export default WorkDetails


const Cover = ({ videos, cover }) => {
  // console.log(cover)
  const video = videos ? videos[0] : null
  const VideoFrame = () => {
    return (
      <div style={{padding: '56.25% 0 0 0', position: 'relative'}}>
        <iframe
          title={video}
          src={`https://player.vimeo.com/video/${video}`}
          style={{position: 'absolute', top: '0', left: '0', width:'100%', height: '100%'}}
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </div>
    )
  }
  return (
    <div className={styles.cover}>
      {video ? <VideoFrame /> : <Img fluid={cover.childImageSharp.fluid} />}
      {/* <Img fluid={cover.childImageSharp.fluid} /> */}
    </div>
  )
}


export const query = graphql`
  query WorkPage($slug: String, $dir: String) {
    markdownRemark(frontmatter: {slug: {eq: $slug}}) {
      html
      frontmatter {
        title
        date
        videos
        categories
        exhibition
        collabs
        links
        location
        photocredits
        imagenotes
      }
    }
    allFile(filter: {
      extension: {regex: "/(jpg)|(png)|(jpeg)/"}, relativeDirectory: {eq: $dir}}
      sort: {fields: name}
    ) {
      nodes {
        name
        id
        childImageSharp {
          fluid(maxWidth: 1920, quality: 100) {
            ...GatsbyImageSharpFluid
          }
        }
      }
    }
  }
`