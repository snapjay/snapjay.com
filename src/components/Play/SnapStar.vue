<template lang="pug">
    .star(:style="`left:${assention}px; top:${declination}px; width:${size}px; height:${size}px; background-color:${color};`")
</template>

<script>
  import rand from '@/shared/rand'

  export default {
    name: 'SnapPhoto',
    props: {
      src: {
        type: String,
        required: false,
        default: ''
      },
      alt: {
        type: String,
        required: false,
        default: ''
      },
      assention: {
        type: Number,
        required: true
      },
      declination: {
        type: Number,
        required: true
      }
    },
    computed: {
      size () {
        return rand(0.5, 3)
      },
      color () {
        const colors = ['#fffec1', '#fffdfb', '#fff', '#ffd3d3', '#fff5e7']
        return colors[Math.floor(Math.random() * colors.length)]
      }
    }
  }
</script>

<style scoped>
    .star {
        position: absolute;
        border-radius: 50%;
    }
</style>
