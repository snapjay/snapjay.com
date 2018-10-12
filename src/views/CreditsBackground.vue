<template lang="pug">
    .full-screen
        .sun.rounded-circle

</template>

<script>
  export default {
    name: 'CreditsBackground'
  }
</script>

<style scoped>
    .sun {
        background-color: #ffb849;
        height: 200px;
        width: 200px;
        left: 25%;
        position: fixed;
        bottom: 40px;
    }
</style>
