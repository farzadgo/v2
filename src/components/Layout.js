import React from 'react'
import Head from './Head'
import Navbar from './Navbar'
import Footer from './Footer'

// import { useLocation } from '@reach/router'
// import '../styles/global.css' /* imported in gatsby-browser.js */


const Layout = ({ children, info }) => {
  
  // const { pathname } = useLocation()
  // const isHome = pathname === '/'
  // const [isLoading, setIsLoading] = useState(isHome)
  // const [toggle, setToggle] = useState(false)
  // const toggler = () => setToggle(prev => !prev)

  // useEffect(() => {
  //   if (toggle) {
  //     document.body.style.overflow = 'hidden'
  //   }
  //   return () => {
  //     document.body.style.overflow = 'unset'
  //   }
  // }, [toggle])

  return (
    <>
      <Head />
      <div id="root">
        <>
          <Navbar info={info} />
          <div id="content">
            { children }
            <Footer info={info}/>
          </div>
        </>
      </div>
    </>
  )
}

export default Layout