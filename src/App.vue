<script>
import HomeView from "./views/HomeView.vue";
import SkillsView from "./views/SkillsView.vue";
import CreditsView from "./views/CreditsView.vue";
import PlayView from "./views/PlayView.vue";
import ConnectView from "./views/ConnectView.vue";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { NConfigProvider } from "naive-ui";

export default {
  name: "App",
  data() {
    return {
      themeOverrides: {
        Popover: {
          color: "#35322f",
          textColor: "#fff",
          borderRadius: "8px",
          fontSize: ".6rem",
        },
      },
    };
  },
  components: {
    HomeView,
    CreditsView,
    SkillsView,
    PlayView,
    ConnectView,
    NConfigProvider,
  },
  mounted() {
    gsap.registerPlugin(ScrollTrigger);
  },
};
</script>

<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <div class="container">
      <section ref="home"><HomeView /></section>
      <section ref="skill"><SkillsView /></section>
      <section ref="credit"><CreditsView /></section>
      <section ref="play"><PlayView /></section>
      <section ref="connect"><ConnectView /></section>

    </div>
  </n-config-provider>
</template>

<style lang="scss" scoped>
$background: black;
$foreground: white;
.container {
  overscroll-behavior: none;
  width: 100%;
  height: 100%;
}
h1 {
  margin: 50px 0;
  text-align: center;
}
</style>
