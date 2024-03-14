import React, { useState, useEffect } from 'react';
import { Link } from 'gatsby';
import * as styles from '../styles/components/Menu.module.css';
import { pages } from '../config';
import Spinner from './Spinner';

const Menu = ({ pause, mobile, modelLoaded }) => {
  const { about, works } = pages
  const [waited, setWaited] = useState(false);

  useEffect(() => {
    setWaited(false);
    if (pause) {
      setTimeout(() => {
        setWaited(true);
      }, 1000);
    }
  }, [pause])
  

  return (
   <>
      {pause && <div className={styles.container}>
        <nav className={styles.nav}>
          <ul>
            { modelLoaded ?
            <li>
              <div className={`play-btn ${styles.boxScene}`} style={{opacity: waited ? '1' : '0', pointerEvents: waited ? 'auto' : 'none'}}>
                <div className={styles.box}>
                  <div className={styles.face}> get lost </div>
                  <div className={`${styles.side} ${styles.face}`}> start </div>
                </div>
              </div>
            </li> :
            <Spinner mobile={mobile}/>
            }
            <li>
              <Link to={works.slug}> selected {works.directory} </Link>
            </li>
            <li>
              <Link to={about.slug}> {about.directory} </Link>
            </li>
          </ul>
        </nav>
      </div> }
   </>
  )
}

export default Menu