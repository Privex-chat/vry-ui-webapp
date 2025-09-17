<template>
  <div :class="['weapon-slot', { 
    'has-weapon': weapon, 
    'is-rare': isRareSkin, 
    'is-melee': isMelee,
    'has-rgb': hasRGBBuddy 
  }]">
    <!-- Empty State -->
    <div v-if="!weapon" class="empty-slot">
      <div class="weapon-type-label">{{ weaponType }}</div>
      <div class="empty-icon">—</div>
    </div>
    
    <!-- Weapon Present -->
    <div v-else class="weapon-content">
      <!-- Rare Indicator -->
      <div v-if="isRareSkin || hasRGBBuddy" class="rare-badge">
        {{ hasRGBBuddy ? 'RGB' : 'RARE' }}
      </div>
      
      <!-- Weapon Image -->
      <div class="weapon-image-container">
        <img 
          v-if="weapon.skinDisplayIcon" 
          :src="weapon.skinDisplayIcon" 
          :alt="weapon.skinDisplayName"
          class="weapon-image"
        >
        <div v-else class="weapon-placeholder">
          <span>{{ weaponType }}</span>
        </div>
        
        <!-- Gun Buddy -->
        <img 
          v-if="weapon.buddy_displayIcon" 
          :src="weapon.buddy_displayIcon" 
          alt="Gun Buddy"
          :class="['buddy-image', { 'rgb-buddy': hasRGBBuddy }]"
        >
      </div>
      
      <!-- Weapon Info -->
      <div class="weapon-info">
        <div class="skin-name">{{ getSkinDisplayName() }}</div>
        <div class="weapon-type">{{ weaponType }}</div>
        <div v-if="skinTier" :class="['skin-tier', tierClass]">
          {{ tierLabel }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const RARE_SKINS = [
  'Kuronami', 'Prime', 'Reaver', 'Spectrum', 'Champions', 
  'Elderflame', 'Radiant Crisis', 'Protocol', 'RGX', 'Glitchpop',
  'Singularity', 'Sentinels of Light', 'Ruination', 'Zedd',
  'Forsaken', 'Sovereign', 'Celestial', 'Magepunk', 'Ion'
]

const TIER_MAP = {
  '0cebb8be-46d7-c12a-d306-e9907bfc5a25': { name: 'select', label: 'Select Edition' },
  'e046854e-406c-37f4-6607-19a9ba8426fc': { name: 'deluxe', label: 'Deluxe Edition' },
  '60bca009-4182-7998-dee7-b8a2558dc369': { name: 'premium', label: 'Premium Edition' },
  '12683d76-48d7-84a3-4e09-6985794f0445': { name: 'ultra', label: 'Ultra Edition' },
  '411e4a55-4e59-7757-41f0-86a53f101bb5': { name: 'exclusive', label: 'Exclusive Edition' }
}

export default {
  name: 'WeaponSlot',
  props: {
    weapon: {
      type: Object,
      default: null
    },
    weaponType: {
      type: String,
      required: true
    },
    isMelee: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isRareSkin() {
      if (!this.weapon || !this.weapon.skinDisplayName) return false
      const skinName = this.weapon.skinDisplayName.toLowerCase()
      return RARE_SKINS.some(rare => skinName.includes(rare.toLowerCase()))
    },
    
    hasRGBBuddy() {
      if (!this.weapon || !this.weapon.buddy_displayIcon) return false
      return this.weapon.buddy_displayIcon.includes('fist_bump') || 
             this.weapon.buddy_displayIcon.includes('riot_buddy')
    },
    
    skinTier() {
      if (!this.weapon || !this.weapon.skin) return null
      return TIER_MAP[this.weapon.skin]
    },
    
    tierClass() {
      if (!this.skinTier) return ''
      return `tier-${this.skinTier.name}`
    },
    
    tierLabel() {
      if (!this.skinTier) return ''
      return this.skinTier.label
    }
  },
  methods: {
    getSkinDisplayName() {
      if (!this.weapon || !this.weapon.skinDisplayName) return 'Standard'
      
      // Remove weapon type from skin name for cleaner display
      let displayName = this.weapon.skinDisplayName
        .replace(this.weaponType, '')
        .replace('Collection', '')
        .trim()
      
      if (!displayName || displayName.toLowerCase() === 'standard') {
        return 'Standard'
      }
      
      return displayName
    }
  }
}
</script>

<style scoped>
.weapon-slot {
  background: rgba(15, 25, 35, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.weapon-slot::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--accent-color, #00b4d8), transparent);
  opacity: 0;
  transition: opacity 0.3s;
}

.weapon-slot:hover::before {
  opacity: 1;
}

.weapon-slot:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  border-color: rgba(0, 180, 216, 0.3);
}

.weapon-slot.is-rare {
  background: linear-gradient(135deg, rgba(15, 25, 35, 0.5), rgba(189, 57, 68, 0.1));
  border-color: rgba(189, 57, 68, 0.3);
}

.weapon-slot.has-rgb {
  background: linear-gradient(135deg, rgba(15, 25, 35, 0.5), rgba(255, 215, 0, 0.1));
  border-color: rgba(255, 215, 0, 0.3);
  animation: rgbPulse 3s infinite;
}

@keyframes rgbPulse {
  0%, 100% { 
    box-shadow: 0 0 0 0 rgba(255, 215, 0, 0);
  }
  50% { 
    box-shadow: 0 0 20px 5px rgba(255, 215, 0, 0.2);
  }
}

/* Empty Slot */
.empty-slot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem;
  opacity: 0.3;
}

.weapon-type-label {
  font-size: 0.9rem;
  color: #a8b2c7;
  font-weight: 500;
}

.empty-icon {
  font-size: 1.2rem;
  color: #a8b2c7;
}

/* Weapon Content */
.weapon-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* Rare Badge */
.rare-badge {
  position: absolute;
  top: 5px;
  right: 5px;
  background: linear-gradient(135deg, #ff4655, #bd3944);
  color: white;
  padding: 2px 6px;
  border-radius: 6px;
  font-size: 0.65rem;
  font-weight: bold;
  z-index: 2;
  animation: badgePulse 2s infinite;
}

.has-rgb .rare-badge {
  background: linear-gradient(135deg, #ffd700, #ff4655);
}

@keyframes badgePulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

/* Weapon Image Container */
.weapon-image-container {
  position: relative;
  width: 100px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.weapon-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
}

.weapon-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  font-size: 0.7rem;
  color: #a8b2c7;
}

/* Gun Buddy */
.buddy-image {
  position: absolute;
  bottom: -5px;
  right: -5px;
  width: 20px;
  height: 20px;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
}

.buddy-image.rgb-buddy {
  filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.8));
  animation: buddyFloat 3s ease-in-out infinite;
}

@keyframes buddyFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

/* Weapon Info */
.weapon-info {
  flex: 1;
  min-width: 0;
}

.skin-name {
  font-weight: 600;
  font-size: 0.9rem;
  color: #ffffff;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 2px;
}

.is-rare .skin-name {
  background: linear-gradient(90deg, #ff4655, #ffd700);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.weapon-type {
  font-size: 0.75rem;
  color: #a8b2c7;
  margin-bottom: 4px;
}

/* Skin Tier Badge */
.skin-tier {
  display: inline-block;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border: 1px solid currentColor;
}

.tier-select {
  color: #0cebb8;
  background: rgba(12, 235, 184, 0.1);
}

.tier-deluxe {
  color: #e04685;
  background: rgba(224, 70, 133, 0.1);
}

.tier-premium {
  color: #d1548e;
  background: rgba(209, 84, 142, 0.1);
}

.tier-ultra {
  color: #ffd700;
  background: rgba(255, 215, 0, 0.1);
}

.tier-exclusive {
  color: #ff4655;
  background: rgba(255, 70, 85, 0.1);
}

/* Melee Specific Styles */
.weapon-slot.is-melee {
  background: linear-gradient(135deg, rgba(15, 25, 35, 0.5), rgba(138, 43, 226, 0.1));
  border-color: rgba(138, 43, 226, 0.3);
}

.weapon-slot.is-melee .weapon-image-container {
  width: 120px;
  height: 60px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .weapon-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .weapon-image-container {
    width: 100%;
    height: 60px;
  }
}
</style>