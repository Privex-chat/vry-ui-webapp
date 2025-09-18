<template>
  <div 
    :class="['weapon-slot', { 
      'has-weapon': weapon, 
      'is-rare': isRareSkin, 
      'is-melee': isMelee,
      'has-rgb': hasRGBBuddy 
    }]"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @mousemove="handleMouseMove"
  >
    <!-- Tooltip -->
    <transition name="tooltip">
      <div 
        v-if="showTooltip && tooltipContent" 
        class="weapon-tooltip"
        :style="{ left: tooltipX + 'px', top: tooltipY + 'px' }"
      >
        <div v-if="buddyName" class="tooltip-buddy">
          <span class="buddy-name">{{ buddyName }}</span>
        </div>
        <div v-if="skinTier" class="tooltip-tier">
          <span class="tier-label">Tier:</span>
          <span :class="['tier-value', tierClass]">{{ tierLabel }}</span>
        </div>
      </div>
    </transition>
    
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
          :alt="buddyName || 'Gun Buddy'"
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

// WeaponSlot.vue - Updated script section
<script>
import { buddyService } from '@/services/buddyService';

const RARE_SKINS = [
  'Kuronami', 'Prime', 'Reaver', 'Spectrum', 'Champions', 
  'Elderflame', 'Radiant Crisis', 'Protocol', 'RGX', 'Glitchpop',
  'Singularity', 'Sentinels of Light', 'Ruination', 'Zedd',
  'Forsaken', 'Sovereign', 'Celestial', 'Magepunk', 'Ion',
  'Blastx', 'ChronoVoid', 'Gaia', 'Neptun', 'Oni', 'Origin'
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
  data() {
    return {
      showTooltip: false,
      tooltipX: 0,
      tooltipY: 0,
      resolvedBuddyName: null,
      isLoadingBuddy: false
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
      const buddyIcon = this.weapon.buddy_displayIcon.toLowerCase()
      return buddyIcon.includes('fist_bump') || 
             buddyIcon.includes('riot_buddy') ||
             buddyIcon.includes('riot_gun_buddy')
    },
    
    buddyName() {
      // Use resolved name from API if available
      if (this.resolvedBuddyName) {
        return this.resolvedBuddyName;
      }
      
      // Fallback to existing logic while loading
      if (!this.weapon) return null;
      
      // Check if we have buddy UUID to resolve
      if (this.weapon.buddy_uuid) {
        return null; // Will be resolved async
      }
      
      // Fallback to existing display name or extraction from URL
      if (this.weapon.buddy_displayName) {
        return this.weapon.buddy_displayName;
      }
      
      return this.extractBuddyNameFromURL();
    },
    
    skinTier() {
      if (!this.weapon || !this.weapon.tier) return null
      return TIER_MAP[this.weapon.tier] || TIER_MAP[this.weapon.skin]
    },
    
    tierClass() {
      if (!this.skinTier) return ''
      return `tier-${this.skinTier.name}`
    },
    
    tierLabel() {
      if (!this.skinTier) return ''
      return this.skinTier.label
    },
    
    tooltipContent() {
      return this.weapon && (this.weapon.skinDisplayName || this.buddyName || this.skinTier)
    }
  },
  methods: {
    getSkinDisplayName() {
      if (!this.weapon || !this.weapon.skinDisplayName) return 'Standard'
      
      let displayName = this.weapon.skinDisplayName
        .replace(this.weaponType, '')
        .replace('Collection', '')
        .trim()
      
      if (!displayName || displayName.toLowerCase() === 'standard') {
        return 'Standard'
      }
      
      return displayName
    },
    
    extractBuddyNameFromURL() {
      if (!this.weapon.buddy_displayIcon) return null;
      
      const iconUrl = this.weapon.buddy_displayIcon.toLowerCase();
      
      // Try to extract name from URL path as fallback
      const match = iconUrl.match(/buddies\/([^/]+)\//i);
      if (match && match[1]) {
        return match[1].replace(/-/g, ' ').replace(/_/g, ' ')
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ') + ' Buddy';
      }
      
      return 'Gun Buddy';
    },
    
    async resolveBuddyName() {
      if (!this.weapon || !this.weapon.buddy_uuid) return;
      
      if (this.isLoadingBuddy) return;
      
      this.isLoadingBuddy = true;
      try {
        const buddyName = await buddyService.getBuddyNameByUUID(this.weapon.buddy_uuid);
        if (buddyName) {
          this.resolvedBuddyName = buddyName;
        }
      } catch (error) {
        console.error('Failed to resolve buddy name:', error);
      } finally {
        this.isLoadingBuddy = false;
      }
    },
    
    handleMouseEnter(event) {
      if (this.weapon) {
        this.showTooltip = true;
        this.updateTooltipPosition(event);
        
        // Try to resolve buddy name when tooltip is shown
        if (this.weapon.buddy_uuid && !this.resolvedBuddyName && !this.isLoadingBuddy) {
          this.resolveBuddyName();
        }
      }
    },
    
    handleMouseLeave() {
      this.showTooltip = false;
    },
    
    handleMouseMove(event) {
      if (this.showTooltip) {
        this.updateTooltipPosition(event);
      }
    },
    
    updateTooltipPosition(event) {
      const rect = this.$el.getBoundingClientRect();
      const tooltipOffset = 10;
      
      this.tooltipX = event.clientX - rect.left + tooltipOffset;
      this.tooltipY = event.clientY - rect.top - 40;
      
      const maxX = rect.width - 150;
      if (this.tooltipX > maxX) {
        this.tooltipX = maxX;
      }
      
      if (this.tooltipY < 0) {
        this.tooltipY = event.clientY - rect.top + 20;
      }
    }
  },
  watch: {
    weapon: {
      immediate: true,
      handler(newWeapon) {
        this.resolvedBuddyName = null;
        if (newWeapon && newWeapon.buddy_uuid) {
          // Preload buddy name when weapon changes
          this.resolveBuddyName();
        }
      }
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
  overflow: visible; /* Changed to allow tooltip overflow */
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

/* Tooltip Styles */
.weapon-tooltip {
  position: absolute;
  background: linear-gradient(135deg, #1e2936 0%, #0f1923 100%);
  border: 2px solid var(--accent-gold);
  border-radius: 10px;
  padding: 8px 10px;
  color: var(--text-primary);
  font-size: 0.85rem;
  z-index: 1000;
  pointer-events: none;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
  min-width: 10px;
  backdrop-filter: blur(10px);
}

.tooltip-header {
  font-weight: 600;
  margin-bottom: 8px;
  color: #ffffff;
  font-size: 0.95rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 6px;
}

.tooltip-buddy {
  display: flex;
  gap: 8px;
  margin-bottom: 6px;
  align-items: center;
}

.buddy-label {
  color: var(--text-secondary);
  font-size: 0.8rem;
}

.buddy-name {
  color: var(--accent-gold);
  font-weight: 600;
  font-size: 0.85rem;
}

.tooltip-tier {
  display: flex;
  gap: 8px;
  align-items: center;
}

.tier-label {
  color: var(--text-secondary);
  font-size: 0.8rem;
}

.tier-value {
  font-weight: 600;
  font-size: 0.85rem;
}

/* Tooltip transition animation */
.tooltip-enter-active,
.tooltip-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.tooltip-enter-from,
.tooltip-leave-to {
  opacity: 0;
  transform: translateY(5px);
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
  bottom: -8px;
  right: -7px;
  width: 31px;
  height: 31px;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
  cursor: help;
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
  background-clip: text;
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

.tier-select,
.tier-value.tier-select {
  color: #0cebb8;
  background: rgba(12, 235, 184, 0.1);
}

.tier-deluxe,
.tier-value.tier-deluxe {
  color: #e04685;
  background: rgba(224, 70, 133, 0.1);
}

.tier-premium,
.tier-value.tier-premium {
  color: #d1548e;
  background: rgba(209, 84, 142, 0.1);
}

.tier-ultra,
.tier-value.tier-ultra {
  color: #ffd700;
  background: rgba(255, 215, 0, 0.1);
}

.tier-exclusive,
.tier-value.tier-exclusive {
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
  
  .weapon-tooltip {
    font-size: 0.75rem;
    min-width: 150px;
    padding: 8px 12px;
  }
}
</style>