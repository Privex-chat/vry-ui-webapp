<template>
  <teleport to="body">
    <div class="modal-backdrop" @click.self="closeModal" role="dialog" aria-modal="true" :aria-label="`${playerName} loadout`">
      <div class="modal-container">

        <!-- MODAL HEADER -->
        <div class="modal-header">
          <div class="header-left">
            <div class="header-agent-wrap">
              <img
                :src="player.Agent || defaultAgentIcon"
                :alt="playerName"
                class="header-agent-icon"
                @error="e => e.target.src = defaultAgentIcon"
              >
            </div>
            <div class="header-info">
              <h2 class="modal-player-name">{{ playerName }}</h2>
              <div class="header-meta">
                <span class="modal-player-level">Level {{ player.Level || 'N/A' }}</span>
                <span v-if="player.Title" class="modal-player-title">{{ player.Title }}</span>
              </div>
            </div>
          </div>
          <button class="close-btn" @click="closeModal" aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <!-- PLAYER IDENTITY SIDEBAR -->
          <div class="identity-sidebar">
            <!-- Player Card -->
            <div class="player-card-wrap">
              <div class="level-pill">{{ player.Level || '?' }}</div>
              <img
                v-if="player.PlayerCard"
                :src="player.PlayerCard"
                alt="Player Card"
                class="player-card-img"
                @error="e => e.target.style.display='none'"
              >
              <div v-else class="player-card-placeholder">
                <span>No Card</span>
              </div>
              <div class="player-card-overlay">
                <div class="overlay-name">{{ playerName }}</div>
                <div v-if="player.Title" class="overlay-title">{{ player.Title }}</div>
              </div>
            </div>

            <!-- Player Stats Chips -->
            <div v-if="player.Sprays && Object.keys(player.Sprays).length > 0" class="sprays-mini">
              <div class="sidebar-section-label">Sprays</div>
              <div class="sprays-row">
                <div
                  v-for="(spray, idx) in player.Sprays"
                  :key="idx"
                  class="spray-chip"
                  :title="spray.displayName"
                >
                  <img v-if="spray.displayIcon" :src="spray.displayIcon" :alt="spray.displayName" class="spray-chip-img">
                  <span class="spray-chip-name">{{ formatSprayName(spray.displayName) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- WEAPONS SECTION -->
          <div class="weapons-main">
            <h3 class="weapons-section-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
                <line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
              </svg>
              Weapon Loadout
            </h3>

            <div class="weapons-grid">
              <div class="weapon-col">
                <div class="weapon-col-label">Rifles</div>
                <WeaponSlot :weapon="getWeaponByType('Vandal')"   weapon-type="Vandal" />
                <WeaponSlot :weapon="getWeaponByType('Phantom')"  weapon-type="Phantom" />
                <WeaponSlot :weapon="getWeaponByType('Bulldog')"  weapon-type="Bulldog" />
                <WeaponSlot :weapon="getWeaponByType('Guardian')" weapon-type="Guardian" />

                <div class="weapon-col-label">Snipers</div>
                <WeaponSlot :weapon="getWeaponByType('Marshal')"  weapon-type="Marshal" />
                <WeaponSlot :weapon="getWeaponByType('Outlaw')"   weapon-type="Outlaw" />
                <WeaponSlot :weapon="getWeaponByType('Operator')" weapon-type="Operator" />
              </div>

              <div class="weapon-col">
                <div class="weapon-col-label">Sidearms</div>
                <WeaponSlot :weapon="getWeaponByType('Classic')" weapon-type="Classic" />
                <WeaponSlot :weapon="getWeaponByType('Shorty')"  weapon-type="Shorty" />
                <WeaponSlot :weapon="getWeaponByType('Frenzy')"  weapon-type="Frenzy" />
                <WeaponSlot :weapon="getWeaponByType('Ghost')"   weapon-type="Ghost" />
                <WeaponSlot :weapon="getWeaponByType('Sheriff')" weapon-type="Sheriff" />

                <div class="weapon-col-label">SMGs</div>
                <WeaponSlot :weapon="getWeaponByType('Stinger')" weapon-type="Stinger" />
                <WeaponSlot :weapon="getWeaponByType('Spectre')" weapon-type="Spectre" />
              </div>

              <div class="weapon-col">
                <div class="weapon-col-label">Shotguns</div>
                <WeaponSlot :weapon="getWeaponByType('Bucky')" weapon-type="Bucky" />
                <WeaponSlot :weapon="getWeaponByType('Judge')" weapon-type="Judge" />

                <div class="weapon-col-label">Heavy</div>
                <WeaponSlot :weapon="getWeaponByType('Ares')" weapon-type="Ares" />
                <WeaponSlot :weapon="getWeaponByType('Odin')" weapon-type="Odin" />

                <div class="weapon-col-label">Melee</div>
                <WeaponSlot :weapon="getWeaponByType('Melee')" weapon-type="Melee" :is-melee="true" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script>
import WeaponSlot from './WeaponSlot.vue'

const WEAPON_IDS = {
  'Classic':  '29a0cfab-485b-f5d5-779a-b59f85e204a8',
  'Shorty':   '42da8ccc-40d5-affc-beec-15aa47b42eda',
  'Frenzy':   '44d4e95c-4157-0037-81b2-17841bf2e8e3',
  'Ghost':    '1baa85b4-4c70-1284-64bb-6481dfc3bb4e',
  'Sheriff':  'e336c6b8-418d-9340-d77f-7a9e4cfe0702',
  'Stinger':  'f7e1b454-4ad4-1063-ec0a-159e56b58941',
  'Spectre':  '462080d1-4035-2937-7c09-27aa2a5c27a7',
  'Bulldog':  'ae3de142-4d85-2547-dd26-4e90bed35cf7',
  'Guardian': '4ade7faa-4cf1-8376-95ef-39884480959b',
  'Phantom':  'ee8e8d15-496b-07ac-e5f6-8fae5d4c7b1a',
  'Vandal':   '9c82e19d-4575-0200-1a81-3eacf00cf872',
  'Bucky':    '910be174-449b-c412-ab22-d0873436b21b',
  'Judge':    'ec845bf4-4f79-ddda-a3da-0db3774b2794',
  'Marshal':  'c4883e50-4494-202c-3ec3-6b8a9284f00b',
  'Outlaw':   '5f0aaf7a-4289-3998-d5ff-eb9a5cf7ef5c',
  'Operator': 'a03b24d3-4319-996d-0f8c-94bbfba1dfc7',
  'Ares':     '55d8a0f4-4274-ca67-fe2c-06ab45efdf58',
  'Odin':     '63e6c2b6-4a8e-869c-3d4c-e38355226584',
  'Melee':    '2f59173c-4bed-b6c3-2191-dea9b58be9c7',
}

export default {
  name: 'PlayerModal',
  components: { WeaponSlot },
  emits: ['close'],
  props: {
    player: { type: Object, required: true }
  },
  data() {
    return { defaultAgentIcon: '/default_agent.png' }
  },
  computed: {
    playerName() {
      return this.player.Name || 'Unknown Agent'
    }
  },
  methods: {
    closeModal() { this.$emit('close') },
    getWeaponByType(type) {
      if (!this.player.Weapons) return null
      const id = WEAPON_IDS[type]
      if (!id) return null
      const w = this.player.Weapons[id]
      return w ? { ...w, id, type } : null
    },
    formatSprayName(name) {
      if (!name) return 'Unknown'
      return name.length > 14 ? name.slice(0, 13) + '…' : name
    }
  },
  mounted() {
    const handleEscape = e => { if (e.key === 'Escape') this.closeModal() }
    document.addEventListener('keydown', handleEscape)
    this.escapeHandler = handleEscape
    document.body.style.overflow = 'hidden'
  },
  beforeUnmount() {
    if (this.escapeHandler) document.removeEventListener('keydown', this.escapeHandler)
    document.body.style.overflow = ''
  }
}
</script>

<style scoped>
/* BACKDROP */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: var(--bg-overlay);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  animation: fadeIn 0.2s ease;
}

/* CONTAINER */
.modal-container {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  width: 100%;
  max-width: 1100px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-lg);
  animation: scaleIn 0.25s cubic-bezier(0.34, 1.3, 0.64, 1);
}

/* HEADER */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-secondary);
  flex-shrink: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-agent-wrap {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid var(--border-color);
  background: var(--bg-primary);
  flex-shrink: 0;
}

.header-agent-icon {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.modal-player-name {
  font-size: 1.35rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
  color: var(--text-primary);
}

.header-meta {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.modal-player-level {
  font-size: 0.82rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.modal-player-title {
  font-size: 0.78rem;
  color: var(--accent-gold);
  opacity: 0.9;
}

.close-btn {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: var(--bg-card);
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
}

.close-btn:hover {
  border-color: var(--error-color);
  color: var(--error-color);
  background: rgba(255, 70, 85, 0.1);
}

/* BODY */
.modal-body {
  display: flex;
  gap: 0;
  overflow: hidden;
  flex: 1;
  min-height: 0;
}

/* SIDEBAR */
.identity-sidebar {
  width: 200px;
  flex-shrink: 0;
  border-right: 1px solid var(--border-color);
  overflow-y: auto;
  padding: 1.25rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  background: var(--bg-secondary);
}

/* PLAYER CARD */
.player-card-wrap {
  position: relative;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid var(--border-color);
  aspect-ratio: 1 / 2;
  background: var(--bg-primary);
  flex-shrink: 0;
}

.level-pill {
  position: absolute;
  top: 0.5rem;
  left: 50%;
  transform: translateX(-50%);
  background: var(--gradient-accent);
  color: white;
  padding: 0.2rem 0.7rem;
  border-radius: 10px;
  font-family: 'Rajdhani', sans-serif;
  font-weight: 700;
  font-size: 0.95rem;
  z-index: 2;
  white-space: nowrap;
}

.player-card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.player-card-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  font-size: 0.82rem;
}

.player-card-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.5rem 0.75rem 0.75rem;
  background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%);
}

.overlay-name {
  font-weight: 600;
  font-size: 0.85rem;
  color: white;
  margin-bottom: 0.15rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.overlay-title {
  font-size: 0.75rem;
  color: var(--accent-gold);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* SPRAYS */
.sidebar-section-label {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-secondary);
  opacity: 0.7;
  margin-bottom: 0.5rem;
}

.sprays-row {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.spray-chip {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.5rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  transition: border-color 0.2s;
}

.spray-chip:hover { border-color: var(--border-color-hover); }

.spray-chip-img {
  width: 30px;
  height: 30px;
  object-fit: contain;
  flex-shrink: 0;
}

.spray-chip-name {
  font-size: 0.72rem;
  color: var(--text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* WEAPONS MAIN */
.weapons-main {
  flex: 1;
  overflow-y: auto;
  padding: 1.25rem 1.5rem;
  min-width: 0;
}

.weapons-section-title {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-family: 'Rajdhani', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--text-secondary);
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--border-color);
}

.weapons-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
  align-items: start;
}

.weapon-col { display: flex; flex-direction: column; gap: 0.35rem; }

.weapon-col-label {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-secondary);
  opacity: 0.6;
  padding: 0.75rem 0 0.25rem;
  border-top: 1px solid var(--border-color);
  margin-top: 0.25rem;
}

.weapon-col .weapon-col-label:first-child {
  padding-top: 0;
  border-top: none;
  margin-top: 0;
}

/* Custom scrollbar inside modal */
.weapons-main::-webkit-scrollbar,
.identity-sidebar::-webkit-scrollbar { width: 4px; }
.weapons-main::-webkit-scrollbar-track,
.identity-sidebar::-webkit-scrollbar-track { background: transparent; }
.weapons-main::-webkit-scrollbar-thumb,
.identity-sidebar::-webkit-scrollbar-thumb {
  background: var(--scrollbar-thumb);
  border-radius: 4px;
}

/* ANIMATIONS */
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.93) translateY(16px); }
  to   { opacity: 1; transform: scale(1)    translateY(0); }
}

/* RESPONSIVE */
@media (max-width: 900px) {
  .weapons-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 640px) {
  .modal-container { border-radius: 16px 16px 0 0; max-height: 95vh; }
  .modal-backdrop  { align-items: flex-end; padding: 0; }

  .identity-sidebar { display: none; }

  .modal-body { flex-direction: column; }
  .weapons-main { padding: 1rem; }
  .weapons-grid { grid-template-columns: 1fr; }
}
</style>
