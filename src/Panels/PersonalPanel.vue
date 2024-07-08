<template>
  <div class="pad">
    <h1>Personal Projects</h1>
    <hr />
    <ul>
      <li v-for="project in personal" :key="project.id">
        <h3 class="black">{{ project.title }}</h3>
        <a :href="project.href" target="_blank"><img :src="`/assets/img/personal/${project.img}`" class="project grow"
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
    title: "Jukebox Tools",
    img: "jukebox-tools-wordmark.svg",
    desc: "I developed a web application that provides a suite of tools for jukebox enthusiasts, title strip generator, layout studio and record collection manager.",
    href: "https://jukebox.tools/"
  },
  {
    id: 2,
    title: "Old Boot Woodshop",
    img: "boot.svg",
    desc: "One of my passions lies in woodworking, and as an expression of that passion, I have designed and developed a website to showcase my woodworking creations.",
    href: "https://oldboot.us/"
  },
  {
    id: 3,
    title: "Select-O-Matic 100 Simulator",
    img: "jukeboxLogo.svg",
    desc: "I developed a web application that faithfully simulates the functionality and experience of a 1952 Seeburg Select-O-Matic 100 jukebox. Go ahead... Drop a quarter!",
    href: "https://simulator.jukebox.tools/"
  },
  {
    id: 4,
    title: "NGCart",
    img: "cart.svg",
    desc: "I developed NGCart which became a popular component utilizing the Angular framework, which eventually culminated in a book deal centered around this product.",
    href: "https://ngcart.snapjay.com/"
  },
  {
    id: 5,
    title: "Garage Door Opener",
    img: "garage.svg",
    desc: "Using a Raspberry Pi, I developed a garage door opener that can be controlled via a web interface, and integrated with Google Home and SMS alerts.",
    href: "https://github.com/snapjay/garage-door"
  },
  {
    id: 6,
    title: "Lost In Thought",
    img: "lostinthought.svg",
    desc: "Combing my passions of making and engineering, I created an interactive Halloween experience that fused AI, web sockets and illusion.",
    href: "https://lostinthought.oldboot.us/"
  },
  {
    id: 7,
    img: "intelligift-wordmark.svg",
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
