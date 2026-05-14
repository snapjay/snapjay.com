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
    <aside class="page-sidebar">
      <PolaroidPhoto 
        v-for="(image, index) in word.images"
        :key="index"
        :src="image.src"
        :caption="image.caption"
      />
    </aside>

    <main class="page-main">
      <div class="content-body">
        <p class="lead-text">
          {{ word.leadText || 'Exploring the intersection of creativity and impact through the lens of ' + word.label + '.' }}
        </p>
        <p>
            {{ word.bodyText || 'This role embodies the core values of our gravity-based design philosophy. Every interaction is calculated, every collision intentional. In the world of physics-based typography, stands out as a high-weight component that anchors the visual experience.' }}
        </p>
      </div>
    </main>
  </div>
</template>

<style scoped>
.page-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 3rem;
  padding: 2rem;
}

.page-sidebar {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  border-right: 1px solid var(--border-subtle);
  padding-right: 3rem;
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

@media (max-width: 1024px) {
  .page-container {
    grid-template-columns: 1fr;
    gap: 2rem;
    padding: 1rem 2rem;
  }

  .page-sidebar {
    border-right: none;
    border-bottom: 1px solid var(--border-subtle);
    padding-right: 0;
    padding-bottom: 2rem;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 1.5rem;
  }

  .page-sidebar > * {
    flex: 1 1 45%;
    min-width: 200px;
  }
}

@media (max-width: 640px) {
  .page-container {
    padding: 1rem 0.5rem 3rem;
    gap: 1.5rem;
  }

  .page-sidebar {
    flex-direction: column;
  }

  .page-sidebar > * {
    flex: 1 1 100%;
    min-width: auto;
  }
}
</style>
