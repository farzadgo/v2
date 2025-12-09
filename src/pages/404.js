import React from 'react'
import Layout from '../components/Layout'
import { Helmet } from 'react-helmet'

const NotFound = () => {
  const info = { directory: '', workTitle: ''}
  const notFoundStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontFamily: 'var(--code-font)',
    fontSize: 'var(--font-sm)'
  }

  return (
    <Layout info={info}>
      <Helmet title='Not Found' />
      <main className='main'>
        <div style={notFoundStyle}>
          <p> --- page not found --- </p>
        </div>
      </main>
    </Layout>
  )
}

export default NotFound