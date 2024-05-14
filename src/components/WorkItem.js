import React, { memo } from 'react';
import * as styles from '../styles/components/WorkList.module.css';
import { Link } from 'gatsby';

const WorkItem = ({ work, dir, activeSlug, handleHover }) => {
  const { title, thumb, slug, date } = work.frontmatter;
  let active = activeSlug === slug;

  return (
    <Link
      to={`${dir}${slug}`} 
      className={`${styles.workItem} ${active ? styles.active : ''}`}
      onMouseEnter={active ? null : () => handleHover(title, thumb, date)}
      onMouseLeave={() => handleHover('', '', '')}
    >
      <p> {title} </p>
    </Link>
  )
}

export default memo(WorkItem);