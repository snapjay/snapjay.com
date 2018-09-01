<template lang="pug">
  .main
    ul
      li
        router-link(:to="{name: 'snapjay'}") snapjay
      li
        router-link(:to="{name: 'skills'}") skills
      li
        router-link(:to="{name: 'credit'}") credit
      li
        router-link(:to="{name: 'play'}") play
      li
        router-link(:to="{name: 'contact'}") contact
    router-view
</template>

<script>
  export default {
    name: 'Snapjay'
  }
</script>
