import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import words from './words.json'

const routes = [
  {
    path: '/:id?',
    name: 'home',
    component: App
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const DEFAULT_TITLE = 'snapjay | Engineer + Entrepreneur | Knoxville, TN'

router.afterEach((to) => {
  const id = to.params.id
  let title = DEFAULT_TITLE

  if (id) {
    const word = words.find(w => w.id === id)
    if (word) {
      title = `snapjay | ${word.label}`
    }
  }

  // Update document title
  document.title = title

  // Track page view in Google Analytics
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'page_view', {
      page_location: window.location.href,
      page_path: to.fullPath,
      page_title: title
    })
  }
})

export default router
