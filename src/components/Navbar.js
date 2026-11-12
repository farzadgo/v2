import React from 'react'
import * as styles from '../styles/components/Navbar.module.css'
import NavItem from './NavItem'
import WorkList from './WorkList'
import useWindowSize from '../hooks/useWindowSize'


const Navbar = ({ info }) => {
  const breakpoint = 1000
  const width = useWindowSize()

  const wideNavbar = width < breakpoint
  const containerStyle = {
    width: wideNavbar ? '100%' : 'var(--nav-width)',
    borderRightWidth: wideNavbar ? '0px' : '1px'
  }

  return (
    <nav className={styles.container} style={containerStyle}>
      <ul className={styles.directory}>
        <NavItem home> farzad golghasemi </NavItem>
        {width < breakpoint && (
          <NavItem dropdown={<WorkList />}> works </NavItem>
        )}
        <NavItem about> about </NavItem>
      </ul>
    </nav>
  )
}

export default Navbar
