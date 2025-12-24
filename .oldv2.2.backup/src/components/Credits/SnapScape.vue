<template lang="pug">
    .hills
        img.cow(src='/static/img/credits/cow.svg', alt='', style='left:13%; bottom: 10px; width: 70px;')
        img.cow.mirror(src='/static/img/credits/cow.svg', alt='', style='left:45%; bottom: 30px; width: 100px;')
        img.cow(src='/static/img/credits/cow.svg', alt='', style='left:80%;  bottom: 5px; width: 89px;')
        img.cow.barn(src='/static/img/credits/barn.svg', alt='', style='left:80%;  bottom: 5px; width: 149px;')
        windmill
        tractor
</template>

<script>
  import Windmill from '@/components/Credits/Windmill'
  import Tractor from '@/components/Credits/Tractor'

  export default {
    name: 'SnapScape',
    components: {
      'windmill': Windmill,
      'tractor': Tractor
    },
    methods: {}
  }
</script>

<style scoped>
    .hills {
        position: fixed;
        background-image: url('/static/img/credits/hills.svg');
        background-position: center bottom;
        background-repeat: repeat-x;
        width: 100%;
        bottom: 0;
        height: 165px;
    }
    .cow {
        position: absolute;
        bottom: 0;
        width: 200px;
    }
    .cow:active {
        width: 20px;
    }

    .mirror {
        display: block;
        -moz-transform: matrix(-1, 0, 0, 1, 0, 0);
        -webkit-transform: matrix(-1, 0, 0, 1, 0, 0);
        -o-transform: matrix(-1, 0, 0, 1, 0, 0);
    }

    .barn {
        position: absolute;
        bottom: 0;
        right: 10%;
        width: 200px;
    }

</style>
