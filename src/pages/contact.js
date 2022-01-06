import React from 'react'
import * as Icon from 'react-feather'
import { Helmet } from 'react-helmet'
import Layout from '../components/Layout'
import * as styles from '../styles/pages/Contact.module.css'
import { email, colors, pages, socialMedia } from '../config'


const Contact = (/*{ data }*/) => {
  
  const info = pages.contact

  return (
    <Layout info={info} >
      <Helmet title={info.directory} />
      <main className="main">
        <header className={styles.header}>
          <h1> {info.directory} </h1>
        </header>
        <div className={styles.body}>

          <div className={styles.description}>
            <p> {email} </p>
          </div>
        
          <div className={styles.social}>
            {socialMedia.map((item, i) => <SocialIcon key={i} item={item}/>)}
          </div>

        </div>
      </main>
    </Layout>
  )
}

export default Contact


const SocialIcon = ({ item }) => {
  const iconProps = {
    color: colors.lightWhite,
    size:32,
    strokeWidth: 1
  }
  const TagName = Icon[item.name]
  return (
    <>
      <a href={item.url} aria-label={`${item.name} Link`} target="_blank" rel="noreferrer">
        <TagName {...iconProps}/>
      </a>
    </>
  )
}


// export const query = graphql`
//   query DeveloperPage {
//     allMarkdownRemark(
//       filter: {fileAbsolutePath: {regex: "/developer/"}}
//       sort: {fields: frontmatter___date, order: DESC}
//     ) {
//       nodes {
//         frontmatter {
//           slug
//           title
//           date
//           github
//           external
//           stack
//         }
//         id
//       }
//     }
//   }
// `