<template>
  <img src="/assets/bg/dark-gloomy-books-pages-preview.jpg" class="hero" alt="Book" aria-hidden="true" />
  <div class="pad">
    <h1>Books</h1>
    <h2>Technical Editor</h2>
    <ul>
      <li v-for="book in books" :key="book.id">
        <hr />
        <h3>{{ book.title }}</h3>
        <a :href="book.href" target="_blank" rel="noopener noreferrer">
          <img :src="`/assets/img/books/${book.img}`" :alt="book.title" class="book grow" />
        </a>
        <p>{{ book.desc }}</p>
      </li>
    </ul>
    <hr />
    <img src="/assets/bg/dark-gloomy-books-pages-preview.jpg" class="hero" alt="Book" aria-hidden="true"
      style="transform: rotate(180deg)" />
  </div>
</template>
<script setup>
const books = [
  {
    id: 1,
    img: '6551OS_Building-Commerce-Application.webp',
    title: 'Building E-Commerce Application',
    desc: 'Following my release of NGCart there emerged demand for a book that featured it as a cornerstone while exploring the development process of e-commerce solutions. I was invited to serve as the technical editor for this project.',
    href: 'https://www.amazon.com/Building-Commerce-Application-Adrian-Mejia/dp/1785286552/ref=sr_1_1?tag=snapjay-20'
  },
  {
    id: 2,
    img: '3945OS_4522_M.E.A.N.Blueprints.webp',
    title: 'MEAN Blueprints',
    desc: 'Following the success of the initial book, a second publication was requested, delving deeper into the intricacies of the MEAN stack framework. This follow-up book aimed to provide a more comprehensive understanding and exploration of MEAN stack technologies of which I serve as the technical editor.',
    href: 'https://www.amazon.com/MEAN-Blueprints-Adrian-Mejia/dp/1783983945/ref=sr_1_2?tag=snapjay-20'
  }
]
</script>
<style scoped>
img.book {
  width: 250px;
  height: auto;
  margin: 1.5rem auto;
  display: block;
}
</style>
