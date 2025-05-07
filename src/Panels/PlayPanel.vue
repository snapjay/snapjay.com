<template>
  <div class="pad">
    <div class="header">
      <h1>Play</h1>
      <img src="/assets/img/play/shuffle.svg" draggable="false" class="grow" alt="Shuffle the Deck" width="93"
        height="57" aria-hidden="true" @click="shuffleCards" />
    </div>

    <div class="table">
      <Card v-for="project in play" class="card-transition" @click.stop="pickUpCardHandler(project.id)"
        :project="project" :left="project.left"
        :style="{ top: `${project.top}px`, left: `${project.left}px`, transform: `rotate(${project.rotation}deg)` }"
        :key="project.id" ref="itemRefs">
        <div v-if="project.link" class="projectLink">
          <a :href="project.link.href" target="_blank">
            <img :src="project.link.src" :alt="project.title" width="60" height="60"  class="link" />
          </a>
        </div>
      </Card>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import Card from '../components/CardComp.vue'
import playData from '@/data/play.json'
const play = ref(playData)
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
  play.value.forEach((project) => {
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
img.link{
  width: 60px;
  height: 60px;
  border-radius: 10%;
  padding: .2rem;
  box-shadow: 0 0 10px rgba(0, 5, 10, 0.15);
  background-color: rgba(255, 255, 255, 0.75);
}
</style>
