import React, { useEffect, useRef, useState } from 'react'
// import { useStaticQuery, graphql, Link } from 'gatsby'
import { Helmet } from 'react-helmet'
import Layout from '../components/Layout'
import * as styles from '../styles/pages/Foyer.module.css'
import { pages } from '../config'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/js/controls/OrbitControls'

// import "useLoader" here
// import { Canvas, useFrame } from 'react-three-fiber'

// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
// import model from '../models/baba.gltf'

const Foyer = () => {
  
  const info = pages.home
  
  // const { nodes, materials } = useLoader(GLTFLoader, model )

  // implement three.js
  // const data = useStaticQuery(graphql`
  //   query Foyer {
  //     allFile(filter: {ext: {eq: ".gltf"}}) {
  //       nodes {
  //         base
  //         id
  //       }
  //     }
  //   }
  // `)

  
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
      var scene = new THREE.Scene();
      var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
      var renderer = new THREE.WebGLRenderer();

      renderer.setSize( window.innerWidth, window.innerHeight );
      mountRef.current.appendChild( renderer.domElement );

      var geometry = new THREE.BoxGeometry( 1, 1, 1 );
      var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
      var cube = new THREE.Mesh( geometry, material );

      scene.add( cube );
      camera.position.z = 5;

      var animate = function () {
        requestAnimationFrame( animate );
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        renderer.render( scene, camera );
      };

      let onWindowResize = function () {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
      };

      window.addEventListener("resize", onWindowResize, false);
      
      animate();

      // let container, camera, renderer, controls;
      // let sceneL, sceneR;

      // let sliderPos = window.innerWidth / 2;

      // init();

      // function init() {

      // 		container = document.querySelector( '.container' );

      // 		sceneL = new THREE.Scene();
      // 		sceneL.background = new THREE.Color( 0xBCD48F );

      // 		sceneR = new THREE.Scene();
      // 		sceneR.background = new THREE.Color( 0x8FBCD4 );

      // 		camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 0.1, 100 );
      // 		camera.position.z = 6;

      // 		controls = new OrbitControls( camera, container );

      // 		const light = new THREE.HemisphereLight( 0xffffff, 0x444444, 1 );
      // 		light.position.set( - 2, 2, 2 );
      // 		sceneL.add( light.clone() );
      // 		sceneR.add( light.clone() );

      // 		initMeshes();
      // 		initSlider();

      // 		renderer = new THREE.WebGLRenderer( { antialias: true } );
      // 		renderer.setPixelRatio( window.devicePixelRatio );
      // 		renderer.setSize( window.innerWidth, window.innerHeight );
      // 		renderer.setScissorTest( true );
      // 		renderer.setAnimationLoop( render );
      // 		container.appendChild( renderer.domElement );

      // 		window.addEventListener( 'resize', onWindowResize );

      // 	}

      // 	function initMeshes() {

      // 		const geometry = new THREE.IcosahedronGeometry( 1, 3 );

      // 		const meshL = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial() );
      // 		sceneL.add( meshL );

      // 		const meshR = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial( { wireframe: true } ) );
      // 		sceneR.add( meshR );

      // 	}

      // 	function initSlider() {

      // 		const slider = document.querySelector( '.slider' );

      // 		function onPointerDown() {

      // 			if ( event.isPrimary === false ) return;

      // 			controls.enabled = false;

      // 			window.addEventListener( 'pointermove', onPointerMove );
      // 			window.addEventListener( 'pointerup', onPointerUp );

      // 		}

      // 		function onPointerUp() {

      // 			controls.enabled = true;

      // 			window.removeEventListener( 'pointermove', onPointerMove );
      // 			window.removeEventListener( 'pointerup', onPointerUp );

      // 		}

      // 		function onPointerMove( e ) {

      // 			if ( event.isPrimary === false ) return;

      // 			sliderPos = Math.max( 0, Math.min( window.innerWidth, e.pageX ) );

      // 			slider.style.left = sliderPos - ( slider.offsetWidth / 2 ) + "px";

      // 		}

      // 		slider.style.touchAction = 'none'; // disable touch scroll
      // 		slider.addEventListener( 'pointerdown', onPointerDown );

      // 	}

      // 	function onWindowResize() {

      // 		camera.aspect = window.innerWidth / window.innerHeight;
      // 		camera.updateProjectionMatrix();

      // 		renderer.setSize( window.innerWidth, window.innerHeight );

      // 	}

      // 	function render() {

      // 		renderer.setScissor( 0, 0, sliderPos, window.innerHeight );
      // 		renderer.render( sceneL, camera );

      // 		renderer.setScissor( sliderPos, 0, window.innerWidth, window.innerHeight );
      // 		renderer.render( sceneR, camera );

      // 	}

    }

  }, [isMounted])
  

  return (
    <Layout info={info}>
      <Helmet title={info.directory}/>

      <main className={`main ${styles.main}`} ref={mountRef}>
        
        {/* <Canvas>
          <SpinningBox />
        </Canvas> */}

        <div className={styles.message}>
          <p> Foyer under construction.. </p>
        </div>

      </main>

    </Layout>
  )
}

export default Foyer