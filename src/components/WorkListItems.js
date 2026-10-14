import React from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import { useLocation } from '@reach/router'
import * as styles from '../styles/components/WorkList.module.css'
import WorkItem from './WorkItem'

// shared grouped/years work list — used by the desktop sidebar (WorkList)
// and the mobile navbar dropdown, each wrapping it in their own container
// styling (width, chrome) via `className`
const WorkListItems = ({ className, onHover }) => {

  const data = useStaticQuery(graphql`
    query WorkListItems {
      allMarkdownRemark(
        filter: {fileAbsolutePath: {regex: "/works/"}}
        sort: {frontmatter: {date: DESC}}
      ) {
        nodes {
          frontmatter {
            title
            slug
            date
            category
            parent
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

  const { pathname } = useLocation()
  const activeSlug = pathname.split('/').filter(e => e.length > 0)[0]

  const works = data.allMarkdownRemark.nodes

  const groups = [
    { key: 'artistic-practice', heading: null, works: works.filter(w => w.frontmatter.category === 'artistic-practice') },
    { key: 'collaborative', heading: 'Curation & Collaboration', works: works.filter(w => w.frontmatter.category === 'collaborative' && !w.frontmatter.parent) },
    { key: 'sudora3', heading: 'SUDORAع', works: works.filter(w => w.frontmatter.category === 'collaborative' && w.frontmatter.parent === 'sudora3') },
  ]

  return (
    <ul className={className}>
      {groups.map(group => (
        <React.Fragment key={group.key}>
          {group.heading && <li className={styles.groupHeading}>{group.heading}</li>}
          {group.works.map(e => (
            <WorkItem
              key={e.frontmatter.slug}
              work={e}
              activeSlug={activeSlug}
              handleHover={onHover}
            />
          ))}
        </React.Fragment>
      ))}
    </ul>
  )
}

export default WorkListItems
