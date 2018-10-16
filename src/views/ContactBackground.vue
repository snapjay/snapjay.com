<template lang="pug">
    video(autoplay loop poster='/static/img/contact/poster.jpg')
        source(src='/static/video/sjct.mp4' type='video/mp4')
        source(src='/static/video/sjct.webm' type='video/webm')
</template>

<script>
  export default {
    name: 'Contact'
  }
</script>

<style lang="scss" scoped>
    video {
        position: fixed;
        right: 0;
        bottom: 0;
        min-width: 100%;
        min-height: 100%;
        width: auto;
        height: auto;
        z-index: -100;
        background: url(/static/img/contact/poster.jpg) no-repeat;
        background-size: cover;
    }
</style>
