import React, { useEffect, useState, useRef, useCallback } from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import * as styles from '../styles/components/WorkList.module.css'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import { useLocation } from '@reach/router'
import useWindowSize from '../hooks/useWindowSize'
import { throttle } from '../utilities/helpers'
import WorkItem from './WorkItem'


const WorkList = () => {

  const data = useStaticQuery(graphql`
    query WorkList {
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
    { key: 'collaborative', heading: 'curation and collaboration', works: works.filter(w => w.frontmatter.category === 'collaborative' && !w.frontmatter.parent) },
    { key: 'sudora3', heading: 'sudora3', works: works.filter(w => w.frontmatter.category === 'collaborative' && w.frontmatter.parent === 'sudora3') },
  ]

  const width = useWindowSize()
  const container = useRef(null)

  const active = {title: '', thumb: '', date: ''}
  const [hovered, setHovered] = useState(active)
  const [visible, setVisible] = useState(false)

  const [yPos, setYPos] = useState(50)
  const [shiftThumb, setShiftThumb] = useState(false)

  const containerStyle = {
    width: visible ? '100%' : 'var(--nav-width)',
  }

  const handleMouseMove = throttle((event) => {
    setYPos(event.clientY - 40)
    if (event.clientY > window.innerHeight - 330) {
      setShiftThumb(true)
    } else {
      setShiftThumb(false)
    }
  }, 20)

  // const changeToSemanticDate = (date) => {
  //   const d = new Date(date)
  //   return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
  // }

  const handleHover = useCallback((title, thumb, date) => {
    if (thumb) {
      setHovered({ title, thumb, date })
      setVisible(true)
    } else {
      // leave `hovered` as-is so the image stays mounted while it fades
      // out, instead of clearing it and popping the content away instantly
      setVisible(false)
    }
  }, [])

  useEffect(() => {
    let workListContainer = null
    if (container.current) {
      container.current.addEventListener('mousemove', handleMouseMove)
      workListContainer = container.current
    }
    return () => {
      if (workListContainer) {
        workListContainer.removeEventListener('mousemove', handleMouseMove)
      }
    }
  }, [handleMouseMove])

  if (width < 1000) return null

  return (
    <div className={styles.container} ref={container} style={containerStyle}>

      <ul className={styles.workList}>
        {groups.map(group => (
          <React.Fragment key={group.key}>
            {group.heading && <li className={styles.groupHeading}>{group.heading}</li>}
            {group.works.map((e, i) => (
              <WorkItem
                key={e.frontmatter.slug}
                work={e}
                // showYear={i === 0 || e.frontmatter.date.split('-')[0] !== group.works[i - 1].frontmatter.date.split('-')[0]}
                activeSlug={activeSlug}
                handleHover={handleHover}
              />
            ))}
          </React.Fragment>
        ))}
      </ul>

      <div className={`${styles.thumbContainer} ${visible ? styles.visible : ''}`}>
        <div className={styles.thumbImage} style={{top: `${shiftThumb ? yPos - 270 : yPos}px`}}>
          {/* <p> {hovered.date.split('-')[0]} </p> */}
          <GatsbyImage image={getImage(hovered.thumb)} alt={hovered.title} />
        </div>
      </div>

    </div>
  )
}


export default WorkList