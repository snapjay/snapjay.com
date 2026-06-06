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
  <div class="page-container is-gallery">
    <main class="page-main">
      <div class="content-body">
        <p class="lead-text" v-if="word.leadText" v-html="word.leadText">
        </p>
        <p v-if="word.bodyText" v-html="word.bodyText">
        </p>
      </div>

      <div class="gallery-grid">
        <PolaroidPhoto 
          v-for="(image, index) in word.images"
          :key="index"
          :src="image.src"
          :caption="image.caption"
          :href="image.href"
        />
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
  gap: 2rem;
}

.content-body {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  font-family: 'Outfit', sans-serif;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.85);
  font-size: 1.1rem;
}

.content-body :deep(a) {
  color: var(--accent);
  text-decoration: none;
  font-weight: 600;
  border-bottom: 1.5px solid color-mix(in srgb, var(--accent) 30%, transparent);
  transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
  padding-bottom: 2px;
}

.content-body :deep(a:hover) {
  color: #fff;
  border-bottom-color: #fff;
}

.lead-text {
  font-size: 1.4rem;
  color: #fff;
  font-weight: 500;
  line-height: 1.5;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 3rem;
  margin-top: 2rem;
}

@media (max-width: 640px) {
  .page-container {
    padding: 1rem 0.5rem 3rem;
  }
  
  .gallery-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}
</style>
