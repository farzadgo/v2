import React from 'react'
import { graphql } from 'gatsby'
import { Helmet } from 'react-helmet'
import Layout from '../components/Layout'
import Img from 'gatsby-image'
import * as styles from '../styles/pages/About.module.css'
import { pages } from '../config'


const About = ({ data }) => {
  
  const info = pages.about
  const nodes = data.allMarkdownRemark.nodes
  const [ bio, vitae, imprint ] = nodes.map(e => e.html)
  const { thumb } = nodes[0].frontmatter

  return (
    <Layout info={info}>
      <Helmet title="About" />

      <main className="main">
        <header className={styles.header}>
          <h1> {info.directory} </h1>
        </header>
        <div className={styles.body}>

          <div className={styles.bio} dangerouslySetInnerHTML={{__html: bio}}/>
          <div className={styles.profile}>
            <Img
              fluid={thumb.childImageSharp.fluid}
              // className={styles.contain}
            />
          </div>

          <div className={styles.vitae} dangerouslySetInnerHTML={{__html: vitae}}/>

          <div className={styles.imprint} dangerouslySetInnerHTML={{__html: imprint}} />

        </div>
      </main>

    </Layout>
  )
}

export default About


export const query = graphql`
  query AboutPage {
    allMarkdownRemark(
      filter: {fileAbsolutePath: {regex: "/about/"}}
      sort: {fields: frontmatter___order, order: ASC}
    ) {
      nodes {
        html
        frontmatter {
          thumb {
            childImageSharp {
              fluid(quality: 100, cropFocus: CENTER) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
      }
    }
  }
`