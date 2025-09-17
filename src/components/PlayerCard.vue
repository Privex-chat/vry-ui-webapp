<template>
  <div :class="['player-card', teamClass, { 'has-rare': hasRareItems }]" @click="$emit('click', player)">
    <div v-if="hasRareItems" class="rare-indicator">
      {{ rareType }}
    </div>
    
    <img 
      :src="player.Agent || defaultAgentIcon" 
      :alt="playerName"
      class="agent-icon">
    
    <div class="player-info">
      <div class="player-name">{{ playerName }}</div>
      <div class="player-rank">Level {{ player.Level || 'N/A' }}</div>
      
      <div class="player-weapons">
        <div 
          v-for="weapon in displayWeapons" 
          :key="weapon.id"
          :class="['weapon-item', { 'rare-weapon': weapon.isRare }]"
          :title="weapon.fullName">
          <img v-if="weapon.icon" :src="weapon.icon" alt="" class="weapon-icon">
          <span>{{ weapon.shortName }}</span>
          <img v-if="weapon.buddy" :src="weapon.buddy" alt="Buddy" class="buddy-icon">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const PRIORITY_WEAPONS = {
  '9c82e19d-4575-0200-1a81-3eacf00cf872': 'Vandal',
  'ee8e8d15-496b-07ac-e5f6-8fae5d4c7b1a': 'Phantom',
  '29a0cfab-485b-f5d5-779a-b59f85e204a8': 'Classic',
  'e336c6b8-418d-9340-d77f-7a9e4cfe0702': 'Sheriff',
  '4ade7faa-4cf1-8376-95ef-39884480959b': 'Guardian',
  'c4883e50-4494-202c-3ec3-6b8a9284f00b': 'Marshal',
  'a03b24d3-4319-996d-0f8c-94bbfba1dfc7': 'Operator'
}

const RARE_SKINS = ['Kuronami', 'Prime', 'Reaver', 'Spectrum', 'Champions', 'Elderflame', 'Radiant Crisis', 'Protocol', 'RGX']

export default {
  name: 'PlayerCard',
  props: {
    player: {
      type: Object,
      required: true
    },
    team: {
      type: String,
      required: true,
      validator: value => ['ally', 'enemy', 'neutral'].includes(value)
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
    },
    
    teamClass() {
      if (this.team === 'neutral') return 'neutral-card'
      return this.team === 'ally' ? 'ally-card' : 'enemy-card'
    },
    
    displayWeapons() {
      if (!this.player.Weapons) return []
      
      const weapons = []
      const priorityOrder = ['Vandal', 'Phantom', 'Sheriff']
      
      // First, try to get priority weapons in order
      Object.entries(this.player.Weapons).forEach(([id, weapon]) => {
        const weaponType = PRIORITY_WEAPONS[id] || weapon.weapon || ''
        
        if (priorityOrder.includes(weaponType)) {
          const skinName = weapon.skinDisplayName || 'Default'
          const shortName = this.getShortenedSkinName(skinName, weaponType)
          
          weapons.push({
            id,
            weaponType,
            fullName: skinName,
            shortName,
            icon: weapon.skinDisplayIcon,
            buddy: weapon.buddy_displayIcon,
            isRare: this.isRareSkin(skinName),
            priority: priorityOrder.indexOf(weaponType)
          })
        }
      })
      
      // Sort by priority and take top 3
      return weapons
        .sort((a, b) => a.priority - b.priority)
        .slice(0, 3)
    },
    
    hasRareItems() {
      if (!this.player.Weapons) return false
      
      return Object.values(this.player.Weapons).some(weapon => {
        const skinName = weapon.skinDisplayName || ''
        return this.isRareSkin(skinName) || this.hasRGBBuddy(weapon)
      })
    },
    
    rareType() {
      if (!this.player.Weapons) return 'Rare'
      
      let hasRGB = false
      let hasExclusive = false
      
      Object.values(this.player.Weapons).forEach(weapon => {
        if (this.hasRGBBuddy(weapon)) hasRGB = true
        if (weapon.skinDisplayName && weapon.skinDisplayName.includes('Champions')) hasExclusive = true
      })
      
      if (hasRGB) return 'RGB'
      if (hasExclusive) return 'Exclusive'
      return 'Rare'
    }
  },
  
  methods: {
    getShortenedSkinName(fullName, weaponType) {
      // Remove weapon type from skin name
      let shortName = fullName.replace(weaponType, '').trim()
      
      // If it's default, just show weapon type
      if (shortName === '' || shortName.toLowerCase() === 'standard') {
        return weaponType
      }
      
      // Limit length for display
      if (shortName.length > 15) {
        const words = shortName.split(' ')
        return words[0] || weaponType
      }
      
      return shortName
    },
    
    isRareSkin(skinName) {
      if (!skinName) return false
      const lowerName = skinName.toLowerCase()
      return RARE_SKINS.some(rare => lowerName.includes(rare.toLowerCase()))
    },
    
    hasRGBBuddy(weapon) {
      return weapon.buddy_displayIcon && 
             (weapon.buddy_displayIcon.includes('fist_bump') || 
              weapon.buddy_displayIcon.includes('riot_buddy'))
    }
  }
}
</script>

<style scoped>
.player-card {
  background: var(--bg-card);
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.player-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, currentColor, transparent);
  opacity: 0;
  transition: opacity 0.3s;
}

.ally-card::before {
  color: var(--ally-color);
}

.enemy-card::before {
  color: var(--enemy-color);
}

.neutral-card::before {
  color: var(--accent-purple);
}

.player-card:hover::before {
  opacity: 1;
}

.ally-card:hover {
  border-color: var(--ally-color);
  transform: translateX(5px);
  box-shadow: 0 4px 20px rgba(0, 180, 216, 0.2);
}

.enemy-card:hover {
  border-color: var(--enemy-color);
  transform: translateX(-5px);
  box-shadow: 0 4px 20px rgba(255, 70, 85, 0.2);
}

.neutral-card:hover {
  border-color: var(--accent-purple);
  transform: translateY(-3px);
  box-shadow: 0 4px 20px rgba(189, 57, 68, 0.2);
}

.has-rare {
  background: linear-gradient(135deg, var(--bg-card), rgba(255, 215, 0, 0.1));
}

.agent-icon {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  background: var(--bg-secondary);
  padding: 4px;
  border: 2px solid var(--border-color);
  object-fit: cover;
}

.player-info {
  flex: 1;
}

.player-name {
  font-weight: 600;
  margin-bottom: 4px;
  font-size: 1.1rem;
}

.player-rank {
  color: var(--text-secondary);
  font-size: 0.85rem;
  margin-bottom: 8px;
}

.player-weapons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.weapon-item {
  background: var(--bg-secondary);
  border-radius: 6px;
  padding: 4px 8px;
  font-size: 0.75rem;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 4px;
  border: 1px solid var(--border-color);
  transition: all 0.3s;
  position: relative;
}

.weapon-item:hover {
  border-color: var(--accent-gold);
  color: var(--text-primary);
  transform: translateY(-2px);
}

.rare-weapon {
  background: linear-gradient(135deg, var(--bg-secondary), rgba(189, 57, 68, 0.2));
  border-color: var(--accent-purple);
}

.weapon-icon {
  width: 24px;
  height: 12px;
  opacity: 0.8;
  object-fit: contain;
}

.buddy-icon {
  width: 14px;
  height: 14px;
  margin-left: auto;
  filter: drop-shadow(0 0 2px rgba(255, 215, 0, 0.5));
}

.rare-indicator {
  position: absolute;
  top: 8px;
  right: 8px;
  background: linear-gradient(135deg, var(--accent-gold), var(--accent-purple));
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: bold;
  text-transform: uppercase;
  animation: pulse 2s infinite;
  z-index: 1;
}

@keyframes pulse {
  0%, 100% { 
    transform: scale(1); 
    box-shadow: 0 0 0 0 rgba(255, 215, 0, 0.4);
  }
  50% { 
    transform: scale(1.05); 
    box-shadow: 0 0 10px 5px rgba(255, 215, 0, 0.2);
  }
}
</style>