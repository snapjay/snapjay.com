<script setup>
import PolaroidPhoto from '../PolaroidPhoto.vue'
import credits from '../../data/credits.json'

defineProps({
  word: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="page-container">
    <!-- Profile Grid -->
    <section class="profile-section">
      <aside class="profile-sidebar">
        <PolaroidPhoto 
          v-for="(image, index) in word.images"
          :key="index"
          :src="image.src"
          :caption="image.caption"
          :href="image.href"
        />
      </aside>

      <main class="profile-main">
        <div class="content-body">
          <p class="lead-text" v-if="word.leadText" v-html="word.leadText">
          </p>
          <p v-if="word.bodyText" v-html="word.bodyText">
          </p>
        </div>
      </main>
    </section>

    <!-- Client Portfolio / Logo Grid -->
    <section class="portfolio-section">
      <h2 class="section-title">Client Portfolio &amp; Partnerships</h2>
      
      <div class="credits-grid">
        <div 
          v-for="credit in credits.sort((a, b) => a.title.localeCompare(b.title))" 
          :key="credit.id" 
          class="credit-card"
        >
          <!-- White Logo Wrapper to ensure all logos pop and are readable -->
          <div class="logo-wrapper">
            <a :href="credit.href" target="_blank" rel="noopener noreferrer" class="logo-link">
              <img :src="`/credits/${credit.img.url}`" :alt="credit.title" class="logo-img" />
            </a>
          </div>
          
          <div class="credit-info">
            <h3 class="credit-title">{{ credit.title }}</h3>
            <p class="credit-desc">{{ credit.desc }}</p>
            <a :href="credit.href" target="_blank" rel="noopener noreferrer" class="credit-link">
              <span>Visit Website</span>
              <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem 5rem 2rem;
}

.profile-section {
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 3rem;
  padding: 2rem 0 4rem 0;
  border-bottom: 1px solid var(--border-subtle);
}

.profile-sidebar {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.profile-main {
  display: flex;
  flex-direction: column;
  gap: 2rem;
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
  transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
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

/* Portfolio grid section */
.portfolio-section {
  padding-top: 4rem;
}

.section-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 2.8rem;
  color: #fff;
  letter-spacing: 0.05em;
  margin-bottom: 2.5rem;
  position: relative;
  display: inline-block;
  line-height: 1.1;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 0;
  width: 60px;
  height: 3px;
  background: var(--category-color, var(--accent));
  border-radius: 2px;
}

.credits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2.5rem;
}

.credit-card {
  background: var(--glass);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  box-shadow: var(--shadow-lg);
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  overflow: hidden;
}

.credit-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at top right, rgba(var(--accent-rgb), 0.08), transparent 50%);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.credit-card:hover {
  transform: translateY(-5px);
  border-color: rgba(var(--accent-rgb), 0.3);
  box-shadow: var(--shadow-lg), 0 0 25px rgba(var(--accent-rgb), 0.15);
}

.credit-card:hover::before {
  opacity: 1;
}

.logo-wrapper {
  background: #ffffff;
  padding: 1.25rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 90px;
  width: 100%;
  box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease;
}

.credit-card:hover .logo-wrapper {
  transform: scale(1.02);
}

.logo-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.logo-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.05));
  transition: transform 0.3s ease;
}

.credit-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex: 1;
}

.credit-title {
  font-family: 'Outfit', sans-serif;
  font-size: 1.3rem;
  font-weight: 700;
  color: #fff;
  margin: 0;
}

.credit-desc {
  font-family: 'Outfit', sans-serif;
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--text-secondary);
  margin: 0;
  flex: 1;
}

.credit-link {
  font-family: 'Outfit', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--category-color, var(--accent));
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 0.5rem;
  transition: color 0.2s ease;
}

.credit-link:hover {
  color: #fff;
}

.arrow-icon {
  width: 14px;
  height: 14px;
  transition: transform 0.2s ease;
}

.credit-link:hover .arrow-icon {
  transform: translateX(4px);
}

/* Responsive States */
@media (max-width: 1024px) {
  .profile-section {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .profile-sidebar {
    border-bottom: 1px solid var(--border-subtle);
    padding-bottom: 2rem;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 1.5rem;
  }

  .profile-sidebar > * {
    flex: 1 1 45%;
    min-width: 200px;
  }
}

@media (max-width: 640px) {
  .page-container {
    padding: 0 1rem 3rem 1rem;
  }
  
  .profile-sidebar {
    flex-direction: column;
  }

  .profile-sidebar > * {
    flex: 1 1 100%;
    min-width: auto;
  }
  
  .credits-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}
</style>
