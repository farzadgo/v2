import React, { useEffect, useState, useRef, useCallback } from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import * as styles from '../styles/components/WorkList.module.css';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import { useLocation } from '@reach/router';
import useWindowSize from '../hooks/useWindowSize';
import { throttle } from '../utilities/helpers';
import WorkItem from './WorkItem';


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
  
  const width = useWindowSize();
  const container = useRef(null);

  const active = {title: '', thumb: '', date: ''}
  const [hovered, setHovered] = useState(active);

  const [yPos, setYPos] = useState(50);
  const [shiftThumb, setShiftThumb] = useState(false);

  const handleMouseMove = throttle((event) => {
    setYPos(event.clientY - 40);
    if (event.clientY > window.innerHeight - 330) {
      setShiftThumb(true)
    } else {
      setShiftThumb(false)
    }
  }, 20);

  // const changeToSemanticDate = (date) => {
  //   const d = new Date(date);
  //   return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  // }

  const handleHover = useCallback((title, thumb, date) => {
    setHovered({...hovered, title, thumb, date});
  }, [hovered]);

  useEffect(() => {
    let worklistContainer = null;
    if (container.current) {
      container.current.addEventListener('mousemove', handleMouseMove);
      worklistContainer = container.current;
    }
    return () => {
      if (worklistContainer) {
        worklistContainer.removeEventListener('mousemove', handleMouseMove);
      }
    }
  }, [handleMouseMove])


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

      {hovered.thumb && width > 1000 && <div className={styles.thumbContainer}>
        <div className={styles.thumbImage} style={{top: `${shiftThumb ? yPos - 270 : yPos}px`}}>
          <p> {hovered.date.split('-')[0]} </p>
          <GatsbyImage image={getImage(hovered.thumb)} alt={hovered.title} />
        </div>
      </div>}

    </div>
  )
}


export default WorkList