import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import * as styles from '../styles/components/Navbar.module.css'
import NavItem from './NavItem'
import useWindowSize from '../hooks/useWindowSize'


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

  // const { directory, workTitle } = info
  const workList = data.allMarkdownRemark.nodes.map(e => e.frontmatter)

  const breakpoint = 1000
  // const [home, setHome] = useState(false)
  const width = useWindowSize()

  const wideNavbar = width < breakpoint
  const containerStyle = {
    width: wideNavbar ? '100%' : 'var(--nav-width)',
    borderRightWidth: wideNavbar ? '0px' : '1px'
  }

  // useEffect(() => {
  //   if (!directory && !workTitle) setHome(true)
  // }, [directory, workTitle])


  return (
    <nav className={styles.container} style={containerStyle}>
      <ul className={styles.directory}>
        <NavItem home> farzad golghasemi </NavItem>
        {width < breakpoint && <NavItem list={workList}> works </NavItem>}
        <NavItem about> about </NavItem>
      </ul>
    </nav>
  )
}

export default Navbar
