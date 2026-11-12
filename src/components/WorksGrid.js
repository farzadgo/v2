import React, { useState } from 'react'
import { Link } from 'gatsby'
import * as styles from '../styles/components/WorksGrid.module.css'
import useWorks from '../hooks/useWorks'
import WorkPreview from './WorkPreview'

const WorksGrid = () => {

  const works = useWorks()
  const [hovered, setHovered] = useState(null)

  return (
    <div className={styles.grid}>
      {works.map(work => (
        <Link
          key={work.slug}
          to={`/${work.slug}`}
          className={styles.item}
          onMouseEnter={() => setHovered(work.slug)}
          onMouseLeave={() => setHovered(null)}
        >
          <WorkPreview work={work} active={hovered === work.slug} />
          <p className={styles.title}>{work.title}</p>
        </Link>
      ))}
    </div>
  )
}

export default WorksGrid
