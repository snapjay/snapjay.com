<template lang="pug">
    .star(:style="`left:${assention}px; top:${declination}px; width:${size}px; height:${size}px; background-color:${color};`")
</template>

<script>
  function rand (min, max) {
    return (Math.random() * (max - min) + min).toFixed(1)
  }

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
      }
    },
    computed: {
      size () {
        return rand(0.5, 3)
      },
      assention () {
        return rand(1, 2000)
      },
      declination () {
        return rand(1, 2000)
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
        border-radius: 3px;
    }
</style>
