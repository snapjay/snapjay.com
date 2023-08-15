<script>
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { NPopover } from "naive-ui";

export default {
  name: "LogoLink",
  mounted() {
    this.setupScrollSnapping();
  },
  methods: {
    setupScrollSnapping() {
      gsap.registerPlugin(ScrollTrigger);
      gsap.to(this.$refs.image, {
        scrollTrigger: {
          trigger: this.$refs.page,
          start: "top bottom",
          scrub: true,
        },
        delay:0,
        scale: 1.2,
        ease: "none",
      });
    },
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
    width: {
      type: Number,
      default: 25,
    },
  },
  components: {
    NPopover,
  },
};
</script>
<template>
  <li
    ref="page"
    v-for="client in data"
    v-bind:key="client.id"
    :style="{ width: `${width}%` }"
  >
    <NPopover trigger="hover" :content-style="{ maxWidth: '400px' }">
      <template #trigger>
        <a :href="client.href" target="_blank" rel="noopener noreferrer">
          <img
            ref="image"
            :src="`/assets/img/${client.img}`"
            draggable="false"
            :alt="`${client.title} logo`"
        /></a>
      </template>
      <h4>{{ client.title }}</h4>
      <p>{{ client.desc }}</p>
    </NPopover>
  </li>
</template>

<style scoped>
li {
  align-content: center;
  display: inline-block;
}
a {
  display: inline-block;
}
img {
  align-self: center;
  width: 180px;
  transition: transform 0.7s ease-in-out;
}
img:hover {
  transform: scale(1.1);
}
</style>