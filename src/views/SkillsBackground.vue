<template lang="pug">
    canvas.snow.fullscreen
</template>

<script>
  import rand from './../shared/rand'
  import Flake from './../components/Skills/Flake'

  let canvas
  let ctx

  export default {
    name: 'SkillsBackground',
    data () {
      return {
        numberOfFlakes: 200,
        flakes: []
      }
    },
    computed: {
      windowW () {
        return window.innerWidth
      },
      windowH () {
        return window.innerHeight
      }
    },
    mounted () {
      canvas = document.querySelector('.snow')
      ctx = canvas.getContext('2d')
      let x
      let y

      for (let i = 0; i < this.numberOfFlakes; i++) {
        x = rand(0, this.windowW, 0)
        y = rand(0, this.windowH, 0)
        this.flakes.push(new Flake(x, y))
      }

      this.scaleCanvas()
      this.loop()
    },
    methods: {
      scaleCanvas () {
        canvas.width = this.windowW
        canvas.height = this.windowH
      },
      loop () {
        let i = this.flakes.length
        let flake

        ctx.save()
        ctx.setTransform(1, 0, 0, 1, 0, 0)
        ctx.clearRect(0, 0, this.windowW, this.windowH)
        ctx.restore()

        while (i--) {
          flake = this.flakes[i]
          flake.update()
          ctx.beginPath()
          ctx.arc(flake.x, flake.y, flake.weight, 0, 2 * Math.PI, false)
          ctx.fillStyle = `rgba(67, 172, 238, ${flake.alpha})`
          ctx.fill()

          if (flake.y >= this.windowH) {
            flake.y = -flake.weight
          }
        }

        requestAnimationFrame(this.loop)
      }
    }
  }
</script>
