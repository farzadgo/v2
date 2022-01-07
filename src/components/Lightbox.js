import React from 'react'
import Img from 'gatsby-image'
import LightB from 'lightbox-react'
import 'lightbox-react/style.css'


const Lightbox = ({
  images,
  selectedImage,
  handleClose,
  handlePrevRequest,
  handleNextRequest,
}) => {

  const style = {
    position: 'relative',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: '80%',
    height: '100%'
  }

  const array = []
  images.forEach(image =>
    array.push(<Img 
      fluid={image.childImageSharp.fluid}
      style={style}
      imgStyle={{ objectFit: 'contain' }}
    />)
  )

  return (
    <LightB
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