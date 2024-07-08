<template>
  <div class="pad" @click="shuffleCards">
    <h1>Play</h1>
    <div class="table">
      <Card v-for="project in personal" :key="project.id" :img="project.img" :title="project.title"
        class="card-transition" :desc="project.desc" @click.stop="" :style="{
          top: project.top,
          left: project.left,
          transform: `rotate(${project.rotation}deg)`
        }">
        <div v-if="project.link" class="projectLink">
          <a :href="project.link.href" target="_blank">
            <img :src="project.link.src" :alt="project.title" :style="{ width: '60px' }" />
          </a>
        </div>
      </Card>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import Card from '../components/Card.vue'
const personal = ref([
  {
    id: 1,
    img: 'motocross.svg',
    title: 'Dirtbike',
    desc: 'I derive most enjoyment from traversing the Rocky Mountains on my dirtbike. Battling terrine and exploring trails, I revel in the discovery of picturesque locations and find peace in natural beauty.'
  },
  {
    id: 2,
    img: 'chicken.svg',
    title: 'Chickens',
    desc: 'I have nurtured a brood of eight chickens, beginning their journey when they were merely two weeks old. Over time, these feathered companions have evolved into beloved pets, enhancing my daily life with both their companionship and the reward of entertainment and supply of fresh eggs.'
  },
  {
    id: 3,
    img: 'saw-table.svg',
    title: 'Wood Working',
    desc: 'Woodworking is a passion of mine, I have built a small woodshop. My proficiency in SVG web skills transitions to my work with my CNC machine. Click the boot to checkout my woodshop.',
    link: {
      href: 'https://oldboot.us',
      src: '/assets/img/personal/boot.svg'
    }
  },
  {
    id: 4,
    img: 'gluten.svg',
    title: 'Growing Food',
    desc: 'Cultivating my own food is a deeply ingrained passion of mine. I am interested in agriculture and food production. My dedication extends to growing food from seed whenever possible, reflecting my love of farming and self-sufficiency.'
  },
  {
    id: 5,
    img: 'concert.svg',
    title: 'Country Music',
    desc: 'Country music holds a special place in my heart, and I find solace and enjoyment in its sound. Attending concerts beneath the open sky is an experience I cherish, as the combination of live country music and the vast expanse of stars creates a truly magical ambiance.'
  },
  {
    id: 6,
    img: 'cooking.svg',
    title: 'Cooking',
    desc: 'Taking pleasure in the full cycle of food, I relish the process of cultivating my own food, nurturing my chickens for their eggs, and subsequently utilizing these homegrown ingredients to prepare meals. This complete journey from seed to plate . I make as much as I can, including  my own pasta, mayo, dressings, cheese, pizza, sauces and bread.'
  }
])

const maxWidth = 450
const maxHeight = 1000
const itemWidth = 150
const itemHeight = 216
const rotate = 15

const isOverlapping = (x1, y1, x2, y2) => {
  return !(
    x2 >= x1 + itemWidth ||
    x2 + itemWidth <= x1 ||
    y2 >= y1 + itemHeight ||
    y2 + itemHeight <= y1
  )
}

const shuffleCards = () => {
  const positions = []

  personal.value.forEach((project) => {
    let newPosition
    let overlapping
    do {
      overlapping = false
      const top = Math.max(0, Math.random() * maxHeight - itemHeight)
      const left = Math.max(0, Math.random() * maxWidth - itemWidth)

      newPosition = { top, left }

      for (const pos of positions) {
        if (isOverlapping(pos.left, pos.top, newPosition.left, newPosition.top)) {
          overlapping = true
          break
        }
      }
    } while (overlapping)

    positions.push(newPosition)
    project.top = `${newPosition.top}px`
    project.left = `${newPosition.left}px`
    project.rotation = Math.random() * rotate - rotate / 2
  })
}
shuffleCards()
</script>
<style scoped>
.table {
  position: relative;
  width: 500px;
  height: 1000px;
  margin-top: 2rem;
}

@media (max-width: 1200px) {
  .table {
    max-width: 90vw;
  }
}

.card-transition {
  transition:
    top 0.9s ease,
    left 0.9s ease,
    transform 2s ease;
  position: absolute;
}

.projectLink {
  text-align: center;
  margin-top: 1rem;
}

.pad {
  cursor: pointer;
}
</style>
