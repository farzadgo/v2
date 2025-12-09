import { useRef } from 'react'

const useDragScroll = () => {
  const isDragging = useRef(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)
  const velocity = useRef(0)
  const animationFrame = useRef(null)
  const lastX = useRef(0)
  const lastTime = useRef(0)

  const easeOut = (velocity) => {
    if (Math.abs(velocity) < 0.01) return 0
    return velocity * 0.98 // Adjust this value for faster or slower deceleration
  }

  const animateMomentum = (element) => {
    if (!element) return

    velocity.current = easeOut(velocity.current)
    element.scrollLeft -= velocity.current

    if (Math.abs(velocity.current) > 0) {
      animationFrame.current = requestAnimationFrame(() =>
        animateMomentum(element)
      )
    } else {
      cancelAnimationFrame(animationFrame.current)
    }
  }

  const handleMouseDown = (e) => {
    isDragging.current = true
    startX.current = e.pageX
    scrollLeft.current = e.currentTarget.scrollLeft
    lastX.current = e.pageX
    lastTime.current = Date.now()

    e.currentTarget.style.cursor = "grabbing"
    cancelAnimationFrame(animationFrame.current) // Stop any momentum animation if dragging resumes
  }

  const handleMouseMove = (e) => {
    if (!isDragging.current) return
    e.preventDefault()

    const x = e.pageX
    const distance = x - startX.current

    e.currentTarget.scrollLeft = scrollLeft.current - distance

    const now = Date.now()
    const deltaTime = now - lastTime.current
    if (deltaTime > 0) {
      velocity.current = (x - lastX.current) / deltaTime // Calculate velocity
    }

    lastX.current = x
    lastTime.current = now
  }

  const handleMouseUpOrLeave = (e) => {
    if (!isDragging.current) return
    isDragging.current = false

    e.currentTarget.style.cursor = "grab"

    // Start momentum animation
    animateMomentum(e.currentTarget)
  }

  const applyDragScroll = (element) => {
    if (!element) return

    element.style.cursor = "grab"

    const cleanUp = () => {
      element.removeEventListener("mousedown", handleMouseDown)
      element.removeEventListener("mousemove", handleMouseMove)
      element.removeEventListener("mouseup", handleMouseUpOrLeave)
      element.removeEventListener("mouseleave", handleMouseUpOrLeave)
    }

    element.addEventListener("mousedown", handleMouseDown)
    element.addEventListener("mousemove", handleMouseMove)
    element.addEventListener("mouseup", handleMouseUpOrLeave)
    element.addEventListener("mouseleave", handleMouseUpOrLeave)

    return cleanUp
  }

  return applyDragScroll
}

export default useDragScroll