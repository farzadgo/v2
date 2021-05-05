import React, { useState, useEffect } from 'react'
import Head from './Head'
import Navbar from './Navbar'
import Menu from './Menu'
import Footer from './Footer'
import Loader from './Loader'
import { useLocation } from '@reach/router'
// import '../styles/global.css' /* imported in gatsby-browser.js */



const Layout = ({ children, info }) => {

  const { pathname } = useLocation()
  const isHome = pathname === '/'
  const [isLoading, setIsLoading] = useState(isHome)
  const [toggle, setToggle] = useState(false)
  const toggler = () => setToggle(prev => !prev)

  useEffect(() => {
    if (isLoading) {
      return
    }
    if (toggle) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isLoading, toggle])

  return (
    <>
      <Head />
      <div id="root">
        {isLoading && isHome ? (
          <Loader finishLoading={() => setIsLoading(false)} />
        ) : (
          <>
            <Navbar info={info} setToggle={toggler}/>
            {toggle && <Menu setToggle={toggler}/>}
            <div id="content">
              { children }
              <Footer info={info}/>
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default Layout
