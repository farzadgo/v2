import React, { useEffect, useState } from 'react';
import Head from './Head';
import Navbar from './Navbar';


const Layout = ({ children, info }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = window.localStorage.getItem('theme');
    return savedTheme ? savedTheme : 'light';
  })

  const themeToggle = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'))
  }

  useEffect(() => {
      window.localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <>
      <Head />
      <div id="root" data-theme={theme}>
        <Navbar info={info} themeToggle={themeToggle} theme={theme} />
        <div id="content"> {children} </div>
      </div>
    </>
  )
}

export default Layout