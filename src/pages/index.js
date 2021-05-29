import React, { useEffect, useRef, useState } from 'react'
// import { useStaticQuery, graphql, Link } from 'gatsby'
import { Helmet } from 'react-helmet'
import Layout from '../components/Layout'
import * as styles from '../styles/pages/Foyer.module.css'
import { pages } from '../config'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// import "useLoader" here
// import { Canvas, useFrame } from 'react-three-fiber'

// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
// import model from '../models/baba.gltf'

const Foyer = () => {
  
  const info = pages.home

  const webGlContainer = {
    position: 'absolute',
    width: '100%',
    height: '100%'
  }

  const webGlSlider = {
    position: 'absolute',
    cursor: 'ew-resize',
    width: '40px',
    height: '40px',
    backgroundColor: '#F32196',
    opacity: '0.7',
    borderRadius: '50%',
    top: 'calc(50% - 20px)',
    left: 'calc(50% - 20px)'
  }
  
  // const { nodes, materials } = useLoader(GLTFLoader, model )
  
  // useEffect(() => {
  //   const loader = new GLTFLoader();
  //   loader.load(model, (gltf) => {
  //     console.log(gltf);
  //     // scene.add()
  //   })
  //   // return () => {
  //   //   cleanup
  //   // }
  // }, [])

  // const SpinningBox = () => {
  //   const mesh = useRef(null)
  //   useFrame(() => (mesh.current.rotation.x = mesh.current.rotation.y += 0.01))
  //   return (
  //     <mesh ref={mesh}>
  //       <boxBufferGeometry attach='geometry' args={1, 1, 1} />
  //       <meshStandardMaterial attach='material' />
  //     </mesh>
  //   )
  // }
  
  const [isMounted, setIsMounted] = useState(false)
  const mountRef = useRef(null);

  useEffect(() => {
    const timeout = setTimeout(() => setIsMounted(true), 2200)
    return () => clearTimeout(timeout)
  });

  useEffect(() => {
    // const el = document.getElementById('can');
    // const canvas = document.createElement('canvas');
    // mountRef.current = el;
    // return () => {
    //   console.log("ref", mountRef.current);
    // }

    if (isMounted) {

      let container, camera, renderer, controls;
      let sceneL, sceneR;

      let sliderPos = window.innerWidth / 2;

      init();

      function init() {

        container = document.querySelector('.webgl-container');

        sceneL = new THREE.Scene();
        sceneL.background = new THREE.Color( '#383838' );

        sceneR = new THREE.Scene();
        sceneR.background = new THREE.Color( '#F0F0F0' );

        camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 0.1, 100 );
        camera.position.z = 6;

        controls = new OrbitControls( camera, container );

        const light = new THREE.HemisphereLight( 0xffffff, 0x444444, 1 );
        light.position.set( - 2, 2, 2 );
        sceneL.add( light.clone() );
        sceneR.add( light.clone() );

        const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.125 );

				directionalLight.position.x = Math.random() - 0.5;
				directionalLight.position.y = Math.random() - 0.5;
				directionalLight.position.z = Math.random() - 0.5;
				directionalLight.position.normalize();

				sceneL.add( directionalLight );

        initMeshes();
        initSlider();

        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.setScissorTest( true );
        renderer.setAnimationLoop( render );
        container.appendChild( renderer.domElement );

        window.addEventListener( 'resize', onWindowResize );

      }

      function initMeshes() {

        const geometry = new THREE.IcosahedronGeometry( 1, 3 );

        const meshL = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial( { flatShading: true, specular: 0x009900 } ) );
        sceneL.add( meshL );

        const meshR = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial( { wireframe: true } ) );
        sceneR.add( meshR );

      }

      function initSlider() {

        const slider = document.querySelector('.webgl-slider');

        function onPointerDown( event ) {

          if ( event.isPrimary === false ) return;

          controls.enabled = false;

          window.addEventListener( 'pointermove', onPointerMove );
          window.addEventListener( 'pointerup', onPointerUp );

        }

        function onPointerUp() {

          controls.enabled = true;

          window.removeEventListener( 'pointermove', onPointerMove );
          window.removeEventListener( 'pointerup', onPointerUp );

        }

        function onPointerMove( event ) {

          if ( event.isPrimary === false ) return;

          sliderPos = Math.max( 0, Math.min( window.innerWidth, event.pageX ) );

          slider.style.left = sliderPos - ( slider.offsetWidth / 2 ) + "px";

        }

        slider.style.touchAction = 'none'; // disable touch scroll
        slider.addEventListener( 'pointerdown', onPointerDown );

      }

      function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );

      }

      function render() {

        renderer.setScissor( 0, 0, sliderPos, window.innerHeight );
        renderer.render( sceneL, camera );

        renderer.setScissor( sliderPos, 0, window.innerWidth, window.innerHeight );
        renderer.render( sceneR, camera );

      }

    }

  }, [isMounted])
  

  return (
    <Layout info={info}>
      <Helmet title={info.directory}/>

      <main className={`main ${styles.main}`} ref={mountRef}>
        
        {/* <Canvas>
          <SpinningBox />
        </Canvas> */}

        {/* <div className={styles.message}>
          <p> Foyer under construction.. </p>
        </div> */}

        <div className="webgl-container" style={webGlContainer}>
          <div className="webgl-slider" style={webGlSlider}></div>
        </div>

      </main>

    </Layout>
  )
}

export default Foyer