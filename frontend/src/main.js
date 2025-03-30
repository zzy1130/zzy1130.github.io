import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
const router = createRouter({
    history: createWebHistory('/frontend/'), // 关键配置
    routes
  })
  