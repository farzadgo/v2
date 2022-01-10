import React from 'react'
import Layout from '../components/Layout'
import { Helmet } from 'react-helmet'
import { colors } from '../config'

const NotFound = () => {
  const info = { directory: '', workTitle: ''}
  const notFoundStyle = {
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

  const emojiStyle = {
    fontSize: '1.8em'
  }

  return (
    <Layout info={info}>
      <Helmet title='Not Found' />
      <main className='main'>
        <div style={notFoundStyle}>
          <p style={emojiStyle}>
            <span role='img' aria-label='not found scream'>😱</span>
          </p>
          <p>page not found</p>
        </div>
      </main>
    </Layout>
  )
}

export default NotFound