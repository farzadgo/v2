import React from 'react';
import Head from './Head';
import Navbar from './Navbar';


const Layout = ({ children, info }) => {
  return (
    <>
      <Head />
      <div id="root">
        <Navbar info={info} />
        <div id="content"> {children} </div>
      </div>
    </>
  )
}

export default Layout