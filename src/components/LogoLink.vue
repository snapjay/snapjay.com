<script>
import { NPopover } from "naive-ui";

export default {
  name: "LogoLink",
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
    v-for="client in data"
    v-bind:key="client.id"
    :style="{ width: `${width}%` }"
  >
    <NPopover trigger="hover" :content-style="{ maxWidth: '400px' }">
      <template #trigger>
        <a :href="client.href" target="_blank" rel="noopener noreferrer" >
          <img
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
  width: 200px;
  transition: transform 0.7s ease-in-out;
}
img:hover {
  transform: scale(1.1);
}
</style>