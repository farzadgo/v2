import React, { useEffect, useState } from 'react'
import { graphql } from 'gatsby'
import { Helmet } from 'react-helmet'
import Layout from '../components/Layout'
import { Instagram, Mail, Printer } from 'react-feather';
import * as styles from '../styles/pages/About.module.css'
import { pages, email, socialMedia } from '../config'


const About = ({ data }) => {
  
  const info = pages.about;
  const nodes = data.allMarkdownRemark.nodes;
  const [ bio, vitae, imprint ] = nodes.map(e => e.html);

  const [show, setShow] = useState(0);

  const insta = socialMedia.filter(e => e.title === 'Instagram')[0];

  useEffect(() => {
    setTimeout(() => {
      setShow(1);
    }, 100);
  }, [])


  return (
    <Layout info={info}>
      <Helmet title={info.directory} />
      <main className="main" style={{transition: 'opacity 0.2s ease-in-out' , opacity: show}}>
        <div className={styles.body}>
          
          <div className={styles.bio} dangerouslySetInnerHTML={{__html: bio}}/>

          <div className={styles.contact}>
            <div>
              <Mail />
              <span>{email}</span>
            </div>
            <div>
              <Instagram />
              <a href={insta.url} aria-label='Instagram Link' target="_blank" rel="noreferrer">
                {insta.username}
              </a>
            </div>
          </div>

          <div className={styles.print}>
            <button onClick={() => window.print()}> <Printer {...{size: 32, strokeWidth: 0.5}}/> </button>
          </div>

          <div className={styles.vitae} dangerouslySetInnerHTML={{__html: vitae}}/>
          <div className={styles.imprint} dangerouslySetInnerHTML={{__html: imprint}}/>

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
      sort: {frontmatter: {order: ASC}}
    ) {
      nodes {
        html
        frontmatter {
          thumb {
            childImageSharp {
              gatsbyImageData(
                quality: 100,
                transformOptions: {cropFocus: CENTER},
              )
            }
          }
        }
      }
    }
  }
`

// you can also define those "quality", "transformOptions", and
// "placeholder" inside gatsby-config under gatsby-plugin-sharp