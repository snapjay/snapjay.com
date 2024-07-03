<template>
  <div class="pad invert">
    <ul>
      <li v-for="project in personal" :key="project.id">
        <h3 class="black">{{ project.title }}</h3>
        <a :href="project.href" target="_blank"><img :src="`/assets/img/${project.img}`" class="project grow"
            :alt="project.title" /></a>
        <div>{{ project.desc }}</div>
        <hr />
      </li>
    </ul>
  </div>
  <img src="/desktop-wallpaper-flower-in-a-black-background-for-space-flower.jpg" class="hero" alt="Technical Editor" />
</template>
<script setup>
const personal = [
  {
    id: 1,
    img: 'credits/jukeboxLogo.svg',
    title: 'Jukebox Simulator',
    desc: 'I developed a web application that faithfully simulates the functionality and experience of a 1952 Seeburg Select-O-Matic jukebox. Go ahead... Drop a quarter!',
    href: 'https://simulator.jukebox.tools/'
  },
  {
    id: 2,
    img: 'credits/intelligift-wordmark.svg',
    title: 'intelli.gift',
    desc: 'Pursued a personal side project centered around AI experimentation, aiming to leverage artificial intelligence to curate the ideal gift selections.',
    href: 'https://intelli.gift/'
  },
  {
    id: 3,
    img: 'credits/boot.svg',
    title: 'Old Boot',
    desc: 'One of my passions lies in woodworking, and as an expression of that passion, I have designed and developed a website to showcase my woodworking creations.',
    href: 'https://oldboot.us/'
  },
  {
    id: 4,
    img: 'credits/cart.svg',
    title: 'NGCart',
    desc: 'I developed NGCart which became a popular component utilizing the Angular framework, which eventually culminated in a book deal centered around this achievement.',
    href: 'https://ngcart.snapjay.com/'
  }
]
</script>
<style scoped>
.project {
  width: 250px;
  height: auto;
  margin: 1.5rem auto;
  display: block;
}
</style>
