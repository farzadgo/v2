import React from 'react'
import Img from 'gatsby-image'
import LB from 'lightbox-react'
import 'lightbox-react/style.css'
import * as styles from '../styles/components/Lightbox.module.css'


const Lightbox = ({
  images,
  selectedImage,
  handleClose,
  handlePrevRequest,
  handleNextRequest,
}) => {

  const array = []
  images.forEach(image =>
    array.push(<Img 
      fluid={image.childImageSharp.fluid}
      className={styles.lbImg}
      imgStyle={{ objectFit: 'contain' }}
    />)
  )

  return (
    <LB
      enableZoom={false}
      clickOutsideToClose={true}
      mainSrc={array[selectedImage]}
      nextSrc={array[(selectedImage + 1) % array.length]}
      prevSrc={array[(selectedImage + array.length - 1) % array.length]}
      onCloseRequest={handleClose}
      onMovePrevRequest={handlePrevRequest(selectedImage, array.length)}
      onMoveNextRequest={handleNextRequest(selectedImage, array.length)}
    />
  )
}

export default Lightbox
