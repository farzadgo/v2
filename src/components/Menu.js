import React from 'react'
import { Link } from 'gatsby'
import * as styles from '../styles/components/Menu.module.css'
import * as Icon from 'react-feather'
import { pages } from '../config'


const Menu = ({ setToggle }) => {
  const { about, developer, works } = pages

  return (
    <div className={styles.container}>

      <div className={styles.header}>
        <CloseBtn setToggle={setToggle}/>
      </div>

      <nav className={styles.nav}>
        <ul>
          <li><Link to={works.slug}> {works.directory} </Link></li>
          <li><Link to={about.slug}> {about.directory} </Link></li>
          <li><Link to={developer.slug}> {developer.directory} </Link></li>
        </ul>
      </nav>

    </div>
  )
}

export default Menu


const CloseBtn = ({ setToggle }) => {
  const iconProps = {
    color: '#2A2726',
    size: 32,
    strokeWidth: 1
  }
  return (
    <button
      className={styles.button}
      type="button"
      aria-label="Close"
      onClick={setToggle}
    >
      <Icon.X {...iconProps}/>
    </button>
  )
}