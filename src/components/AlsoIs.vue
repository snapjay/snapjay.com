<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import PaperTag from './PaperTag.vue'
import { relatedWords, type Word } from '../data/words'

const props = defineProps<{ word: Word }>()
const router = useRouter()

const related = computed(() => relatedWords(props.word.id, 3))
const tilts = [-3, 2, -1.5]
</script>

<template>
  <nav class="also" aria-label="Other identities">
    <h2 class="also-title">Dan is also&hellip;</h2>
    <ul class="also-list">
      <li v-for="(w, i) in related" :key="w.id">
        <a class="also-card" :href="`/${w.id}`" :style="{ '--tilt': `${tilts[i % tilts.length]}deg` }"
          @click.prevent="router.push(`/${w.id}`)">
          <PaperTag :word="w" />
        </a>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.also {
  max-width: 1200px;
  margin: 5rem auto 2rem;
  padding: 3rem 2rem 0;
  border-top: 1px solid var(--border-subtle);
}

.also-title {
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 400;
  font-size: clamp(1.8rem, 1.2rem + 2vw, 2.8rem);
  color: var(--paper);
  margin-bottom: 1.6rem;
}

.also-list {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1.25rem 2rem;
}

.also-card {
  display: inline-block;
  font-size: clamp(1.15rem, 0.9rem + 1vw, 1.7rem);
  text-decoration: none;
  /* Filter on the parent of the clip-path gives a shadow in the torn shape */
  filter: drop-shadow(0 5px 8px rgba(0, 0, 0, 0.5));
  transform: rotate(var(--tilt));
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.also-card:hover,
.also-card:focus-visible {
  transform: rotate(0deg) translateY(-4px) scale(1.04);
}

.also-card:focus-visible {
  outline: 2px solid var(--paper);
  outline-offset: 6px;
}

@media (max-width: 640px) {
  .also {
    margin-top: 3rem;
    padding: 2rem 0.5rem 0;
  }
}
</style>
