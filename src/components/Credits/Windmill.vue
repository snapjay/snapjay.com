<template lang="pug">
    .windmill
        img.blades(src='/static/img/credits/blades.svg', alt='', width='130', height='130')
        .tower
</template>

<script>
  import {TweenMax, Linear} from 'gsap/TweenMax'

  export default {
    name: 'Windmill',
    mounted () {
      TweenMax.to(document.getElementsByClassName('blades')[0], 10, {rotation: 360, repeat: -1, ease: Linear.easeNone})
    }
  }
</script>

<style scoped>
    .windmill {
        position: absolute;
        bottom: 86px;
        left: 15%;
    }

    .windmill #blades{
        width: 130px;
    }

    .windmill .tower {
        background-color: #C6C6C6;
        height: 98px;
        left: 62px;
        position: absolute;
        top: 64px;
        width: 7px;
    }

</style>
