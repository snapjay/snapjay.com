<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import PolaroidPhoto from '../PolaroidPhoto.vue'
import credits from '../../data/credits.json'

defineProps({
  word: {
    type: Object,
    required: true
  }
})

const clients = computed(() => [...credits].sort((a, b) => a.title.localeCompare(b.title)))

const now = new Date()
const pad = n => String(n).padStart(2, '0')
const runDate = `${pad(now.getMonth() + 1)}/${pad(now.getDate())}/${String(now.getFullYear()).slice(2)}`

// Lines "print" one by one the first time the sheet scrolls into view
const sheetRef = ref(null)
const printing = ref(false)
let observer = null

onMounted(() => {
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    printing.value = true
    return
  }
  observer = new IntersectionObserver(entries => {
    if (entries.some(e => e.isIntersecting)) {
      printing.value = true
      observer.disconnect()
    }
  }, { threshold: 0.15 })
  if (sheetRef.value) observer.observe(sheetRef.value)
})

onUnmounted(() => observer?.disconnect())
</script>

<template>
  <div class="page-container">
    <section class="profile-section">
      <aside class="profile-sidebar">
        <PolaroidPhoto v-for="(image, index) in word.images" :key="index" :src="image.src" :caption="image.caption"
          :href="image.href" :rotation="-2.4" tape="top" />
      </aside>

      <div class="content-body">
        <p class="lead-text" v-if="word.leadText" v-html="word.leadText"></p>
        <p v-if="word.bodyText" v-html="word.bodyText"></p>
      </div>
    </section>

    <section class="printout" aria-label="Client history">
      <div ref="sheetRef" class="sheet" :class="{ 'is-printing': printing }">
        <header class="pr-head">
          <div class="pr-row pr-meta">
            <span>SNAPJAY SYSTEMS</span><span class="pr-center">CLIENT HISTORY REPORT</span><span>PAGE 001</span>
          </div>
          <div class="pr-row pr-meta">
            <span>RUN {{ runDate }}</span><span class="pr-center">25+ YRS IN SERVICE</span><span>OPERATOR: DAN</span>
          </div>
          <div class="pr-rule" aria-hidden="true">{{ '='.repeat(160) }}</div>
          <div class="pr-row pr-cols" aria-hidden="true">
            <span>CLIENT</span><span>WORK PERFORMED</span>
          </div>
          <div class="pr-rule" aria-hidden="true">{{ '-'.repeat(160) }}</div>
        </header>

        <ol class="pr-lines">
          <li v-for="(c, i) in clients" :key="c.id" class="pr-line" :style="{ '--i': i }">
            <span class="pr-client">
              <img class="pr-logo" :src="`/credits/${c.img.url}`" alt="" decoding="async" loading="lazy" />
              <span class="pr-name">{{ c.title }}</span>
            </span>
            <span class="pr-desc">{{ c.desc }}</span>
            <a class="pr-link" :href="c.href" target="_blank" rel="noopener noreferrer"
              :aria-label="`Visit ${c.title} (opens in a new tab)`">VISIT&nbsp;&gt;</a>
          </li>
        </ol>

        <footer class="pr-foot" :style="{ '--i': clients.length }">
          <div class="pr-rule" aria-hidden="true">{{ '-'.repeat(160) }}</div>
          <div class="pr-row pr-meta">
            <span>TOTAL CLIENTS: {{ String(clients.length).padStart(3, '0') }}</span>
            <span class="pr-center">*** END OF REPORT ***</span>
            <span></span>
          </div>
        </footer>
      </div>
    </section>
  </div>
</template>

<style scoped>
.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem 4rem;
}

/* ── Profile ── */
.profile-section {
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: 3.5rem;
  align-items: start;
  padding: 2rem 0 4rem;
}

.content-body {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 62ch;
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

/* ── Fanfold printout ── */
.printout {
  --line: 1.5rem;          /* every line sits on this grid, so the green bars line up */
  --margin: 2.75rem;       /* tractor-feed strip */
  --ink: #26262a;
  --paper-white: #f7f6ee;
  --paper-green: #dcebd6;
  --hole: #14120f;
  position: relative;
  max-width: 960px;
  margin: 0 auto;
  padding-bottom: 1.5rem;
}

/* The folded stack the sheet is feeding out of */
.printout::before,
.printout::after {
  content: '';
  position: absolute;
  left: 1.5%;
  right: 1.5%;
  bottom: 0.9rem;
  height: 2.5rem;
  background: #e7e5da;
  border-radius: 0 0 2px 2px;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.45);
  transform: rotate(0.5deg);
  z-index: 0;
}

.printout::after {
  left: 3%;
  right: 3%;
  bottom: 0.2rem;
  background: #d9d6c9;
  transform: rotate(-0.6deg);
}

.sheet {
  position: relative;
  z-index: 1;
  padding: var(--line) calc(var(--margin) + 1.75rem);
  color: var(--ink);
  font-family: 'Courier Prime', 'Courier New', monospace;
  font-size: 0.92rem;
  line-height: var(--line);
  background-color: var(--paper-white);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.5);
  transform: rotate(-0.35deg);
}

/* Tractor-feed strips: holes punched every half inch, with a perforation line */
.sheet::before,
.sheet::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  width: var(--margin);
  background:
    radial-gradient(circle at 50% 50%, var(--hole) 0 0.3rem, rgba(0, 0, 0, 0.25) 0.32rem, transparent 0.38rem) 0 0 / 100% var(--line) repeat-y,
    var(--paper-white);
}

.sheet::before {
  left: 0;
  border-right: 1px dashed rgba(0, 0, 0, 0.22);
}

.sheet::after {
  right: 0;
  border-left: 1px dashed rgba(0, 0, 0, 0.22);
}

/* Impact-printer ink: a hair of bleed */
.pr-head,
.pr-lines,
.pr-foot {
  text-shadow: 0 0 0.6px rgba(0, 0, 0, 0.55);
}

.pr-row {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 1rem;
  white-space: nowrap;
}

.pr-row > :last-child {
  text-align: right;
}

.pr-center {
  text-align: center;
}

.pr-cols {
  grid-template-columns: 15rem 1fr;
  font-weight: 700;
}

.pr-cols > :last-child {
  text-align: left;
}

.pr-rule {
  overflow: hidden;
  white-space: nowrap;
  letter-spacing: -0.02em;
  opacity: 0.75;
}

.pr-lines {
  list-style: none;
}

/* Each record gets its own band, green-bar style, running to the perforations */
.pr-line {
  display: grid;
  grid-template-columns: 15rem 1fr auto;
  gap: 0 1.25rem;
  align-items: start;
  margin: 0 -1.75rem;
  padding: 0.55rem 1.75rem;
}

.pr-line:nth-child(odd) {
  background: var(--paper-green);
}

.pr-client {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  min-height: var(--line);
}

.pr-logo {
  flex: none;
  width: 4.2rem;
  height: calc(var(--line) - 0.1rem);
  object-fit: contain;
  object-position: left center;
  /* Printed, not pasted: grayscale ink that sinks into the paper */
  filter: grayscale(1) contrast(1.3);
  mix-blend-mode: multiply;
  opacity: 0.85;
}

.pr-name {
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.pr-desc {
  max-width: 60ch;
}

.pr-link {
  color: var(--ink);
  font-weight: 700;
  text-decoration: none;
  padding: 0 0.2rem;
  white-space: nowrap;
}

.pr-link:hover,
.pr-link:focus-visible {
  color: var(--ink);
  background: #f3dd6b; /* highlighter */
  outline: none;
}

/* ── Print-in animation: each line sweeps in like a print head ── */
.pr-line,
.pr-foot {
  clip-path: inset(0 100% 0 0);
}

.is-printing .pr-line,
.is-printing .pr-foot {
  animation: print-line 0.45s steps(18, end) forwards;
  animation-delay: calc(var(--i) * 130ms + 250ms);
}

@keyframes print-line {
  to {
    clip-path: inset(0 0 0 0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .pr-line,
  .pr-foot {
    clip-path: none;
    animation: none !important;
  }
}

/* ── Smaller screens ── */
@media (max-width: 1024px) {
  .profile-section {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .profile-sidebar {
    max-width: 340px;
  }
}

@media (max-width: 720px) {
  .printout {
    --margin: 1.6rem;
  }

  .sheet {
    padding-left: calc(var(--margin) + 0.9rem);
    padding-right: calc(var(--margin) + 0.9rem);
    font-size: 0.85rem;
  }

  .pr-center,
  .pr-cols {
    display: none;
  }

  .pr-row {
    grid-template-columns: 1fr 1fr;
  }

  .pr-line {
    grid-template-columns: 1fr auto;
    margin: 0 -0.9rem;
    padding: 0.7rem 0.9rem;
  }

  .pr-desc {
    grid-column: 1 / -1;
  }

  .pr-link {
    grid-row: 1;
    grid-column: 2;
  }
}

@media (max-width: 640px) {
  .page-container {
    padding: 0 0.5rem 3rem;
  }
}
</style>
