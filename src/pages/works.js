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
import { pages, colors, sizes } from '../config'

if (typeof window !== "undefined") {
  gsap.registerPlugin(Draggable);
}

export default function Works({ data }) {

  const info = pages.works
  const works = data.allMarkdownRemark.nodes
  const length = works.length

  const allCategories = works.map(e => {
    return e.frontmatter.categories
  })
  const categories = [...new Set(allCategories.flat(1))]
  const [category, setCategory] = useState('all work')
  const [width, setWidth] = useState(0)
  const mobileWidth = sizes.mobileWidth
  
  const handleCategory = e => {
    setCategory(e.target.value)
  }
 
  const handleResize = debounce(() => {
    setWidth(window.innerWidth)
  }, 1000)


  useEffect(() => {
    setWidth(window.innerWidth)
    // elementsRef.current.map(ref => ref.current.focus())
    let elements = document.querySelectorAll('.drag')
    elements.forEach(el => {
      Draggable.create(el, { type:"x,y", edgeResistance:0.65, bounds:"#content", allowEventDefault: true }); 
    })

    if (width < mobileWidth) {
      // console.log('draggable deactivated')
      elements.forEach(el => {
        Draggable.get(el).kill() 
      })
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [handleResize, width, mobileWidth])

  return (
    <Layout info={info} >
      <Helmet title={info.directory} />
      <main className="main" >
        <header className={styles.header}>
          <h1> {info.directory} </h1>
        </header>
        
        <div className={styles.body}>
          
          <div className={styles.selectorBox}>
            <select onChange={handleCategory}>
              <option value='all work'> all work </option>
              {categories.map((e, i) => <option key={i} value={e}>{e}</option>)}
            </select>
          </div>

          {works.map((e, i) =>
            <Card
              key={i}
              index={i}
              work={e}
              length={length}
              width={width}
              mobileWidth={mobileWidth}
              category={category}
            />
          )}
        </div>
        
      </main>
    </Layout>
  )
}


const Card = ({ index, work, length, width, mobileWidth, category }) => {

  const [selected, setSelected] = useState(false)
  const iconProps = {
    color: colors.lightWhite,
    size: 28,
    strokeWidth: 1
  }
  // const r = (Math.floor(Math.random() * 100) / 100)
  const {title, thumb, slug, date, categories} = work.frontmatter
  let cardWidth, pairs
  let style = {
    opacity: !selected ? 0.2 : 1
  }

  if (width < mobileWidth) {
    pairs = {
      position: 'relative',
      width: width - 50,
      marginBottom: '20px'
    }
  } else {
    cardWidth = 290
    let factor = ((width - cardWidth) / (length))
    pairs = {
      position: 'absolute',
      // top: `${r * 50}vh`,
      top: `${(index + 1) * 33}px`,
      left: `${index * factor}px`,
      width: cardWidth
    }
  }
  style = {...style, ...pairs}

  useEffect(() => {
    if (categories.includes(category) || category === 'all work') {
      setSelected(true)
    } else {
      setSelected(false)
    }
    return () => {
      // console.log('categoty selector')
    }
  }, [categories, category])

  // const f1 = 28 / (length - 1)
  // const style = {
  //   top: `${r * 50}vh`,
  //   // top: `${index * 50}px`,
  //   // top: `${(index + 0.3) * f1}vh`,
  //   // left: `${r * 40}vw`,
  //   // left: `${index * 80}px`,
  //   left: `${index * factor}px`,
  //   // width: `${width / 3}px`
  //   width: `${cardWidth}px`
  // }

  return (
    <div style={style} className={`${styles.card} drag`}>
      {thumb && <Img
        fluid={thumb.childImageSharp.fluid}
        className={styles.cardImage}
      />}
      <div className={styles.cardInfo}>
        <div>
          <h1>{title}</h1>
          <p style={{color: colors.codeGreen, fontWeight: 200}}>{date}</p>
          {/* <p>{categories}</p> */}
          {/* {exhibition && <p>Exhibition: {exhibition}</p>} */}
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
          title
          date
          slug
          categories
          exhibition
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


