export const debounce = (callback, wait) => {
  let timeout = null
  return (...args) => {
    const next = () => callback(...args)
    clearTimeout(timeout)
    timeout = setTimeout(next, wait)
  }
}

export const throttle = (callback, limit) => {
  let throttling = false;
  return (...args) => {
    if (!throttling) {
      throttling = true;
      callback(...args);
      setTimeout(() => {
        throttling = false;
      }, limit);
    }
  }
}