<template>
  <teleport to="body">
    <div class="modal-backdrop" @click.self="closeModal">
      <div class="modal-container">
        <!-- Modal Header -->
        <div class="modal-header">
          <div class="header-left">
            <img :src="player.Agent || defaultAgentIcon" :alt="playerName" class="header-agent-icon">
            <div class="header-info">
              <h2 class="player-name">{{ playerName }}</h2>
              <div class="player-level">Level {{ player.Level || 'N/A' }}</div>
            </div>
          </div>
          <button class="close-btn" @click="closeModal">✕</button>
        </div>

        <!-- Player Card and Title Section -->
        <div class="player-identity">
          <div class="player-card-container">
            <div class="card-level">{{ player.Level || '?' }}</div>
            <img v-if="player.PlayerCard" :src="player.PlayerCard" alt="Player Card" class="player-card-image">
            <div class="card-info">
              <div class="card-name">{{ playerName }}</div>
              <div v-if="player.Title" class="card-title">{{ player.Title }}</div>
            </div>
          </div>
        </div>

        <!-- Weapons Grid -->
        <div class="weapons-section">
          <h3 class="section-title">Weapon Loadout</h3>
          <div class="weapons-grid">
            <!-- Primary Weapons -->
            <div class="weapon-category">
              <h4 class="category-label">Rifles</h4>
              <WeaponSlot :weapon="getWeaponByType('Vandal')" weapon-type="Vandal" />
              <WeaponSlot :weapon="getWeaponByType('Phantom')" weapon-type="Phantom" />
              <WeaponSlot :weapon="getWeaponByType('Bulldog')" weapon-type="Bulldog" />
              <WeaponSlot :weapon="getWeaponByType('Guardian')" weapon-type="Guardian" />
            </div>

            <!-- Sidearms -->
            <div class="weapon-category">
              <h4 class="category-label">Sidearms</h4>
              <WeaponSlot :weapon="getWeaponByType('Classic')" weapon-type="Classic" />
              <WeaponSlot :weapon="getWeaponByType('Shorty')" weapon-type="Shorty" />
              <WeaponSlot :weapon="getWeaponByType('Frenzy')" weapon-type="Frenzy" />
              <WeaponSlot :weapon="getWeaponByType('Ghost')" weapon-type="Ghost" />
              <WeaponSlot :weapon="getWeaponByType('Sheriff')" weapon-type="Sheriff" />
            </div>

            <!-- SMGs -->
            <div class="weapon-category">
              <h4 class="category-label">SMGs</h4>
              <WeaponSlot :weapon="getWeaponByType('Stinger')" weapon-type="Stinger" />
              <WeaponSlot :weapon="getWeaponByType('Spectre')" weapon-type="Spectre" />
            </div>

            <!-- Shotguns -->
            <div class="weapon-category">
              <h4 class="category-label">Shotguns</h4>
              <WeaponSlot :weapon="getWeaponByType('Bucky')" weapon-type="Bucky" />
              <WeaponSlot :weapon="getWeaponByType('Judge')" weapon-type="Judge" />
            </div>

            <!-- Snipers -->
            <div class="weapon-category">
              <h4 class="category-label">Snipers</h4>
              <WeaponSlot :weapon="getWeaponByType('Marshal')" weapon-type="Marshal" />
              <WeaponSlot :weapon="getWeaponByType('Outlaw')" weapon-type="Outlaw" />
              <WeaponSlot :weapon="getWeaponByType('Operator')" weapon-type="Operator" />
            </div>

            <!-- Heavy -->
            <div class="weapon-category">
              <h4 class="category-label">Heavy</h4>
              <WeaponSlot :weapon="getWeaponByType('Ares')" weapon-type="Ares" />
              <WeaponSlot :weapon="getWeaponByType('Odin')" weapon-type="Odin" />
            </div>

            <!-- Melee -->
            <div class="weapon-category">
              <h4 class="category-label">Melee</h4>
              <WeaponSlot :weapon="getWeaponByType('Melee')" weapon-type="Melee" :is-melee="true" />
            </div>
          </div>
        </div>

        <!-- Sprays Section -->
        <div v-if="player.Sprays && Object.keys(player.Sprays).length > 0" class="sprays-section">
          <h3 class="section-title">Equipped Sprays</h3>
          <div class="sprays-grid">
            <div v-for="(spray, index) in player.Sprays" :key="index" class="spray-slot">
              <img v-if="spray.displayIcon" :src="spray.displayIcon" :alt="spray.displayName" class="spray-image">
              <div class="spray-name">{{ spray.displayName || 'Unknown Spray' }}</div>
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
  // Sidearms
  'Classic': '29a0cfab-485b-f5d5-779a-b59f85e204a8',
  'Shorty': '42da8ccc-40d5-affc-beec-15aa47b42eda',
  'Frenzy': '44d4e95c-4157-0037-81b2-17841bf2e8e3',
  'Ghost': '1baa85b4-4c70-1284-64bb-6481dfc3bb4e',
  'Sheriff': 'e336c6b8-418d-9340-d77f-7a9e4cfe0702',
  
  // SMGs
  'Stinger': 'f7e1b454-4ad4-1063-ec0a-159e56b58941',
  'Spectre': '462080d1-4035-2937-7c09-27aa2a5c27a7',
  
  // Rifles
  'Bulldog': 'ae3de142-4d85-2547-dd26-4e90bed35cf7',
  'Guardian': '4ade7faa-4cf1-8376-95ef-39884480959b',
  'Phantom': 'ee8e8d15-496b-07ac-e5f6-8fae5d4c7b1a',
  'Vandal': '9c82e19d-4575-0200-1a81-3eacf00cf872',
  
  // Shotguns
  'Bucky': '910be174-449b-c412-ab22-d0873436b21b',
  'Judge': 'ec845bf4-4f79-ddda-a3da-0db3774b2794',
  
  // Snipers
  'Marshal': 'c4883e50-4494-202c-3ec3-6b8a9284f00b',
  'Outlaw': '5f0aaf7a-4289-3998-d5ff-eb9a5cf7ef5c',
  'Operator': 'a03b24d3-4319-996d-0f8c-94bbfba1dfc7',
  
  // Heavy
  'Ares': '55d8a0f4-4274-ca67-fe2c-06ab45efdf58',
  'Odin': '63e6c2b6-4a8e-869c-3d4c-e38355226584',
  
  // Melee
  'Melee': '2f59173c-4bed-b6c3-2191-dea9b58be9c7'
}

export default {
  name: 'PlayerModal',
  components: { WeaponSlot },
  props: {
    player: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      defaultAgentIcon: '/default_agent.png'
    }
  },
  computed: {
    playerName() {
      return this.player.Name || 'Unknown Agent'
    }
  },
  methods: {
    closeModal() {
      this.$emit('close')
    },
    getWeaponByType(weaponType) {
      if (!this.player.Weapons) return null
      
      const weaponId = WEAPON_IDS[weaponType]
      if (!weaponId) return null
      
      const weapon = this.player.Weapons[weaponId]
      if (!weapon) return null
      
      return {
        ...weapon,
        id: weaponId,
        type: weaponType
      }
    }
  },
  mounted() {
    // Add escape key listener
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        this.closeModal()
      }
    }
    document.addEventListener('keydown', handleEscape)
    
    // Store the handler for proper cleanup
    this.escapeHandler = handleEscape
  },
  beforeUnmount() {
    // Clean up the event listener
    if (this.escapeHandler) {
      document.removeEventListener('keydown', this.escapeHandler)
    }
  }
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-container {
  background: linear-gradient(135deg, #1a2332 0%, #0f1923 100%);
  border-radius: 20px;
  width: 90%;
  max-width: 1200px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  animation: slideUp 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

@keyframes slideUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Custom Scrollbar */
.modal-container::-webkit-scrollbar {
  width: 8px;
}

.modal-container::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}

.modal-container::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #00b4d8, #ff4655);
  border-radius: 10px;
}

/* Modal Header */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.3);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-agent-icon {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.header-info {
  display: flex;
  flex-direction: column;
}

.player-name {
  margin: 0;
  font-size: 1.5rem;
  font-weight: bold;
  color: #ffffff;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
}

.player-level {
  color: #a8b2c7;
  font-size: 0.9rem;
}

.close-btn {
  background: rgba(255, 70, 85, 0.2);
  border: 2px solid #ff4655;
  color: #ff4655;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: #ff4655;
  color: white;
  transform: scale(1.1);
}

/* Player Identity Section */
.player-identity {
  padding: 2rem;
  display: flex;
  justify-content: center;
}

.player-card-container {
  position: relative;
  width: 150px;
  height: 300px;
  border-radius: 15px;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
}

.player-card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-level {
  position: absolute;
  top: -2px;
  left: 16%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #00b4d8, #ff4655);
  color: white;
  padding: 0.4rem 1.2rem;
  border-radius: 12px;
  font-weight: bold;
  font-size: 1.2rem;
  z-index: 1;
  box-shadow: 0 4px 15px rgba(0, 180, 216, 0.5);
}

.card-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent);
  padding: 1rem;
  color: white;
}

.card-name {
  font-weight: bold;
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
}

.card-title {
  font-size: 0.9rem;
  color: #ffd700;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
}

/* Weapons Section */
.weapons-section {
  padding: 1.5rem;
}

.section-title {
  color: #ffffff;
  font-size: 1.2rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.weapons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.weapon-category {
  background: rgba(30, 41, 57, 0.5);
  border-radius: 12px;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.category-label {
  color: #a8b2c7;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 0.75rem;
  font-weight: 600;
}

/* Sprays Section */
.sprays-section {
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.sprays-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 1rem;
}

.spray-slot {
  background: rgba(30, 41, 57, 0.5);
  border-radius: 10px;
  padding: 0.75rem;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s;
}

.spray-slot:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
  border-color: rgba(0, 180, 216, 0.5);
}

.spray-image {
  width: 60px;
  height: 60px;
  object-fit: contain;
  margin-bottom: 0.5rem;
}

.spray-name {
  font-size: 0.75rem;
  color: #a8b2c7;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Responsive Design */
@media (max-width: 768px) {
  .modal-container {
    width: 95%;
    max-height: 95vh;
  }
  
  .weapons-grid {
    grid-template-columns: 1fr;
  }
  
  .player-name {
    font-size: 1.2rem;
  }
}
</style>