<template lang="pug">
    .moon-container
        svg.moon(width="100" height="100" viewBox="0 0 300 300")
            path(d="M180.9,257.8c-77.9,0-141.1-63.3-141.1-141.3c0-48.4,24.2-91,61.2-116.5C42.1,21.6,0,78.5,0,145.4C0,230.8,68.8,300,153.6,300c68.6,0,126.7-45.3,146.4-107.7C275,231.7,231,257.8,180.9,257.8z")

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
    .moon path {
        fill: #ebc85f;
    }
</style>
