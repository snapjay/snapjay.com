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
    <div class="arrow up" :class="{ disabled: !canScrollUp }" @click="canScrollUp && scrollPage('up')"></div>
    <div class="horizontal-arrows">
      <div class="arrow left" :class="{ disabled: !canScrollLeft }" @click="canScrollLeft && scrollPage('left')"></div>
      <div class="circle" :class="{ disabled: (!canScrollLeft && !canScrollUp) }"
        @click="(canScrollLeft || canScrollUp) && scrollPage('home')"></div>
      <div class="arrow right" :class="{ disabled: !canScrollRight }" @click="canScrollRight && scrollPage('right')">
      </div>
    </div>
    <div class="arrow down" :class="{ disabled: !canScrollDown }" @click="canScrollDown && scrollPage('down')"></div>
  </nav>
</template>

<style scoped>
#navigator {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 5;
  opacity: 0.3;
  transition: opacity 0.9s;
  background-color: #4e4a4ac2;
  padding: 0.5rem;
  border-radius: 3rem;
}

@media (max-width: 900px) {
  #navigator {
    display: none;
  }
}

#navigator:hover {
  opacity: 1;
}

.arrow {
  cursor: pointer;
  width: 36px;
  height: 36px;
  background-image: url('/assets/arrow.svg');
  background-size: cover;
  background-repeat: no-repeat;
}

.circle {
  align-self: center;
  cursor: pointer;
  width: 24px;
  height: 24px;
  background-color: #fff;
  border-radius: 50%;
}

.arrow.disabled,
.circle.disabled {
  opacity: 0.3;
  cursor: default
}

.up {
  transform: rotate(0deg);
}

.left {
  transform: rotate(270deg);
}

.right {
  transform: rotate(90deg);
}

.down {
  transform: rotate(180deg);
}

.horizontal-arrows {
  display: flex;
  justify-content: space-between;
  width: 110px;
  margin: 0.3rem 0;
}
</style>
