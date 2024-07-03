<script setup>
const clients = [
  {
    id: 1,
    img: 'credits/Telus-Logo.svg',
    title: 'Telus',
    desc: "Developed the user interface for Telus' internal employee loyalty and rewards program's frontend components.",
    href: 'https://www.telus.com/'
  },
  {
    id: 2,
    img: 'credits/EBay_logo.svg',
    title: 'ebay',
    desc: 'Created a prototype for a "Community Court" concept aimed at effectively resolving conflicts between customers.',
    href: 'https://www.ebay.co.uk/'
  },
  {
    id: 3,
    img: 'credits/LogRhythmLogo.svg',
    title: 'LogRhythm',
    desc: "Senior frontend developer role working in the advancement of the company's flagship security product by contributing to its development and infrastructure enhancement efforts.",
    href: 'https://logrhythm.com/'
  },
  {
    id: 4,
    img: 'credits/Lonely_Planet-Logo.svg',
    title: 'Lonely Planet',
    desc: 'Developed a prototype for the travel guide website, incorporating essential features and functionalities.',
    href: 'https://www.lonelyplanet.com/places'
  },
  {
    id: 5,
    img: 'credits/Top_Gear_29.webp',
    title: 'Top Gear',
    desc: 'Built concept protoype for a car selling application, intended for the purpose of conducting user testing.',
    href: 'https://www.topgear.com/'
  },
  {
    id: 8,
    img: 'credits/Intel_logo.svg',
    title: 'Intel',
    desc: 'Built a tempoary micro site for a promotional back-to-school campaign contest partnership between Intel and Staples.',
    href: 'https://www.intel.com/'
  },
  {
    id: 6,
    img: 'credits/Toronto-Dominion_Bank.svg',
    title: 'TD Bank',
    desc: "Participated in the development of the company's customer loyalty program, enabling customers to efficiently redeem accumulated points for various products.",
    href: 'https://www.td.com/ca/en/personal-banking/'
  },
  {
    id: 7,
    img: 'credits/engage_red_logo.png',
    title: 'Engage People',
    desc: 'Served in the capacity of Director of Product Development at Engage, spearheading innovation, internal product development, and client-focused initiatives.',
    href: 'https://www.engagepeople.com/'
  }
]
</script>

<template>
  <h1>CREDITS</h1>
  <h2>Cross sector</h2>
  <ul>
    <li v-for="client in clients.sort((a, b) => a.title.localeCompare(b.title))" :key="client.id">
      <hr />
      <a :href="client.href" target="_blank" rel="noopener noreferrer">
        <img :src="`/assets/img/${client.img}`" class="grow" :alt="client.title" />
      </a>
      <p>{{ client.desc }}</p>
    </li>
  </ul>
  <hr />
</template>

<style scoped>
img {
  width: 50%;
  height: auto;
  margin: 1.5rem auto;
  display: block;
}

hr {
  margin: 2rem 0;
}
</style>
