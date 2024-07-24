<template>
  <img src="/assets/hero/dark-gloomy-books.webp" class="hero" alt="Book" aria-hidden="true" width="500" height="333" />
  <div class="pad">
    <h1>Books</h1>
    <h2>Technical Editor</h2>
    <ul>
      <li v-for="book in books" :key="book.id">
        <hr />
        <h3>{{ book.title }}</h3>
        <a :href="book.href" target="_blank" rel="noopener noreferrer">
          <img :src="`/assets/img/books/${book.img}`" :alt="book.title" class="book grow" width="250" height="309" />
        </a>
        <p>{{ book.desc }}</p>
      </li>
    </ul>
    <hr />
    <img src="/assets/hero/dark-gloomy-books.webp" draggable="false" class="hero" alt="Book" aria-hidden="true"
      width="500" height="333" style="transform: rotate(180deg)" />
  </div>
</template>
<script setup>
import books from '@/data/books.json';
</script>
<style scoped>
img.book {
  width: 250px;
  height: auto;
  margin: 1.5rem auto;
  display: block;
}
</style>
