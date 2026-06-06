<script setup>
import { onMounted, onUnmounted, ref, computed } from 'vue'
import ViewDefault from './views/ViewDefault.vue'
import ViewGallery from './views/ViewGallery.vue'
import ViewList from './views/ViewList.vue'

const props = defineProps({
  word: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'scroll', 'layout'])
const scrollRef = ref(null)
const titleRef = ref(null)
let resizeObserver = null

const handleScroll = (e) => {
  emit('scroll', e.target.scrollTop)
}

// Esc key to close
const onKeyDown = (e) => {
  if (e.key === 'Escape') emit('close')
}

onMounted(() => {
  document.addEventListener('keydown', onKeyDown)
  // Lock body scroll when modal is open
  document.body.style.overflow = 'hidden'
  
  // Track exact position of title placeholder to sync gravity word
  resizeObserver = new ResizeObserver(() => {
    if (titleRef.value && scrollRef.value) {
      const rect = titleRef.value.getBoundingClientRect()
      // rect.top is relative to viewport. Add scrollTop to get absolute position in scroll content
      emit('layout', { 
        x: rect.left, 
        y: rect.top + scrollRef.value.scrollTop,
        width: rect.width,
        height: rect.height
      })
    }
  })
  if (titleRef.value) resizeObserver.observe(titleRef.value)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeyDown)
  document.body.style.overflow = ''
  if (resizeObserver) resizeObserver.disconnect()
})

const activeView = computed(() => {
  if (props.word.pageType === 'Gallery') return ViewGallery;
  if (props.word.pageType === 'List') return ViewList;
  return ViewDefault;
})
</script>

<template>
  <div class="modal-backdrop" @click.self="emit('close')">
    <!-- Close button — fixed to viewport -->
    <button class="close-btn" @click="emit('close')" aria-label="Close">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>

    <div class="modal-scroll" ref="scrollRef" @click.self="emit('close')" @scroll="handleScroll">
      <!-- Title Area: Space for the gravity word to land -->
      <header class="title-area">
        <div class="category-tag">{{ word.category || 'Portfolio' }}</div>
        <div class="title-placeholder" ref="titleRef" :style="{ fontSize: `clamp(3rem, (3 + ${word.weight * 3}) * 1vw, 9rem)` }">{{ word.label.replace(/ /g, '\n') }}</div>
      </header>

      <!-- Content Views -->
      <component :is="activeView" :word="word" />
    </div>
  </div>
</template>

<style scoped>
/* ─── Backdrop ─── */
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 500;
  background: rgba(5, 5, 8, 0.78);
  backdrop-filter: blur(24px) saturate(190%);
  -webkit-backdrop-filter: blur(24px) saturate(190%);
  /* Add subtle glass grain/noise */
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.035'/%3E%3C/svg%3E");
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
  padding: 4rem 2rem 1rem;
  min-height: 14rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 0.8rem;
}

.category-tag {
  font-family: 'Outfit', sans-serif;
  color: var(--accent);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.25em;
  font-size: 0.8rem;
  opacity: 0.9;
  border-bottom: 2px solid color-mix(in srgb, var(--accent) 30%, transparent);
  align-self: flex-start;
  padding-bottom: 0.3rem;
  margin-bottom: 0.5rem;
}

/* Invisible placeholder to reserve space for the animated gravity word */
.title-placeholder {
  font-family: 'Bebas Neue', sans-serif;
  line-height: 0.72;
  padding: 0.13em 0 0 0;
  font-weight: 900;
  text-transform: uppercase;
  color: transparent;
  pointer-events: none;
  white-space: pre-line;
  text-align: left;
}

/* ─── Close button ─── */
.close-btn {
  position: fixed;
  top: 2rem;
  right: 2rem;
  width: 3.2rem;
  height: 3.2rem;
  border-radius: 50%;
  background: rgba(13, 13, 18, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 1100;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.close-btn:hover {
  transform: scale(1.08) rotate(90deg);
  background: var(--accent);
  border-color: rgba(255, 255, 255, 0.3);
  color: white;
  box-shadow: 0 0 20px color-mix(in srgb, var(--accent) 40%, transparent);
}

.close-btn:active {
  transform: scale(0.95);
}

.close-btn svg {
  width: 1.4rem;
  height: 1.4rem;
}

/* ─── Tablet ─── */
@media (max-width: 1024px) {
}

/* ─── Phone ─── */
@media (max-width: 640px) {
  .modal-scroll {
    padding: 0 1rem 3rem;
  }

  .close-btn {
    top: 1rem;
    right: 1rem;
    width: 2.8rem;
    height: 2.8rem;
  }

  .close-btn svg {
    width: 1.2rem;
    height: 1.2rem;
  }
}
</style>
