import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import Layout from '../components/Layout'
import { pages } from '../config'
import WorksGrid from '../components/WorksGrid'
import SceneLauncher from '../components/SceneLauncher'


const Home = () => {
  const info = pages.home
  const [show, setShow] = useState(0)

  useEffect(() => {
    setTimeout(() => {
      setShow(1)
    }, 100)
  }, [])

  return (
    <Layout info={info}>
      <Helmet title={info.directory} />
      <main className="main" style={{transition: 'opacity 0.2s ease-in-out' , opacity: show}}>
        <WorksGrid />
        <SceneLauncher />
      </main>
    </Layout>
  )
}

export default Home
