<template>
  <div
    :class="['weapon-slot', {
      'has-weapon': !!weapon,
      'is-rare': isRareSkin,
      'is-melee': isMelee,
      'has-rgb': hasRGBBuddy
    }]"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <!-- Tooltip (portal-like, fixed position) -->
    <teleport to="body">
      <transition name="tooltip-fade">
        <div
          v-if="showTooltip && tooltipContent && weapon"
          class="weapon-tooltip-portal"
          :style="{ left: tooltipPos.x + 'px', top: tooltipPos.y + 'px' }"
        >
          <div v-if="resolvedBuddyName || weapon.buddy_displayIcon" class="tooltip-row">
            <span class="tooltip-label">Buddy</span>
            <span class="tooltip-value tooltip-buddy-name">{{ resolvedBuddyName || 'Gun Buddy' }}</span>
          </div>
          <div v-if="skinTier" class="tooltip-row">
            <span class="tooltip-label">Tier</span>
            <span :class="['tooltip-value', `tier-${skinTier.name}`]">{{ skinTier.label }}</span>
          </div>
          <div v-if="weapon.skinDisplayName" class="tooltip-row">
            <span class="tooltip-label">Skin</span>
            <span class="tooltip-value">{{ weapon.skinDisplayName }}</span>
          </div>
        </div>
      </transition>
    </teleport>

    <!-- Empty State -->
    <div v-if="!weapon" class="slot-empty">
      <span class="slot-type">{{ weaponType }}</span>
      <span class="slot-dash">—</span>
    </div>

    <!-- Weapon Present -->
    <div v-else class="slot-content">
      <!-- Tier accent line -->
      <div v-if="skinTier" :class="['tier-accent', `tier-${skinTier.name}`]"></div>

      <!-- Rare badge -->
      <span v-if="isRareSkin || hasRGBBuddy" :class="['rare-badge', { 'rgb-badge': hasRGBBuddy }]">
        {{ hasRGBBuddy ? 'RGB' : 'RARE' }}
      </span>

      <!-- Weapon image -->
      <div :class="['slot-image-wrap', { melee: isMelee }]">
        <img
          v-if="weapon.skinDisplayIcon"
          :src="weapon.skinDisplayIcon"
          :alt="weapon.skinDisplayName || weaponType"
          class="slot-weapon-img"
          @error="e => e.target.style.display='none'"
        >
        <div v-else class="slot-img-placeholder">{{ weaponType }}</div>

        <!-- Gun buddy -->
        <div v-if="weapon.buddy_displayIcon" class="buddy-wrap" :title="resolvedBuddyName || 'Gun Buddy'">
          <img
            :src="weapon.buddy_displayIcon"
            :class="['buddy-img', { 'rgb-buddy': hasRGBBuddy }]"
            alt="buddy"
          >
        </div>
      </div>

      <!-- Text info -->
      <div class="slot-info">
        <div :class="['slot-skin-name', { 'is-rare-name': isRareSkin }]">
          {{ getSkinDisplayName() }}
        </div>
        <div class="slot-weapon-type">{{ weaponType }}</div>
        <span v-if="skinTier" :class="['tier-badge', `tier-${skinTier.name}`]">
          {{ skinTier.label }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { buddyService } from '@/services/buddyService'

const RARE_SKINS = [
  'Kuronami','Prime','Reaver','Spectrum','Champions','Elderflame',
  'Radiant Crisis','Protocol','RGX','Glitchpop','Singularity',
  'Sentinels of Light','Forsaken','Ruination','Zedd','Ion',
  'Blastx','Neptun','Oni','Origin'
]

const TIER_MAP = {
  '0cebb8be-46d7-c12a-d306-e9907bfc5a25': { name: 'select',    label: 'Select Edition' },
  'e046854e-406c-37f4-6607-19a9ba8426fc': { name: 'deluxe',    label: 'Deluxe Edition' },
  '60bca009-4182-7998-dee7-b8a2558dc369': { name: 'premium',   label: 'Premium Edition' },
  '12683d76-48d7-84a3-4e09-6985794f0445': { name: 'ultra',     label: 'Ultra Edition' },
  '411e4a55-4e59-7757-41f0-86a53f101bb5': { name: 'exclusive', label: 'Exclusive Edition' },
}

export default {
  name: 'WeaponSlot',
  props: {
    weapon:     { type: Object, default: null },
    weaponType: { type: String, required: true },
    isMelee:    { type: Boolean, default: false }
  },
  data() {
    return {
      showTooltip: false,
      tooltipPos: { x: 0, y: 0 },
      resolvedBuddyName: null,
      isLoadingBuddy: false
    }
  },
  computed: {
    isRareSkin() {
      if (!this.weapon?.skinDisplayName) return false
      const lower = this.weapon.skinDisplayName.toLowerCase()
      return RARE_SKINS.some(r => lower.includes(r.toLowerCase()))
    },
    hasRGBBuddy() {
      if (!this.weapon?.buddy_displayIcon) return false
      const u = this.weapon.buddy_displayIcon.toLowerCase()
      return u.includes('fist_bump') || u.includes('riot_buddy') || u.includes('riot_gun_buddy')
    },
    skinTier() {
      if (!this.weapon?.tier) return null
      return TIER_MAP[this.weapon.tier] || null
    },
    tooltipContent() {
      return !!(this.weapon && (this.resolvedBuddyName || this.weapon.buddy_displayIcon || this.skinTier))
    }
  },
  methods: {
    getSkinDisplayName() {
      if (!this.weapon?.skinDisplayName) return 'Standard'
      let n = this.weapon.skinDisplayName.replace(this.weaponType, '').replace('Collection', '').trim()
      return (!n || n.toLowerCase() === 'standard') ? 'Standard' : n
    },
    handleMouseEnter(event) {
      if (!this.weapon) return
      this.showTooltip = true
      this.updateTooltipPos(event)
      if (this.weapon.buddy_uuid && !this.resolvedBuddyName && !this.isLoadingBuddy) {
        this.resolveBuddyName()
      }
    },
    handleMouseLeave() {
      this.showTooltip = false
    },
    updateTooltipPos(event) {
      const TOOLTIP_W = 220
      const TOOLTIP_H = 90
      const MARGIN    = 12

      let x = event.clientX + MARGIN
      let y = event.clientY - TOOLTIP_H / 2

      if (x + TOOLTIP_W > window.innerWidth - MARGIN) {
        x = event.clientX - TOOLTIP_W - MARGIN
      }
      if (y < MARGIN) y = MARGIN
      if (y + TOOLTIP_H > window.innerHeight - MARGIN) {
        y = window.innerHeight - TOOLTIP_H - MARGIN
      }

      this.tooltipPos = { x, y }
    },
    async resolveBuddyName() {
      if (!this.weapon?.buddy_uuid || this.isLoadingBuddy) return
      this.isLoadingBuddy = true
      try {
        const name = await buddyService.getBuddyNameByUUID(this.weapon.buddy_uuid)
        if (name) this.resolvedBuddyName = name
      } catch (e) {
        console.error('Failed to resolve buddy:', e)
      } finally {
        this.isLoadingBuddy = false
      }
    }
  },
  watch: {
    weapon: {
      immediate: true,
      handler(w) {
        this.resolvedBuddyName = null
        if (w?.buddy_uuid) this.resolveBuddyName()
      }
    }
  }
}
</script>

<style scoped>
/* SLOT BASE */
.weapon-slot {
  position: relative;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  transition: border-color 0.2s, background 0.2s, transform 0.15s;
  overflow: hidden;
}

.weapon-slot:hover {
  border-color: var(--border-color-hover);
  transform: translateX(2px);
}

.weapon-slot.is-rare {
  border-color: rgba(var(--accent-purple-rgb), 0.3);
  background: linear-gradient(90deg, var(--bg-secondary), rgba(var(--accent-purple-rgb), 0.05));
}

.weapon-slot.has-rgb {
  border-color: rgba(255, 215, 0, 0.3);
  background: linear-gradient(90deg, var(--bg-secondary), rgba(255, 215, 0, 0.04));
}

/* TIER ACCENT LINE */
.tier-accent {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
}
.tier-accent.tier-select    { background: var(--tier-select); }
.tier-accent.tier-deluxe    { background: var(--tier-deluxe); }
.tier-accent.tier-premium   { background: var(--tier-premium); }
.tier-accent.tier-ultra     { background: var(--tier-ultra); }
.tier-accent.tier-exclusive { background: var(--tier-exclusive); }

/* EMPTY */
.slot-empty {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.55rem 0.75rem;
  opacity: 0.3;
}
.slot-type { font-size: 0.8rem; color: var(--text-secondary); }
.slot-dash { font-size: 0.85rem; color: var(--text-muted); }

/* CONTENT */
.slot-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
}

/* IMAGE WRAP */
.slot-image-wrap {
  position: relative;
  width: 90px;
  height: 44px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.slot-image-wrap.melee {
  width: 50px;
  height: 50px;
}

.slot-weapon-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 1px 4px rgba(0,0,0,0.4));
  display: block;
}

.slot-img-placeholder {
  font-size: 0.7rem;
  color: var(--text-muted);
}

/* BUDDY */
.buddy-wrap {
  position: absolute;
  bottom: -4px;
  right: -6px;
  z-index: 2;
}

.buddy-img {
  width: 28px;
  height: 28px;
  object-fit: contain;
  filter: drop-shadow(0 1px 3px rgba(0,0,0,0.5));
  display: block;
}

.buddy-img.rgb-buddy {
  filter: drop-shadow(0 0 6px rgba(255, 215, 0, 0.7));
}

/* RARE BADGE */
.rare-badge {
  position: absolute;
  top: 4px;
  right: 4px;
  padding: 1px 5px;
  border-radius: 4px;
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  background: rgba(var(--accent-purple-rgb), 0.2);
  color: var(--accent-purple);
  border: 1px solid rgba(var(--accent-purple-rgb), 0.3);
}

.rgb-badge {
  background: rgba(255, 215, 0, 0.15);
  color: var(--accent-gold);
  border-color: rgba(255, 215, 0, 0.3);
}

/* SLOT INFO */
.slot-info {
  flex: 1;
  min-width: 0;
}

.slot-skin-name {
  font-weight: 600;
  font-size: 0.82rem;
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 0.15rem;
}

.slot-skin-name.is-rare-name {
  background: var(--gradient-accent);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.slot-weapon-type {
  font-size: 0.7rem;
  color: var(--text-muted);
  margin-bottom: 0.25rem;
}

/* TIER BADGE */
.tier-badge {
  display: inline-block;
  padding: 0.1rem 0.45rem;
  border-radius: 4px;
  font-size: 0.62rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.tier-badge.tier-select    { color: var(--tier-select);    background: var(--tier-select-bg);    border: 1px solid var(--tier-select); }
.tier-badge.tier-deluxe    { color: var(--tier-deluxe);    background: var(--tier-deluxe-bg);    border: 1px solid var(--tier-deluxe); }
.tier-badge.tier-premium   { color: var(--tier-premium);   background: var(--tier-premium-bg);   border: 1px solid var(--tier-premium); }
.tier-badge.tier-ultra     { color: var(--tier-ultra);     background: var(--tier-ultra-bg);     border: 1px solid var(--tier-ultra); }
.tier-badge.tier-exclusive { color: var(--tier-exclusive); background: var(--tier-exclusive-bg); border: 1px solid var(--tier-exclusive); }
</style>

<!-- TOOLTIP — global (not scoped) since it portals to body -->
<style>
.weapon-tooltip-portal {
  position: fixed;
  z-index: 9999;
  background: var(--bg-card, #1e1e1e);
  border: 1px solid var(--border-color, #2a2a2a);
  border-radius: 10px;
  padding: 0.6rem 0.85rem;
  min-width: 180px;
  max-width: 240px;
  box-shadow: 0 16px 48px rgba(0,0,0,0.5);
  pointer-events: none;
  backdrop-filter: blur(12px);
}

.tooltip-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  line-height: 1.5;
}

.tooltip-label {
  color: var(--text-muted, #666);
  font-size: 0.72rem;
  width: 36px;
  flex-shrink: 0;
}

.tooltip-value {
  color: var(--text-primary, #f0f0f0);
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tooltip-buddy-name { color: var(--accent-gold, #ffd700); }

.tooltip-value.tier-select    { color: var(--tier-select,    #0cebb8); }
.tooltip-value.tier-deluxe    { color: var(--tier-deluxe,    #e04685); }
.tooltip-value.tier-premium   { color: var(--tier-premium,   #d1548e); }
.tooltip-value.tier-ultra     { color: var(--tier-ultra,     #ffd700); }
.tooltip-value.tier-exclusive { color: var(--tier-exclusive, #ff4655); }

.tooltip-fade-enter-active { animation: tooltipIn 0.15s ease; }
.tooltip-fade-leave-active { animation: tooltipIn 0.1s ease reverse; }

@keyframes tooltipIn {
  from { opacity: 0; transform: translateY(4px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
</style>
