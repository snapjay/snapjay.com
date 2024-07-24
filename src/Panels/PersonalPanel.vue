<template>
  <div class="pad">
    <h1>Personal Projects</h1>
    <hr />
    <ul>
      <li v-for="project in projects" :key="project.id">
        <h2 class="black">{{ project.title }}</h2>
        <a :href="project.href" target="_blank"><img :src="`/assets/img/personal/${project.img.url}`"
            :width="project.img.width" :height="project.img.height" draggable="false" class="project grow"
            :alt="project.title" /></a>
        <div>{{ project.desc }}</div>
        <hr />
      </li>
    </ul>
  </div>
</template>
<script setup>
import projects from '@/data/projects.json';
</script>
<style scoped>
h2 {
  font-size: 2rem;
}

.project {
  width: 250px;
  height: auto;
  margin: 1.5rem auto;
  display: block;
}
</style>
