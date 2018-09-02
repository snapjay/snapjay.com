<template lang="pug">
  .wrapper
    nav
      ul(role="navigation")
        li
          router-link(:to="{name: 'snapjay'}", exact) snapjay
        li
          router-link(:to="{name: 'skills'}") skills
        li
          router-link(:to="{name: 'credits'}") credits
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
<style scoped>
  nav {
    float: right;
  }
  nav li {
    font-family: 'Amatic SC', "Helvetica Neue", Helvetica,Arial, sans-serif;
    display: inline;
    font-size: 40px;
    font-weight: 700;
    text-align: right;
    margin-left: 15px;
    margin-right: 15px;
  }
</style>
