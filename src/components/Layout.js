import React, { useState, useContext, createContext } from 'react'
import Head from './Head'
import Navbar from './Navbar'

export const themes = {
  light: 'light',
  dark: 'dark'
}

export const ThemeContext = createContext({
  theme: undefined,
  setTheme: async (theme) => null
});

export const useTheme = () => useContext(ThemeContext)

const Layout = ({ children, info }) => {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme')
      return savedTheme ? savedTheme : themes.light
    }
  })

  return (
    <ThemeContext.Provider value={{theme, setTheme}}>
      <Head />
      <div id="root">
        <Navbar info={info} />
        <div id="content"> {children} </div>
      </div>
      </ThemeContext.Provider>
  )
}

export default Layout