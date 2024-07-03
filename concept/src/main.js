import './assets/main.css'

import { createApp } from 'vue'
import dragscroll from './plugins/dragscroll'

import App from './App.vue'
const app = createApp(App)

app.use(dragscroll)

app.mount('#app')
