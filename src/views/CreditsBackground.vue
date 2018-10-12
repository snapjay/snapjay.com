<template lang="pug">
    .full-screen
        snap-day

</template>

<script>
  import SnapDay from '@/components/Credits/SnapDay'

  export default {
    name: 'CreditsBackground',
    components: {
      'snap-day': SnapDay
    }
  }
</script>

<style scoped>
    .crditbg {
        width: 100%;
        height: 100%;
        border: 3px solid #2FA231;
    }
    .test {
        width: 100%;
        height: 1px;
        background-color: #EEDD00;
        position: absolute;
        bottom: 20px;
    }

</style>
