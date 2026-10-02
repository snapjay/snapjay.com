<script setup lang="ts">
import { computed } from 'vue'
import type { Word } from '../data/words'
import { paperIndex } from '../data/words'
import { categoryColors, fontFamilies, paperBgs } from '../constants'

const props = defineProps<{ word: Word }>()

// Same paper texture and torn edge for a word wherever it appears
const index = computed(() => paperIndex(props.word.id))
const lines = computed(() => props.word.label.split(' '))
</script>

<template>
  <div class="paper-tag" :class="'paper-torn-' + (index % 4 + 1)" :style="{
    '--paper-bg-url': `url(${paperBgs[index % paperBgs.length]})`,
    '--word-color': categoryColors[word.category || 'Portfolio'] || '#3592bf',
    fontFamily: fontFamilies[word.font] || fontFamilies['moms-typewriter'],
    fontWeight: word.font === 'playfair-display' ? 900 : 'normal'
  }">
    <span class="paper-text">
      <span v-for="(line, i) in lines" :key="i" class="paper-line">{{ line }}<span v-if="i === lines.length - 1"
          class="paper-dot"></span></span>
    </span>
  </div>
</template>

<style scoped>
.paper-tag {
  background-color: #f5f4ed;
  background-image:
    url('/textures/grain-paper.webp'),
    var(--paper-bg-url, none);
  background-size: 128px, cover;
  background-position: center;
  background-repeat: repeat, no-repeat;
  padding: 0.35em 0.85em 0.3em;
  border: 1px solid rgba(0, 0, 0, 0.06);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.05em;

  font-family: 'Moms Typewriter', 'Courier New', Courier, monospace;
  font-weight: normal;
  line-height: 0.95;
  text-transform: lowercase;
  color: #1c1c1f;

  transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1),
    background-color 0.3s ease;
}

.paper-line {
  display: block;
  white-space: nowrap;
}

.paper-line + .paper-line {
  margin-top: -0.05em;
}

.paper-dot {
  display: inline-block;
  width: 0.24em;
  height: 0.24em;
  border-radius: 50%;
  background-color: var(--word-color);
  margin-left: 0.08em;
  vertical-align: baseline;
}

/* Four jagged clip-path variations for torn edges */
.paper-torn-1 {
  clip-path: polygon(0.5% 3%, 12% 1.5%, 28% 4%, 42% 1.2%, 58% 3.5%, 72% 1.8%, 88% 4.2%, 99% 2%,
      98% 18%, 99.5% 38%, 98.2% 58%, 99.1% 78%, 98.5% 97%,
      86% 98.5%, 74% 96.5%, 58% 99%, 44% 97.2%, 28% 98.8%, 14% 96.2%, 1% 98%,
      1.8% 82%, 0.5% 62%, 1.2% 42%, 0.8% 22%);
}

.paper-torn-2 {
  clip-path: polygon(1.5% 2%, 18% 3.5%, 32% 1.2%, 48% 4.1%, 64% 1.8%, 82% 3.2%, 98.5% 1.5%,
      97.5% 22%, 99% 45%, 97.8% 68%, 99.2% 96.5%,
      88% 95.2%, 72% 97.8%, 56% 95.8%, 38% 98.2%, 22% 95.5%, 1.2% 97.2%,
      0.8% 76%, 2% 52%, 0.5% 28%);
}

.paper-torn-3 {
  clip-path: polygon(0.8% 4%, 15% 1.8%, 35% 3.2%, 55% 1.5%, 75% 3.8%, 92% 2.1%, 99.2% 3.5%,
      98.1% 28%, 99% 48%, 97.5% 72%, 98.8% 98%,
      82% 97.1%, 64% 98.8%, 46% 96.5%, 28% 98.2%, 12% 96.8%, 1.5% 97.5%,
      1.2% 78%, 0.5% 58%, 1.8% 32%);
}

.paper-torn-4 {
  clip-path: polygon(1.2% 1.8%, 22% 3.2%, 42% 1.5%, 62% 3.8%, 82% 2.1%, 98.8% 3.2%,
      97.5% 18%, 99.1% 42%, 97.8% 68%, 99.2% 97.8%,
      84% 96.8%, 68% 98.5%, 52% 96.2%, 36% 98.8%, 18% 97.2%, 0.8% 96.2%,
      1.5% 72%, 0.8% 48%, 2.1% 24%);
}
</style>
