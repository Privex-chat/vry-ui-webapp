<template>
  <div class="match-loadouts">
    <!-- Toast Notifications -->
    <div class="toast-container" aria-live="polite">
      <transition-group name="toast">
        <div v-for="toast in toasts" :key="toast.id" :class="['toast', toast.type]">
          <div class="toast-icon">{{ toastIcon(toast.type) }}</div>
          <div class="toast-content">
            <div class="toast-title">{{ toast.title }}</div>
            <div class="toast-message">{{ toast.message }}</div>
          </div>
          <button class="toast-close" @click="dismissToast(toast.id)" title="Dismiss">✕</button>
        </div>
      </transition-group>
    </div>

    <!-- Status Bar -->
    <div class="status-bar">
      <div class="status-indicator">
        <span :class="['status-dot', wsStatus]"></span>
        <span>{{ wsStatusLabel }}</span>
      </div>
      <span class="status-bar-divider"></span>
      <span>{{ lastUpdateString || 'Waiting…' }}</span>
      <span v-if="currentMap" class="status-bar-divider"></span>
      <span v-if="currentMap" class="status-badge">{{ currentMap }}</span>
      <span v-if="currentMode" class="status-bar-divider"></span>
      <span v-if="currentMode" class="status-badge">{{ currentMode }}</span>
      <span style="margin-left:auto; font-size:0.78rem; opacity:0.5;">
        {{ playerCount }} players
      </span>
    </div>

    <!-- Filters Panel -->
    <div class="filters-container">
      <div class="filters-header">
        <div class="filters-title">
          <span class="filter-icon">🎯</span>
          Skin Sniping
        </div>
        <div class="filter-controls">
          <button
            :class="['filter-toggle', { active: skinSnipingEnabled }]"
            @click="toggleSkinSniping"
          >
            <span :style="{ marginRight: '0.3rem' }">{{ skinSnipingEnabled ? '●' : '○' }}</span>
            Skin Sniping {{ skinSnipingEnabled ? 'ON' : 'OFF' }}
          </button>
          <button
            @click="toggleSkinAlerts"
            :class="['skin-alerts-btn', skinAlertsEnabled ? 'on' : 'off']"
          >
            🔔 Alerts {{ skinAlertsEnabled ? 'ON' : 'OFF' }}
          </button>
        </div>
      </div>

      <div class="filters-content">
        <!-- Skin search -->
        <div class="filter-group">
          <label class="filter-label" for="skin-search">Search skins (comma-separated)</label>
          <input
            id="skin-search"
            v-model="skinSearchInput"
            type="text"
            class="filter-input"
            placeholder="e.g., Kuronami, Prime Vandal, Reaver Sheriff…"
            @keydown.escape="skinSearchInput = ''"
          >
        </div>

        <!-- Tier threshold -->
        <div class="filter-group">
          <label class="filter-label">Minimum tier alert</label>
          <div class="tier-selector">
            <button
              v-for="tier in tiers"
              :key="tier.name"
              :class="['tier-btn', tier.name, { active: selectedTier === tier.name }]"
              @click="selectedTier = selectedTier === tier.name ? null : tier.name"
              :title="`Alert for ${tier.label} and above`"
            >
              {{ tier.label }}
            </button>
          </div>
        </div>

        <!-- Special toggles -->
        <div class="filter-group">
          <label class="filter-label">Special detection</label>
          <div class="special-items">
            <label class="checkbox-label">
              <input v-model="rgbBuddyAlert" type="checkbox" id="rgb-toggle">
              <span>Riot Gun Buddy (RGB)</span>
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-container">

      <!-- No match data -->
      <div v-if="!hasMatchData && wsStatus !== 'connecting'" class="no-match">
        <div class="no-match-icon">⚠️</div>
        <span class="error-text">No match data found</span>
        <p class="error-description">
          Make sure vRY-UI is running and you're in a match.<br>
          This page connects to <code>ws://localhost:1100/</code>
        </p>
        <button @click="downloadVRY" class="vry-button">
          Download vRY {{ version }}
        </button>
      </div>

      <!-- Connecting -->
      <div v-else-if="!hasMatchData && wsStatus === 'connecting'" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Connecting to vRY…</p>
        <p class="loading-hint">Make sure vRY-UI is running</p>
      </div>

      <!-- Deathmatch / No-team mode -->
      <div v-else-if="isNonTeamMode && playerCount > 0" class="all-players-container">
        <div class="all-players-header">
          <div class="all-players-label">
            All Players — {{ currentMode || 'Free For All' }}
          </div>
        </div>
        <div class="all-players-grid">
          <player-card
            v-for="player in allPlayers"
            :key="player.puuid"
            :player="player"
            team="neutral"
            @click="openModal(player)"
          />
        </div>
      </div>

      <!-- Team-based mode -->
      <div v-else-if="!isNonTeamMode && playerCount > 0" class="teams-container">
        <div class="team-section ally-team">
          <div class="team-header">
            <div class="team-label">Team 1</div>
            <div v-if="teamScores" class="team-score">{{ teamScores.ally || 0 }}</div>
          </div>
          <div class="players-grid">
            <player-card
              v-for="player in allyPlayers"
              :key="player.puuid"
              :player="player"
              team="ally"
              @click="openModal(player)"
            />
          </div>
        </div>

        <div class="team-section enemy-team">
          <div class="team-header">
            <div class="team-label">Team 2</div>
            <div v-if="teamScores" class="team-score">{{ teamScores.enemy || 0 }}</div>
          </div>
          <div class="players-grid">
            <player-card
              v-for="player in enemyPlayers"
              :key="player.puuid"
              :player="player"
              team="enemy"
              @click="openModal(player)"
            />
          </div>
        </div>
      </div>

      <!-- Still loading after connection -->
      <div v-else-if="wsStatus === 'connected'" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Waiting for match data…</p>
        <p class="loading-hint">Enter a match for data to appear</p>
      </div>
    </div>

    <!-- Player Modal -->
    <player-modal
      v-if="showModal && modalPlayer"
      :player="modalPlayer"
      @close="closeModal"
    />
  </div>
</template>

<script>
import PlayerCard from '@/components/PlayerCard.vue'
import PlayerModal from '@/components/PlayerModal.vue'

const TIER_MAP = {
  '0cebb8be-46d7-c12a-d306-e9907bfc5a25': 'select',
  'e046854e-406c-37f4-6607-19a9ba8426fc': 'deluxe',
  '60bca009-4182-7998-dee7-b8a2558dc369': 'premium',
  '12683d76-48d7-84a3-4e09-6985794f0445': 'ultra',
  '411e4a55-4e59-7757-41f0-86a53f101bb5': 'exclusive',
}

const SPECIAL_SKINS  = ['Kuronami','Prime','Reaver','Spectrum','Champions','Elderflame','Glitchpop','Radiant Crisis']
const NON_TEAM_MODES = ['deathmatch','escalation','spike rush','team deathmatch']

const TIER_ORDER = ['select','deluxe','premium','ultra','exclusive']

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
      lastUpdateString: 'Never',
      version: '',
      vryhref: '',
      currentMap: '',
      currentMode: '',
      teamScores: null,
      hasMatchData: false,
      wsStatus: 'connecting', // connecting | connected | disconnected

      // Skin sniping
      skinSnipingEnabled: false,
      skinSearchInput: '',
      selectedTier: null,
      rgbBuddyAlert: true,
      skinAlertsEnabled: false,
      toasts: [],
      toastIdCounter: 0,

      tiers: [
        { name: 'select',    label: 'Select' },
        { name: 'deluxe',    label: 'Deluxe' },
        { name: 'premium',   label: 'Premium' },
        { name: 'ultra',     label: 'Ultra' },
        { name: 'exclusive', label: 'Exclusive' },
      ],

      websocket: null,
      processedSkins: new Set(),
      reconnectTimer: null,
      updateTimer: null,
    }
  },

  computed: {
    wsStatusLabel() {
      const map = {
        connecting:    '⟳ Connecting to vRY…',
        connected:     '✓ Connected',
        disconnected:  '✕ Disconnected — retrying in 5s',
      }
      return map[this.wsStatus] || 'Unknown'
    },
    playerCount() {
      return Object.keys(this.Players || {}).length
    },
    isNonTeamMode() {
      if (this.currentMode) {
        const lower = this.currentMode.toLowerCase()
        if (NON_TEAM_MODES.some(m => lower.includes(m))) return true
      }
      const teams = new Set(Object.values(this.Players || {}).map(p => p.Team))
      return teams.size <= 1 && !teams.has('Blue') && !teams.has('Red')
    },
    allPlayers() {
      return Object.entries(this.Players || {})
        .map(([puuid, player]) => ({ ...player, puuid }))
        .sort((a, b) => (b.Level || 0) - (a.Level || 0))
    },
    allyPlayers() {
      return Object.entries(this.Players || {})
        .filter(([, p]) => p.Team === 'Blue')
        .map(([puuid, p]) => ({ ...p, puuid }))
    },
    enemyPlayers() {
      return Object.entries(this.Players || {})
        .filter(([, p]) => p.Team === 'Red')
        .map(([puuid, p]) => ({ ...p, puuid }))
    },
    searchTerms() {
      return this.skinSearchInput.split(',').map(t => t.trim().toLowerCase()).filter(Boolean)
    },
  },

  methods: {
    /* --------- MODAL --------- */
    openModal(player) {
      this.modalPlayer = player
      this.showModal = true
    },
    closeModal() {
      this.showModal = false
      this.modalPlayer = null
    },

    /* --------- TOASTS --------- */
    toastIcon(type) {
      const icons = { success: '✓', rare: '★', special: '⭐', legendary: '👑', tier: '🏅', info: 'ℹ' }
      return icons[type] || '●'
    },
    showToast(title, message, type = 'success') {
      const id = this.toastIdCounter++
      this.toasts.push({ id, title, message, type })
      setTimeout(() => this.dismissToast(id), 5000)
    },
    dismissToast(id) {
      const i = this.toasts.findIndex(t => t.id === id)
      if (i > -1) this.toasts.splice(i, 1)
    },

    /* --------- SKIN SNIPING --------- */
    toggleSkinSniping() {
      this.skinSnipingEnabled = !this.skinSnipingEnabled
      this.showToast(
        this.skinSnipingEnabled ? 'Skin Sniping ON' : 'Skin Sniping OFF',
        this.skinSnipingEnabled ? 'Now watching for target skins…' : 'Monitoring paused.',
        'info'
      )
      if (this.skinSnipingEnabled) this.checkCurrentLoadout()
      this.savePreferences()
    },
    toggleSkinAlerts() {
      this.skinAlertsEnabled = !this.skinAlertsEnabled
      this.showToast(
        this.skinAlertsEnabled ? 'Alerts Enabled' : 'Alerts Disabled',
        this.skinAlertsEnabled ? 'Special skins will trigger notifications.' : 'Special skin notifications off.',
        'info'
      )
      this.savePreferences()
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
        const skinKey  = `${puuid}_${skinName}`

        // User-defined search terms
        if (this.searchTerms.length > 0) {
          this.searchTerms.forEach(term => {
            if (skinName.toLowerCase().includes(term) && !this.processedSkins.has(skinKey + term)) {
              this.processedSkins.add(skinKey + term)
              this.showToast('Skin Found!', `${player.Name} → ${skinName}`, 'rare')
            }
          })
        }

        // Special skins
        if (this.skinAlertsEnabled) {
          SPECIAL_SKINS.forEach(special => {
            const key = `${puuid}_special_${special}`
            if (skinName.toLowerCase().includes(special.toLowerCase()) && !this.processedSkins.has(key)) {
              this.processedSkins.add(key)
              this.showToast('Special Skin!', `${player.Name} → ${skinName}`, 'special')
            }
          })
        }

        // RGB buddy
        if (this.rgbBuddyAlert && weapon.buddy_displayIcon) {
          const u = weapon.buddy_displayIcon.toLowerCase()
          if ((u.includes('fist_bump') || u.includes('riot_buddy') || u.includes('riot_gun_buddy'))) {
            const key = `${puuid}_rgb`
            if (!this.processedSkins.has(key)) {
              this.processedSkins.add(key)
              this.showToast('RGB Buddy!', `${player.Name} has the Riot Gun Buddy!`, 'legendary')
            }
          }
        }

        // Tier threshold
        if (this.selectedTier && weapon.tier) {
          const wTier = TIER_MAP[weapon.tier]
          if (wTier && TIER_ORDER.indexOf(wTier) >= TIER_ORDER.indexOf(this.selectedTier)) {
            if (!this.processedSkins.has(skinKey)) {
              this.processedSkins.add(skinKey)
              this.showToast('High-Tier Skin!', `${player.Name} → ${skinName}`, 'tier')
            }
          }
        }
      })
    },

    /* --------- TIMER --------- */
    startUpdateTimer() {
      this.updateTimer = setInterval(() => {
        if (!this.lastUpdate) { this.lastUpdateString = 'Never'; return }
        const s = Math.round(Date.now() / 1000 - this.lastUpdate)
        if (s < 5)        this.lastUpdateString = 'Just now'
        else if (s < 60)  this.lastUpdateString = `${s}s ago`
        else if (s < 3600) this.lastUpdateString = `${Math.floor(s / 60)}m ago`
        else               this.lastUpdateString = `${Math.floor(s / 3600)}h ago`
      }, 1000)
    },

    /* --------- WEBSOCKET --------- */
    connectWebSocket() {
      this.wsStatus = 'connecting'
      try {
        this.websocket = new WebSocket('ws://localhost:1100/')

        this.websocket.onopen = () => {
          this.wsStatus = 'connected'
          this.showToast('Connected', 'Live data stream active.', 'success')
          if (this.reconnectTimer) { clearTimeout(this.reconnectTimer); this.reconnectTimer = null }
        }

        this.websocket.onmessage = ({ data }) => {
          try {
            const json = JSON.parse(data)
            if (!json.type || json.type === 'matchLoadout') {
              const newMatchId = json.matchId
              const oldMatchId = this.loadoutJSON?.matchId
              if (newMatchId && newMatchId !== oldMatchId) this.processedSkins.clear()

              this.loadoutJSON  = json
              this.Players      = json.Players || {}
              this.currentMap   = json.map?.name || json.map || ''
              this.currentMode  = json.mode || ''
              this.lastUpdate   = json.time || (Date.now() / 1000)
              this.teamScores   = json.scores || null
              this.hasMatchData = Object.keys(this.Players).length > 0

              if (this.skinSnipingEnabled) {
                setTimeout(() => this.checkCurrentLoadout(), 500)
              }

              try { localStorage.setItem('loadoutJSON', JSON.stringify(json)) } catch (_e) { /* ignore */ }
            }
          } catch (e) { console.error('WS parse error:', e) }
        }

        this.websocket.onerror = (_err) => { void _err; }

        this.websocket.onclose = () => {
          this.wsStatus = 'disconnected'
          this.scheduleReconnect()
        }
      } catch (e) {
        this.wsStatus = 'disconnected'
        this.scheduleReconnect()
      }
    },
    scheduleReconnect() {
      if (this.reconnectTimer) return
      this.reconnectTimer = setTimeout(() => {
        this.reconnectTimer = null
        this.connectWebSocket()
      }, 5000)
    },

    /* --------- GITHUB --------- */
    async getVersion() {
      try {
        const r    = await fetch('https://api.github.com/repos/Privex-chat/vry-ui/releases')
        const data = await r.json()
        if (data?.length > 0) {
          this.version = data[0].tag_name
          this.vryhref = data[0].assets?.[0]?.browser_download_url || ''
        }
      } catch (_e) { /* ignore */ }
    },
    downloadVRY() {
      window.open(this.vryhref || 'https://github.com/Privex-chat/vry-ui/releases/latest', '_blank')
    },

    /* --------- PREFS --------- */
    loadPreferences() {
      try {
        const p = JSON.parse(localStorage.getItem('matchLoadoutsPrefs') || '{}')
        this.skinSnipingEnabled = p.skinSnipingEnabled || false
        this.skinSearchInput    = p.skinSearchInput    || ''
        this.selectedTier       = p.selectedTier       || null
        this.rgbBuddyAlert      = p.rgbBuddyAlert !== false
        this.skinAlertsEnabled  = p.skinAlertsEnabled  || false
      } catch (_e) { /* ignore */ }
    },
    savePreferences() {
      try {
        localStorage.setItem('matchLoadoutsPrefs', JSON.stringify({
          skinSnipingEnabled: this.skinSnipingEnabled,
          skinSearchInput:    this.skinSearchInput,
          selectedTier:       this.selectedTier,
          rgbBuddyAlert:      this.rgbBuddyAlert,
          skinAlertsEnabled:  this.skinAlertsEnabled,
        }))
      } catch (_e) { /* ignore */ }
    },
  },

  watch: {
    skinSearchInput() { this.savePreferences() },
    selectedTier()    { this.savePreferences() },
    rgbBuddyAlert()   { this.savePreferences() },
  },

  mounted() {
    this.loadPreferences()
    this.startUpdateTimer()
    this.getVersion()

    // Load cached data immediately
    try {
      const cached = JSON.parse(localStorage.getItem('loadoutJSON') || 'null')
      if (cached) {
        this.loadoutJSON  = cached
        this.Players      = cached.Players || {}
        this.currentMap   = cached.map?.name || cached.map || ''
        this.currentMode  = cached.mode || ''
        this.lastUpdate   = cached.time
        this.teamScores   = cached.scores || null
        this.hasMatchData = Object.keys(this.Players).length > 0
      }
    } catch (_e) { /* ignore */ }

    this.connectWebSocket()
  },

  beforeUnmount() {
    if (this.websocket)    this.websocket.close()
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer)
    if (this.updateTimer)  clearInterval(this.updateTimer)
  },
}
</script>

<style scoped>
/* scoped additions on top of matchloadouts.css globals */
.match-loadouts {
  padding-bottom: 4rem;
}

code {
  font-family: 'DM Mono', monospace;
  background: var(--bg-secondary);
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
  font-size: 0.82rem;
  color: var(--accent-blue);
}

.toast-close {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 0.75rem;
  cursor: pointer;
  padding: 0 0.2rem;
  margin-left: auto;
  transition: color 0.15s;
  flex-shrink: 0;
  align-self: flex-start;
}
.toast-close:hover { color: var(--text-primary); }

@media (max-width: 768px) {
  .match-loadouts { padding: 0.75rem 0.75rem 3rem; }
}
</style>
