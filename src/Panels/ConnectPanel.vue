<template>
  <div class="pad">
    <h1>Connect</h1>
    <h2>Lets Be Friends!</h2>
    <ul>
      <li v-for="channel in connect" :key="channel.id">
        <hr />
        <a :href="channel.href" :alt="channel.title" target="_blank" rel="noopener noreferrer">
          <img :src="`/assets/img/connect/${channel.img}`" class="grow connect" :alt="channel.title"
            :aria-label="`Connect via ${channel.title}`" />
        </a>
      </li>
    </ul>
  </div>
  <q>
    "The best way to predict the future is to create it."
    <div class="credit">- Peter Drucker</div>
  </q>
  <div class="gap target">
    <img src="/assets/bg/istockphoto-969737146-612x612.jpg" class="hero" alt="Picture of Telegraph Machine"
      aria-label="Picture of Telegraph Machine" />
    <MorseCode class="morseCode" text="dan at snapjay com" />
  </div>
</template>
<script setup>
import MorseCode from '/src/components/MorseCode.vue'
const connect = [
  {
    id: 1,
    img: 'email.svg',
    title: 'Email',
    href: 'mailto:dan@snapjay.com'
  },
  {
    id: 2,
    img: 'linkedin.svg',
    title: 'LinkedIn',
    href: 'https://www.linkedin.com/profile/view?id=18683312'
  },
  {
    id: 3,
    img: 'github.svg',
    title: 'Github',
    href: 'http://github.com/snapjay'
  },
  {
    id: 4,
    img: 'x.svg',
    title: 'X',
    href: 'https://x.com/snapjay'
  }
]
</script>
<style scoped>
.connect {
  width: 250px;
  height: auto;
  margin: 1.5rem auto;
  display: block;
}

.target {
  padding-bottom: 2rem;
}

.morseCode {
  opacity: 0;
  transition: filter 0.9s, opacity 0.9s;
}

.target:hover .morseCode {
  opacity: 1;
}

q {
  border-radius: 0;
}
</style>