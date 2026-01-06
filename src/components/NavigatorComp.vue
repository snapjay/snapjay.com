<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const canScrollUp = ref(true);
const canScrollDown = ref(true);
const canScrollLeft = ref(true);
const canScrollRight = ref(true);

const checkScroll = () => {
  canScrollUp.value = window.scrollY > 0;
  canScrollDown.value = window.scrollY < document.documentElement.scrollHeight - window.innerHeight;
  canScrollLeft.value = window.scrollX > 0;
  canScrollRight.value = window.scrollX < document.documentElement.scrollWidth - window.innerWidth;
};

const scrollPage = (direction) => {
  const scrollAmount = 500;
  switch (direction) {
    case 'up':
      window.scrollBy({ top: -scrollAmount, behavior: 'smooth' });
      break;
    case 'down':
      window.scrollBy({ top: scrollAmount, behavior: 'smooth' });
      break;
    case 'left':
      window.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      break;
    case 'right':
      window.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      break;
    case 'home':
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      break;
  }
};

onMounted(() => {
  window.addEventListener('scroll', checkScroll);
  checkScroll();
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', checkScroll);
});
</script>

<template>
  <nav id="navigator">
    <button 
      class="nav-btn up" 
      :class="{ disabled: !canScrollUp }" 
      @click="canScrollUp && scrollPage('up')"
      aria-label="Scroll Up"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 15l-6-6-6 6"/>
      </svg>
    </button>
    
    <div class="middle-row">
      <button 
        class="nav-btn left" 
        :class="{ disabled: !canScrollLeft }" 
        @click="canScrollLeft && scrollPage('left')"
        aria-label="Scroll Left"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </button>
      
      <button 
        class="nav-home" 
        :class="{ disabled: (!canScrollLeft && !canScrollUp) }"
        @click="(canScrollLeft || canScrollUp) && scrollPage('home')"
        aria-label="Go Home"
      >
        <div class="home-dot"></div>
      </button>
      
      <button 
        class="nav-btn right" 
        :class="{ disabled: !canScrollRight }" 
        @click="canScrollRight && scrollPage('right')"
        aria-label="Scroll Right"
      >
         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 18l6-6-6-6"/>
        </svg>
      </button>
    </div>

    <button 
      class="nav-btn down" 
      :class="{ disabled: !canScrollDown }" 
      @click="canScrollDown && scrollPage('down')"
      aria-label="Scroll Down"
    >
       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M6 9l6 6 6-6"/>
      </svg>
    </button>
  </nav>
</template>

<style scoped>
#navigator {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 100;
  
  /* Glassmorphism */
  background: rgba(30, 30, 30, 0.65);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
  
  padding: 0.75rem;
  border-radius: 2rem; /* Pill shape container */
  
  opacity: 0.6;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

#navigator:hover {
  opacity: 1;
  transform: translateY(-2px);
  box-shadow: 0 12px 40px 0 rgba(0, 0, 0, 0.4);
  background: rgba(40, 40, 40, 0.75);
}

/* Reset Button Styles */
button {
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.85);
  transition: all 0.2s ease;
  outline: none;
}

.nav-btn {
  width: 40px;
  height: 32px;
  border-radius: 8px;
}

.nav-btn svg {
  width: 24px;
  height: 24px;
}

.nav-btn:hover:not(.disabled) {
  color: #fff;
  transform: scale(1.2);
  background: rgba(255, 255, 255, 0.1);
}

.nav-btn:active:not(.disabled) {
  transform: scale(0.95);
}

.middle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 0.25rem;
  margin: 0.25rem 0;
}

.nav-home {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.home-dot {
  width: 12px;
  height: 12px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  transition: all 0.3s ease;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
}

.nav-home:hover:not(.disabled) .home-dot {
  transform: scale(1.4);
  background-color: #fff;
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
}

/* Disabled State */
.disabled {
  opacity: 0.2 !important;
  cursor: default !important;
  pointer-events: none;
}

/* Mobile Hide */
@media (max-width: 900px) {
  #navigator {
    display: none;
  }
}
</style>
