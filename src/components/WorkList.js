import React from 'react'
import { useLocation } from '@reach/router'
import * as styles from '../styles/components/WorkList.module.css'
import useWorks from '../hooks/useWorks'
import WorkListItem from './WorkListItem'

// shared grouped/years work list — used by the desktop sidebar (WorkList)
// and the mobile navbar dropdown, each wrapping it in their own container
// styling (width, chrome) via `className`
const WorkList = ({ className, onHover }) => {

  const works = useWorks()

  const { pathname } = useLocation()
  const activeSlug = pathname.split('/').filter(e => e.length > 0)[0]

  const groups = [
    { key: 'artistic-practice', heading: null, works: works.filter(w => w.category === 'artistic-practice') },
    { key: 'collaborative', heading: 'Curation & Collaboration', works: works.filter(w => w.category === 'collaborative' && !w.parent) },
    { key: 'sudora3', heading: 'SUDORAع', works: works.filter(w => w.category === 'collaborative' && w.parent === 'sudora3') },
  ]

  return (
    <ul className={className}>
      {groups.map(group => (
        <React.Fragment key={group.key}>
          {group.heading && <li className={styles.groupHeading}>{group.heading}</li>}
          {group.works.map(e => (
            <WorkListItem
              key={e.slug}
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

export default WorkList
