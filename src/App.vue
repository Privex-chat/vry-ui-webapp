<template>
  <div id="app" :data-theme="currentTheme">
    <!-- Theme Selector (Global) - Hidden on MatchLoadouts page -->
    <div v-if="!isMatchLoadoutsPage" :class="['theme-slide', { open: isThemeOpen }]">
      <button class="theme-toggle" @click="isThemeOpen = !isThemeOpen">
        <span v-if="!isThemeOpen">&lt;</span>
        <span v-else>&gt;</span>
      </button>

      <div class="theme-selector" v-if="isThemeOpen">
        <div class="theme-buttons">
          <button 
            v-for="theme in themes" 
            :key="theme" 
            class="theme-btn"
            :class="{ active: currentTheme === theme }"
            @click="setTheme(theme)"
          >
            {{ theme }}
          </button>
        </div>
      </div>
    </div>

    <!-- Navigation Header -->
    <header role="banner" class="navbar">
      <div class="nav-container">
        <div class="logo-section">
          <!-- Logo -->
          <router-link to="/" class="logo">
            <img src="assets/Logo.png" alt="VRY" style="width: 100%; height: 100%; object-fit: cover;">
          </router-link>

          <!-- Navigation Links -->
          <nav class="nav-links">
            <router-link to="/" class="nav-link">Home</router-link>
            <a href="/#features" class="nav-link">Features</a>
            <a href="https://discord.gg/HeTKed64Ka" target="_blank" class="nav-link">Support</a>
            <a href="/#founders" class="nav-link">Founders</a>
            <router-link to="/matchLoadouts" class="nav-link">Match Loadouts</router-link>
          </nav>
        </div>
      </div>
    </header>

    <!-- Page contents render here -->
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      isThemeOpen: false,
      themes: ['Dark', 'Light', 'Midnight', 'Valorant'],
      currentTheme: 'Dark'
    }
  },
  computed: {
    isMatchLoadoutsPage() {
      return this.$route.path === '/matchLoadouts' || this.$route.name === 'MatchLoadouts';
    }
  },
  methods: {
    setTheme(theme) {
      this.currentTheme = theme
      localStorage.setItem('selectedTheme', theme)
      document.documentElement.setAttribute('data-theme', theme)
      
      // Emit theme change event for child components
      this.$root.$emit('theme-changed', theme)
    },
    
    loadTheme() {
      const savedTheme = localStorage.getItem('selectedTheme')
      if (savedTheme && this.themes.includes(savedTheme)) {
        this.currentTheme = savedTheme
        document.documentElement.setAttribute('data-theme', savedTheme)
      }
    }
  },
  mounted() {
    this.loadTheme()
    
    // Close theme panel when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.theme-slide')) {
        this.isThemeOpen = false
      }
    })
  },
  watch: {
    $route(to, from) {
      console.log("Navigated from", from.fullPath, "to", to.fullPath)
      this.isThemeOpen = false
    }
  }

}
</script>

<style>
/* Import the global theme styles */
@import '~@/assets/theme.css';
@import '~@/assets/matchloadouts.css';

#app {
  min-height: 100vh;
  background: var(--gradient-1);
  color: var(--text-primary);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  transition: all 0.3s ease;
}

/* Theme Selector */
.theme-slide {
  position: fixed;
  top: 80px;
  right: 0;
  z-index: 1000;
  transition: transform 0.5s ease;
  transform: translateX(calc(100% + 2px)); /* Reduced from 100px to 40px */
}

.theme-slide.open {
  transform: translateX(0);
}

.theme-toggle {
  position: absolute;
  left: -37px; /* Move toggle button outside the panel */
  top: 0;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 8px 0 0 8px;
  border-right: none; /* Remove right border for seamless look */
  padding: 8px 14px;
  cursor: pointer;
  color: var(--text-primary);
  font-weight: bold;
  box-shadow: -2px 2px 8px rgba(0,0,0,0.3); /* Adjust shadow direction */
}

.theme-selector {
  background: var(--bg-card);
  padding: 12px;
  border-left: 1px solid var(--border-color);
  border-radius: 0 0 0 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  width: 315px; /* Fixed width for consistent behavior */
}

.theme-buttons {
  display: flex;
  gap: 5px;
}

.theme-btn {
  background: var(--bg-secondary);
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s;
  font-family: inherit;
}

.theme-btn:hover {
  background: var(--selection-bg);
  color: var(--text-primary);
  transform: translateY(-2px);
}

.theme-btn.active {
  background: var(--accent-purple);
  color: white;
  border-color: var(--accent-purple);
}

/* Navigation */
.navbar {
  background: var(--header-bg);
  padding: 1rem 2rem;
  border-bottom: 2px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
  background: rgba(30, 30, 30, 0.9);
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.logo {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: transform 0.4s;
}

.logo:hover {
  transform: scale(1.1) rotate(5deg);
}

.nav-links {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.nav-link {
  color: var(--text-primary);
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s;
  position: relative;
}

.nav-link:hover {
  background: var(--selection-bg);
  transform: translateY(-2px);
}

.nav-link.router-link-exact-active {
  color: var(--accent-purple);
}

.nav-link.router-link-exact-active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 10%;
  right: 10%;
  height: 2px;
  background: var(--accent-purple);
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .navbar {
    padding: 1rem;
  }
  
  .nav-links {
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .nav-link {
    padding: 0.4rem 0.8rem;
    font-size: 0.9rem;
  }
  
  .theme-slide {
    top: 100px;
  }
}

/* Global Gradient Background */
body {
  margin: 0;
  padding: 0;
  background: var(--gradient-1);
}

/* Ensure theme variables are available globally */
* {
  box-sizing: border-box;
}
</style>