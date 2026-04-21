<template>
  <div id="app" :data-theme="currentTheme">
    <!-- Navigation Header -->
    <header class="navbar" :class="{ scrolled: isScrolled }">
      <div class="nav-container">
        <!-- Logo -->
        <router-link to="/" class="logo" @click="closeMobileMenu">
          <img src="assets/Logo.png" alt="VRY" class="logo-img">
          <span class="logo-text">VRY</span>
        </router-link>

        <!-- Desktop Navigation Links -->
        <nav class="nav-links" :class="{ 'mobile-open': mobileMenuOpen }">
          <router-link to="/" class="nav-link" @click="closeMobileMenu">Home</router-link>
          <a href="/#features" class="nav-link" @click="closeMobileMenu">Features</a>
          <a href="https://discord.gg/HeTKed64Ka" target="_blank" class="nav-link" @click="closeMobileMenu">Support</a>
          <a href="/#founders" class="nav-link" @click="closeMobileMenu">Founders</a>
          <router-link to="/matchLoadouts" class="nav-link match-link" @click="closeMobileMenu">
            <span class="live-dot"></span>
            Match Loadouts
          </router-link>

          <!-- Mobile-only theme options -->
          <div class="mobile-theme-section">
            <span class="mobile-theme-label">Theme</span>
            <div class="mobile-theme-grid">
              <button
                v-for="theme in themes"
                :key="theme.name"
                :class="['mobile-theme-btn', { active: currentTheme === theme.name }]"
                @click="setTheme(theme.name); closeMobileMenu()"
              >
                <span class="swatch" :style="{ background: theme.swatch }"></span>
                {{ theme.name }}
              </button>
            </div>
          </div>
        </nav>

        <!-- Right side controls -->
        <div class="nav-right">
          <!-- Theme Picker Dropdown -->
          <div class="theme-picker" ref="themePicker">
            <button
              class="theme-toggle-btn"
              @click="isThemeOpen = !isThemeOpen"
              :title="`Theme: ${currentTheme}`"
              :aria-expanded="isThemeOpen"
              aria-label="Change theme"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="5"/>
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
              </svg>
              <span class="theme-label-text">{{ currentTheme }}</span>
              <svg class="chevron" :class="{ open: isThemeOpen }" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>

            <transition name="dropdown">
              <div v-if="isThemeOpen" class="theme-dropdown">
                <div class="dropdown-header">Choose Theme</div>
                <button
                  v-for="theme in themes"
                  :key="theme.name"
                  :class="['theme-item', { active: currentTheme === theme.name }]"
                  @click="setTheme(theme.name)"
                >
                  <span class="swatch" :style="{ background: theme.swatch }"></span>
                  <span class="theme-item-name">{{ theme.name }}</span>
                  <svg v-if="currentTheme === theme.name" class="check-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </button>
              </div>
            </transition>
          </div>

          <!-- Mobile Hamburger -->
          <button
            class="hamburger"
            :class="{ open: mobileMenuOpen }"
            @click="mobileMenuOpen = !mobileMenuOpen"
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      <!-- Mobile menu overlay -->
      <div v-if="mobileMenuOpen" class="mobile-overlay" @click="closeMobileMenu"></div>
    </header>

    <!-- Page contents render here -->
    <router-view v-slot="{ Component }">
      <transition name="page" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      isThemeOpen: false,
      mobileMenuOpen: false,
      isScrolled: false,
      themes: [
        { name: 'Dark',     swatch: 'linear-gradient(135deg, #1a1a1a, #bd3944)' },
        { name: 'Light',    swatch: 'linear-gradient(135deg, #f5f5f5, #e81123)' },
        { name: 'Midnight', swatch: 'linear-gradient(135deg, #0d1117, #58a6ff)' },
        { name: 'Valorant', swatch: 'linear-gradient(135deg, #0f1923, #ff4655)' },
      ],
      currentTheme: 'Dark'
    }
  },
  computed: {
    isMatchLoadoutsPage() {
      return this.$route && (this.$route.path === '/matchLoadouts' || this.$route.name === 'MatchLoadouts')
    }
  },
  methods: {
    setTheme(theme) {
      this.currentTheme = theme
      this.isThemeOpen = false
      localStorage.setItem('selectedTheme', theme)
      document.documentElement.setAttribute('data-theme', theme)
    },
    loadTheme() {
      const savedTheme = localStorage.getItem('selectedTheme')
      if (savedTheme && this.themes.find(t => t.name === savedTheme)) {
        this.currentTheme = savedTheme
        document.documentElement.setAttribute('data-theme', savedTheme)
      }
    },
    closeMobileMenu() {
      this.mobileMenuOpen = false
    },
    handleScroll() {
      this.isScrolled = window.scrollY > 20
    },
    handleClickOutside(e) {
      if (this.$refs.themePicker && !this.$refs.themePicker.contains(e.target)) {
        this.isThemeOpen = false
      }
    }
  },
  mounted() {
    this.loadTheme()
    window.addEventListener('scroll', this.handleScroll)
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
    document.removeEventListener('click', this.handleClickOutside)
  },
  watch: {
    $route() {
      this.closeMobileMenu()
      this.isThemeOpen = false
    },
    mobileMenuOpen(val) {
      document.body.style.overflow = val ? 'hidden' : ''
    }
  }
}
</script>

<style>
@import '~@/assets/theme.css';
@import '~@/assets/matchloadouts.css';

/* ========== GLOBAL ========== */
#app {
  min-height: 100vh;
  background: var(--gradient-1);
  color: var(--text-primary);
  font-family: 'DM Sans', 'Inter', -apple-system, sans-serif;
  transition: background 0.3s ease, color 0.3s ease;
}

/* ========== NAVBAR ========== */
.navbar {
  position: sticky;
  top: 0;
  z-index: 500;
  padding: 0 2rem;
  height: 64px;
  display: flex;
  align-items: center;
  background: rgba(var(--header-bg-rgb), 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border-color);
  transition: box-shadow 0.3s ease, border-color 0.3s ease;
}

.navbar.scrolled {
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.25);
  border-bottom-color: var(--accent-purple);
}

.nav-container {
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 2rem;
}

/* LOGO */
.logo {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  text-decoration: none;
  flex-shrink: 0;
  transition: transform 0.25s ease;
}
.logo:hover { transform: scale(1.04); }

.logo-img {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  object-fit: cover;
  border: 1.5px solid var(--border-color);
  display: block;
}

.logo-text {
  font-family: 'Rajdhani', 'DM Sans', sans-serif;
  font-weight: 700;
  font-size: 1.3rem;
  letter-spacing: 2px;
  color: var(--text-primary);
  text-transform: uppercase;
}

/* NAV LINKS */
.nav-links {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex: 1;
}

.nav-link {
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
  padding: 0.45rem 0.85rem;
  border-radius: 8px;
  transition: color 0.2s, background 0.2s, transform 0.2s;
  position: relative;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.nav-link:hover {
  color: var(--text-primary);
  background: var(--selection-bg);
}

.nav-link.router-link-exact-active {
  color: var(--accent-purple);
  background: rgba(var(--accent-purple-rgb), 0.12);
}

.match-link {
  border: 1px solid transparent;
  transition: all 0.25s;
}
.match-link:hover {
  border-color: var(--accent-purple);
}
.match-link.router-link-active {
  border-color: var(--accent-purple);
}

.live-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--success-color);
  box-shadow: 0 0 8px var(--success-color);
  animation: livePulse 2s infinite;
  flex-shrink: 0;
}

@keyframes livePulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.6; transform: scale(0.8); }
}

/* MOBILE THEME SECTION (hidden on desktop) */
.mobile-theme-section { display: none; }

/* NAV RIGHT */
.nav-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-left: auto;
  flex-shrink: 0;
}

/* ========== THEME PICKER ========== */
.theme-picker { position: relative; }

.theme-toggle-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 0.85rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  color: var(--text-secondary);
  font-family: inherit;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.theme-toggle-btn:hover {
  border-color: var(--accent-purple);
  color: var(--text-primary);
  background: var(--selection-bg);
}

.theme-label-text {
  min-width: 52px;
}

.chevron {
  transition: transform 0.25s ease;
  opacity: 0.6;
}
.chevron.open { transform: rotate(180deg); }

/* DROPDOWN */
.theme-dropdown {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 14px;
  padding: 0.5rem;
  min-width: 180px;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.4);
  z-index: 1000;
  overflow: hidden;
}

.dropdown-header {
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-secondary);
  padding: 0.4rem 0.75rem 0.6rem;
  opacity: 0.7;
}

.theme-item {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  width: 100%;
  padding: 0.55rem 0.75rem;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--text-secondary);
  font-family: inherit;
  font-size: 0.88rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  text-align: left;
}

.theme-item:hover {
  background: var(--selection-bg);
  color: var(--text-primary);
}

.theme-item.active {
  background: rgba(var(--accent-purple-rgb), 0.15);
  color: var(--text-primary);
}

.swatch {
  width: 20px;
  height: 20px;
  border-radius: 6px;
  border: 1.5px solid rgba(255,255,255,0.15);
  flex-shrink: 0;
}

.theme-item-name { flex: 1; }

.check-icon {
  color: var(--accent-purple);
  flex-shrink: 0;
}

/* DROPDOWN TRANSITION */
.dropdown-enter-active {
  animation: dropIn 0.18s ease;
}
.dropdown-leave-active {
  animation: dropIn 0.15s ease reverse;
}
@keyframes dropIn {
  from { opacity: 0; transform: translateY(-8px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

/* ========== HAMBURGER ========== */
.hamburger {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 36px;
  height: 36px;
  padding: 6px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-card);
  cursor: pointer;
  transition: all 0.2s;
}

.hamburger span {
  display: block;
  width: 100%;
  height: 2px;
  background: var(--text-secondary);
  border-radius: 2px;
  transition: all 0.3s ease;
  transform-origin: center;
}

.hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
.hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

.hamburger:hover { border-color: var(--accent-purple); }

/* ========== PAGE TRANSITION ========== */
.page-enter-active, .page-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.page-enter-from { opacity: 0; transform: translateY(8px); }
.page-leave-to   { opacity: 0; transform: translateY(-8px); }

/* MOBILE OVERLAY */
.mobile-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  z-index: 399;
  backdrop-filter: blur(4px);
}

/* ========== RESPONSIVE ========== */
@media (max-width: 900px) {
  .theme-label-text { display: none; }
  .theme-toggle-btn { padding: 0.45rem 0.6rem; }
}

@media (max-width: 768px) {
  .navbar { padding: 0 1rem; }

  .hamburger { display: flex; }
  .mobile-overlay { display: block; }

  .nav-links {
    position: fixed;
    top: 64px;
    right: 0;
    bottom: 0;
    width: 280px;
    flex-direction: column;
    align-items: stretch;
    gap: 0.25rem;
    padding: 1.5rem 1rem;
    background: var(--bg-card);
    border-left: 1px solid var(--border-color);
    transform: translateX(100%);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 400;
    overflow-y: auto;
  }

  .nav-links.mobile-open {
    transform: translateX(0);
    box-shadow: -20px 0 60px rgba(0,0,0,0.4);
  }

  .nav-link {
    padding: 0.75rem 1rem;
    font-size: 1rem;
    border-radius: 10px;
  }

  .mobile-theme-section {
    display: block;
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--border-color);
  }

  .mobile-theme-label {
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-secondary);
    opacity: 0.7;
    display: block;
    margin-bottom: 0.75rem;
    padding: 0 0.25rem;
  }

  .mobile-theme-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
  }

  .mobile-theme-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.6rem 0.75rem;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    background: var(--bg-secondary);
    color: var(--text-secondary);
    font-family: inherit;
    font-size: 0.83rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;
  }

  .mobile-theme-btn.active {
    border-color: var(--accent-purple);
    background: rgba(var(--accent-purple-rgb), 0.15);
    color: var(--text-primary);
  }

  .mobile-theme-btn .swatch {
    width: 16px;
    height: 16px;
  }

  /* Hide desktop theme picker on mobile */
  .theme-picker { display: none; }
}

/* ========== GLOBAL UTILS ========== */
* { box-sizing: border-box; }

body {
  margin: 0;
  padding: 0;
  background: var(--gradient-1);
}
</style>
