import React from 'react'
import Head from './Head'
import Navbar from './Navbar'
import Footer from './Footer'


const Layout = ({ children, info }) => {
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