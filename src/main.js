import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// ✅ Import your global CSS here
import './assets/style.css'

createApp(App).use(router).mount('#app')
