<script setup>
import PolaroidPhoto from '../PolaroidPhoto.vue'

defineProps({
  word: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="page-container">
    <main class="page-main">
      <div class="content-body">
        <p class="lead-text" v-if="word.leadText" v-html="word.leadText">
        </p>
        <p v-if="word.bodyText" v-html="word.bodyText">
        </p>
      </div>

      <div class="list-container">
        <div v-for="(image, index) in word.images" :key="index" class="list-item">
          <div class="list-photo">
            <PolaroidPhoto :src="image.src" :caption="image.caption" :href="image.href" />
          </div>
          <div class="list-content">
            <h3 class="list-item-title">{{ image.title || image.caption }}</h3>
            <div class="list-item-detail" v-html="image.detail || 'This entry highlights a specific project milestone or creative endeavor within the ' + word.label + ' domain.'">
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.page-main {
  display: flex;
  flex-direction: column;
  gap: 4rem;
}

.content-body {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  font-family: 'Outfit', sans-serif;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
}

.lead-text {
  font-size: 1.4rem;
  color: #fff;
  font-weight: 500;
  line-height: 1.5;
}

.list-container {
  display: flex;
  flex-direction: column;
  gap: 5rem;
}

.list-item {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 4rem;
  align-items: start;
}

.list-photo {
  width: 100%;
}

.list-content {
  padding-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.list-item-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 2.5rem;
  color: var(--accent);
  letter-spacing: 0.05em;
  margin: 0;
  line-height: 1;
}

.list-item-detail {
  font-family: 'Outfit', sans-serif;
  font-size: 1.15rem;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.7);
  max-width: 65ch;
}

@media (max-width: 800px) {
  .list-item {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .list-photo {
    max-width: 400px;
    margin: 0 auto;
  }
  
  .list-content {
    padding-top: 0;
    text-align: center;
  }
  
  .list-item-detail {
    margin: 0 auto;
  }
}
</style>
