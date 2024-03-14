import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Helmet } from 'react-helmet';
import { pages } from '../config';
import WorkList from '../components/WorkList';


const Works = () => {
  const info = pages.works;
  const [show, setShow] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setShow(1);
    }, 100);
  }, [])
  
  return (
    <Layout info={info} >
      <Helmet title={info.directory} />
      <main className="main" style={{transition: 'opacity 0.2s ease-in-out' , opacity: show}}>
        <WorkList dir={'./'}/>
      </main>
    </Layout>
  )
}

export default Works