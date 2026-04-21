<template>
  <div
    :class="['player-card', teamClass, { 'has-rare': hasRareItems }]"
    @click="$emit('click', player)"
    :title="`View ${playerName}'s loadout`"
  >
    <!-- Rare / special indicator badge -->
    <div v-if="hasRareItems" :class="['rare-indicator', rareType.toLowerCase()]">
      <span class="rare-dot"></span>
      {{ rareType }}
    </div>

    <!-- Agent avatar -->
    <div class="agent-container">
      <img
        :src="player.Agent || defaultAgentIcon"
        :alt="playerName"
        class="agent-icon"
        @error="e => e.target.src = defaultAgentIcon"
      >
    </div>

    <!-- Player info -->
    <div class="player-info">
      <div class="player-name">{{ playerName }}</div>
      <div class="player-meta">
        <span class="player-level">Lv. {{ player.Level || '?' }}</span>
        <span v-if="player.Title" class="player-title">{{ player.Title }}</span>
      </div>

      <!-- Weapon Skins row -->
      <div v-if="displayWeapons.length" class="player-weapons">
        <div
          v-for="weapon in displayWeapons"
          :key="weapon.id"
          :class="['weapon-tag', { 'weapon-rare': weapon.isRare, [`tier-${weapon.tier}`]: weapon.tier }]"
          :title="weapon.fullName"
        >
          <img v-if="weapon.icon" :src="weapon.icon" :alt="weapon.weaponType" class="weapon-tag-icon">
          <span class="weapon-tag-name">{{ weapon.shortName }}</span>
          <img v-if="weapon.buddy" :src="weapon.buddy" alt="buddy" class="weapon-buddy">
        </div>
      </div>
      <div v-else class="no-weapons">Default skins</div>
    </div>

    <!-- Arrow indicator -->
    <div class="card-arrow">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    </div>
  </div>
</template>

<script>
const PRIORITY_WEAPONS = {
  '9c82e19d-4575-0200-1a81-3eacf00cf872': 'Vandal',
  'ee8e8d15-496b-07ac-e5f6-8fae5d4c7b1a': 'Phantom',
  'e336c6b8-418d-9340-d77f-7a9e4cfe0702': 'Sheriff',
  '4ade7faa-4cf1-8376-95ef-39884480959b': 'Guardian',
  'c4883e50-4494-202c-3ec3-6b8a9284f00b': 'Marshal',
  'a03b24d3-4319-996d-0f8c-94bbfba1dfc7': 'Operator',
  '29a0cfab-485b-f5d5-779a-b59f85e204a8': 'Classic',
  'ae3de142-4d85-2547-dd26-4e90bed35cf7': 'Bulldog',
}

const RARE_SKINS = [
  'Kuronami','Prime','Reaver','Spectrum','Champions','Elderflame',
  'Radiant Crisis','Protocol','RGX','Glitchpop','Singularity',
  'Sentinels of Light','Forsaken','Ruination','Zedd','Ion',
  'Oni','Blastx','Neptun'
]

const TIER_MAP = {
  '0cebb8be-46d7-c12a-d306-e9907bfc5a25': 'select',
  'e046854e-406c-37f4-6607-19a9ba8426fc': 'deluxe',
  '60bca009-4182-7998-dee7-b8a2558dc369': 'premium',
  '12683d76-48d7-84a3-4e09-6985794f0445': 'ultra',
  '411e4a55-4e59-7757-41f0-86a53f101bb5': 'exclusive',
}

export default {
  name: 'PlayerCard',
  emits: ['click'],
  props: {
    player: { type: Object, required: true },
    team:   { type: String, required: true, validator: v => ['ally','enemy','neutral'].includes(v) }
  },
  data() {
    return { defaultAgentIcon: '/default_agent.png' }
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
      const priorityOrder = Object.values(PRIORITY_WEAPONS)

      Object.entries(this.player.Weapons).forEach(([id, weapon]) => {
        const weaponType = PRIORITY_WEAPONS[id] || weapon.weapon || ''
        if (!weaponType) return

        const skinName = weapon.skinDisplayName || 'Standard'
        const shortName = this.getShortName(skinName, weaponType)
        const tier = TIER_MAP[weapon.tier] || null

        weapons.push({
          id,
          weaponType,
          fullName: skinName,
          shortName,
          icon: weapon.skinDisplayIcon,
          buddy: weapon.buddy_displayIcon,
          isRare: this.isRareSkin(skinName),
          tier,
          priority: priorityOrder.indexOf(weaponType)
        })
      })

      return weapons
        .filter(w => w.priority !== -1)
        .sort((a, b) => a.priority - b.priority)
        .slice(0, 3)
    },
    hasRareItems() {
      if (!this.player.Weapons) return false
      return Object.values(this.player.Weapons).some(w =>
        this.isRareSkin(w.skinDisplayName || '') || this.hasRGBBuddy(w)
      )
    },
    rareType() {
      if (!this.player.Weapons) return 'Rare'
      let hasRGB = false, hasChampions = false, hasRare = false
      Object.values(this.player.Weapons).forEach(w => {
        if (this.hasRGBBuddy(w)) hasRGB = true
        if ((w.skinDisplayName || '').toLowerCase().includes('champions')) hasChampions = true
        if (this.isRareSkin(w.skinDisplayName || '')) hasRare = true
      })
      if (hasRGB) return 'RGB'
      if (hasChampions) return 'Exclusive'
      if (hasRare) return 'Rare'
      return 'Notable'
    }
  },
  methods: {
    getShortName(fullName, weaponType) {
      let n = fullName.replace(weaponType, '').replace('//Collection', '').trim()
      if (!n || n.toLowerCase() === 'standard') return weaponType
      return n.length > 14 ? n.split(' ').slice(0,2).join(' ') : n
    },
    isRareSkin(name) {
      if (!name) return false
      const lower = name.toLowerCase()
      return RARE_SKINS.some(r => lower.includes(r.toLowerCase()))
    },
    hasRGBBuddy(weapon) {
      if (!weapon.buddy_displayIcon) return false
      const u = weapon.buddy_displayIcon.toLowerCase()
      return u.includes('fist_bump') || u.includes('riot_buddy') || u.includes('riot_gun_buddy')
    }
  }
}
</script>

<style scoped>
.player-card {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.85rem 1rem;
  background: var(--bg-card);
  cursor: pointer;
  position: relative;
  transition: background 0.2s, padding-left 0.2s;
  overflow: hidden;
}

/* Left accent bar */
.player-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: transparent;
  transition: background 0.2s;
}

.ally-card::before   { background: var(--ally-color); opacity: 0.4; }
.enemy-card::before  { background: var(--enemy-color); opacity: 0.4; }
.neutral-card::before { background: var(--accent-purple); opacity: 0.4; }

.player-card:hover { background: var(--bg-card-hover); }

.ally-card:hover::before   { opacity: 1; }
.enemy-card:hover::before  { opacity: 1; }
.neutral-card:hover::before { opacity: 1; }

/* RARE HIGHLIGHT */
.has-rare {
  background: linear-gradient(90deg, var(--bg-card) 70%, rgba(255, 215, 0, 0.04) 100%);
}

/* RARE INDICATOR */
.rare-indicator {
  position: absolute;
  top: 0.5rem;
  right: 1.75rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.15rem 0.5rem;
  border-radius: 5px;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  z-index: 2;
}

.rare-indicator.rare      { background: rgba(var(--accent-purple-rgb), 0.2); color: var(--accent-purple); }
.rare-indicator.exclusive { background: rgba(255, 215, 0, 0.15); color: var(--accent-gold); }
.rare-indicator.rgb       { background: rgba(61, 220, 151, 0.15); color: var(--success-color); }
.rare-indicator.notable   { background: var(--bg-secondary); color: var(--text-secondary); }

.rare-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: currentColor;
  animation: pulse 2s infinite;
}

/* AGENT */
.agent-container {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 10px;
  overflow: hidden;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
}

.agent-icon {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* PLAYER INFO */
.player-info { flex: 1; min-width: 0; }

.player-name {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 0.2rem;
}

.player-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.player-level {
  font-size: 0.72rem;
  color: var(--text-muted);
  font-weight: 500;
}

.player-title {
  font-size: 0.7rem;
  color: var(--accent-gold);
  opacity: 0.8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;
}

/* WEAPON TAGS */
.player-weapons {
  display: flex;
  gap: 0.3rem;
  flex-wrap: nowrap;
  overflow: hidden;
}

.weapon-tag {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.2rem 0.5rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 5px;
  font-size: 0.7rem;
  color: var(--text-secondary);
  white-space: nowrap;
  max-width: 100px;
  overflow: hidden;
  transition: border-color 0.2s;
  flex-shrink: 0;
}

.weapon-tag:hover { border-color: var(--border-color-hover); color: var(--text-primary); }

.weapon-tag.weapon-rare {
  border-color: rgba(var(--accent-purple-rgb), 0.4);
  color: var(--accent-purple);
  background: rgba(var(--accent-purple-rgb), 0.06);
}

/* Tier-based coloring on tags */
.weapon-tag.tier-ultra {
  border-color: rgba(255, 215, 0, 0.35);
  color: var(--tier-ultra);
  background: var(--tier-ultra-bg);
}
.weapon-tag.tier-exclusive {
  border-color: rgba(255, 70, 85, 0.35);
  color: var(--tier-exclusive);
  background: var(--tier-exclusive-bg);
}

.weapon-tag-icon {
  width: 22px;
  height: 11px;
  object-fit: contain;
  opacity: 0.8;
  flex-shrink: 0;
}

.weapon-tag-name {
  overflow: hidden;
  text-overflow: ellipsis;
}

.weapon-buddy {
  width: 13px;
  height: 13px;
  object-fit: contain;
  flex-shrink: 0;
  margin-left: auto;
}

.no-weapons {
  font-size: 0.72rem;
  color: var(--text-muted);
  font-style: italic;
}

/* ARROW */
.card-arrow {
  flex-shrink: 0;
  color: var(--text-muted);
  opacity: 0;
  transform: translateX(-4px);
  transition: opacity 0.2s, transform 0.2s;
}

.player-card:hover .card-arrow {
  opacity: 1;
  transform: translateX(0);
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.4; }
}
</style>
