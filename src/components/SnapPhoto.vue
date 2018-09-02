<template lang="pug">
  .photo
    .tape(style='top: 37px; left: -16px;')
    .tape(style='bottom: -2px; right: 48px;')
    img(:src='src', :alt='alt')
</template>

<script>
  export default {
    name: 'SnapPhoto',
    props: {
      src: {
        type: String,
        required: true
      },
      alt: {
        type: String,
        required: false,
        default: ''
      }
    }
  }
</script>

<style scoped>
  .photo {
    position: relative;
    transition-property: all;
    -webkit-transition-property: all;
    transition-duration: 1.3s;
    -webkit-transition-duration: 1.3s;
  }
  .photo{
    -webkit-transform: rotate(4.5deg);
    -ms-transform: rotate(4.5deg);
    transform: rotate(4.5deg);
  }
  .photo:hover{
    -webkit-transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  .photo img {
    width: 80%;
    margin-top: 40px;
  }
  .photo .tape{
    position: absolute;
    background-color: rgba(249, 240, 204, 0.70);
    width: 104px;
    height: 17px;
    -webkit-transform: rotate(-25.5deg);
    -ms-transform: rotate(-25.5deg);
    transform: rotate(-25.5deg);
    z-index: 10;
  }
</style>
