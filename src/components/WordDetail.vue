<script setup>
import { onMounted, onUnmounted, ref, computed, nextTick, provide } from 'vue'
import ViewDefault from './views/ViewDefault.vue'
import ViewGallery from './views/ViewGallery.vue'
import ViewList from './views/ViewList.vue'
import ViewSoftwareEngineer from './views/ViewSoftwareEngineer.vue'
import { transformCdnUrl } from '../utils/cdn'
import { categoryColors, fontFamilies } from '../constants'

const props = defineProps({
  word: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'scroll', 'layout'])
const scrollRef = ref(null)
const titleRef = ref(null)
const closeBtnRef = ref(null)
let resizeObserver = null

const activeZoomIndex = ref(-1)
const carouselTransitionName = ref('slide-left')
const lightboxCloseBtnRef = ref(null)

const isVideo = (src) => {
  return typeof src === 'string' && /\.(mp4|webm|ogg|mov)/i.test(src);
}

const resolvedWord = computed(() => {
  if (!props.word.images) return props.word;
  return {
    ...props.word,
    images: props.word.images.map(img => {
      if (img.src && !img.src.startsWith('/') && !img.src.startsWith('http://') && !img.src.startsWith('https://')) {
        return {
          ...img,
          src: `/photos/${props.word.id}/${img.src}`
        };
      }
      return img;
    })
  };
});

const zoomableImages = computed(() => {
  if (!resolvedWord.value.images) return []
  return resolvedWord.value.images.filter(img => !img.href)
})

const zoomFontSize = computed(() => {
  const activeImg = zoomableImages.value[activeZoomIndex.value];
  if (!activeImg || !activeImg.caption) return '2.2rem';
  const len = activeImg.caption.length;
  if (len < 20) return '2.2rem';
  if (len < 35) return '1.9rem';
  if (len < 45) return '1.6rem';
  return '1.35rem';
});

const openLightbox = (src) => {
  const index = zoomableImages.value.findIndex(img => img.src === src)
  if (index !== -1) {
    activeZoomIndex.value = index
    nextTick(() => {
      lightboxCloseBtnRef.value?.focus()
    })
  }
}

const closeSharedLightbox = () => {
  const lastActiveIndex = activeZoomIndex.value
  const lastActiveImage = zoomableImages.value[lastActiveIndex]
  activeZoomIndex.value = -1
  if (lastActiveImage) {
    nextTick(() => {
      const el = document.querySelector(`.polaroid-wrapper[data-src="${lastActiveImage.src}"]`)
      if (el) {
        el.focus()
      }
    })
  }
}

const navigateCarousel = (direction) => {
  if (zoomableImages.value.length <= 1) return
  
  carouselTransitionName.value = direction > 0 ? 'slide-left' : 'slide-right'
  
  let nextIndex = activeZoomIndex.value + direction
  if (nextIndex < 0) nextIndex = zoomableImages.value.length - 1
  if (nextIndex >= zoomableImages.value.length) nextIndex = 0
  
  activeZoomIndex.value = nextIndex
}

provide('openLightbox', openLightbox)

const handleScroll = (e) => {
  emit('scroll', e.target.scrollTop)
}

// Esc key to close
const onKeyDown = (e) => {
  if (activeZoomIndex.value !== -1) {
    if (e.key === 'Escape') {
      e.preventDefault()
      e.stopPropagation()
      closeSharedLightbox()
    } else if (e.key === 'ArrowRight' || e.key === 'Right') {
      e.preventDefault()
      navigateCarousel(1)
    } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
      e.preventDefault()
      navigateCarousel(-1)
    }
    return
  }
  if (e.key === 'Escape') emit('close')
}

onMounted(() => {
  document.addEventListener('keydown', onKeyDown)
  // Lock body scroll when modal is open
  document.body.style.overflow = 'hidden'

  // Focus the scroll container automatically for accessibility with a slight delay.
  // This allows the user to immediately scroll the modal using arrow keys,
  // while Tab still moves focus directly to the close button.
  setTimeout(() => {
    scrollRef.value?.focus()
  }, 150)

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
  if (props.word.pageType === 'SoftwareEngineer') return ViewSoftwareEngineer;
  if (props.word.pageType === 'Gallery') return ViewGallery;
  if (props.word.pageType === 'List') return ViewList;
  return ViewDefault;
})
</script>

<template>
  <div class="modal-backdrop" @click.self="emit('close')"
    :style="{ '--category-color': categoryColors[word.category || 'Portfolio'] || '#3592bf' }">
    <!-- Close button — fixed to viewport -->
    <button ref="closeBtnRef" class="close-btn" @click="emit('close')" aria-label="Close">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>

    <div class="modal-scroll" ref="scrollRef" tabindex="-1" @click.self="emit('close')" @scroll="handleScroll">
      <!-- Title Area: Space for the gravity word to land -->
      <header class="title-area">
        <div class="category-tag">{{ word.category || 'Portfolio' }}</div>
        <div class="title-placeholder" ref="titleRef" :style="{
          fontSize: `clamp(1.3rem, (1.3 + 0.5 * 1.5) * 1vw, 3.8rem)`, // Ignore word.weight to keep all sizes the same
          fontFamily: fontFamilies[word.font] || fontFamilies['moms-typewriter'],
          fontWeight: (word.font === 'playfair-display') ? '900' : 'normal'
        }">
          <span v-for="(line, lineIdx) in word.label.split(' ')" :key="lineIdx" class="cloth-line">
            {{ line }}
            <span v-if="lineIdx === word.label.split(' ').length - 1" class="paper-dot"></span>
          </span>
        </div>
      </header>

      <!-- Content Views -->
      <component :is="activeView" :word="resolvedWord" />
    </div>

    <!-- Shared Lightbox Carousel inside WordDetail.vue -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="activeZoomIndex !== -1" class="shared-lightbox-overlay" @click.self="closeSharedLightbox" @wheel.prevent @touchmove.prevent>
          
          <button ref="lightboxCloseBtnRef" class="close-btn" @click="closeSharedLightbox" aria-label="Close image">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>

          <!-- Carousel Controls -->
          <button v-if="zoomableImages.length > 1" class="carousel-nav prev" @click="navigateCarousel(-1)" aria-label="Previous image">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <path d="M15 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
          
          <button v-if="zoomableImages.length > 1" class="carousel-nav next" @click="navigateCarousel(1)" aria-label="Next image">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <path d="M9 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>

          <div class="lightbox-content">
            <!-- Carousel slide wrapper for sliding transitions -->
            <Transition :name="carouselTransitionName">
              <div :key="activeZoomIndex" class="polaroid expanded-polaroid" @click="closeSharedLightbox">
                <div class="photo-container">
                  <template v-if="isVideo(zoomableImages[activeZoomIndex].src)">
                    <video 
                      :src="transformCdnUrl(zoomableImages[activeZoomIndex].src)"
                      autoplay
                      loop
                      muted
                      playsinline
                    ></video>
                  </template>
                  <template v-else>
                    <img :src="transformCdnUrl(zoomableImages[activeZoomIndex].src.replace('.webp', '-thumb.webp'))" class="photo-placeholder" :alt="zoomableImages[activeZoomIndex].caption" />
                    <img :src="transformCdnUrl(zoomableImages[activeZoomIndex].src)" class="photo-highres" :alt="zoomableImages[activeZoomIndex].caption" />
                  </template>
                  <div class="photo-glare"></div>
                </div>
                <div class="caption-container">
                  <div class="caption" :style="{ fontSize: zoomFontSize }">
                    {{ zoomableImages[activeZoomIndex].caption }}
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
/* ─── Backdrop ─── */
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 500;
  background: rgba(5, 5, 8, 0.58);
  backdrop-filter: blur(18px) saturate(190%);
  -webkit-backdrop-filter: blur(14px) saturate(190%);
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

.modal-scroll:focus {
  outline: none;
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

/* ─── Shared Lightbox Carousel ─── */
.shared-lightbox-overlay {
  position: fixed;
  inset: 0;
  z-index: 2000;
  background: rgba(10, 10, 12, 0.85);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  cursor: zoom-out;
}



.carousel-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 2100;
}

.carousel-nav:hover {
  background: var(--category-color);
  border-color: rgba(255, 255, 255, 0.4);
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 0 15px color-mix(in srgb, var(--category-color) 40%, transparent);
}

.carousel-nav:active {
  transform: translateY(-50%) scale(0.95);
}

.carousel-nav.prev {
  left: 2.5rem;
}

.carousel-nav.next {
  right: 2.5rem;
}

.lightbox-content {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  pointer-events: none;
}

.expanded-polaroid {
  position: relative;
  pointer-events: auto;
  cursor: zoom-out;
  max-width: 600px;
  width: 90vw;
  background-color: #fcfcfc;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.25'/%3E%3C/svg%3E");
  padding: 1.5rem 1.5rem 2.5rem 1.5rem;
  box-shadow: 0 30px 70px rgba(0, 0, 0, 0.65);
  border: 1px solid rgba(0,0,0,0.08);
}

.photo-container {
  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
  background: #222;
  position: relative;
  border: 2px solid rgba(0,0,0,0.15);
}

.photo-container img,
.photo-container video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-placeholder {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.photo-highres {
  position: absolute;
  inset: 0;
  z-index: 2;
}

.photo-glare {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.05) 100%);
  pointer-events: none;
  mix-blend-mode: screen;
  z-index: 3;
}

.caption-container {
  margin-top: 1rem;
  height: 4.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.caption {
  font-family: 'Reenie Beanie', cursive;
  color: #1a337a;
  text-align: center;
  font-size: 2.2rem;
  line-height: 1.1;
  text-wrap: balance;
  width: 100%;
}

/* ─── Carousel Transitions ─── */
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.5s cubic-bezier(0.25, 1, 0.5, 1);
  position: absolute;
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(120%) rotate(8deg);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-120%) rotate(-8deg);
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-120%) rotate(-8deg);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(120%) rotate(8deg);
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
  color: var(--category-color);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.25em;
  font-size: 0.8rem;
  opacity: 0.9;
  border-bottom: 2px solid color-mix(in srgb, var(--category-color) 30%, transparent);
  align-self: flex-start;
  padding-bottom: 0.3rem;
  margin-bottom: 0.5rem;
}

/* Invisible placeholder to reserve space for the animated gravity word */
.title-placeholder {
  display: inline-flex;
  flex-direction: column;
  align-self: flex-start;
  padding: 0.35em 0.85em 0.3em;
  line-height: 0.95;
  text-transform: lowercase;
  visibility: hidden;
  pointer-events: none;
  text-align: left;
}

.cloth-line {
  display: block;
  overflow: visible;
}

.cloth-line+.cloth-line {
  margin-top: -0.05em;
}

.paper-dot {
  display: inline-block;
  width: 0.24em;
  height: 0.24em;
  border-radius: 50%;
  margin-left: 0.08em;
  vertical-align: baseline;
}

/* ─── Close button ─── */
/* ─── Tablet ─── */
@media (max-width: 1024px) {}

/* ─── Phone ─── */
@media (max-width: 640px) {
  .modal-scroll {
    padding: 0 1rem 3rem;
  }
}
</style>
