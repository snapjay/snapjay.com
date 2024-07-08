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
      isDown = true
      startX = e.clientX
      startY = e.clientY
      scrollLeft = window.scrollX
      scrollTop = window.scrollY
      lastX = startX
      lastY = startY
      lastTime = Date.now()
      velocityX = 0
      velocityY = 0
      document.body.classList.add('grabbing')
      cancelAnimationFrame(animationFrameId)
      e.preventDefault()
    }

    const onMouseLeave = () => {
      if (isDown) {
        isDown = false
        isDragging = false
        document.body.classList.remove('grabbing')
        captureFinalScrollPosition()
        applyInertia()
      }
    }

    const onMouseUp = () => {
      if (isDown) {
        isDown = false
        document.body.classList.remove('grabbing')
        setTimeout(() => {
          isDragging = false
        }, 0)
        captureFinalScrollPosition()
        applyInertia()
      }
    }

    const onMouseMove = (e) => {
      if (!isDown) return
      e.preventDefault()

      const now = Date.now()
      const timeDiff = now - lastTime
      const x = e.clientX - startX
      const y = e.clientY - startY
      const deltaX = e.clientX - lastX
      const deltaY = e.clientY - lastY

      if (Math.abs(x) > 5 || Math.abs(y) > 5) {
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
        isDragging = false
      }
    }

    const captureFinalScrollPosition = () => {
      scrollLeft = window.scrollX
      scrollTop = window.scrollY
    }

    const applyInertia = () => {
      const friction = 0.92

      const inertiaStep = () => {
        if (Math.abs(velocityX) > 0.1 || Math.abs(velocityY) > 0.1) {
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
