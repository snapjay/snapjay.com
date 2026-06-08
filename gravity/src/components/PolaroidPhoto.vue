<script setup>
import { computed, ref, nextTick, onUnmounted, inject } from 'vue';

const props = defineProps({
  src: String,
  caption: String,
  href: String
})

const openLightbox = inject('openLightbox', null);

const isExpanded = ref(false);
const animatingActive = ref(false);
const rect = ref({ top: 0, left: 0, width: 0, height: 0 });
const highResLoaded = ref(false);

const windowWidth = ref(window.innerWidth);
const windowHeight = ref(window.innerHeight);

const originalPolaroidRef = ref(null);

const randomRotation = Math.random() * 7 - 3.5; // Random rotation between -3.5 and 3.5 deg

const isVideo = (src) => {
  return typeof src === 'string' && /\.(mp4|webm|ogg|mov)/i.test(src);
}

const isExternal = computed(() => props.href && (props.href.startsWith('http') || props.href.startsWith('mailto:')));

const fontSize = computed(() => {
  if (!props.caption) return '2.2rem';
  const len = props.caption.length;
  if (len < 20) return '2.2rem';
  if (len < 35) return '1.9rem';
  if (len < 45) return '1.6rem';
  return '1.35rem';
});

const thumbSrc = computed(() => {
  if (props.src && props.src.startsWith('/photos/') && props.src.endsWith('.webp')) {
    return props.src.replace('.webp', '-thumb.webp');
  }
  return props.src;
});

const updateRect = () => {
  const polaroidEl = originalPolaroidRef.value;
  if (polaroidEl) {
    const wrapperEl = polaroidEl.parentElement;
    
    // Save original styles
    const originalWrapperTransform = wrapperEl ? wrapperEl.style.transform : '';
    const originalPolaroidTransform = polaroidEl.style.transform;
    const originalWrapperTransition = wrapperEl ? wrapperEl.style.transition : '';
    const originalPolaroidTransition = polaroidEl.style.transition;
    
    // Clear transforms and transitions temporarily to measure unrotated/unhovered resting rect
    if (wrapperEl) {
      wrapperEl.style.transform = 'none';
      wrapperEl.style.transition = 'none';
    }
    polaroidEl.style.transform = 'none';
    polaroidEl.style.transition = 'none';
    
    // Force layout reflow and measure unhovered resting position
    rect.value = polaroidEl.getBoundingClientRect();
    
    // Restore original styles instantly
    if (wrapperEl) {
      wrapperEl.style.transform = originalWrapperTransform;
      wrapperEl.style.transition = originalWrapperTransition;
    }
    polaroidEl.style.transform = originalPolaroidTransform;
    polaroidEl.style.transition = originalPolaroidTransition;
  }
}

const handleResize = () => {
  windowWidth.value = window.innerWidth;
  windowHeight.value = window.innerHeight;
  updateRect();
}

const handlePhotoClick = (e) => {
  if (!props.href) {
    e.preventDefault();
    
    if (openLightbox) {
      openLightbox(props.src);
      return;
    }
    
    updateRect();
    
    isExpanded.value = true;
    highResLoaded.value = false; // Reset high-res loaded state
    
    nextTick(() => {
      requestAnimationFrame(() => {
        animatingActive.value = true;
      });
    });
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('keydown', handleGlobalKeydown);
  }
}

const closeLightbox = () => {
  animatingActive.value = false;
  window.removeEventListener('resize', handleResize);
  window.removeEventListener('keydown', handleGlobalKeydown);
  setTimeout(() => {
    isExpanded.value = false;
  }, 600); // Wait for transition to finish
}

const closeLightboxInstant = () => {
  animatingActive.value = false;
  isExpanded.value = false;
  window.removeEventListener('resize', handleResize);
  window.removeEventListener('keydown', handleGlobalKeydown);
}

const navigateToSibling = (direction) => {
  const zoomableElements = Array.from(document.querySelectorAll('.polaroid-wrapper.no-link'));
  const myWrapper = originalPolaroidRef.value.closest('.polaroid-wrapper');
  const myIndex = zoomableElements.indexOf(myWrapper);
  if (myIndex === -1) return;
  
  let targetIndex = myIndex + direction;
  if (targetIndex < 0) targetIndex = zoomableElements.length - 1;
  if (targetIndex >= zoomableElements.length) targetIndex = 0;
  
  const targetElement = zoomableElements[targetIndex];
  if (targetElement && targetElement !== myWrapper) {
    closeLightboxInstant();
    targetElement.click();
    nextTick(() => {
      targetElement.focus();
    });
  }
}

const handleGlobalKeydown = (e) => {
  if (!isExpanded.value) return;
  if (e.key === 'Escape') {
    e.preventDefault();
    closeLightbox();
  } else if (e.key === 'ArrowRight' || e.key === 'Right') {
    e.preventDefault();
    navigateToSibling(1);
  } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
    e.preventDefault();
    navigateToSibling(-1);
  }
}

const handlePhotoKey = (e) => {
  const isLink = e.currentTarget.tagName === 'A';
  if (e.key === ' ' || e.key === 'Spacebar') {
    e.preventDefault();
    e.currentTarget.click();
  } else if (e.key === 'Enter' && !isLink) {
    e.preventDefault();
    e.currentTarget.click();
  }
}

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  window.removeEventListener('keydown', handleGlobalKeydown);
})

const transformStyle = computed(() => {
  if (!rect.value.width) return {};
  
  const cX = windowWidth.value / 2;
  const cY = windowHeight.value / 2;
  
  const oX = rect.value.left + rect.value.width / 2;
  const oY = rect.value.top + rect.value.height / 2;
  
  const dX = cX - oX;
  const dY = cY - oY;
  
  // Dynamic scale up to 700px on desktop, or 95% width on mobile/tablet
  const targetWidth = Math.min(700, windowWidth.value * 0.95);
  const scale = targetWidth / rect.value.width;
  
  return {
    '--start-top': `${rect.value.top}px`,
    '--start-left': `${rect.value.left}px`,
    '--start-width': `${rect.value.width}px`,
    '--start-height': `${rect.value.height}px`,
    '--dx': `${dX}px`,
    '--dy': `${dY}px`,
    '--scale': scale,
    '--start-rotation': `${randomRotation}deg`
  };
});
</script>

<template>
  <component 
    :is="href ? 'a' : 'div'" 
    :href="href"
    :target="isExternal ? '_blank' : undefined"
    :rel="isExternal=='test' ? 'noopener noreferrer' : undefined"
    class="polaroid-wrapper"
    :class="{ 'no-link': !href }"
    :data-src="src"
    tabindex="0"
    @click="handlePhotoClick"
    @keydown="handlePhotoKey"
  >
    <div 
      ref="originalPolaroidRef"
      class="polaroid" 
      :class="{ 'is-hidden-in-grid': isExpanded }"
      :style="{ transform: `rotate(${randomRotation}deg)` }"
    >
      <div class="photo-container">
        <video 
          v-if="isVideo(src)"
          :src="src"
          autoplay
          loop
          muted
          playsinline
        ></video>
        <img v-else :src="thumbSrc" :alt="caption" />
        <div class="photo-glare"></div>
      </div>
      <div class="caption-container">
        <div class="caption" :style="{ fontSize: fontSize }">
          {{ caption }}
        </div>
      </div>
    </div>
  </component>

  <!-- Lightbox for non-link photos with FLIP transition -->
  <Teleport to="body">
    <div 
      v-if="isExpanded" 
      class="lightbox-overlay" 
      :class="{ 'is-visible': animatingActive }" 
      @click="closeLightbox"
      @wheel.prevent
      @touchmove.prevent
    >
      <button class="close-btn" @click="closeLightbox" aria-label="Close image">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
      <div class="lightbox-content">
        <div 
          class="polaroid expanded-polaroid" 
          :class="{ 'is-centered': animatingActive }" 
          :style="transformStyle"
        >
          <div class="photo-container">
            <template v-if="isVideo(src)">
              <video 
                :src="src"
                autoplay
                loop
                muted
                playsinline
              ></video>
            </template>
            <template v-else>
              <!-- Thumbnail loaded instantly as a placeholder -->
              <img :src="thumbSrc" class="photo-placeholder" :alt="caption" />
              
              <!-- High-res photo stacked on top, fading in seamlessly when fully loaded -->
              <img 
                :src="src" 
                class="photo-highres" 
                :class="{ 'is-loaded': highResLoaded }"
                @load="highResLoaded = true"
                :alt="caption" 
              />
            </template>
            <div class="photo-glare"></div>
          </div>
          <div class="caption-container">
            <div class="caption" :style="{ fontSize: fontSize }">
              {{ caption }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Reenie+Beanie&display=swap');

.polaroid-wrapper {
  display: block; /* Ensure transform/perspective work correctly on <a> tags */
  padding: 1rem;
  perspective: 1000px;
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  text-decoration: none;
  cursor: pointer;
}

.polaroid-wrapper.no-link {
  cursor: zoom-in;
}

.polaroid {
  /* Off-white paper color and subtle SVG noise for texture */
  background-color: #fcfcfc;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.25'/%3E%3C/svg%3E");
  padding: 1.2rem;
  box-shadow: 
    0 4px 15px #000000e7,
    0 10px 30px rgba(0, 0, 0, 0.603),
    inset 0 0 20px rgba(0, 0, 0, 0.233); /* slight inner shadow for aging */
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
              box-shadow 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  border: 1px solid rgba(0,0,0,0.08);
}

/* Instant visibility grid handoff: Hides original element immediately on click to prevent double imaging */
.polaroid.is-hidden-in-grid {
  opacity: 0 !important;
  pointer-events: none !important;
}

.polaroid-wrapper:hover {
  transform: rotate(1deg) scale(1.02) translateY(-10px);
  z-index: 10;
}

.polaroid-wrapper:focus-visible {
  outline: 3px solid var(--category-color, var(--accent));
  outline-offset: -2px;
  border-radius: 4px;
  transform: rotate(1deg) scale(1.02) translateY(-10px);
  z-index: 10;
}

.polaroid-wrapper:hover .polaroid {
  box-shadow: 
    0 25px 50px rgba(0,0,0,0.3),
    0 20px 25px rgba(0,0,0,0.15),
    inset 0 0 20px rgba(0,0,0,0.03);
}

.photo-container {
  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
  background: #222;
  position: relative;
  border: 2px solid rgba(0,0,0,0.15);
  box-shadow: inset 0 0 10px rgba(0,0,0,0.5);
}

.photo-container img,
.photo-container video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: contrast(1.1) brightness(1.05) saturate(0.9);
}

/* Progressive loading positions */
.photo-placeholder {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.photo-highres {
  position: absolute;
  inset: 0;
  z-index: 2;
  opacity: 0;
  transition: opacity 0.4s ease-out;
}

.photo-highres.is-loaded {
  opacity: 1;
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
  height: 4.8rem; /* Fixed height to enforce paper shape */
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden; /* prevents pushing the bottom down */
}

.caption {
  font-family: 'Reenie Beanie', cursive;
  color: #1a337a; /* Deep blue ink color */
  text-align: center;
  line-height: 1.1;
  transform: rotate(-1.5deg);
  opacity: 0.85;
  text-wrap: balance;
  width: 100%;
  /* Optional: subtle ink bleed effect */
  text-shadow: 0px 0px 1px rgba(26, 51, 122, 0.2);
}

/* Lightbox styles */
.lightbox-overlay {
  position: fixed;
  inset: 0;
  z-index: 2000;
  background: rgba(10, 10, 12, 0);
  backdrop-filter: blur(0px);
  -webkit-backdrop-filter: blur(0px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  cursor: zoom-out;
  transition: background 0.6s ease, backdrop-filter 0.6s ease;
  pointer-events: none;
}

.lightbox-overlay.is-visible {
  background: rgba(10, 10, 12, 0.85);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  pointer-events: auto;
}

.lightbox-overlay .close-btn {
  opacity: 0;
  transition: opacity 0.3s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), background 0.4s, border-color 0.4s, color 0.4s, box-shadow 0.4s;
}

.lightbox-overlay.is-visible .close-btn {
  opacity: 1;
}

.lightbox-content {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.expanded-polaroid {
  position: fixed;
  top: var(--start-top);
  left: var(--start-left);
  width: var(--start-width);
  height: var(--start-height);
  margin: 0 !important;
  box-shadow: 
    0 4px 15px #000000e7,
    0 10px 30px rgba(0, 0, 0, 0.603),
    inset 0 0 20px rgba(0, 0, 0, 0.233) !important;
  
  transform: translate(0, 0) scale(1) rotate(var(--start-rotation));
  transform-origin: center center;
  transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1),
               box-shadow 0.6s cubic-bezier(0.34, 1.56, 0.64, 1),
               padding 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  will-change: transform;
  pointer-events: auto;
  cursor: zoom-out;
}

.expanded-polaroid.is-centered {
  transform: translate(var(--dx), var(--dy)) scale(var(--scale)) rotate(0deg);
  padding: 1.5rem 1.5rem 2rem 1.5rem !important;
  box-shadow: 0 30px 70px rgba(0, 0, 0, 0.65) !important;
}
</style>

