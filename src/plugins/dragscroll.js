export default {
  install(app) {
    let isDown = false
    let isDragging = false
    let startX, startY
    let scrollLeft, scrollTop
    let lastX, lastY, lastTime
    let velocityX = 0,
      velocityY = 0
    let animationFrameId

    const onMouseDown = (e) => {
      // Only allow main mouse button (left click)
      if (e.button !== 0) return

      isDown = true
      startX = e.clientX
      startY = e.clientY
      scrollLeft = window.scrollX
      scrollTop = window.scrollY
      lastX = startX
      lastY = startY
      lastTime = performance.now()
      velocityX = 0
      velocityY = 0

      document.body.classList.add('grabbing')
      cancelAnimationFrame(animationFrameId)

      // Prevent native drag for images
      if (e.target.tagName.toLowerCase() === 'img') e.preventDefault()
    }

    const stopDragging = () => {
      if (isDown) {
        isDown = false
        document.body.classList.remove('grabbing')
        captureFinalScrollPosition()
        applyInertia()

        // Set isDragging to false asynchronously to allow 'click' event 
        // to read the true value and be prevented if necessary
        setTimeout(() => {
          isDragging = false
        }, 0)
      }
    }

    const onMouseLeave = () => {
      stopDragging()
    }

    const onMouseUp = () => {
      stopDragging()
    }

    const onMouseMove = (e) => {
      if (!isDown) return
      e.preventDefault()

      // Safety check: if user released button outside window and returned
      if (e.buttons === 0) {
        stopDragging()
        return
      }

      const now = performance.now()
      const timeDiff = now - lastTime

      // Prevent division by zero or extremely small time defs
      if (timeDiff <= 0) return

      const x = e.clientX - startX
      const y = e.clientY - startY
      const deltaX = e.clientX - lastX
      const deltaY = e.clientY - lastY

      // Threshold to distinguish click vs drag
      if (!isDragging && (Math.abs(x) > 5 || Math.abs(y) > 5)) {
        isDragging = true
      }

      window.scrollTo(scrollLeft - x, scrollTop - y)

      velocityX = deltaX / timeDiff
      velocityY = deltaY / timeDiff

      lastX = e.clientX
      lastY = e.clientY
      lastTime = now
    }

    const onClick = (e) => {
      if (isDragging) {
        e.preventDefault()
        e.stopPropagation()
      }
    }

    const captureFinalScrollPosition = () => {
      scrollLeft = window.scrollX
      scrollTop = window.scrollY
    }

    const applyInertia = () => {
      const friction = 0.92 // Friction coefficient

      const inertiaStep = () => {
        // Stop if velocity is negligible
        if (Math.abs(velocityX) > 0.1 || Math.abs(velocityY) > 0.1) {
          // 16ms approx for 60fps
          scrollLeft -= velocityX * 16
          scrollTop -= velocityY * 16
          window.scrollTo(scrollLeft, scrollTop)

          velocityX *= friction
          velocityY *= friction

          animationFrameId = requestAnimationFrame(inertiaStep)
        }
      }

      inertiaStep()
    }

    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseleave', onMouseLeave)
    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('click', onClick, true)

    app.config.globalProperties.$removeDragScroll = () => {
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseleave', onMouseLeave)
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('click', onClick, true)
    }
  }
}
