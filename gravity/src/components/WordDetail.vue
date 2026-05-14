<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import PolaroidPhoto from './PolaroidPhoto.vue'

defineProps({
  word: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close'])
const scrollRef = ref(null)

// Esc key to close
const onKeyDown = (e) => {
  if (e.key === 'Escape') emit('close')
}

onMounted(() => {
  document.addEventListener('keydown', onKeyDown)
  // Lock body scroll when modal is open
  document.body.style.overflow = 'hidden'
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeyDown)
  document.body.style.overflow = ''
})
</script>

<template>
  <div class="modal-backdrop" @mousedown.self="emit('close')" @touchend.self.prevent="emit('close')">
    <!-- Close button — fixed to viewport -->
    <button class="close-btn" @click="emit('close')" aria-label="Close">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>

    <div class="modal-scroll" ref="scrollRef" @mousedown.stop @touchstart.stop>
    
      <!-- Content -->
      <div :class="['page-container', { 'is-gallery': word.pageType === 'Gallery' }]">
        <aside v-if="word.pageType !== 'Gallery'" class="page-sidebar">
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
              {{ word.leadText || 'Exploring the intersection of creativity and impact through the lens of ' + word.label.replace('\n', ' ') + '.' }}
            </p>
            <p>
                {{ word.bodyText || 'This role embodies the core values of our gravity-based design philosophy. Every interaction is calculated, every collision intentional. In the world of physics-based typography, stands out as a high-weight component that anchors the visual experience.' }}
            </p>
          </div>

          <div v-if="word.pageType === 'Gallery'" class="gallery-grid">
            <PolaroidPhoto 
              v-for="(image, index) in word.images"
              :key="index"
              :src="image.src"
              :caption="image.caption"
            />
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ─── Backdrop ─── */
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 500;
  background: rgba(10, 10, 12, 0.92);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  display: flex;
  flex-direction: column;
}

/* ─── Scrollable content ─── */
.modal-scroll {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior-y: contain;
  padding: 0 2rem 4rem;
  scrollbar-width: thin;
  scrollbar-color: var(--border-highlight) transparent;
}

.modal-scroll::-webkit-scrollbar {
  width: 6px;
}

.modal-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.modal-scroll::-webkit-scrollbar-thumb {
  background: var(--border-subtle);
  border-radius: 3px;
}

/* ─── Title area ─── */
.title-area {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 2rem 1rem;
  min-height: 12rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 0.5rem;
}

.category-tag {
  font-family: 'Outfit', sans-serif;
  color: var(--accent);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 0.9rem;
}

/* Invisible placeholder to reserve space for the animated gravity word */
.title-placeholder {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(5rem, 10vw, 10rem);
  line-height: 0.85;
  font-weight: 900;
  text-transform: uppercase;
  color: transparent;
  pointer-events: none;
  white-space: pre-line;
}

/* ─── Page layout ─── */
.page-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 3rem;
  padding: 2rem;
}

.page-container.is-gallery {
  grid-template-columns: 1fr;
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

.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-top: 1.5rem;
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

/* ─── Gallery Grid ─── */
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 3rem;
  margin-top: 2rem;
}

/* ─── Close button ─── */
.close-btn {
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  background: rgba(30, 30, 36, 0.9);
  border: 1px solid var(--border-highlight);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  z-index: 1100;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.close-btn:hover {
  transform: scale(1.1) rotate(90deg);
  background: var(--accent);
  border-color: white;
}

.close-btn:active {
  transform: scale(0.95);
}

.close-btn svg {
  width: 1.5rem;
  height: 1.5rem;
}

/* ─── Tablet ─── */
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

/* ─── Phone ─── */
@media (max-width: 640px) {
  .modal-scroll {
    padding: 0 1rem 3rem;
  }

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

  .content-grid {
    grid-template-columns: 1fr;
  }

  .lead-text {
    font-size: 1.2rem;
  }

  .content-body {
    font-size: 1rem;
  }

  .close-btn {
    top: 1rem;
    right: 1rem;
    width: 3rem;
    height: 3rem;
  }

  .close-btn svg {
    width: 1.3rem;
    height: 1.3rem;
  }
}
</style>
