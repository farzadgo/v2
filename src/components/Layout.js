import React, { useEffect, useState } from 'react';
import Head from './Head';
import Navbar from './Navbar';


const Layout = ({ children, info }) => {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme ? savedTheme : 'light';
    }
  })

  const themeToggle = () => {
    setTheme(prev => {
      const newTheme = prev === 'light' ? 'dark' : 'light';
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', newTheme);
      }
      return newTheme;
    });
  };

  useEffect(() => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', theme);
      }
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