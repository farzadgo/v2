import React, { useEffect, useState } from 'react'
import { X } from 'react-feather'
import * as styles from '../styles/components/SceneLauncher.module.css'
import useWindowSize from '../hooks/useWindowSize'
import PlayOverlay from './PlayOverlay'

const BREAKPOINT = 1000

const SceneLauncher = () => {
  const [open, setOpen] = useState(false)
  const [modelLoaded, setModelLoaded] = useState(false)
  const [pause, setPause] = useState(true)
  const [hasStarted, setHasStarted] = useState(false)
  const width = useWindowSize()

  const webGlContainer = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    // visibility (not display) so the container keeps its layout size while
    // hidden — the renderer/camera are sized from its bounding rect on setup,
    // before modelLoaded flips true
    visibility: modelLoaded ? 'visible' : 'hidden',
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

  const handleClose = () => {
    setOpen(false)
    setModelLoaded(false)
    setPause(true)
    setHasStarted(false)
  }

  useEffect(() => {
    if (!open) return

    let animID
    let cancelled = false
    let cleanup = () => {}

    (async () => {
      const [
        { Clock, WebGLRenderer, ACESFilmicToneMapping },
        { updatePlayer, controls, teleportPlayerIfOob, keydownFunc, keyupFunc },
        { camera },
        { scene },
        { manager, loadModels },
      ] = await Promise.all([
        import('three'),
        import('../3dcore/player'),
        import('../3dcore/camera'),
        import('../3dcore/scene'),
        import('../3dcore/loader'),
      ])

      if (cancelled) return

      const STEPS_PER_FRAME = 5
      const clock = new Clock()

      const container = document.querySelector('.webgl-container')
      const renderer = new WebGLRenderer({ antialias: true })
      renderer.setPixelRatio(window.devicePixelRatio)

      const { width: cw, height: ch } = container.getBoundingClientRect()
      renderer.setSize(cw, ch)
      camera.aspect = cw / ch
      camera.updateProjectionMatrix()

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
          setHasStarted(true)
        }
      }

      const onPointerLockChange = () => {
        if (document.pointerLockElement !== document.body) {
          stopAnim()
          setPause(true)
        }
      }

      const updateRenderer = () => {
        const { width: rw, height: rh } = container.getBoundingClientRect()
        renderer.setSize(rw, rh)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        return { rw, rh }
      }

      const onWindowResize = () => {
        const { rw, rh } = updateRenderer()
        camera.aspect = rw / rh
        camera.updateProjectionMatrix()
      }

      document.addEventListener('click', clickFunc)
      document.addEventListener('pointerlockchange', onPointerLockChange)
      document.addEventListener('keydown', keydownFunc)
      document.addEventListener('keyup', keyupFunc)
      document.body.addEventListener('mousemove', mousemoveFunc)
      window.addEventListener('resize', onWindowResize)

      loadModels()

      manager.onLoad = () => {
        setModelLoaded(true)
      }
      manager.onError = (url) => {
        console.log('error loading ' + url)
      }

      const animate = () => {
        const deltaTime = Math.min(0.05, clock.getDelta()) / STEPS_PER_FRAME
        for (let i = 0; i < STEPS_PER_FRAME; i++) {
          controls(deltaTime)
          updatePlayer(deltaTime)
          teleportPlayerIfOob()
        }
        renderer.render(scene, camera)
        animID = requestAnimationFrame(animate)
      }

      const stopAnim = () => {
        cancelAnimationFrame(animID)
      }

      cleanup = () => {
        stopAnim()
        document.removeEventListener('click', clickFunc)
        document.removeEventListener('pointerlockchange', onPointerLockChange)
        document.removeEventListener('keydown', keydownFunc)
        document.removeEventListener('keyup', keyupFunc)
        document.body.removeEventListener('mousemove', mousemoveFunc)
        window.removeEventListener('resize', onWindowResize)
        if (document.pointerLockElement === document.body) {
          document.exitPointerLock()
        }
      }
    })()

    return () => {
      cancelled = true
      cleanup()
    }
  }, [open])

  if (width < BREAKPOINT) return null

  return (
    <>
      <div className={styles.boxBtnContainer}>
        <div className={styles.boxBtn} onClick={() => setOpen(true)} aria-label="Get lost">
          <div className={styles.cube}>
            <div className={`${styles.face} ${styles.front}`}>get</div>
            <div className={`${styles.face} ${styles.right}`}>lost</div>
            <div className={`${styles.face} ${styles.back}`}>get</div>
            <div className={`${styles.face} ${styles.left}`}>lost</div>
            {/* <div className={`${styles.face} ${styles.top}`}></div> */}
            {/* <div className={`${styles.face} ${styles.bottom}`}></div> */}
          </div>
        </div>
      </div>

      {open && (
        <div className={styles.modalRoot}>
          {pause && (
            <button className={styles.closeButton} onClick={handleClose} aria-label="Close">
              <X />
            </button>
          )}

          <div className="webgl-container" style={webGlContainer}> </div>

          <PlayOverlay pause={pause} modelLoaded={modelLoaded} hasStarted={hasStarted} />

          {!pause && <div style={ctrlStyle}>
            <ul>
              <li>menu <span>_Esc</span></li>
              <li>walk directions <span>_W_A_S_D</span></li>
              <li>jump <span>_Space</span></li>
              <li>look around <span>_Mouse</span></li>
            </ul>
          </div>}
        </div>
      )}
    </>
  )
}

export default SceneLauncher
