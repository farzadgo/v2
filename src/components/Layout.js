import React, { useState, useEffect } from 'react'
import Head from './Head'
import Navbar from './Navbar'
import Menu from './Menu'
import Footer from './Footer'
// import '../styles/global.css' /* imported in gatsby-browser.js */



const Layout = ({ children, info }) => {

  const [toggle, setToggle] = useState(false)
  const toggler = () => setToggle(prev => !prev)

  useEffect(() => {
    if (toggle) {
      document.body.style.overflow = 'hidden'
      // document.body.style.paddingRight = '15px'
    }
    return () => {
      document.body.style.overflow = 'unset'
      // document.body.style.paddingRight = '0px'
    }
  }, [toggle])

  return (
    <>
      <Head />
      <div id="root">
        <Navbar info={info} setToggle={toggler}/>
        {toggle && <Menu setToggle={toggler}/>}
        <div id="content">
          { children }
          <Footer info={info}/>
        </div>
      </div>
      
    </>
  )
}

export default Layout
