import React, { memo } from 'react'
import * as styles from '../styles/components/WorkList.module.css'
import { Link } from 'gatsby'

const WorkItem = ({ work, showYear, activeSlug, handleHover }) => {
  const { title, thumb, slug, date } = work.frontmatter
  let active = activeSlug === slug

  return (
    <li className={styles.workItem}>
      {/* <span className={styles.workYear}> {showYear ? date.split('-')[0] : ''} </span> */}
      <span className={styles.workYear}> {date.split('-')[0]} </span>
      <Link
        to={`/${slug}`}
        className={`${styles.workTitle} ${active ? styles.active : ''}`}
        onMouseEnter={active ? null : () => handleHover(title, thumb, date)}
        onMouseLeave={() => handleHover('', '', '')}
      >
        {title}
      </Link>
    </li>
  )
}

export default memo(WorkItem)