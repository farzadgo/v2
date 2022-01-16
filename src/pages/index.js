import React, { useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet'
import Layout from '../components/Layout'
import Spinner from '../components/Spinner'
import Menu from '../components/Menu'
import { pages } from '../config'

import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Octree } from 'three/examples/jsm/math/Octree.js'
import { Capsule } from 'three/examples/jsm/math/Capsule.js'


const Foyer = () => {
  
  const info = pages.home
  const mountRef = useRef(null)
  const [modelLoaded, setModelLoaded] = useState(false)
  const [modelError, setModelError] = useState(false)
  const [pause, setPause] = useState(true)

  const mainStyle = {
    width: '100%',
    height: '100%',
    padding: 0,
    margin: 0
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
    padding: 'var(--gap)',
    color: 'rgb(0, 180, 0',
    lineHeight: '1.4em',
    fontFamily: 'var(--code-font)',
    fontWeight: 'bold',
    fontSize: 'var(--font-lg)',
    textShadow: '1px 1px 0 rgb(33, 33, 33)',
  }
  
  useEffect(() => {

    let animID
    const GRAVITY = 30
    const STEPS_PER_FRAME = 5
    const modelUrl = 'https://raw.githubusercontent.com/farzadgo/v2/master/src/models/collision-world.glb'

    // CLOCK & SCENE & CAMERA
    const clock = new THREE.Clock()

    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#494949')

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.rotation.order = 'YXZ'
    // camera.position.z = 5

    // LIGHTS
    const ambientlight = new THREE.AmbientLight(0x6688cc)
    scene.add(ambientlight)

    const fillLight1 = new THREE.DirectionalLight(0xff9999, 0.5)
    fillLight1.position.set(- 1, 1, 2)
    scene.add(fillLight1)

    const fillLight2 = new THREE.DirectionalLight(0x8888ff, 0.2)
    fillLight2.position.set(0, - 1, 0)
    scene.add(fillLight2)

    const directionalLight = new THREE.DirectionalLight(0xffffaa, 1.2)
    directionalLight.position.set(- 5, 25, - 1)
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.near = 0.01
    directionalLight.shadow.camera.far = 500
    directionalLight.shadow.camera.right = 30
    directionalLight.shadow.camera.left = - 30
    directionalLight.shadow.camera.top	= 30
    directionalLight.shadow.camera.bottom = - 30
    directionalLight.shadow.mapSize.width = 1024
    directionalLight.shadow.mapSize.height = 1024
    directionalLight.shadow.radius = 4
    directionalLight.shadow.bias = - 0.00006
    scene.add(directionalLight)

    // const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
    // light.position.set(- 2, 2, 2)
    // scene.add(light.clone())

    // CONTAINER & RENDERER & LOADER
    const container = document.querySelector('.webgl-container')

    const renderer = new THREE.WebGLRenderer({antialias: true})
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.VSMShadowMap
    container.appendChild(renderer.domElement)

    const worldOctree = new Octree()
    const playerCollider = new Capsule(new THREE.Vector3(0, 0.35, 0), new THREE.Vector3(0, 1, 0), 0.35)
    const playerVelocity = new THREE.Vector3()
    const playerDirection = new THREE.Vector3()
      
    const keyStates = {}

    const keydownFunc = event => keyStates[event.code] = true
    const keyupFunc = event => keyStates[event.code] = false
    const clickFunc = event => {
      let mainClass
      let allClass = event.target.className
      if (typeof allClass === 'string') {
        mainClass = allClass.split(' ')[0]
      }
      if (mainClass === 'play-btn' && window.innerWidth > 600) {
        document.body.requestPointerLock()
        animate()
        setPause(false)
      }
      if (mainClass === 'play-btn' && window.innerWidth < 599) {
        alert('3D space functions only on desktop mode!')
      }
      
    }
    const onPointerLockChange = () => {
      if (document.pointerLockElement !== document.body) {
        stopAnim()
        setPause(true)
      }
      // setPause(prev => !prev)
    }
    const mousemoveFunc = event => {
      if (document.pointerLockElement === document.body) {
        camera.rotation.y -= event.movementX / 500
        camera.rotation.x -= event.movementY / 500
      }
    }
    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    document.addEventListener('keydown', keydownFunc)
    document.addEventListener('keyup', keyupFunc)
    document.addEventListener('click', clickFunc)
    document.addEventListener('pointerlockchange', onPointerLockChange)
    document.body.addEventListener('mousemove', mousemoveFunc)
    window.addEventListener('resize', onWindowResize)

    let playerOnFloor = false;

    function playerCollisions() {
      const result = worldOctree.capsuleIntersect(playerCollider)
      playerOnFloor = false
      if (result) {
        playerOnFloor = result.normal.y > 0
        if (!playerOnFloor) {
          playerVelocity.addScaledVector( result.normal, - result.normal.dot(playerVelocity))
        }
        playerCollider.translate(result.normal.multiplyScalar(result.depth))
      }
    }

    function updatePlayer(deltaTime) {
      let damping = Math.exp(- 4 * deltaTime) - 1
      if (!playerOnFloor) {
        playerVelocity.y -= GRAVITY * deltaTime
        // small air resistance
        damping *= 0.1
      }
      playerVelocity.addScaledVector(playerVelocity, damping)
      const deltaPosition = playerVelocity.clone().multiplyScalar(deltaTime)
      playerCollider.translate(deltaPosition)
      playerCollisions()
      camera.position.copy(playerCollider.end)
    }

    function getForwardVector() {
      camera.getWorldDirection(playerDirection)
      playerDirection.y = 0
      playerDirection.normalize()
      return playerDirection
    }

    function getSideVector() {
      camera.getWorldDirection(playerDirection)
      playerDirection.y = 0
      playerDirection.normalize()
      playerDirection.cross(camera.up)
      return playerDirection
    }

    function controls(deltaTime) {
      // gives a bit of air control
      const speedDelta = deltaTime * (playerOnFloor ? 25 : 8);
      if (keyStates['KeyW']) {
        playerVelocity.add(getForwardVector().multiplyScalar(speedDelta));
      }
      if (keyStates['KeyS']) {
        playerVelocity.add(getForwardVector().multiplyScalar(-speedDelta));
      }
      if (keyStates['KeyA']) {
        playerVelocity.add(getSideVector().multiplyScalar(-speedDelta));
      }
      if (keyStates['KeyD']) {
        playerVelocity.add(getSideVector().multiplyScalar(speedDelta));
      }
      if (playerOnFloor) {
        if (keyStates['Space']) {
          playerVelocity.y = 15;
        }
      }
    }
    
    // start of --- LOADER
    const loader = new GLTFLoader()

    loader.load(
      modelUrl, 
      gltf => {
        const objects = gltf.scene.children
        // console.log(objects)
        // objects.map(e => {
        //   e.material = new THREE.MeshNormalMaterial({wireframe: true, color: 0xffffff})
        // })
        scene.add(gltf.scene)
        if (objects) {
          // console.log('model loaded')
          setModelLoaded(true)
        }
        worldOctree.fromGraphNode(gltf.scene)
        gltf.scene.traverse(child => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.material.map) {
              child.material.map.anisotropy = 8
            }
          }
        })
        // originally animate was called here > animate()
      },
      xhr => {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded')
      },
      error => {
        // console.log('model load error')
        alert('3D model loading failed! Please continue to check the website :)')
        setModelLoaded(true)
        setModelError(true)
      }
    )
    // end of --- LOADER


    function teleportPlayerIfOob() {
      if (camera.position.y <= -25) {
        playerCollider.start.set(0, 0.35, 0)
        playerCollider.end.set(0, 1, 0)
        playerCollider.radius =  0.35
        camera.position.copy(playerCollider.end)
        camera.rotation.set(0, 0, 0)
      }
    }


    function animate() {
      // console.log('animating')
      const deltaTime = Math.min( 0.05, clock.getDelta()) / STEPS_PER_FRAME
      // we look for collisions in substeps to mitigate the risk of
      // an object traversing another too quickly for detection.
      for (let i = 0; i < STEPS_PER_FRAME; i ++) {
        controls(deltaTime)
        updatePlayer(deltaTime)
        teleportPlayerIfOob()
      }
      renderer.render(scene, camera)
      animID = requestAnimationFrame(animate)
    }

    const stopAnim = () => {
      // console.log('animation cancelled')
      cancelAnimationFrame(animID)
    }


    return () => {
      // console.log('unmounting Foyer...')
      document.removeEventListener('keydown', keydownFunc)
      document.removeEventListener('keyup', keyupFunc)
      document.removeEventListener('click', clickFunc)
      document.removeEventListener('pointerlockchange', onPointerLockChange)
      document.body.removeEventListener('mousemove', mousemoveFunc)
      window.removeEventListener('resize', onWindowResize)
    }

  }, [])

  
  return (
    <Layout info={info} pause={pause} >
      <Helmet title={info.directory}/>
      <main style={mainStyle} ref={mountRef}>
        {modelLoaded ? <Menu pause={pause} modelError={modelError}/> : <Spinner />}
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