<script setup>
import { ref, computed } from 'vue'
import PolaroidPhoto from '../PolaroidPhoto.vue'

const props = defineProps({
  word: {
    type: Object,
    required: true
  }
})

const BANDS = ['#c0392b', '#1f5fa8', '#2e7d32', '#d9731f']
const JUKEBOX_TOOLS = 'https://jukebox.tools/'

// Selection codes run like a real selector: A1, A2, B1, B2…
const codeFor = i => 'ABCDEFGH'[Math.floor(i / 2)] + ((i % 2) + 1)

const slots = computed(() => {
  const images = props.word.images || []
  const machines = images.map((image, i) => ({
    code: codeFor(i),
    band: BANDS[i % BANDS.length],
    strip: image.strip || { a: image.caption || '', artist: props.word.label, b: '' },
    image
  }))
  const n = machines.length
  return [
    ...machines,
    {
      code: codeFor(n),
      band: BANDS[n % BANDS.length],
      strip: { a: 'Print Your Own', artist: 'Jukebox.Tools', b: 'Title Strips' },
      href: JUKEBOX_TOOLS
    }
  ]
})

const selected = ref(0)
const playing = computed(() => slots.value[selected.value])
</script>

<template>
  <div class="page-container">
    <div class="content-body">
      <p class="lead-text" v-if="word.leadText" v-html="word.leadText"></p>
      <p v-if="word.bodyText" v-html="word.bodyText"></p>
    </div>

    <div class="jukebox">
      <div class="selector" role="group" aria-label="Jukebox selector: pick a machine">
        <div class="selector-header" aria-hidden="true">
          <span class="pilot"></span> Make your selection <span class="pilot"></span>
        </div>

        <div class="selector-glass">
          <template v-for="(slot, i) in slots" :key="slot.code">
            <a v-if="slot.href" class="slot" :href="slot.href" target="_blank" rel="noopener noreferrer"
              :style="{ '--band': slot.band }" :aria-label="`${slot.code}: Print your own title strips at Jukebox Tools (opens in a new tab)`">
              <span class="slot-code" aria-hidden="true">{{ slot.code }}</span>
              <span class="strip" aria-hidden="true">
                <span class="strip-side">{{ slot.strip.a }}</span>
                <span class="strip-artist">{{ slot.strip.artist }}</span>
                <span class="strip-side">{{ slot.strip.b }}</span>
              </span>
            </a>
            <button v-else type="button" class="slot" :class="{ 'is-selected': selected === i }"
              :aria-pressed="selected === i" :style="{ '--band': slot.band }"
              :aria-label="`${slot.code}: ${slot.image.caption}`" @click="selected = i">
              <span class="slot-code" aria-hidden="true">{{ slot.code }}</span>
              <span class="strip" aria-hidden="true">
                <span class="strip-side">{{ slot.strip.a }}</span>
                <span class="strip-artist">{{ slot.strip.artist }}</span>
                <span class="strip-side">{{ slot.strip.b }}</span>
              </span>
            </button>
          </template>
        </div>
      </div>

      <div class="now-playing" aria-live="polite">
        <div class="now-playing-label tape">
          <span class="playing-dot" aria-hidden="true"></span>Now playing {{ playing.code }}
        </div>
        <Transition name="record" mode="out-in">
          <div :key="playing.code" class="now-playing-photo">
            <PolaroidPhoto :src="playing.image.src" :caption="playing.image.caption" :rotation="2.2" tape="top" />
          </div>
        </Transition>
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

.lead-text {
  font-size: 1.4rem;
  color: #fff;
  font-weight: 500;
  line-height: 1.5;
}

/* ── Layout ── */
.jukebox {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr);
  gap: 3.5rem;
  align-items: center;
  margin-top: 3rem;
}

/* ── Chrome selector panel ── */
.selector {
  padding: 1rem 1.1rem 1.25rem;
  border-radius: 18px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.55) 0%, rgba(255, 255, 255, 0) 22%),
    linear-gradient(90deg, #8d939b 0%, #e9ecef 18%, #b5bbc2 40%, #f4f6f8 62%, #9ca2aa 84%, #d6dade 100%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.8),
    inset 0 -2px 0 rgba(0, 0, 0, 0.25),
    0 18px 40px rgba(0, 0, 0, 0.55);
}

.selector-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.7rem;
  margin-bottom: 0.8rem;
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.15rem;
  letter-spacing: 0.22em;
  color: #3b3f45;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.7);
}

.pilot {
  width: 0.55rem;
  height: 0.55rem;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, #ffe7a8, #e8a030 60%, #9a5a10);
  box-shadow: 0 0 6px rgba(232, 160, 48, 0.8);
}

.selector-glass {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.85rem;
  padding: 0.9rem;
  border-radius: 10px;
  background:
    linear-gradient(160deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0) 35%),
    #1c1915;
  box-shadow: inset 0 3px 10px rgba(0, 0, 0, 0.7);
}

.slot {
  position: relative;
  display: block;
  padding: 0;
  border: 0;
  border-radius: 3px;
  background: none;
  cursor: pointer;
  text-decoration: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.slot:hover {
  transform: translateY(-2px);
}

.slot:focus-visible {
  outline: 2px solid #f2b84b;
  outline-offset: 3px;
}

/* The lit selection: amber pilot glow around the strip */
.slot.is-selected {
  box-shadow: 0 0 0 2px #f2b84b, 0 0 18px rgba(242, 184, 75, 0.45);
}

.slot-code {
  position: absolute;
  top: -0.55rem;
  left: -0.45rem;
  z-index: 1;
  min-width: 1.9rem;
  padding: 0.15rem 0.3rem;
  border-radius: 3px;
  background: linear-gradient(180deg, #f2efe6, #cfcabd);
  color: #2a2620;
  font-family: 'Bebas Neue', sans-serif;
  font-size: 0.85rem;
  letter-spacing: 0.08em;
  line-height: 1;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.slot.is-selected .slot-code {
  background: linear-gradient(180deg, #ffe7a8, #f2b84b);
}

/* ── Title strip: A side / artist band / B side ── */
.strip {
  display: grid;
  grid-template-rows: 1fr auto 1fr;
  aspect-ratio: 3 / 1;
  padding: 0.25rem 0.5rem;
  border-radius: 2px;
  background-color: #f6f1e1;
  background-image: url('/textures/grain-paper.webp');
  background-size: 128px;
  color: #23201b;
  text-align: center;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
}

.strip-side {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  font-family: 'Special Elite', 'Courier New', monospace;
  font-size: clamp(0.62rem, 0.45rem + 0.45vw, 0.85rem);
  text-transform: uppercase;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.strip-artist {
  padding: 0.12rem 0;
  border-top: 3px solid var(--band);
  border-bottom: 3px solid var(--band);
  box-shadow: inset 0 2px 0 #f6f1e1, inset 0 -2px 0 #f6f1e1, inset 0 3px 0 var(--band), inset 0 -3px 0 var(--band);
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(0.85rem, 0.6rem + 0.6vw, 1.15rem);
  letter-spacing: 0.12em;
  line-height: 1.1;
  color: var(--band);
  white-space: nowrap;
}

/* ── Now playing ── */
.now-playing {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.now-playing-label {
  --tape-tilt: -1.5deg;
  cursor: default;
}

.now-playing-label:hover {
  transform: rotate(var(--tape-tilt));
}

.playing-dot {
  width: 0.55em;
  height: 0.55em;
  border-radius: 50%;
  background: #f2b84b;
  box-shadow: 0 0 6px rgba(242, 184, 75, 0.9);
}

.now-playing-photo {
  width: 100%;
  max-width: 380px;
}

.record-enter-active,
.record-leave-active {
  transition: opacity 0.25s ease, transform 0.3s cubic-bezier(0.23, 1, 0.32, 1);
}

.record-enter-from {
  opacity: 0;
  transform: translateY(14px) rotate(4deg);
}

.record-leave-to {
  opacity: 0;
  transform: translateY(-10px) rotate(-3deg);
}

@media (max-width: 900px) {
  .jukebox {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }
}

@media (max-width: 640px) {
  .page-container {
    padding: 1rem 0.5rem 3rem;
  }

  .selector {
    padding: 0.75rem 0.7rem 0.9rem;
  }

  .selector-glass {
    gap: 0.7rem;
    padding: 0.7rem;
  }
}
</style>
