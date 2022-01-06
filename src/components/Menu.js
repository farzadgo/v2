import React from 'react'
import { Link } from 'gatsby'
import * as styles from '../styles/components/Menu.module.css'
import * as Icon from 'react-feather'
import { email, colors, pages, socialMedia } from '../config'

const Menu = ({ pause, modelError }) => {
  const { about, works } = pages
  // const [ width, setWidth ] = useState(900)
  // const [ mobile, setMobile ] = useState(false)

  // const itemStyle = {
  //   height: `${sizes.navHeight}px`,
  //   opacity: mobile ? 0 : 1,
  //   color: mobile ? 'gold' : 'inherit'
  // }

  // const handleResize = debounce(() => setWidth(window.innerWidth), 1000)
  // console.log(mobile)

  // useEffect(() => {
  //   setWidth(window.innerWidth)
  //   // const nodesArray = [...document.querySelectorAll('.menu-item')]
  //   // console.log(nodesArray)
  //   // let hoverClass = 'nohover'
  //   // nodesArray.forEach(e => {
  //   //   if (width < 600) {
  //   //     e.classList.add(hoverClass)
  //   //   } else {
  //   //     e.classList.remove(hoverClass)
  //   //   }
  //   // })

  //   if (width < 600) {
  //     setMobile(true)
  //   } else {
  //     setMobile(false)
  //   }

  //   window.addEventListener('resize', handleResize)
  //   return () => {
  //     window.removeEventListener('resize', handleResize)
  //   }
  // }, [width])

  return (
   <>
      { pause && <div className={styles.container}>
        <nav className={styles.nav}>
          <ul>
            { !modelError && <li>
                <div className={`play-btn ${styles.boxScene}`}>
                  <div className={styles.box}>
                    <div className={styles.face}> get lost </div>
                    <div className={`${styles.side} ${styles.face}`}> start </div>
                  </div>
                </div> 
            </li> }
            <li>
              <span>(+)</span>
              <Link to={works.slug}> {works.directory}</Link>
            </li>
            <li>
              <span>(+)</span>
              <Link to={about.slug}> {about.directory} </Link>
            </li>
          </ul>
        </nav>
        <div className={styles.contact}>
          <div className={styles.social}>
            {socialMedia.map((item, i) => <SocialIcon key={i} item={item}/>)}
          </div>
          <p className={styles.email}> {email} </p>
        </div>
      </div> }
   </>
  )
}

export default Menu


const SocialIcon = ({ item }) => {
  const iconProps = {
    color: colors.lightWhite,
    size: 30,
    strokeWidth: 1
  }
  const TagName = Icon[item.name]
  return (
    <>
      <a href={item.url} aria-label={`${item.name} Link`} target="_blank" rel="noreferrer">
        <TagName {...iconProps}/>
      </a>
    </>
  )
}