import React, { useEffect, useState, useRef } from 'react';
import { graphql, Link, useStaticQuery } from 'gatsby';
import * as styles from '../styles/components/WorkList.module.css';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import { useLocation } from "@reach/router";

const isBrowser = typeof window !== 'undefined';

const WorkList = ({ dir }) => {

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

  const { pathname } = useLocation();
  const activeSlug = pathname.split('/').filter(e => e.length > 0 && e !== 'works')[0];

  const works = data.allMarkdownRemark.nodes;
  
  const [width, setWidth] = useState(isBrowser && window.innerWidth);
  const container = useRef(null);

  const active = {title: '', thumb: '', date: ''}
  const [hovered, setHovered] = useState(active);

  const [yPos, setYPos] = useState(50);
  const [shiftThumb, setShiftThumb] = useState(false);

  const handleMouseMove = (event) => {
    setYPos(event.clientY - 40);
    if (event.clientY > window.innerHeight - 330) {
      setShiftThumb(true)
    } else {
      setShiftThumb(false)
    }
  }

  // const changeToSemanticDate = (date) => {
  //   const d = new Date(date);
  //   return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  // }

  const handleHover = (title, thumb, date) => setHovered({...hovered, title, thumb, date});

  useEffect(() => {
    if (container.current) {
      container.current.addEventListener('mousemove', handleMouseMove);
    }
    window.addEventListener('resize', () => setWidth(window.innerWidth));
    return () => window.removeEventListener('resize', () => setWidth(window.innerWidth));
  }, [])


  return (      
    <div className={styles.container} ref={container}>

      {works.map((e, i) =>
        <WorkItem
          key={i}
          work={e}
          dir={dir}
          activeSlug={activeSlug}
          handleHover={handleHover}
        />
      )}

      {hovered.thumb && width > 900 && <div className={styles.thumbContainer}>
        <div className={styles.thumbImage} style={{top: `${shiftThumb ? yPos - 270 : yPos}px`}}>
          <p> {hovered.date.split('-')[0]} </p>
          <GatsbyImage image={getImage(hovered.thumb)} alt={hovered.title} />
        </div>
      </div>}

    </div>
  )
}


const WorkItem = ({ work, dir, activeSlug, handleHover }) => {
  const { title, thumb, slug, date } = work.frontmatter;
  let active = activeSlug === slug;

  return (
    <Link
      to={`${dir}${slug}`} 
      className={`${styles.workItem} ${active ? styles.active : ''}`}
      onMouseEnter={active ? null : () => handleHover(title, thumb, date)}
      onMouseLeave={() => handleHover('', '')}
    >
      <p> {title} </p>
    </Link>
  )
}


export default WorkList