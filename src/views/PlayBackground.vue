<template lang="pug">
    .full-screen
        snap-night.full-screen
        .moon
            snap-moon
        img.d-none.d-md-block.tree(src='/static/img/play/tree.svg', style='width: 28%;', alt='')
        img.d-none.d-md-block.tree(src='/static/img/play/tree.svg', style='top:280px; transform:rotate(20deg); left:-30px; ', alt='')
        img.d-none.d-md-block.tree(src='/static/img/play/tree.svg', style='transform:rotate(180deg); right:0px; width: 25%;', alt='')
        img.d-none.d-md-block.tree(src='/static/img/play/tree.svg', style='top:280px; transform:rotate(200deg); right:0px;', alt='')
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
        right:15%;
        top : 19%;
        position: absolute;
    }
    .tree {
        top: 1px;
        position: absolute;
        width: 35%;
    }
</style>
