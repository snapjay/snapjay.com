<template lang="pug">
    #tractor
        img.tractor(src='/static/img/credits/tractor.svg', alt='')
        img.wheel.back(src='/static/img/credits/wheel.svg', alt='')
        img.wheel.front(src='/static/img/credits/wheel.svg', alt='')
</template>

<script>
  import {TweenMax, Linear} from 'gsap/TweenMax'

  export default {
    name: 'Tractor',
    mounted () {
      TweenMax.to(document.getElementById('tractor'), 740, {left:3400});
      TweenMax.to(document.getElementsByClassName('tractor')[0], 0.1, {top:'+=1', repeat:-1, yoyo:true, ease:Linear.easeNone});
      TweenMax.to(document.getElementsByClassName('back')[0], 13, {rotation:360, repeat:-1,ease:Linear.easeNone});
      TweenMax.to(document.getElementsByClassName('front')[0], 13, {rotation:360, repeat:-1,ease:Linear.easeNone});
    }
  }
</script>

<style scoped>
    #tractor{
        position: absolute;
        bottom: 0;
        left:0;
        height: 110px;
    }
    #tractor img{
        position: absolute;
    }
    #tractor .tractor{
        width: 160px;
        position: absolute;
    }
    #tractor .wheel{
        position: absolute;
    }
    #tractor .back{
        width:66px;
        left: 2px;
        bottom:0
    }
    #tractor .front{
        width: 49px;
        left: 99px;
        bottom:0
    }
</style>
