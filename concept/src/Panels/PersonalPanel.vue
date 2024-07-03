<template>
  <h1 class="pad">Personal Projects</h1>
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
  <!-- <img src="/desktop-wallpaper-flower-in-a-black-background-for-space-flower.jpg" class="hero" alt="Flower" /> -->
</template>
<script setup>
const personal = [
  {
    id: 1,
    img: "credits/jukebox-tools-wordmark.svg",
    title: "Jukebox Tools",
    desc: "I developed a web application that provides a suite of tools for jukebox enthusiasts, title strip generator, layout studio and record collection manager.",
    href: "https://jukebox.tools/"
  },
  {
    id: 2,
    img: "credits/boot.svg",
    title: "Old Boot Woodshop",
    desc: "One of my passions lies in woodworking, and as an expression of that passion, I have designed and developed a website to showcase my woodworking creations.",
    href: "https://oldboot.us/"
  },
  {
    id: 3,
    img: "credits/jukeboxLogo.svg",
    title: "Select-O-Matic 100 Simulator",
    desc: "I developed a web application that faithfully simulates the functionality and experience of a 1952 Seeburg Select-O-Matic 100 jukebox. Go ahead... Drop a quarter!",
    href: "https://simulator.jukebox.tools/"
  },
  {
    id: 4,
    img: "credits/cart.svg",
    title: "NGCart",
    desc: "I developed NGCart which became a popular component utilizing the Angular framework, which eventually culminated in a book deal centered around this product.",
    href: "https://ngcart.snapjay.com/"
  },
  {
    id: 5,
    img: "credits/garage.svg",
    title: "Garage Door Opener",
    desc: "Using a Raspberry Pi, I developed a garage door opener that can be controlled via a web interface, and integrated with Google Home and SMS alerts.",
    href: "https://github.com/snapjay/garage-door"
  },
  {
    id: 6,
    img: "credits/intelligift-wordmark.svg",
    title: "intelli.gift",
    desc: "Pursued AI experimentation project, aiming to leverage artificial intelligence to curate the ideal gift selections.",
    href: "https://intelli.gift/"
  },
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
