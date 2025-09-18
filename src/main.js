// main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { buddyService } from './services/buddyService'

// Import global CSS
import './assets/style.css'
import './assets/theme.css'
import './assets/matchloadouts.css'

// Preload buddy data on app start
buddyService.preloadBuddies().catch(error => {
  console.error('Failed to preload buddy data:', error);
});

createApp(App).use(router).mount('#app')