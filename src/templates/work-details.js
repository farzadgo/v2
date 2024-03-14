import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import Layout from '../components/Layout';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import * as styles from '../styles/pages/WorkDetails.module.css'
import { graphql } from 'gatsby';
import { Helmet } from 'react-helmet';
import WorkList from '../components/WorkList';

const isBrowser = typeof window !== 'undefined';

const WorkDetails = ({ data }) => {
  
  const { html } = data.markdownRemark;
  const { title } = data.markdownRemark.frontmatter;
  const images = data.allFile.nodes;

  const info = {directory: 'works', workTitle: title};
  const htmlRef = useRef(null);

  const [showAlt, setShowAlt] = useState(true);
  const altGalleryRef = useRef(null);

  const [root, setRoot] = useState(null);
  
  const [show, setShow] = useState(0);
  const [width, setWidth] = useState(isBrowser && window.innerWidth);
  

  const groupImages = (imgs) => {
    const grouped = {}
    imgs.forEach((img) => {
      const prefix = img.name.split('_')[0]
      if (!grouped[prefix]) {
        grouped[prefix] = []
      }
      grouped[prefix].push(img)
    })
    return grouped
  }

  const appendImages = (container, imgs) => {
    const images = imgs.map((img) => {
      return (
        <div key={img.id} className={styles.image}>
          <GatsbyImage
            image={getImage(img)}
            alt={img.name}
          />
        </div>
      )
    });

    const credits = container.getAttribute('data-credits');
    const caption = credits ? <div key={container.className} className={styles.caption}> {credits} </div> : null;

    if (!root) {
      let root = createRoot(container);
      setRoot(root);
      let allContent = [caption, images];
      // root.render(images);
      root.render(allContent);
    }
  }

  const appendImagesInGroups = (container, imgs) => {
    // console.log(imgs);
    const groups = groupImages(imgs);
    Object.keys(groups).forEach((prefix) => {
      const imgContainer = container.querySelector(`.${prefix}`);
      if (groups[prefix]) {
        appendImages(imgContainer, groups[prefix]);
      }
    })
  }


  useEffect(() => {

    setTimeout(() => {
      setShow(1);
    }, 100);

    if (htmlRef.current) {
      let imageContainers = htmlRef.current.querySelectorAll('.gallery');
      if (imageContainers.length > 1) {
        appendImagesInGroups(htmlRef.current, images);
        setShowAlt(false);
      } else if (imageContainers.length === 1) {
        appendImages(imageContainers[0], images);
        setShowAlt(false);
      } else {
        if (images.length > 0) {
          appendImages(altGalleryRef.current, images);
        } else {
          setShowAlt(false);
        }
      }
    }

    window.addEventListener('resize', () => setWidth(window.innerWidth));
    return () => window.removeEventListener('resize', () => setWidth(window.innerWidth));
  }, [])


  return (
    <Layout info={info} >
      <Helmet title={title} />
      <main className="main">

        {width > 900 && <WorkList dir={'../'}/>}

        <div className={styles.container} style={{opacity: show}}>
          <header><h1 style={{display: 'none'}}> {title} </h1></header>
          <div className={styles.html} dangerouslySetInnerHTML={{__html: html}} ref={htmlRef}/>
          {showAlt && <div><div ref={altGalleryRef} className='gallery'></div></div>}
        </div>

      </main>
    </Layout>
  )
}

export default WorkDetails


export const query = graphql`
  query WorkPage($slug: String, $dir: String) {
    markdownRemark(frontmatter: {slug: {eq: $slug}}) {
      html
      frontmatter {
        title
        date
      }
    }
    allFile(filter: {
      extension: {regex: "/(jpg)|(png)|(jpeg)/"}, relativeDirectory: {eq: $dir}}
      sort: {name: ASC}
    ) {
      nodes {
        name
        id
        childImageSharp {
          gatsbyImageData(
            quality: 90,
            layout: CONSTRAINED,
            placeholder: BLURRED,
          )
        }
      }
    }
  }
`