import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/Layout'
import * as Icon from 'react-feather'
import { Helmet } from 'react-helmet'
import * as styles from '../styles/pages/Developer.module.css'
import { colors, pages, socialMedia } from '../config'


const Developer = ({ data }) => {
  
  const info = pages.developer
  const devs = data.allMarkdownRemark.nodes
  // const [height, setHeight] = useState(0)
  const iconProps = {
    color: colors.lightWhite,
    size: 22,
    strokeWidth: 1
  }
  const style = {
    backgroundColor: colors.veryGray,
    // minHeight: `${height - sizes.navHeight}px`,
  }
  console.log(style.minHeight)

  // const handleResize = debounce(() => setHeight(window.innerHeight), 1000)

  // useEffect(() => {
  //   setHeight(window.innerHeight)
  //   window.addEventListener('resize', handleResize)
  //   return () => {
  //     window.removeEventListener('resize', handleResize)
  //   }
  // }, [])

  return (
    <Layout info={info} >
      <Helmet title="Developer" />

      <main className="main" style={style}>
        <header className={styles.header}>
          <h1> Development and Design </h1>
        </header>
  
        <div className={styles.body}>
          <div className={styles.description}>
            <p> Here is the list of web development and design prjects I’ve worked on.. </p>
          </div>

          <table className={styles.table}>
            <thead>
              <tr>
                <th>Year</th>
                <th>Title</th>
                <th className={styles.hide}>Built with</th>
                <th>Link</th>
              </tr>
            </thead>
            <tbody>
              {devs.map((e, i) => {
                const {
                  date,
                  title,
                  github,
                  external,
                  stack
                } = e.frontmatter;
                return (
                  <tr key={i}>
                    <td>{`${new Date(date).getFullYear()}`}</td>
                    <td>{title}</td>
                    {/* <td className={[styles.tech, styles.hide].join(' ')}> */}
                    <td className={styles.hide}>
                      {stack.length > 0 &&
                        stack.map((item, i) => (
                          <span key={i}>
                            {item}
                            {''}
                            {i !== stack.length - 1 && <span style={{margin: '0 5px'}} >&middot;</span>}
                          </span>
                        ))}
                    </td>
                    <td className={styles.links}>
                      <div>
                        {external && (
                          <a href={external} aria-label="External Link" target="_blank" rel="noreferrer">
                            <Icon.ExternalLink {...iconProps}/>
                          </a>
                        )}
                        {github && (
                          <a href={github} aria-label="GitHub Link" target="_blank" rel="noreferrer">
                            <Icon.Code {...iconProps}/>
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className={styles.social}>
            {socialMedia.map((item, i) => <SocialIcon key={i} item={item}/>)}
          </div>

        </div>
      </main>
    </Layout>
  )
}

export default Developer


const SocialIcon = ({ item }) => {
  const iconProps = {
    color: colors.lightWhite,
    size: 28,
    strokeWidth: 1
  }
  const TagName = Icon[item.name]
  return (
    <div>
      <a href={item.url} aria-label={`${item.name} Link`} target="_blank" rel="noreferrer">
        <TagName {...iconProps}/>
      </a>
    </div>
  )
}



export const query = graphql`
  query DeveloperPage {
    allMarkdownRemark(
      filter: {fileAbsolutePath: {regex: "/developer/"}}
      sort: {fields: frontmatter___date, order: DESC}
    ) {
      nodes {
        frontmatter {
          slug
          title
          date
          github
          external
          stack
        }
        id
      }
    }
  }
`