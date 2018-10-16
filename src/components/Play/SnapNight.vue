<template lang="pug">
    .night
        snap-star(v-for='index in 529', :key='index', :assention='assention()', :declination='declination()')
        snap-shooting-star()
</template>

<script>
  import rand from '@/shared/rand'
  import SnapStar from '@/components/Play/SnapStar'
  import SnapShootingStar from '@/components/Play/SnapShootingStar'

  export default {
    name: 'SnapNight',
    components: {
      'snap-star': SnapStar,
      'snap-shooting-star': SnapShootingStar
    },
    methods: {
      assention () {
        return rand(1, 2000)
      },
      declination () {
        return rand(1, 2000)
      }
    }
  }
</script>

<style scoped>
    .night {
        -webkit-animation: spin 160s linear infinite;
        -moz-animation: spin 160s linear infinite;
        animation: spin 160s linear infinite;
        transform-origin: center center;
    }

    @-moz-keyframes spin {
        100% {
            -moz-transform: rotate(360deg);
        }
    }

    @-webkit-keyframes spin {
        100% {
            -webkit-transform: rotate(360deg);
        }
    }

    @keyframes spin {
        100% {
            -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
        }
    }
</style>
