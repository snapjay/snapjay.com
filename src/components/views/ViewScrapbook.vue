<script setup>
import PolaroidPhoto from '../PolaroidPhoto.vue'

defineProps({
  word: {
    type: Object,
    required: true
  }
})

// Hand-tuned repeating patterns, so the collage looks arranged rather than
// random, and stays identical on every visit.
// Each run of three sizes fills one row on desktop.
const SIZES = ['l', 's', 'm', 'm', 'l', 's', 's', 'm', 'l']
const TILTS = [-2.6, 1.8, -1.1, 2.9, -1.9, 1.2, -3.1, 2.2, -0.8, 1.5]
const DROPS = [0, 2.5, 1, 1.75, 0, 3, 0.5, 2.25, 0] // rem, staggers the row
const TAPES = ['top', 'corners', 'top', 'top', 'corners', 'top', 'corners', 'top', 'top']

const at = (list, i) => list[i % list.length]
</script>

<template>
  <div class="page-container">
    <div class="content-body">
      <p class="lead-text" v-if="word.leadText" v-html="word.leadText"></p>
      <p v-if="word.bodyText" v-html="word.bodyText"></p>
    </div>

    <div class="scrapbook" :class="{ 'is-few': (word.images || []).length < 3 }">
      <div v-for="(image, i) in word.images" :key="image.src" class="scrap" :class="'scrap-' + at(SIZES, i)"
        :style="{ '--drop': at(DROPS, i) + 'rem' }">
        <PolaroidPhoto :src="image.src" :caption="image.caption" :href="image.href" :rotation="at(TILTS, i)"
          :tape="at(TAPES, i)" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
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
  color: var(--category-color, var(--accent));
  text-decoration: none;
  font-weight: 600;
  border-bottom: 1.5px solid color-mix(in srgb, var(--category-color, var(--accent)) 30%, transparent);
  transition: color 0.2s ease, border-color 0.2s ease;
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

/* ── Collage ── */
.scrapbook {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-items: flex-start;
  row-gap: 1.5rem;
  margin-top: 3rem;
}

.scrap {
  margin-top: var(--drop, 0);
}

.scrap-l { flex: 0 0 36%; }
.scrap-m { flex: 0 0 29%; }
.scrap-s { flex: 0 0 24%; }

/* One or two photos: keep them big and side by side */
.scrapbook.is-few .scrap {
  flex-basis: 40%;
}

@media (max-width: 1024px) {
  .scrap-l { flex-basis: 50%; }
  .scrap-m { flex-basis: 45%; }
  .scrap-s { flex-basis: 42%; }
}

@media (max-width: 640px) {
  .page-container {
    padding: 1rem 0.5rem 3rem;
  }

  .scrapbook {
    justify-content: flex-start;
    row-gap: 0.5rem;
    margin-top: 2rem;
  }

  /* One per row, zig-zagging left and right */
  .scrap,
  .scrapbook.is-few .scrap {
    flex-basis: 88%;
    margin-top: 0;
  }

  .scrap:nth-child(even) {
    margin-left: auto;
  }
}
</style>
