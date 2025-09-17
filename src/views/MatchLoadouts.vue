<template>
  <div class="match-loadouts" :data-theme="currentTheme">

    <!-- Theme Selector Slide -->
    <div :class="['theme-slide', { open: isThemeOpen }]">
      <button class="theme-toggle" @click="isThemeOpen = !isThemeOpen">
        <span v-if="!isThemeOpen">&lt; Theme</span>
        <span v-else>&gt; </span>
      </button>

      <div class="theme-selector" v-if="isThemeOpen">
        <div class="theme-label">.</div>
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

    <!-- Toast Container -->
    <div class="toast-container">
      <transition-group name="toast">
        <div v-for="toast in toasts" :key="toast.id" :class="['toast', toast.type]">
          <div class="toast-icon">{{ toast.type === 'legendary' ? '' : '✓' }}</div>
          <div class="toast-content">
            <div class="toast-title">{{ toast.title }}</div>
            <div class="toast-message">{{ toast.message }}</div>
          </div>
        </div>
      </transition-group>
    </div>

    <!-- Filters Section -->
    <div class="filters-container">
      <div class="filters-header">
        <div class="filters-title">
          Skin Sniping Filters
        </div>
        <button 
          :class="['filter-toggle', { active: skinSnipingEnabled }]"
          @click="toggleSkinSniping">
          {{ skinSnipingEnabled ? 'Disable' : 'Enable' }} Skin Sniping
        </button>
        <button 
          @click="toggleSkinAlerts" 
          class="skin-alerts-btn" 
          :class="{ 'on': skinAlertsEnabled, 'off': !skinAlertsEnabled }"
        >
          {{ skinAlertsEnabled ? 'Skin Alerts: ON' : 'Skin Alerts: OFF' }}
        </button>

      </div>
      <div class="filters-content">
        <div class="filter-group">
          <label class="filter-label">Skins to Snipe</label>
          <input 
            v-model="skinSearchInput"
            type="text" 
            class="filter-input" 
            placeholder="e.g., Kuronami, Prime Vandal, Reaver Sheriff">
        </div>
        <div class="filter-group">
          <label class="filter-label">Minimum Tier Threshold</label>
          <div class="tier-selector">
            <button 
              v-for="tier in tiers" 
              :key="tier.name"
              :class="['tier-btn', tier.class, { active: selectedTier === tier.name }]"
              @click="selectedTier = tier.name">
              {{ tier.label }}
            </button>
          </div>
        </div>
        <div class="filter-group">
          <label class="filter-label">Special Items</label>
          <div class="special-items">
            <label class="checkbox-label">
              <input v-model="rgbBuddyAlert" type="checkbox">
              <span>RGB Alert (Riot buddy)</span>
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-container">
      <div class="match-info">
        <div class="match-map">{{ currentMap || '' }}</div>
        <div class="match-time">Last updated: {{ lastUpdateString }}</div>
      </div>

      <div v-if="!showTime" class="no-match">
        <span class="error-text">Couldn't fetch match or no match found in cache!</span>
        <button @click="downloadVRY" class="btn vry-button">
          <span class="btn-inner">Download vRY {{ version }}</span>
        </button>
      </div>

      <!-- Deathmatch/No Teams Mode -->
      <div v-else-if="isNonTeamMode && Players && Object.keys(Players).length > 0" class="all-players-container">
        <div class="all-players-section">
          <div class="all-players-header">
            <div class="all-players-label">Player List</div>
          </div>
          <div class="all-players-grid">
            <player-card 
              v-for="player in allPlayers" 
              :key="player.puuid"
              :player="player"
              :team="'neutral'"
              @click="openModal(player)">
            </player-card>
          </div>
        </div>
      </div>

      <!-- Team-based Mode -->
      <div v-else-if="!isNonTeamMode && Players && Object.keys(Players).length > 0" class="teams-container">
        <!-- Ally Team -->
        <div class="team-section ally-team">
          <div class="team-header">
            <div class="team-label">Your Team</div>
          </div>
          <div class="players-grid">
            <player-card 
              v-for="player in allyPlayers" 
              :key="player.puuid"
              :player="player"
              :team="'ally'"
              @click="openModal(player)">
            </player-card>
          </div>
        </div>

        <!-- Enemy Team -->
        <div class="team-section enemy-team">
          <div class="team-header">
            <div class="team-label">Enemy Team</div>
          </div>
          <div class="players-grid">
            <player-card 
              v-for="player in enemyPlayers" 
              :key="player.puuid"
              :player="player"
              :team="'enemy'"
              @click="openModal(player)">
            </player-card>
          </div>
        </div>
      </div>

      <div v-else class="loading-container">
        <div class="loading-spinner"></div>
        <p>Waiting for match data...</p>
      </div>
    </div>

    <!-- Player Modal -->
    <player-modal 
      v-if="showModal" 
      :player="modalPlayer" 
      @close="closeModal">
    </player-modal>
  </div>
</template>

<script>
import PlayerCard from '@/components/PlayerCard.vue'
import PlayerModal from '@/components/PlayerModal.vue'

const TIER_MAP = {
  '0cebb8be-46d7-c12a-d306-e9907bfc5a25': 'select',
  'e046854e-406c-37f4-6607-19a9ba8426fc': 'deluxe',
  '60bca009-4182-7998-dee7-b8a2558dc369': 'premium',
  '12683d76-48d7-84a3-4e09-6985794f0445': 'exclusive',
  '411e4a55-4e59-7757-41f0-86a53f101bb5': 'ultra'
}

const SPECIAL_SKINS = ['Kuronami', 'Prime', 'Reaver', 'Spectrum', 'Champions', 'Elderflame', 'Glitchpop', 'Radiant Crisis']
const RGB_BUDDY_IDS = ['ad508aeb-44b7-46bf-f923-959267483e78'] // Fist Bump Buddy UUID

// Non-team game modes
const NON_TEAM_MODES = ['Deathmatch', 'Escalation', 'Spike Rush']

export default {
  name: 'MatchLoadouts',
  components: { PlayerCard, PlayerModal },
  data() {
    return {
      loadoutJSON: null,
      Players: {},
      showModal: false,
      modalPlayer: null,
      lastUpdate: null,
      lastUpdateString: '',
      showTime: false,
      version: '0.00',
      vryhref: '',
      currentMap: '',
      currentMode: '',
      
      // Theme system
      isThemeOpen: false,
      themes: ['Dark', 'Light', 'Midnight', 'Valorant'],
      currentTheme: 'Light',
      
      // Skin sniping features
      skinSnipingEnabled: false,
      skinSearchInput: '',
      selectedTier: null,
      rgbBuddyAlert: true,
      toasts: [],
      toastIdCounter: 0,
      skinAlertsEnabled: false,

      // Tier configuration
      tiers: [
        { name: 'select', label: 'Select', class: 'select' },
        { name: 'deluxe', label: 'Deluxe', class: 'deluxe' },
        { name: 'premium', label: 'Premium', class: 'premium' },
        { name: 'exclusive', label: 'Exclusive', class: 'exclusive' },
        { name: 'ultra', label: 'Ultra', class: 'ultra' }
      ],
      
      websocket: null,
      processedSkins: new Set() // Track already notified skins
    }
  },
  
  computed: {
    isNonTeamMode() {
      // Check if it's deathmatch or other non-team modes
      if (this.currentMode && NON_TEAM_MODES.some(mode => this.currentMode.toLowerCase().includes(mode.toLowerCase()))) {
        return true
      }
      
      // Check if all players are on the same team (fallback)
      const teams = new Set(Object.values(this.Players).map(p => p.Team))
      return teams.size === 1
    },
    
    allPlayers() {
      return Object.entries(this.Players)
        .map(([puuid, player]) => ({ ...player, puuid }))
    },
    
    allyPlayers() {
      return Object.entries(this.Players)
        .filter(([/* unused */, player]) => player.Team === 'Blue')
        .map(([puuid, player]) => ({ ...player, puuid }))
    },
    
    enemyPlayers() {
      return Object.entries(this.Players)
        .filter(([/* unused */, player]) => player.Team === 'Red')
        .map(([puuid, player]) => ({ ...player, puuid }))
    },
    
    searchTerms() {
      return this.skinSearchInput
        .split(',')
        .map(term => term.trim().toLowerCase())
        .filter(t => t)
    }
  },
  
  methods: {
    setTheme(theme) {
      this.currentTheme = theme
      localStorage.setItem('selectedTheme', theme)
      document.documentElement.setAttribute('data-theme', theme)
    },
    toggleSkinSniping() {
      this.skinSnipingEnabled = !this.skinSnipingEnabled
      if (this.skinSnipingEnabled) {
        this.showToast('Skin Sniping Enabled', 'Monitoring for rare skins...', 'success')
        this.checkCurrentLoadout()
      }
      localStorage.setItem('skinSnipingEnabled', this.skinSnipingEnabled)
    },

    toggleSkinAlerts() {
      this.skinAlertsEnabled = !this.skinAlertsEnabled;
    },

    checkCurrentLoadout() {
      if (!this.skinSnipingEnabled || !this.Players) return
      
      Object.entries(this.Players).forEach(([puuid, player]) => {
        this.checkPlayerForRareSkins(player, puuid)
      })
    },
    
    checkPlayerForRareSkins(player, puuid) {
      if (!player.Weapons) return
      
      Object.values(player.Weapons).forEach(weapon => {
        const skinName = weapon.skinDisplayName || ''
        const skinKey = `${puuid}_${skinName}`
        
        // Avoid duplicate notifications
        if (this.processedSkins.has(skinKey)) return
        
        // Check search terms
        if (this.searchTerms.length > 0) {
          this.searchTerms.forEach(term => {
            if (skinName.toLowerCase().includes(term)) {
              this.processedSkins.add(skinKey)
              this.showToast('Searched Skin Found!', `${player.Name} has ${skinName}`, 'rare')
            }
          })
        }
        
        // Check special skins (only if alerts are enabled)
        if (this.skinAlertsEnabled) {
          SPECIAL_SKINS.forEach(special => {
            if (skinName.toLowerCase().includes(special.toLowerCase())) {
              this.processedSkins.add(skinKey)
              this.showToast('Special Skin Detected!', `${player.Name} has ${skinName}`, 'special')
            }
          })
        }

        
        // Check RGB buddy
        if (this.rgbBuddyAlert && weapon.buddy_displayIcon) {
          if (weapon.buddy_displayIcon.includes('fist_bump') || 
              RGB_BUDDY_IDS.includes(weapon.skin_buddy_level)) {
            const buddyKey = `${puuid}_rgb_buddy`
            if (!this.processedSkins.has(buddyKey)) {
              this.processedSkins.add(buddyKey)
              this.showToast('RGB DETECTED!', `${player.Name} has the Riot Gun Buddy!`, 'legendary')
            }
          }
        }
        
        // Check tier threshold
        if (this.selectedTier && weapon.tier) {
          const weaponTier = TIER_MAP[weapon.tier]
          if (this.isTierHigherOrEqual(weaponTier, this.selectedTier)) {
            this.processedSkins.add(skinKey)
            this.showToast('High Tier Skin!', `${player.Name} has ${skinName}`, 'tier')
          }
        }
      })
    },
    
    isTierHigherOrEqual(weaponTier, selectedTier) {
      const tierOrder = ['select', 'deluxe', 'premium', 'ultra', 'exclusive']
      return tierOrder.indexOf(weaponTier) >= tierOrder.indexOf(selectedTier)
    },
    
    showToast(title, message, type = 'success') {
      const toast = {
        id: this.toastIdCounter++,
        title,
        message,
        type
      }
      
      this.toasts.push(toast)
      
      setTimeout(() => {
        const index = this.toasts.findIndex(t => t.id === toast.id)
        if (index > -1) {
          this.toasts.splice(index, 1)
        }
      }, 5000)
    },
    
    openModal(player) {
      this.modalPlayer = player
      this.showModal = true
    },
    
    closeModal() {
      this.showModal = false
      this.modalPlayer = null
    },
    
    updateLastTime() {
      setInterval(() => {
        if (!this.lastUpdate) return
        
        const seconds = Math.round(Date.now() / 1000 - this.lastUpdate)
        
        if (seconds < 0) {
          this.showTime = false
          return
        }
        
        this.showTime = true
        
        if (seconds === 1) {
          this.lastUpdateString = '1 second ago'
        } else if (seconds < 60) {
          this.lastUpdateString = `${seconds} seconds ago`
        } else if (Math.floor(seconds / 60) === 1) {
          this.lastUpdateString = '1 minute ago'
        } else if (seconds < 3600) {
          this.lastUpdateString = `${Math.floor(seconds / 60)} minutes ago`
        } else if (Math.floor(seconds / 3600) === 1) {
          this.lastUpdateString = '1 hour ago'
        } else if (seconds < 86400) {
          this.lastUpdateString = `${Math.floor(seconds / 3600)} hours ago`
        } else if (Math.floor(seconds / 86400) === 1) {
          this.lastUpdateString = '1 day ago'
        } else {
          this.lastUpdateString = `${Math.floor(seconds / 86400)} days ago`
        }
      }, 1000)
    },
    
    getVersion() {
      fetch('https://api.github.com/repos/isaacKenyon/VALORANT-rank-yoinker/releases')
        .then(response => response.json())
        .then(data => {
          this.version = data[0].tag_name
          this.vryhref = data[0].assets[0].browser_download_url
        })
    },
    
    downloadVRY() {
      window.location.href = this.vryhref
    },
    
    connectWebSocket() {
      try {
        this.websocket = new WebSocket('ws://localhost:1100/')
        
        this.websocket.onmessage = (event) => {
          const data = JSON.parse(event.data)
          
          if (data.type === undefined || data.type === 'matchLoadout') {
            this.loadoutJSON = data
            this.Players = data.Players || {}
            this.currentMap = data.map.name
            this.currentMode = data.mode || ''
            this.lastUpdate = data.time
            
            // Clear processed skins for new match
            this.processedSkins.clear()
            
            // Check for rare skins if monitoring is enabled
            if (this.skinSnipingEnabled) {
              setTimeout(() => this.checkCurrentLoadout(), 500)
            }
            
            // Save to localStorage
            localStorage.setItem('loadoutJSON', JSON.stringify(this.loadoutJSON))
          }
        }
        
        this.websocket.onopen = () => {
          console.log('Connected to WebSocket server')
        }
        
        this.websocket.onerror = (error) => {
          console.error('WebSocket error:', error)
        }
      } catch (error) {
        console.error('Failed to connect to WebSocket:', error)
      }
    },
    
    loadPreferences() {
      // Load theme
      const savedTheme = localStorage.getItem('selectedTheme')
      if (savedTheme && this.themes.includes(savedTheme)) {
        this.currentTheme = savedTheme
        document.documentElement.setAttribute('data-theme', savedTheme)
      }
      
      // Load saved preferences
      const savedSniping = localStorage.getItem('skinSnipingEnabled')
      if (savedSniping !== null) {
        this.skinSnipingEnabled = savedSniping === 'true'
      }
      
      const savedSearch = localStorage.getItem('skinSearchTerms')
      if (savedSearch) {
        this.skinSearchInput = savedSearch
      }
      
      const savedTier = localStorage.getItem('selectedTier')
      if (savedTier) {
        this.selectedTier = savedTier
      }
      
      const savedRGB = localStorage.getItem('rgbBuddyAlert')
      if (savedRGB !== null) {
        this.rgbBuddyAlert = savedRGB === 'true'
      }
    }
  },
  
  watch: {
    skinSearchInput(val) {
      localStorage.setItem('skinSearchTerms', val)
    },
    selectedTier(val) {
      localStorage.setItem('selectedTier', val)
    },
    rgbBuddyAlert(val) {
      localStorage.setItem('rgbBuddyAlert', val)
    }
  },
  
  mounted() {
    this.lastUpdate = Date.now() / 1000
    this.updateLastTime()
    this.loadPreferences()
    
    // Load cached data
    const cached = localStorage.getItem('loadoutJSON')
    if (cached) {
      try {
        this.loadoutJSON = JSON.parse(cached)
        this.Players = this.loadoutJSON.Players || {}
        this.currentMap = this.loadoutJSON.map
        this.currentMode = this.loadoutJSON.mode || ''
        this.lastUpdate = this.loadoutJSON.time
      } catch (error) {
        console.error('Failed to parse cached data:', error)
      }
    }
    
    this.connectWebSocket()
  },
  
  created() {
    this.getVersion()
  }
}
</script>

<style src="@/assets/matchloadouts.css" scoped></style>