import React, { useState, useEffect, useRef } from 'react';
import { useStaticQuery, graphql, Link, navigate } from 'gatsby';
import * as styles from '../styles/components/Navbar.module.css';
import * as Icon from 'react-feather';
import { pages } from '../config';

const isBrowser = typeof window !== 'undefined';

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

  const { directory, workTitle } = info;
  const workList = data.allMarkdownRemark.nodes.map(e => e.frontmatter);
  const dirList = [ pages.works, pages.about ]
  // const { pathname } = useLocation()
  // const pathWords = pathname.split('/').filter(e => e)
  // const depth = pathWords.length

  const breakpoint = 901;
  const [home, setHome] = useState(false);
  const [width, setWidth] = useState(isBrowser && window.innerWidth);
  
  const wideNavbar = directory === 'about' || width < breakpoint || home;
  const homeTitle = width < breakpoint && workTitle ? 'farzad' : 'farzad golghasemi';


  const style = {
    width: wideNavbar ? '100%' : '25vw', // '400px'
    backgroundColor: home ? '#00000000' : 'var(--very-white)',
    borderRight: wideNavbar ? 'none' : `1px solid var(--light-gray)`,
  }

  useEffect(() => {
    if (!directory && !workTitle) setHome(true);

    window.addEventListener('resize', () => setWidth(window.innerWidth));
    return () => window.removeEventListener('resize', () => setWidth(window.innerWidth));
  }, [directory, workTitle])


  return (
    <nav className={styles.container} style={style}>
      <ul className={styles.directory}>
        <NavItem home={home}> {homeTitle} </NavItem>
        {!home && <NavItem list={dirList}> {directory} </NavItem>}
        {width < breakpoint && workTitle && <NavItem list={workList} deep={true}> {workTitle} </NavItem>}
      </ul>
    </nav>
  )
}

export default Navbar


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
      <div className={styles.navItem} onClick={handleClickOn} onKeyDown={handleClickOn} role="button" tabIndex="-1">
        {list && <span className={styles.navItemArrow}>
          <Icon.ChevronRight {...{strokeWidth: 1}}/>
        </span>}
        <span>
          {children}
        </span>
      </div>
      {open && <DropMenu list={list} deep={deep}/>}
    </li>
  )
}


const DropMenu = ({ list, deep }) => {
  const DropItem = ({ item }) => {
    let link, title;
    if (deep) {
      link = `../${item.slug}`
      title = item.title
    } else {
      link = item.slug
      title = item.directory
    }
    return (
      <Link to={link}> {title} </Link>
    )
  }
  return (
    <div className={styles.dropMenu}>
      {list.map((e, i) => <DropItem key={i} item={e}/>)}
    </div>
  )
}