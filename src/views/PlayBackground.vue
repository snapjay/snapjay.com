<template lang="pug">
    .full-screen
        .moon
            snap-moon
        img.tree(src='/static/img/play/tree.svg')
        img.tree(src='/static/img/play/tree.svg', style='top:280px; transform:rotate(20deg); ')
        img.tree(src='/static/img/play/tree.svg', style='transform:rotate(180deg); right:0px;')
        img.tree(src='/static/img/play/tree.svg', style='top:280px; transform:rotate(200deg); right:0px;')
        snap-night.full-screen
</template>

<script>
  import SnapNight from '@/components/Play/SnapNight'
  import SnapMoon from '@/components/Play/SnapMoon'

  export default {
    name: 'PlayBackground',
    components: {
      'snap-moon': SnapMoon,
      'snap-night': SnapNight
    }
  }
</script>
<style lang="scss" scoped>
    @import "../assets/styles/variables";

    .moon {
        width:100px;
        height: 100px;
        right:190px;
        top : 50px;
        position: absolute;
    }
    .tree {
        position: absolute;
        width: 35%;
    }
</style>
