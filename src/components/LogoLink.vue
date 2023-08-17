<script>
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { NPopover, NGrid, NGridItem } from "naive-ui";

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
        delay: 0,
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
  },
  components: {
    NPopover,
    NGrid,
    NGridItem,
  },
};
</script>
<template>
  <div class="block">
  <NGrid cols="2 900:4" x-gap="12" y-gap="36" >
    <NGridItem v-for="client in data" class="cell" v-bind:key="client.id">
      <div ref="page">
        <NPopover trigger="hover" :content-style="{ maxWidth: '400px' }">
          <template #trigger>
            <a :href="client.href" target="_blank" rel="noopener noreferrer">
              <img
                ref="image"
                :src="`/assets/img/${client.img}`"
                draggable="false"
                :alt="`${client.title} logo`"
                width=""
                height=""
            /></a>
          </template>
          <h4>{{ client.title }}</h4>
          <p>{{ client.desc }}</p>
        </NPopover>
      </div>
    </NGridItem>
  </NGrid></div>
</template>
<style scoped>
.block {
  margin-bottom: 70px;
}
.cell {
  display: flex;
  align-items: center;
  justify-content: center;
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