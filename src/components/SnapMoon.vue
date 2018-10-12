<template lang="pug">
    .moon-container
        .item.land.rounded-circle
        .item.shadow.rounded-circle
</template>

<script>
  export default {
    name: 'SnapMoon'
  }
</script>

<style scoped>
    .moon-container {
        position: relative;
    }
    .item{
        width: 100px;
        height: 100px;
        position: absolute;
    }
    .land {
        background-color: #ebc85f;
        left: 10px;
        top: 3px;
    }
    .shadow {
        background-color: #161616;
    }
</style>
