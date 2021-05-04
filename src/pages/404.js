import React from 'react'
import Layout from '../components/Layout'
import * as styles from '../styles/pages/NotFound.module.css'
import { Helmet } from 'react-helmet'

const NotFound = () => {
  const info = { directory: '', workTitle: ''}
  return (
    <Layout info={info}>
      <Helmet title="Not Found" />
      <main className="main">
        <div className={styles.body}>
          <p>Page not found!</p>
          <p>Click ☰ for more</p>
        </div>
      </main>
    </Layout>
  )
}

export default NotFound
