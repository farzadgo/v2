import React from 'react'
import Layout from '../components/Layout'
import { Helmet } from 'react-helmet'
import { colors } from '../config'

const NotFound = () => {
  const info = { directory: '', workTitle: ''}
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontFamily: 'var(--code-font)',
    textAlign: 'center',
    lineHeight: '1.8em',
    color: colors.lightWhite,
    fontSize: '1.5em'
  }

  return (
    <Layout info={info}>
      <Helmet title="Not Found" />
      <main className="main">
        <div style={style}>
          <p style={{fontSize: '1.8em'}}>😱</p>
          <p>page not found</p>
        </div>
      </main>
    </Layout>
  )
}

export default NotFound
