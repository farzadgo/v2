import React, { useState, useEffect, useRef } from 'react'
import { navigate } from 'gatsby'
import * as styles from '../styles/components/Navbar.module.css'

const NavItem = ({ home, about, dropdown, children }) => {
  const [open, setOpen] = useState(false)
  const node = useRef()

  const handleClickOn = () => {
    if (dropdown) { setOpen(!open); return }
    if (home) navigate("/")
    if (about) navigate("/about")
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
      {open && dropdown && <div className={styles.dropMenu}>
        {dropdown}
      </div>}
    </li>
  )
}

export default NavItem
