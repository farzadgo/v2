import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import Img from 'gatsby-image'
import LightBox from '../components/Lightbox'
import * as styles from '../styles/pages/WorkDetails.module.css'
import { graphql } from 'gatsby'
import { Helmet } from 'react-helmet'


const WorkDetails = ({ data }) => {

  const { html } = data.markdownRemark
  const { title } = data.markdownRemark.frontmatter
  const images = data.allFile.nodes
  const images_ = images.slice(1, images.length)
  const info = { directory: 'Works', workTitle: title }

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
  }, [showLightbox])


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
          <div
            role="button"
            tabIndex="-1"
            className={styles.cover}
            onClick={() => handleOpen(0)}
            onKeyDown={() => handleOpen(0)}
          >
            <Img fluid={images[0].childImageSharp.fluid} />
          </div>
        </div>
  
        <div className={styles.secondContainer}>
          {images_.map((image, i) => (
            <div
              key={image.id}
              role="button"
              tabIndex="0"
              className={styles.image}
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


export const query = graphql`
  query WorkPage($slug: String, $dir: String) {
    markdownRemark(frontmatter: {slug: {eq: $slug}}) {
      html
      frontmatter {
        title
        thumb {
          childImageSharp {
            fluid {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    }
    allFile(filter: {
      extension: {regex: "/(jpg)|(png)|(jpeg)/"}, relativeDirectory: {eq: $dir}}
      sort: {fields: name}
    ) {
      nodes {
        name
        id
        relativeDirectory
        childImageSharp {
          fluid(maxWidth: 1200, quality: 100) {
            ...GatsbyImageSharpFluid
          }
        }
      }
    }
  }
`