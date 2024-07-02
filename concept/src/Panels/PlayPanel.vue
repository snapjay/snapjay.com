<template>
  <div class="pad" @click="generateRandomPositions">
    <h1>Play</h1>
    <div class="table">
      <Card
        v-for="project in personal"
        :key="project.id"
        :img="project.img"
        :title="project.title"
        class="card-transition"
        :desc="project.desc"
        @click.stop=""
        :style="{
          top: project.top,
          left: project.left,
          transform: `rotate(${project.rotation}deg)`
        }"
      >
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
    img: 'noun-motocross-4706122.svg',
    title: 'Dirtbike',
    desc: 'I derive immense enjoyment from traversing the rocky terrains of the mountains on my dirtbike. Exploring intricate trails, I revel in the discovery of picturesque and secluded locations that exude natural beauty.'
  },
  {
    id: 2,
    img: 'noun-chicken-5412599.svg',
    title: 'Chickens',
    desc: 'I have nurtured a brood of seven chickens, beginning their journey when they were merely two weeks old. Over time, these feathered companions have evolved into beloved pets, enhancing my daily life with both their companionship and the reward of a consistent supply of fresh eggs.'
  },
  {
    id: 3,
    img: 'noun-saw-table-3437774.svg',
    title: 'Wood Working',
    desc: 'Woodworking is a passion of mine, I have built a small woodshop. My proficiency in SVG web skills transitions to my work with my CNC machine. Click the boot to checkout my creations.',
    link: {
      href: 'https://oldboot.us',
      src: '/assets/img/credits/boot.svg'
    }
  },
  {
    id: 4,
    img: 'noun-gluten-4321747.svg',
    title: 'Growing Food',
    desc: 'Cultivating my own food is a deeply ingrained passion of mine. I possess a profound interest in the realm of agriculture and food production, driven by a fervent desire to create sustenance from the ground up. My dedication extends to crafting items from scratch whenever possible, reflecting my commitment to a holistic approach to nourishment and self-sufficiency.'
  },
  {
    id: 5,
    img: 'noun-concert-5674382.svg',
    title: 'Country Music',
    desc: 'Country music holds a special place in my heart, and I find solace and enjoyment in its melodies. Attending concerts beneath the open sky is an experience I cherish, as the combination of live country music and the vast expanse of stars creates a truly magical ambiance.'
  },
  {
    id: 6,
    img: 'noun-cooking-2555746.svg',
    title: 'Cooking',
    desc: 'Taking pleasure in the full cycle of nourishment, I relish the process of cultivating my own food, nurturing my chickens for their eggs, and subsequently utilizing these homegrown ingredients to prepare meals. This complete journey from seed to plate brings me immense satisfaction and a profound connection to the sustenance I create.'
  }
])

const maxWidth = 450
const maxHeight = 1000
const itemWidth = 150
const itemHeight = 216
const rotate = 15

function isOverlapping(x1, y1, x2, y2) {
  return !(
    x2 >= x1 + itemWidth ||
    x2 + itemWidth <= x1 ||
    y2 >= y1 + itemHeight ||
    y2 + itemHeight <= y1
  )
}

function generateRandomPositions() {
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
generateRandomPositions()
</script>
<style scoped>
.table {
  position: relative;
  width: 500px;
  height: 1000px;
  margin-top: 2rem;
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
