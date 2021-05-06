import React from 'react'
import Layout from '../components/Layout'
import { Helmet } from 'react-helmet'

const NotFound = () => {
  const info = { directory: '', workTitle: ''}
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontFamily: 'var(--code-font)',
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: '1.8em',
  }

  return (
    <Layout info={info}>
      <Helmet title="Not Found" />
      <main className="main">
        <div style={style}>
          <p>Page not found!</p>
          <p>Click ☰ for more</p>
        </div>
      </main>
    </Layout>
  )
}

export default NotFound
