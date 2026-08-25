import React, { memo } from 'react'
import * as styles from '../styles/components/WorkList.module.css'
import { Link } from 'gatsby'

const WorkItem = ({ work, activeSlug, handleHover }) => {
  const { title, thumb, slug, date } = work.frontmatter
  let active = activeSlug === slug

  return (
    <li>
      <Link
        to={`/${slug}`}
        className={`${styles.workItem} ${active ? styles.active : ''}`}
        onMouseEnter={active ? null : () => handleHover(title, thumb, date)}
        onMouseLeave={() => handleHover('', '', '')}
      >
        {title}
      </Link>
    </li>
  )
}

export default memo(WorkItem)