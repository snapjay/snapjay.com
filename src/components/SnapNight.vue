<template lang="pug">
    .night
        snap-star(v-for='index in 229', :key='index')
        snap-shooting-star()
</template>

<script>
  import SnapStar from '@/components/SnapStar'
  import SnapShootingStar from '@/components/SnapShootingStar'

  export default {
    name: 'SnapNight',
    components: {
      'snap-star': SnapStar,
      'snap-shooting-star': SnapShootingStar
    }
  }
</script>

<style scoped>
    .night {
        -webkit-animation:spin 160s linear infinite;
        -moz-animation:spin 160s linear infinite;
        animation:spin 160s linear infinite;
    }

    @-moz-keyframes spin { 100% { -moz-transform: rotate(360deg); } }
    @-webkit-keyframes spin { 100% { -webkit-transform: rotate(360deg); } }
    @keyframes spin { 100% { -webkit-transform: rotate(360deg); transform:rotate(360deg); } }
</style>
