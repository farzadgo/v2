import React, { useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet'
import Layout from '../components/Layout'
import Menu from '../components/Menu'
import { pages } from '../config'

import { Clock, WebGLRenderer, ACESFilmicToneMapping } from 'three'
import { updatePlayer, controls, teleportPlayerIfOob, keydownFunc, keyupFunc } from '../3dcore/player'
import { camera } from '../3dcore/camera'
import { scene } from '../3dcore/scene'
import { manager, loadModels } from '../3dcore/loader'


const isMobile = () => {
  if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    return true
  } else {
    return false
  }
}


const Foyer = () => {
  // restart the space (if preferred) from here
  // and send it other modules e.g. camera.js
  
  const info = pages.home
  const [show, setShow] = useState(0)
  const [mobile, setMobile] = useState(false)
  const mountRef = useRef(null)
  const [modelLoaded, setModelLoaded] = useState(false)
  // const [modelError, setModelError] = useState(false)
  const [pause, setPause] = useState(true)

  const mainStyle = {
    width: '100%',
    height: '100%',
    padding: 0,
    margin: 0,
    transition: 'opacity 0.5s ease-in-out',
    opacity: show ? 1 : 0
  }

  const webGlContainer = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    display: modelLoaded ? 'block' : 'none',
    overflow: 'hidden'
  }

  const ctrlStyle = {
    position: 'absolute',
    bottom: '0',
    zIndex: '5',
    padding: 'var(--padding)',
    color: 'rgb(0, 180, 0)',
    lineHeight: '1.4em',
    fontFamily: 'var(--code-font)',
    fontWeight: 'bold',
    fontSize: 'var(--font-sm)',
    textShadow: '1px 1px 0 rgb(33, 33, 33)',
  }

  useEffect(() => {

    let animID
    const STEPS_PER_FRAME = 5
    const clock = new Clock()


    const container = document.querySelector('.webgl-container')
    const renderer = new WebGLRenderer({antialias: true})
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.toneMapping = ACESFilmicToneMapping
    renderer.toneMappingExposure = 0.48
    container.appendChild(renderer.domElement)


    const mousemoveFunc = event => {
      if (document.pointerLockElement === document.body) {
        camera.rotation.y -= event.movementX / 500
        camera.rotation.x -= event.movementY / 500
      }
    }

    const clickFunc = event => {
      let mainClass
      let allClass = event.target.className
      if (typeof allClass === 'string') {
        mainClass = allClass.split(' ')[0]
      }
      if (mainClass === 'play-btn') {
        document.body.requestPointerLock()
        animate()
        setPause(false)
      }
    }

    const onPointerLockChange = () => {
      if (document.pointerLockElement !== document.body) {
        stopAnim()
        setPause(true)
      }
    }

    const updateRenderer = () => {
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }

    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      updateRenderer()
    }

    document.addEventListener('click', clickFunc)
    document.addEventListener('pointerlockchange', onPointerLockChange)
    document.addEventListener('keydown', keydownFunc)
    document.addEventListener('keyup', keyupFunc)
    document.body.addEventListener('mousemove', mousemoveFunc)
    window.addEventListener('resize', onWindowResize)


    if (!isMobile()) {
      loadModels()
    } else {
      setMobile(true)
    }
    
    manager.onLoad = () => {
      console.log('Loading complete!')
      setModelLoaded(true)
    }
    manager.onProgress = (_url, itemsLoaded, itemsTotal) => {
      console.log(`loaded: ${itemsLoaded}/${itemsTotal}`)
    }
    manager.onError = (url) => {
      console.log('error loading ' + url)
      // setModelError(true)
    }

    const animate = () => {
      const deltaTime = Math.min( 0.05, clock.getDelta()) / STEPS_PER_FRAME
      for (let i = 0; i < STEPS_PER_FRAME; i ++) {
        controls(deltaTime)
        updatePlayer(deltaTime)
        teleportPlayerIfOob()
      }
      renderer.render(scene, camera)
      animID = requestAnimationFrame(animate)
    }

    const stopAnim = () => {
      cancelAnimationFrame(animID)
      // console.log(camera.position)
    }

    setShow(1)

    return () => {
      console.log('unmount getLost')
      document.removeEventListener('click', clickFunc)
      document.removeEventListener('pointerlockchange', onPointerLockChange)
      document.removeEventListener('keydown', keydownFunc)
      document.removeEventListener('keyup', keyupFunc)
      document.body.removeEventListener('mousemove', mousemoveFunc)
      window.removeEventListener('resize', onWindowResize)
    }

  }, [])

  
  return (
    <Layout info={info}>
      <Helmet title={info.directory}/>
      <main style={mainStyle} ref={mountRef}>
        <Menu pause={pause} mobile={mobile} modelLoaded={modelLoaded}/>
        <div className='webgl-container' style={webGlContainer}> </div>
        {!pause && <div style={ctrlStyle}>
          <ul>
            <li>menu <span>_Esc</span></li>
            <li>walk directions <span>_W_A_S_D</span></li>
            <li>jump <span>_Space</span></li>
            <li>look around <span>_Mouse</span></li>
          </ul>
        </div>}
      </main>
    </Layout>
  )
}

export default Foyer