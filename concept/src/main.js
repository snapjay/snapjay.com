import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueDragscroll from 'vue-dragscroll'
import dragscroll from './plugins/dragscroll'

import App from './App.vue'
// import router from './router'

const app = createApp(App)

app.use(VueDragscroll)
app.use(createPinia())
app.use(dragscroll)
// app.use(router)

app.mount('#app')
