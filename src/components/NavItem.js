import React, { useState, useEffect, useRef } from 'react'
import { Link, navigate } from 'gatsby'
import * as styles from '../styles/components/Navbar.module.css'
import { ChevronRight } from 'react-feather'

const NavItem = ({ home, list, deep, children }) => {
  const [open, setOpen] = useState(false)
  const node = useRef()

  const handleClickOn = () => {
    if (list) {
      setOpen(!open)
    } else if (!home || !list) {
      navigate("/")
    }
  }

  const handleClickOut = e => {
    if (node.current.contains(e.target)) {
      return
    }
    setOpen(false)
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOut)
    return () => {
      document.removeEventListener("mousedown", handleClickOut)
    }
  }, [])

  return (
    <li ref={node}>

      <div className={styles.navItem} onClick={handleClickOn} onKeyDown={(e) => e.key === 'Enter' && handleClickOn()} role="button" tabIndex="0">
        {list && <span className={styles.navItemArrow}>
          <ChevronRight {...{strokeWidth: 1}}/>
        </span>}
        <span>
          {children}
        </span>
      </div>

      {open && list && <div className={styles.dropMenu}>
        {list.map((e, i) => <DropItem key={i} item={e} deep={deep}/>)}
      </div>}

    </li>
  )
}

export default NavItem


const DropItem = ({ item, deep }) => {
  let link, title
  if (deep) {
    link = `../${item.slug}`
    title = item.title
  } else {
    link = item.slug
    title = item.directory
  }
  return <Link to={link}> {title} </Link>
}