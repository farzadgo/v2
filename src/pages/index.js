import React, { useRef } from 'react'
// import { useStaticQuery, graphql, Link } from 'gatsby'
import { Helmet } from 'react-helmet'
import Layout from '../components/Layout'
import * as styles from '../styles/pages/Foyer.module.css'
import { pages } from '../config'

// import "useLoader" here
import { Canvas, useFrame } from 'react-three-fiber'

// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
// import model from '../models/baba.gltf'



// Last content check
// GitHub repo
// Build and Deploy



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


  const SpinningBox = () => {
    const mesh = useRef(null)
    useFrame(() => (mesh.current.rotation.x = mesh.current.rotation.y += 0.01))
    return (
      <mesh ref={mesh}>
        <boxBufferGeometry attach='geometry' args={1, 1, 1} />
        <meshStandardMaterial attach='material' />
      </mesh>
    )
  }
  
  
  return (
    <Layout info={info}>
      <Helmet title="Foyer" />

      <main className={`main ${styles.main}`}>
        <Canvas>
          <SpinningBox />
        </Canvas>
        <div className={styles.message}>
          <p> foyer under construction </p>
        </div>
      </main>

    </Layout>
  )
  
}

export default Foyer