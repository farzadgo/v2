import React, { useEffect, useState } from 'react'
import { graphql, Link } from 'gatsby'
import Layout from '../components/Layout'
import * as styles from '../styles/pages/Works.module.css'
import Img from 'gatsby-image'
import { gsap } from 'gsap'
import { Draggable } from 'gsap/Draggable'
import * as Icon from 'react-feather'
import { Helmet } from 'react-helmet'
import { debounce } from '../utilities/helpers'
import { pages } from '../config'

if (typeof window !== "undefined") {
  gsap.registerPlugin(Draggable);
}

export default function Works({ data }) {

  const info = pages.works
  const works = data.allMarkdownRemark.nodes
  const length = works.length
  const [width, setWidth] = useState(0)
  // const elementsRef = useRef(null)

  const handleResize = debounce(() => setWidth(window.innerWidth), 1000)

  useEffect(() => {
    // elementsRef.current.map(ref => ref.current.focus())
    let elements = document.querySelectorAll('.card')
    elements.forEach(el => {
      Draggable.create(el, { type:"x,y", edgeResistance:0.65, bounds:"#content", inertia:false }); 
    })
    setWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [handleResize])

  return (
    <Layout info={info} >
      <Helmet title="Works" />
      <main className="main">
        <header className={styles.header}>
          <h1> {info.directory} </h1>
        </header>
        
        <div className={styles.body}>
          {works.map((e, i) =>
            <Card
              key={i}
              index={i}
              work={e}
              length={length}
              width={width}
            />
          )}
        </div>
        
      </main>
    </Layout>
  )
}


const Card = ({ index, work, length, width }) => {

  const iconProps = {
    color: '#272727',
    size: 28,
    strokeWidth: 1.5
  }
  const { title, thumb, slug, date } = work.frontmatter
  const shortDate = date.slice(0, -3)

  let cardWidth, factor;
  if (width < 700) {
    cardWidth = 250
    factor = ((width - 20 - cardWidth) / (length * 0.8))
  } else {
    cardWidth = 450
    factor = ((width - cardWidth) / (length * 1.6))
  }
  // const r = (Math.floor(Math.random() * 100) / 100)
  const f1 = 28 / (length - 1)

  const style = {
    // top: `${r * 25}vh`,
    // top: `${index * 50}px`,
    top: `${index * f1}vh`,
    // left: `${r * 40}vw`,
    // left: `${index * 80}px`,
    left: `${index * factor}px`,
    // width: `${width / 3}px`
    width: `${cardWidth}px`
  }

  return (
    <div style={style} className={`${styles.card} card`}>
      <Img
        fluid={thumb.childImageSharp.fluid}
        // className={styles.cardImg}
      />
      <div className={styles.cardInfo}>
        <div>
          <h3>{ title }</h3>
          <h4><i>{ shortDate }</i></h4>
        </div>
        <Link
          to={"/works/" + slug}
          className={styles.cardArrow}
        >
          <Icon.ArrowRight {...iconProps}/>
        </Link>
      </div>
    </div>
  )
}


export const query = graphql`
  query WorksPage {
    allMarkdownRemark(
      filter: {fileAbsolutePath: {regex: "/works/"}}
      sort: {fields: frontmatter___date, order: ASC}
    ) {
      nodes {
        frontmatter {
          slug
          title
          date
          thumb {
            childImageSharp {
              fluid(maxHeight: 440, maxWidth: 660, cropFocus: CENTER) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
        id
      }
    }
  }
`


