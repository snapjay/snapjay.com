<template lang="pug">
    #shooting-star()
</template>

<script>
  import {TweenMax, Linear} from 'gsap/TweenMax'

  export default {
    name: 'SnapShootingStar',
    mounted () {
      TweenMax.to(document.getElementById('shooting-star'), 0.4, {
        width: 75,
        left: '+=250',
        top: '+=250',
        opacity: 0,
        ease: Linear.easeNone,
        autoRound: false,
        repeat: -1,
        delay: 5,
        repeatDelay: 24
      })
    }
  }
</script>

<style scoped>
    #shooting-star {
        position: absolute;
        border-top: 1px solid #fff;
        width: 0;
        left: 40%;
        top: 20%;
        -moz-transform: rotate(45deg);
        -webkit-transform: rotate(45deg);
        -o-transform: rotate(45deg);
        -ms-transform: rotate(45deg);
    }

</style>
