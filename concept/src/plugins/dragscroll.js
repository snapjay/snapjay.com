// src/plugins/dragscroll.js

export default {
  install(app) {
    let isDown = false
    let isDragging = false
    let startX, startY
    let scrollLeft, scrollTop

    function onMouseDown(e) {
      isDown = true
      startX = e.clientX
      startY = e.clientY
      scrollLeft = window.scrollX
      scrollTop = window.scrollY
      document.body.classList.add('grabbing')
      e.preventDefault()
    }

    function onMouseLeave() {
      isDown = false
      isDragging = false
      document.body.classList.remove('grabbing')
    }

    function onMouseUp() {
      isDown = false
      document.body.classList.remove('grabbing')
      // Delay resetting isDragging to allow click event to check the flag
      setTimeout(() => {
        isDragging = false
      }, 0)
    }

    function onMouseMove(e) {
      if (!isDown) return
      e.preventDefault()
      const x = e.clientX - startX
      const y = e.clientY - startY
      if (Math.abs(x) > 5 || Math.abs(y) > 5) {
        isDragging = true
      }
      window.scrollTo(scrollLeft - x, scrollTop - y)
    }

    function onClick(e) {
      if (isDragging) {
        e.preventDefault()
        isDragging = false
      }
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
