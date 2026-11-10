import { useEffect } from 'react'

// mouse drag-to-scroll with momentum for a horizontally scrolling element
// clicks that end a drag are swallowed so they don't open the image under the cursor
const useDragScroll = (ref) => {
  useEffect(() => {
    const element = ref.current
    if (!element) return

    let isDragging = false
    let startX = 0
    let startScroll = 0
    let moved = 0
    let velocity = 0
    let lastX = 0
    let lastTime = 0
    let frame = null

    const endMomentum = () => {
      cancelAnimationFrame(frame)
      element.style.scrollSnapType = ''
    }

    const animateMomentum = () => {
      velocity *= 0.98 // adjust for faster or slower deceleration
      element.scrollLeft -= velocity
      if (Math.abs(velocity) > 0.01) {
        frame = requestAnimationFrame(animateMomentum)
      } else {
        endMomentum()
      }
    }

    const handleMouseDown = (e) => {
      isDragging = true
      moved = 0
      startX = lastX = e.pageX
      startScroll = element.scrollLeft
      lastTime = Date.now()
      velocity = 0

      cancelAnimationFrame(frame)
      element.style.cursor = 'grabbing'
      element.style.scrollSnapType = 'none' // snapping would fight the drag
    }

    const handleMouseMove = (e) => {
      if (!isDragging) return
      e.preventDefault()

      const x = e.pageX
      moved = Math.max(moved, Math.abs(x - startX))
      element.scrollLeft = startScroll - (x - startX)

      const now = Date.now()
      const deltaTime = now - lastTime
      if (deltaTime > 0) velocity = (x - lastX) / deltaTime
      lastX = x
      lastTime = now
    }

    const handleMouseUpOrLeave = () => {
      if (!isDragging) return
      isDragging = false
      element.style.cursor = 'grab'
      // a pause before releasing means no fling
      if (Date.now() - lastTime > 80) velocity = 0
      animateMomentum()
    }

    const handleClick = (e) => {
      if (moved > 5) {
        e.preventDefault()
        e.stopPropagation()
      }
    }

    element.style.cursor = 'grab'
    element.addEventListener('mousedown', handleMouseDown)
    element.addEventListener('mousemove', handleMouseMove)
    element.addEventListener('mouseup', handleMouseUpOrLeave)
    element.addEventListener('mouseleave', handleMouseUpOrLeave)
    element.addEventListener('click', handleClick, true)

    return () => {
      endMomentum()
      element.removeEventListener('mousedown', handleMouseDown)
      element.removeEventListener('mousemove', handleMouseMove)
      element.removeEventListener('mouseup', handleMouseUpOrLeave)
      element.removeEventListener('mouseleave', handleMouseUpOrLeave)
      element.removeEventListener('click', handleClick, true)
    }
  }, [ref])
}

export default useDragScroll
