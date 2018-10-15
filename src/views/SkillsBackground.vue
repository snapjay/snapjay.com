<template lang="pug">
    canvas.snow.fullscreen
</template>

<script>
  export default {
    name: 'SkillsBackground',
    mounted () {
      const canvas = document.querySelector('.snow')
      const ctx = canvas.getContext('2d')
      const windowW = window.innerWidth
      const windowH = window.innerHeight
      const numFlakes = 200
      const flakes = []

      function Flake (x, y) {
        const maxWeight = 3
        const maxSpeed = 1

        this.x = x
        this.y = y
        this.r = randomBetween(0, 1)
        this.a = randomBetween(0, Math.PI)
        this.aStep = 0.01

        this.weight = randomBetween(2, maxWeight)
        this.alpha = (this.weight / maxWeight) - 1
        this.speed = (this.weight / maxWeight) * maxSpeed

        this.update = function () {
          this.x += Math.cos(this.a) * this.r
          this.a += this.aStep

          this.y += this.speed
        }
      }

      function init () {
        let i = numFlakes
        let flake
        let x
        let y

        while (i--) {
          x = randomBetween(0, windowW, true)
          y = randomBetween(0, windowH, true)

          flake = new Flake(x, y)
          flakes.push(flake)
        }

        scaleCanvas()
        loop()
      }

      function scaleCanvas () {
        canvas.width = windowW
        canvas.height = windowH
      }

      function loop () {
        let i = flakes.length
        let flakeA

        // clear canvas
        ctx.save()
        ctx.setTransform(1, 0, 0, 1, 0, 0)
        ctx.clearRect(0, 0, windowW, windowH)
        ctx.restore()

        // loop of hell
        while (i--) {
          flakeA = flakes[i]
          flakeA.update()
          ctx.beginPath()
          ctx.arc(flakeA.x, flakeA.y, flakeA.weight, 0, 2 * Math.PI, false)
          ctx.fillStyle = `rgba(67, 172, 238, ${flakeA.alpha})`
          ctx.fill()

          if (flakeA.y >= windowH) {
            flakeA.y = -flakeA.weight
          }
        }

        requestAnimationFrame(loop)
      }

      function randomBetween (min, max, round) {
        const num = Math.random() * (max - min + 1) + min

        if (round) {
          return Math.floor(num)
        } else {
          return num
        }
      }
      init()
    }
  }
</script>

<style scoped>
    .sun {
        background-color: #ffb849;
        height: 200px;
        width: 200px;
        left: 25%;
        position: fixed;
        bottom: 40px;
    }
</style>
