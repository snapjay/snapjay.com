<template>
  <div class="pad">
    <h1>Connect</h1>
    <h2>Lets Be Friends!</h2>
    <ul>
      <li v-for="channel in connect" :key="channel.id">
        <hr />
        <a :href="channel.href" :alt="channel.title" target="_blank" rel="noopener noreferrer">
          <img :src="`/assets/img/connect/${channel.img.url}`" :width="channel.img.width" :height="channel.img.height"
            class="grow connect" :alt="channel.title" :aria-label="`Connect via ${channel.title}`" />
        </a>
      </li>
    </ul>
  </div>
  <q>
    "The best way to predict the future is to create it."
    <div class="credit">- Peter Drucker</div>
  </q>
  <div class="gap target">
    <img src="/assets/hero/transmisson.webp" draggable="false" class="hero" alt="Picture of a Transmission"
      aria-label="Picture of a Transmission" width="400" height="283" />
    <MorseCode class="morseCode" text="dan at snapjay com" />
  </div>
  <div class="pad">
    <h3>Attributions</h3>
    <ul>
      <li v-for="noun in nounAttribution" :key="noun.id">
        "<a :href="noun.link" target="_blank" rel="noopener noreferrer">{{ noun.name }}</a>" by
        <a :href="`https://thenounproject.com/creator/${encodeURIComponent(noun.author)}/`" target="_blank"
          rel="noopener noreferrer">{{ noun.author }}</a>, from
        <a :href="`https://thenounproject.com/browse/icons/term/${encodeURIComponent(noun.name)}/`" target="_blank"
          rel="noopener noreferrer">Noun Project</a> <a href="https://creativecommons.org/licenses/by/3.0/deed.en"
          target="_blank" style="font-weight: 400;">CC BY
          3.0</a>
      </li>
      <li>"<a href="https://www.pickpik.com/red-book-dark-gloomy-books-pages-paper-66312" target="_blank"
          rel="noopener noreferrer">Book</a>" by <a href="https://www.pickpik.com/">PickPik</a> Royalty Free</li>
      <li>"<a
          href="https://pngtree.com/freebackground/professional-maintenance-hardware-tool-set-black-background-photo-map-with-map_1518280.html?sol=downref&id=bef"
          target="_blank" rel="noopener noreferrer">Hardware
          Tool Set</a>" by <a href="https://www.pickpik.com/" target="_blank" rel="noopener noreferrer">pngtree</a>
        Individual License</li>
      <li>"<a href="https://auto.howstuffworks.com/transmission-pictures.htm" target="_blank"
          rel="noopener noreferrer">Transmission</a>" by <a href="https://www.pickpik.com/">howstuffworks</a> Attributed
      </li>
    </ul>
  </div>

</template>
<script setup>
import MorseCode from '/src/components/MorseCode.vue'
import connect from '@/data/connect.json'

const nounAttribution = [
  {
    id: 1,
    name: 'Shuffle Deck',
    author: 'lucashelle',
    link: 'https://thenounproject.com/icon/shuffle-deck-4214770/',
  },
  {
    id: 2,
    name: 'Concert',
    author: 'karyative',
    link: 'https://thenounproject.com/icon/concert-5674382/',
  },
  {
    id: 3,
    name: 'Cooking',
    author: 'Pause08',
    link: 'https://thenounproject.com/icon/cooking-2555746/',
  },
  {
    id: 4,
    name: 'Gluten',
    author: 'iconnutstock',
    link: 'https://thenounproject.com/icon/gluten-4321747/',
  },
  {
    id: 5,
    name: 'Motocross',
    author: 'heyrabbit',
    link: 'https://thenounproject.com/icon/motocross-4706122/',
  },
  {
    id: 6,
    name: 'Saw Table',
    author: 'kavya261990',
    link: 'https://thenounproject.com/icon/saw-table-3437774/',
  },
  {
    id: 6,
    name: 'Chicken',
    author: 'yohwankim91',
    link: 'https://thenounproject.com/icon/chicken-6984722/',
  },
]
</script>
<style scoped>
.connect {
  width: 250px;
  height: auto;
  margin: 1.5rem auto;
  display: block;
}

.hero {
  margin: 0 auto;
  display: block;
  width: auto;
}


/* .morseCode {
  opacity: 0;
  transition: filter 0.9s, opacity 0.9s;
}

.target:hover .morseCode {
  opacity: 1;
} */

.credit {
  background-color: black;
}

q {
  border-radius: 0;
}

h3 {
  color: #000;
  text-shadow: none;
}

li {
  font-size: .75rem;
}
</style>