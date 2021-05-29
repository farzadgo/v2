import React, { useState, useEffect, useRef } from 'react'
import { useStaticQuery, graphql, Link, navigate } from 'gatsby'
import * as styles from '../styles/components/Navbar.module.css'
import * as Icon from 'react-feather'
import { debounce } from '../utilities/helpers'
import { pages, colors, sizes } from '../config'


const Navbar = ({ info, setToggle }) => {

  const data = useStaticQuery(graphql`
    query WorkList {
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

  const { directory, workTitle } = info
  const workList = data.allMarkdownRemark.nodes.map(e => e.frontmatter)
  const dirList = [ pages.works, pages.about, pages.developer ]

  // const { pathname } = useLocation()
  // const pathWords = pathname.split('/').filter(e => e)
  // const depth = pathWords.length

  const breakpoint = 600
  const homeTitle = 'Farzad Golghasemi'
  const [home, setHome] = useState(false)
  const [scrollPos, setScrollPos] = useState(0)
  const [visible, setVisible] = useState(true)
  const [width, setWidth] = useState(0)
  // const [bgColor, setBgColor] = useState('#1d1d1d')
  // const [textColor, setTextColor] = useState('#eeeeee')

  const style = {
    height: `${sizes.navHeight}px`,
    top: visible ? '0' : `-${sizes.navHeight}px`,
    backgroundColor: home ? colors.clear : colors.darkGray,
    color: home ? colors.darkGray : colors.lightWhite,
    fontWeight: home ? '600' : '300'
  }

  const handleScroll = debounce(() => {
    const currentScrollPos = window.pageYOffset
    setVisible((scrollPos > currentScrollPos && scrollPos - currentScrollPos > 80) || currentScrollPos < 10)
    setScrollPos(currentScrollPos)
  }, 100)

  const handleResize = debounce(() => setWidth(window.innerWidth), 1000)

  // const handleColor = () => {
  //   if (home) {
  //     setBgColor('#00000000')
  //     setTextColor('#272727')
  //   }
  // }

  useEffect(() => {
    if (!directory && !workTitle) {
      setHome(true)
    }
    setWidth(window.innerWidth)
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [scrollPos, directory, workTitle, handleScroll, handleResize])

  return (
    <nav className={styles.container} style={style}>
      
      <ul className={styles.directory}>
        {width > breakpoint && <NavItem home={home}> {homeTitle} </NavItem>}
        {width < breakpoint && !workTitle && !directory && <NavItem home={home}> {homeTitle} </NavItem>}

        {width < breakpoint && !workTitle && directory && <NavItem list={dirList}> {directory} </NavItem>}
        {width > breakpoint && directory && <NavItem list={dirList}> {directory} </NavItem>}

        {workTitle && <NavItem list={workList} deep={true}> {workTitle} </NavItem>}
      </ul>

      {home && <MenuBtn setToggle={setToggle} color={style.color}/>}
      {width < breakpoint && !home && <BackBtn workTitle={workTitle}/>}

    </nav>
  )
}

export default Navbar


const NavItem = ({ home, list, deep, children }) => {
  const [open, setOpen] = useState(false)
  const node = useRef()

  const iconProps = {
    color: '#eeeeee',
    size: 24,
    strokeWidth: 1
  }

  const handleClickOn = () => {
    if (list) {
      setOpen(!open)
    } else if (!home) {
      navigate("/")
    } else {
      console.log('fagosemi')
    }
  }

  const handleClickOut = e => {
    if (node.current.contains(e.target)) {
      // inside click
      return
    }
    // outside click
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
      <div
        className={styles.navItem}
        role="button"
        tabIndex="-1"
        onClick={handleClickOn}
        onKeyDown={handleClickOn}
      >
        {list && <span className={styles.navItemArrow}>
          <Icon.ChevronRight {...iconProps}/>
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


const BackBtn = ({ workTitle }) => {

  const [backWorks, setBackWorks] = useState(false)
  const iconProps = {
    color: '#eeeeee',
    size: 24,
    strokeWidth: 1
  }
  const icon = backWorks ? <Icon.ArrowLeft {...iconProps}/> : <Icon.Home {...iconProps}/>
  const handleClick = () => {
    backWorks ? navigate("/works") : navigate("/")
  }

  useEffect(() => {
    if (workTitle) {
      setBackWorks(true)
    }
  }, [workTitle])

  return (
    <button
      className={styles.button}
      type="button"
      aria-label="Menu"
      onClick={handleClick}
    >
      {icon}
    </button>
  )
}


const MenuBtn = ({ setToggle, color }) => {
  const iconProps = {
    color: color,
    size: 32,
    strokeWidth: 1
  }
  return (
    <button
      className={styles.button}
      type="button"
      aria-label="Menu"
      onClick={() => setToggle()}
    >
      <Icon.Menu {...iconProps}/>
    </button>
  )
}