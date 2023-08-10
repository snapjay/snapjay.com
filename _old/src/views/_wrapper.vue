<template lang="pug">
    .full-screen
        .background
            router-view(name='background')
        main.full-screen.main
            nav
                ul(role='navigation')
                    li
                        router-link(:to="{name: 'snapjay'}", exact) snapjay
                    li
                        router-link(:to="{name: 'skills'}") skills
                    li
                        router-link(:to="{name: 'credits'}") credits
                    li
                        router-link(:to="{name: 'play'}" ) play
                    li
                        router-link(:to="{name: 'contact'}") contact
            router-view.router
</template>

<script>
  export default {
    name: 'Snapjay'
  }
</script>
<style scoped>
    .background {
        position: absolute;
        overflow: hidden;
        width: 100%;
        height: 100%;
    }

    .main {
        overflow-y: scroll;
    }

    nav {
        z-index: 200;
    }

    .router{
        margin-top: 65px;
    }

    nav ul {
        float: right;
        margin-bottom: 0;
    }
    nav li {
        font-family: 'Amatic SC', "Helvetica Neue", Helvetica, Arial, sans-serif;
        display: inline;
        font-size: 40px;
        font-weight: 700;
        text-align: right;
        margin-left: 15px;
        margin-right: 15px;
    }
</style>
