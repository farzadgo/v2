import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import Img from 'gatsby-image'
import * as styles from '../styles/pages/WorkDetails.module.css'
import { graphql } from 'gatsby'
import { Helmet } from 'react-helmet'


const WorkDetails = ({ data }) => {

  const {html} = data.markdownRemark
  const {title, videos} = data.markdownRemark.frontmatter
  const info = {directory: 'works', workTitle: title}
  const images = data.allFile.nodes
  const cover = images[0]
  const vidID = videos ? videos[0] : null
  const [gallery, setGallery] = useState([])

  
  const VideoFrame = () => {
    let video = vidID ? vidID : null
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

  useEffect(() => {
    vidID ? setGallery(images) : setGallery(images.slice(1, images.length))
  }, [])


  return (
    <Layout info={info} >
      <Helmet title={title} />
      <main className="main">

        <header className={styles.header}>
          <h1>{title}</h1>
        </header>
  
        <div className={styles.firstContainer}>
          <div className={styles.html} dangerouslySetInnerHTML={{__html: html}} />
          <div className={styles.cover}>
            {vidID ? <VideoFrame /> : <Img fluid={cover.childImageSharp.fluid} />}
          </div>
        </div>
  
        <div className={styles.secondContainer}>
          {gallery.map((image, i) => (
            <div key={image.id} className={styles.image}>
              <Img fluid={image.childImageSharp.fluid} />
            </div>
          ))}
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