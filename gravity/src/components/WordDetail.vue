<script setup>
import PolaroidPhoto from './PolaroidPhoto.vue'

defineProps({
  word: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close'])
</script>

<template>
  <div class="selected-overlay">
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
        <header class="content-header">
          <span class="category-tag">Featured Role</span>
          <h1 class="content-title">{{ word.label }}</h1>
        </header>

        <div class="content-body">
          <p class="lead-text">
            Exploring the intersection of creativity and impact through the lens of {{ word.label.replace('\n', ' ') }}.
          </p>
          <p>
            This role embodies the core values of our gravity-based design philosophy. Every interaction is calculated,
            every collision intentional. In the world of physics-based typography, {{ word.label.replace('\n', ' ') }}
            stands out as a high-weight component that anchors the visual experience.
          </p>
          <div class="content-grid">
            <div class="grid-card">
              <h3>Dynamics</h3>
              <p>Simulating realistic weight and momentum to create tactile digital interfaces.</p>
            </div>
            <div class="grid-card">
              <h3>Impact</h3>
              <p>How typography influences user perception through movement and physics.</p>
            </div>
          </div>
        </div>
      </main>
    </div>

    <button class="close-btn" @click="emit('close')">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
        <path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>
  </div>
</template>

<style scoped>
.selected-overlay {
  position: absolute;
  inset: 0;
  z-index: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(10, 10, 12, 0.9);
  backdrop-filter: blur(20px);
}

.page-container {
  width: 90%;
  max-width: 1200px;
  height: 85%;
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 4rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: 3rem;
  padding: 4rem;
  overflow-y: auto;
  box-shadow: 0 50px 100px rgba(0, 0, 0, 0.4);
}

@media (max-width: 1024px) {
  .page-container {
    grid-template-columns: 1fr;
    gap: 2rem;
    padding: 3rem;
    height: 90%;
  }

  .page-sidebar {
    max-width: 300px;
  }
}

@media (max-width: 640px) {
  .page-container {
    padding: 1.5rem;
    border-radius: 2rem;
    width: 95%;
  }

  .content-title {
    font-size: 4rem;
  }

  .content-grid {
    grid-template-columns: 1fr;
  }

  .close-btn {
    top: 1rem;
    right: 1rem;
    width: 3rem;
    height: 3rem;
  }
}

.page-sidebar {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.page-main {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  overflow-y: auto;
  padding-right: 1rem;
}

/* Custom Scrollbar */
.page-main::-webkit-scrollbar {
  width: 6px;
}

.page-main::-webkit-scrollbar-thumb {
  background: var(--border-subtle);
  border-radius: 3px;
}

.category-tag {
  font-family: 'Outfit', sans-serif;
  color: var(--accent);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 0.9rem;
}

.content-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 6rem;
  line-height: 0.9;
  margin: 0.5rem 0 0;
  white-space: pre-line;
  background: linear-gradient(to bottom, #fff, #888);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
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

.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-top: 2rem;
}

.grid-card {
  padding: 2rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 1.5rem;
}

.grid-card h3 {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  color: #fff;
}

.grid-card p {
  font-size: 0.95rem;
  margin: 0;
  opacity: 0.7;
}

.close-btn {
  position: absolute;
  top: 2.5rem;
  right: 2.5rem;
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-highlight);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  z-index: 1100;
}

.close-btn:hover {
  transform: scale(1.1) rotate(90deg);
  background: var(--accent);
  border-color: white;
}

.close-btn svg {
  width: 1.8rem;
  height: 1.8rem;
}
</style>
