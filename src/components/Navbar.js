import React, { useState, useEffect } from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import * as styles from '../styles/components/Navbar.module.css'
import NavItem from './NavItem'
import { ToggleLeft, ToggleRight } from 'react-feather'
import { pages } from '../config'
import useWindowSize from '../hooks/useWindowSize'
import { themes, useTheme } from './Layout'


const Navbar = ({ info }) => {

  const data = useStaticQuery(graphql`
    query WorkNav {
      allMarkdownRemark(
        filter: {fileAbsolutePath: {regex: "/works/"}}
        sort: {fields: frontmatter___date, order: DESC}
      ) {
        nodes {
          frontmatter {
            title
            slug
          }
        }
      }
    }
  `)

  const {theme, setTheme} = useTheme()

  const { directory, workTitle } = info
  const workList = data.allMarkdownRemark.nodes.map(e => e.frontmatter)
  const dirList = [ pages.works, pages.about ]
  // const { pathname } = useLocation()
  // const pathWords = pathname.split('/').filter(e => e)
  // const depth = pathWords.length

  const breakpoint = 1000
  const [home, setHome] = useState(false)
  const width = useWindowSize()
  
  const wideNavbar = directory === 'about' || width < breakpoint || home
  const homeTitle = width < breakpoint && workTitle ? 'farzad' : 'farzad golghasemi'

  const containerStyle = {
    width: wideNavbar ? '100%' : 'var(--nav-width)',
    borderRightWidth: wideNavbar ? '0px' : '1px'
  }

  const themeToggle = () => setTheme(theme === themes.light ? themes.dark : themes.light)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme)
    }
  }, [theme])

  useEffect(() => {
    if (!directory && !workTitle) setHome(true)
  }, [directory, workTitle])


  return (
    <nav className={styles.container} style={containerStyle}>
      <ul className={styles.directory}>
        <NavItem home={home}> {homeTitle} </NavItem>
        {!home && <NavItem list={dirList}> {directory} </NavItem>}
        {width < breakpoint && workTitle && <NavItem list={workList} deep={true}> {workTitle} </NavItem>}
      </ul>
      <button className={styles.themeToggle} onClick={themeToggle} aria-label="Toggle Theme">
        {theme === 'light' ? <ToggleLeft /> : <ToggleRight />}
      </button>
    </nav>
  )
}

export default Navbar
