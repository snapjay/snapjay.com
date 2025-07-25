<script setup>
import credits from '@/data/credits.json';
</script>

<template>
  <div class="pad">
    <h1>CREDITS</h1>
    <h2>Cross sector</h2>
    <ul>
      <li v-for="credit in credits.sort((a, b) => a.title.localeCompare(b.title))" :key="credit.id">
        <hr />
        <a :href="credit.href" target="_blank" rel="noopener noreferrer">
          <img :src="`/assets/img/credits/${credit.img.url}`" draggable="false" class="grow" :alt="credit.title" />
        </a>
        <p><strong>{{ credit.title }}.</strong> {{ credit.desc }}</p>
      </li>
    </ul>
    <hr />
  </div>
  <q>
    "UX is not just the design; it's your customers entire journey."
    <div class="credit">- ChatGTP</div>
  </q>
</template>

<style scoped>
img {
  width: 50%;
  height: auto;
  margin: 1.5rem auto;
  display: block;
}


strong {
  font-weight: 600;
}

hr {
  margin: 2rem 0;
}
</style>
