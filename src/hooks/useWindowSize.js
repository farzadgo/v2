import { useState, useEffect } from 'react';

const isBrowser = typeof window !== 'undefined';

const useWindowSize = () =>{
  const [width, setWidth] = useState(isBrowser && window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    }
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    }
  }, []);

  return width
}

export default useWindowSize;