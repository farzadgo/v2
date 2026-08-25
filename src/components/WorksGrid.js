import React from 'react'
import { useStaticQuery, graphql, Link } from 'gatsby'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import * as styles from '../styles/components/WorksGrid.module.css'

const WorksGrid = () => {

  const data = useStaticQuery(graphql`
    query WorksGrid {
      allMarkdownRemark(
        filter: {fileAbsolutePath: {regex: "/works/"}}
        sort: {frontmatter: {date: DESC}}
      ) {
        nodes {
          frontmatter {
            title
            slug
            thumb {
              childImageSharp {
                gatsbyImageData(
                  layout: CONSTRAINED,
                  transformOptions: {cropFocus: CENTER},
                )
              }
            }
          }
        }
      }
    }
  `)

  const works = data.allMarkdownRemark.nodes

  return (
    <div className={styles.grid}>
      {works.map(({ frontmatter: { title, slug, thumb } }) => (
        <Link key={slug} to={`/${slug}`} className={styles.item}>
          <GatsbyImage image={getImage(thumb)} alt={title} />
          <p>{title}</p>
        </Link>
      ))}
    </div>
  )
}

export default WorksGrid
