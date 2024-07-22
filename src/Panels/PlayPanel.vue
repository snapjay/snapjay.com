<template>
  <div class="pad">
    <div class="header">
      <h1>Play</h1>
      <img src="/assets/img/play/shuffle.svg" draggable="false" class="grow" alt="Shuffle the Deck" aria-hidden="true"
        @click="shuffleCards" />
    </div>

    <div class="table">
      <Card v-for="project in personal" class="card-transition" @click.stop="pickUpCardHandler(project.id)"
        :project="project" :left="project.left"
        :style="{ top: `${project.top}px`, left: `${project.left}px`, transform: `rotate(${project.rotation}deg)` }"
        :key="project.id" ref="itemRefs">
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
import { ref, onMounted } from 'vue'
import Card from '../components/CardComp.vue'
const personal = ref([
  {
    id: 1,
    img: 'motocross.svg',
    title: 'Dirtbike',
    // card: 'spades_jack.svg',
    card: 'dirtbikes2.png',
    desc: 'I derive most enjoyment from traversing the Rocky Mountains on my dirtbike. Battling mountainous terrain and exploring trails. I revel in the discovery of picturesque locations and find peace in natural beauty.'
  },
  {
    id: 2,
    img: 'chicken.svg',
    title: 'Chickens',
    // card: 'hearts_queen.svg',
    card: 'chicken.png',
    desc: 'I have nurtured a brood of eight chickens, beginning their journey when they were merely two weeks old. Over time, these feathered companions have evolved into beloved pets, enhancing my daily life with both their companionship and the reward of entertainment and supply of fresh eggs.'
  },
  {
    id: 3,
    img: 'saw-table.svg',
    title: 'Woodwork',
    card: 'diamonds_king.svg',
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
    card: 'clubs_ace.svg',
    desc: 'Cultivating my own food is a deeply ingrained passion of mine. I am interested in agriculture and food production. My dedication extends to growing food from seed whenever possible, reflecting my love of farming and self-sufficiency.'
  },
  {
    id: 5,
    img: 'concert.svg',
    title: 'Country Music',
    card: 'hearts_10.svg',
    desc: 'Country music holds a special place in my heart, and I find solace and enjoyment in its sound. Attending concerts beneath the open sky is an experience I cherish, as the combination of live country music and the vast expanse of stars creates a truly magical ambiance.'
  },
  {
    id: 6,
    img: 'cooking.svg',
    title: 'Cooking',
    card: 'diamonds_2.svg',
    desc: 'Taking pleasure in the full cycle of food, I relish the process of cultivating my own food, nurturing my chickens for their eggs, and subsequently utilizing these homegrown ingredients to prepare meals. This complete journey from seed to plate . I make as much as I can, including  my own pasta, mayo, dressings, cheese, pizza, sauces and bread.'
  }
])
const itemRefs = ref([])
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
    project.top = newPosition.top
    project.left = newPosition.left
    project.rotation = Math.random() * rotate - rotate / 2
  })
}
onMounted(() => {
  shuffleCards()
})

const pickUpCardHandler = (id) => {
  itemRefs.value.forEach((itemRef) => {
    if (itemRef.id !== id) {
      itemRef.putCardDown();
    } else {
      itemRef.pickUpCard();
    }
  });
};
</script>
<style scoped>
.table {
  position: relative;
  width: 500px;
  height: 1000px;
  margin-top: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
