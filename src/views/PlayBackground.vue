<template lang="pug">
    .full-screen
        .moon
            snap-moon
        img.tree(src='/static/img/play/tree.svg', style='width: 28%;', alt='')
        img.tree(src='/static/img/play/tree.svg', style='top:280px; transform:rotate(20deg); ', alt='')
        img.tree(src='/static/img/play/tree.svg', style='transform:rotate(180deg); right:0px; width: 25%;', alt='')
        img.tree(src='/static/img/play/tree.svg', style='top:280px; transform:rotate(200deg); right:0px;', alt='')
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
        right:260px;
        top : 100px;
        position: absolute;
    }
    .tree {
        position: absolute;
        width: 35%;
    }
</style>
