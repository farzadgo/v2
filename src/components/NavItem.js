import React, { useState, useEffect, useRef } from 'react'
import { Link, navigate } from 'gatsby'
import * as styles from '../styles/components/Navbar.module.css'

const NavItem = ({ home, about, list, deep, children }) => {
  const [open, setOpen] = useState(false)
  const node = useRef()

  const handleClickOn = () => {
    if (list) setOpen(!open)
    if (!list && home) navigate("/")
    if (!list && about) navigate("/about")
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
        <span>
          {children}
        </span>
      </div>
      {open && list && <div className={styles.dropMenu}>
        {list.map((e, i) => {
          const link = `../${e.slug}`
          const title = e.title
          return (
            <Link key={i} to={link}>
              {title}
            </Link>
          )
        })}
      </div>}
    </li>
  )
}

export default NavItem
