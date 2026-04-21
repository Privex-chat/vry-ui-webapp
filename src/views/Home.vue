<template>
  <div class="home">
    <!-- ═══════════════════════════ HERO ═══════════════════════════ -->
    <section class="hero-section">
      <div class="hero-bg-glow"></div>
      <div class="hero-inner">
        <div class="hero-content">
          <div class="hero-eyebrow">VALORANT Tracker</div>
          <h1 class="hero-title">
            Know Every
            <span class="gradient-text">Player.</span><br>
            Every Skin.
          </h1>
          <p class="hero-description">
            vRY reveals ranks, loadouts, skin tiers, and match intel in real-time —
            giving you the edge before the round even starts.
          </p>

          <div class="hero-actions">
            <a :href="vryhref || 'https://github.com/Privex-chat/vry-ui/releases/latest'" class="btn-primary-hero">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Download {{ version || 'Latest' }}
            </a>
            <a href="https://github.com/Privex-chat/vry-ui" target="_blank" class="btn-ghost-hero">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
              </svg>
              View on GitHub
            </a>
          </div>

          <p v-if="downloads" class="hero-social-proof">
            <span class="download-count">{{ downloads }}</span> total downloads
          </p>
        </div>

        <div class="hero-visual">
          <div class="hero-img-frame">
            <img src="assets/Example.png" alt="vRY UI screenshot" class="hero-screenshot">
            <div class="hero-img-glow"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════ LINKS BAR ═══════════════════════════ -->
    <div class="links-bar">
      <a href="https://github.com/Privex-chat/vry-ui" target="_blank" class="link-chip">
        <img src="assets/GitHub.png" alt="GitHub" class="link-chip-icon">
        GitHub Repository
      </a>
      <a href="https://discord.gg/HeTKed64Ka" target="_blank" class="link-chip">
        <img src="assets/Discord.png" alt="Discord" class="link-chip-icon">
        Join Discord
      </a>
      <router-link to="/matchLoadouts" class="link-chip live">
        <span class="live-indicator"></span>
        Live Match View
      </router-link>
    </div>

    <!-- ═══════════════════════════ FEATURES ═══════════════════════════ -->
    <section class="features-section" id="features">
      <div class="section-label">Features</div>
      <h2 class="section-heading">Everything you need to<br><span class="gradient-text">read the lobby.</span></h2>
      <p class="section-sub">Real-time data piped directly to you while you're in-game.</p>

      <div class="features-list">

        <div class="feature-block">
          <div class="feature-text">
            <div class="feature-tag">Rank Tracking</div>
            <h3>Peak Rank Analysis</h3>
            <p>"That Jett going 22/9 can't be Bronze 2!" — Correct, she used to be Gold 3.</p>
            <ul class="feature-points">
              <li>Detect boosted accounts in seconds</li>
              <li>View historical rank data for both teams</li>
              <li>Color-coded rank tiers for fast scanning</li>
            </ul>
          </div>
          <div class="feature-media">
            <img src="assets/PeakRank.png" alt="Peak Rank feature" class="feature-img">
          </div>
        </div>

        <div class="feature-block reverse">
          <div class="feature-text">
            <div class="feature-tag rare-tag">Skin Sniping</div>
            <h3>Advanced Skin Tracker</h3>
            <p>Efficiently beg for skins — vRY is not responsible if you get muted for being a twerp.</p>
            <ul class="feature-points">
              <li>Detect Kuronami, Reaver, Champions &amp; more</li>
              <li>Riot Gun Buddy RGB alert system</li>
              <li>Filter by skin tier threshold</li>
            </ul>
          </div>
          <div class="feature-media">
            <img src="assets/Skin.png" alt="Skin Tracking" class="feature-img">
          </div>
        </div>

        <div class="feature-block">
          <div class="feature-text">
            <div class="feature-tag">Statistics</div>
            <h3>Headshot Percentage</h3>
            <p>"WHY DO THEY KEEP ONE-SHOTTING ME?!" — 34% headshot rate, that's why.</p>
            <ul class="feature-points">
              <li>Color-coded accuracy indicators</li>
              <li>Real-time per-player accuracy</li>
              <li>Full team analysis at a glance</li>
            </ul>
          </div>
          <div class="feature-media">
            <img src="assets/HS.png" alt="Headshot Stats" class="feature-img">
          </div>
        </div>

        <div class="feature-block reverse">
          <div class="feature-text">
            <div class="feature-tag discord-tag">Discord RPC</div>
            <h3>Discord Rich Presence</h3>
            <p>Flex your live match status. Updates your activity card in real-time.</p>
            <ul class="feature-points">
              <li>Toggle on/off at any time</li>
              <li>Shows live score and map</li>
              <li>Match details displayed automatically</li>
            </ul>
          </div>
          <div class="feature-media">
            <img src="assets/rpc.png" alt="Discord RPC" class="feature-img">
          </div>
        </div>

        <div class="feature-block">
          <div class="feature-text">
            <div class="feature-tag">Team Info</div>
            <h3>Party Detection</h3>
            <p>Suspected that Reyna and Skye duo-queued? Now you know for certain.</p>
            <ul class="feature-points">
              <li>Color-coded party groupings</li>
              <li>Detects full stacks vs. solos</li>
              <li>Works for both teams</li>
            </ul>
          </div>
          <div class="feature-media">
            <img src="assets/Party.png" alt="Party Indicator" class="feature-img">
          </div>
        </div>

        <div class="feature-block reverse">
          <div class="feature-text">
            <div class="feature-tag">Performance</div>
            <h3>Win Rate Analysis</h3>
            <p>That low-ranked player? High winrate grinder. Now you know who to watch.</p>
            <ul class="feature-points">
              <li>Per-player win rate data</li>
              <li>See who's on a hot streak</li>
              <li>Both-team coverage</li>
            </ul>
          </div>
          <div class="feature-media">
            <img src="assets/WR.png" alt="Winrate" class="feature-img">
          </div>
        </div>

      </div>
    </section>

    <!-- ═══════════════════════════ TESTIMONIALS ═══════════════════════════ -->
    <section class="testimonials-section">
      <div class="section-label">Community</div>
      <h2 class="section-heading">What players say</h2>

      <div class="testimonials-grid">
        <div class="testimonial-card">
          <div class="tcard-quote">"</div>
          <img src="assets/Zombs.png" alt="Zombs" class="tcard-avatar">
          <p class="tcard-text">
            I used to live a sad life, begging for skins, wondering who owned that majestic Reaver Vandal.
            Thanks to vRY, I can now efficiently beg for skins!
          </p>
          <div class="tcard-author">
            <strong>Zombs</strong>
            <span>A Funny Person</span>
          </div>
        </div>

        <div class="testimonial-card">
          <div class="tcard-quote">"</div>
          <img src="assets/Ovo.png" alt="Ovo" class="tcard-avatar">
          <p class="tcard-text">
            Now I can flame smurfs more efficiently — by knowing exactly why the Level 2 Reyna is
            completely destroying me.
          </p>
          <div class="tcard-author">
            <strong>Ovo Simpático</strong>
            <span>Chief User Representative</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════ FOOTER / FOUNDERS ═══════════════════════════ -->
    <footer class="footer" id="founders">
      <!-- Developer -->
      <div class="footer-dev">
        <div class="footer-section-label">Developer</div>
        <div class="dev-card">
          <a href="https://github.com/Privex-chat" target="_blank">
            <img
              src="https://cdn.discordapp.com/avatars/1053965380957241344/54d94c23a849e37afccbcac448c1238d.png"
              alt="Sonix"
              class="dev-avatar"
            >
          </a>
          <div>
            <div class="dev-name">Sonix</div>
            <div class="dev-socials">
              <a href="https://github.com/Privex-chat" target="_blank" class="dev-social">
                <img src="assets/GitHub.png" alt="GitHub" class="dev-social-icon">
              </a>
              <a href="https://discord.com/users/1053965380957241344" target="_blank" class="dev-social">
                <img src="assets/Discord.png" alt="Discord" class="dev-social-icon">
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Founders -->
      <div class="footer-founders">
        <div class="footer-section-label">Founders</div>
        <div class="founders-row">
          <a href="https://github.com/zayKenyon" target="_blank" class="founder-card">
            <img src="https://avatars.githubusercontent.com/u/87788699?v=4" alt="Zay" class="founder-avatar">
            <span class="founder-name">Zay</span>
          </a>
          <a href="https://github.com/OwOHamper" target="_blank" class="founder-card">
            <img src="https://avatars.githubusercontent.com/u/74879467?v=4" alt="Hamper" class="founder-avatar">
            <span class="founder-name">Hamper</span>
          </a>
        </div>
      </div>

      <div class="footer-bottom">
        VALORANT Rank Yoinker is not affiliated with Riot Games.
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      version: '',
      vryhref: '',
      downloads: null,
    }
  },
  methods: {
    async getVersion() {
      try {
        const r = await fetch('https://api.github.com/repos/Privex-chat/vry-ui/releases')
        const data = await r.json()
        if (data?.length > 0) {
          this.version = data[0].tag_name
          this.vryhref = data[0].assets?.[0]?.browser_download_url || ''
          let total = 0
          data.forEach(release => release.assets.forEach(a => { total += a.download_count }))
          this.downloads = total.toLocaleString()
        }
      } catch {}
    }
  },
  mounted() {
    this.getVersion()
  }
}
</script>

<style scoped>
/* ─────────────────── HERO ─────────────────── */
.hero-section {
  position: relative;
  overflow: hidden;
  padding: 5rem 2rem 4rem;
  max-width: 1400px;
  margin: 0 auto;
}

.hero-bg-glow {
  position: absolute;
  top: -100px;
  left: 50%;
  transform: translateX(-50%);
  width: 700px;
  height: 400px;
  background: radial-gradient(ellipse, rgba(var(--accent-purple-rgb), 0.12) 0%, transparent 70%);
  pointer-events: none;
}

.hero-inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.hero-eyebrow {
  display: inline-block;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent-purple);
  background: rgba(var(--accent-purple-rgb), 0.1);
  border: 1px solid rgba(var(--accent-purple-rgb), 0.25);
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  margin-bottom: 1.25rem;
}

.hero-title {
  font-family: 'Rajdhani', sans-serif;
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 700;
  line-height: 1.05;
  margin-bottom: 1.25rem;
  color: var(--text-primary);
}

.hero-description {
  color: var(--text-secondary);
  font-size: 1.05rem;
  line-height: 1.7;
  margin-bottom: 2rem;
  max-width: 480px;
}

.hero-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}

.btn-primary-hero {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.85rem 1.75rem;
  background: var(--gradient-accent);
  color: white;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.95rem;
  text-decoration: none;
  transition: all 0.25s;
  border: none;
}

.btn-primary-hero:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-glow-purple);
  color: white;
}

.btn-ghost-hero {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.85rem 1.75rem;
  background: var(--bg-card);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.95rem;
  text-decoration: none;
  transition: all 0.25s;
}

.btn-ghost-hero:hover {
  border-color: var(--text-secondary);
  color: var(--text-primary);
  transform: translateY(-2px);
}

.hero-social-proof {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.download-count {
  color: var(--accent-gold);
  font-weight: 700;
  font-size: 1rem;
}

/* HERO IMAGE */
.hero-visual { position: relative; }

.hero-img-frame {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-lg);
}

.hero-screenshot {
  width: 100%;
  height: auto;
  display: block;
  transition: transform 0.4s ease;
}

.hero-img-frame:hover .hero-screenshot { transform: scale(1.02); }

.hero-img-glow {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(var(--accent-purple-rgb), 0.08), transparent 60%);
  pointer-events: none;
}

/* ─────────────────── LINKS BAR ─────────────────── */
.links-bar {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  padding: 0 2rem 3rem;
  flex-wrap: wrap;
}

.link-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.55rem 1.1rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 50px;
  color: var(--text-secondary);
  font-size: 0.88rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s;
}

.link-chip:hover {
  border-color: var(--border-color-hover);
  color: var(--text-primary);
  transform: translateY(-2px);
}

.link-chip.live {
  border-color: rgba(var(--accent-purple-rgb), 0.35);
  color: var(--accent-purple);
}

.link-chip.live:hover { background: rgba(var(--accent-purple-rgb), 0.08); }

.link-chip-icon {
  width: 18px;
  height: 18px;
  object-fit: contain;
}

.live-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--success-color);
  box-shadow: 0 0 8px var(--success-color);
  animation: livePulse 2s infinite;
}

/* ─────────────────── FEATURES SECTION ─────────────────── */
.features-section {
  padding: 2rem 2rem 5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.section-label {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent-purple);
  margin-bottom: 0.75rem;
}

.section-heading {
  font-family: 'Rajdhani', sans-serif;
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  font-weight: 700;
  line-height: 1.15;
  margin-bottom: 0.75rem;
  color: var(--text-primary);
}

.section-sub {
  color: var(--text-secondary);
  font-size: 1rem;
  margin-bottom: 3.5rem;
}

/* FEATURE BLOCKS */
.features-list { display: flex; flex-direction: column; gap: 2rem; }

.feature-block {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 2.5rem;
  transition: border-color 0.25s, box-shadow 0.25s;
}

.feature-block:hover {
  border-color: var(--border-color-hover);
  box-shadow: var(--shadow-md);
}

.feature-block.reverse {
  direction: rtl;
}
.feature-block.reverse > * { direction: ltr; }

.feature-tag {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0.2rem 0.65rem;
  border-radius: 5px;
  background: rgba(0, 180, 216, 0.12);
  color: var(--accent-blue);
  border: 1px solid rgba(0, 180, 216, 0.25);
  margin-bottom: 0.9rem;
}

.rare-tag {
  background: rgba(var(--accent-purple-rgb), 0.12);
  color: var(--accent-purple);
  border-color: rgba(var(--accent-purple-rgb), 0.25);
}

.discord-tag {
  background: rgba(88, 101, 242, 0.12);
  color: #5865F2;
  border-color: rgba(88, 101, 242, 0.25);
}

.feature-text h3 {
  font-family: 'Rajdhani', sans-serif;
  font-size: 1.65rem;
  font-weight: 700;
  margin-bottom: 0.6rem;
  color: var(--text-primary);
}

.feature-text p {
  color: var(--text-secondary);
  line-height: 1.65;
  margin-bottom: 1.25rem;
  font-size: 0.97rem;
}

.feature-points {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.feature-points li {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.feature-points li::before {
  content: '→';
  color: var(--accent-purple);
  font-weight: 700;
  flex-shrink: 0;
  margin-top: 0.05rem;
}

.feature-img {
  width: 100%;
  height: auto;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-md);
  display: block;
}

/* ─────────────────── TESTIMONIALS ─────────────────── */
.testimonials-section {
  padding: 3rem 2rem 5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.testimonials-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-top: 2.5rem;
}

.testimonial-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 18px;
  padding: 2rem;
  position: relative;
  transition: all 0.25s;
}

.testimonial-card:hover {
  border-color: var(--border-color-hover);
  box-shadow: var(--shadow-md);
  transform: translateY(-3px);
}

.tcard-quote {
  position: absolute;
  top: 1rem;
  right: 1.5rem;
  font-size: 3.5rem;
  color: var(--accent-purple);
  opacity: 0.2;
  font-family: Georgia, serif;
  line-height: 1;
}

.tcard-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 2.5px solid var(--border-color);
  margin-bottom: 1rem;
  display: block;
}

.tcard-text {
  color: var(--text-secondary);
  font-style: italic;
  line-height: 1.7;
  margin-bottom: 1.25rem;
  font-size: 0.93rem;
}

.tcard-author {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.tcard-author strong {
  color: var(--text-primary);
  font-size: 0.95rem;
}

.tcard-author span {
  color: var(--text-muted);
  font-size: 0.82rem;
}

/* ─────────────────── FOOTER ─────────────────── */
.footer {
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
  padding: 4rem 2rem 2rem;
  margin-top: 2rem;
}

.footer-section-label {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 1.25rem;
  text-align: center;
}

.footer-dev {
  text-align: center;
  margin-bottom: 3rem;
}

.dev-card {
  display: inline-flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1.25rem 2rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
}

.dev-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: 2.5px solid var(--border-color);
  display: block;
  transition: all 0.25s;
}

.dev-avatar:hover {
  border-color: var(--accent-purple);
  box-shadow: var(--shadow-glow-purple);
}

.dev-name {
  font-family: 'Rajdhani', sans-serif;
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 0.4rem;
}

.dev-socials { display: flex; gap: 0.5rem; }

.dev-social { display: inline-block; transition: transform 0.2s; }
.dev-social:hover { transform: translateY(-3px); }

.dev-social-icon { width: 22px; height: 22px; }

.footer-founders {
  text-align: center;
  margin-bottom: 3rem;
}

.founders-row {
  display: flex;
  justify-content: center;
  gap: 2rem;
}

.founder-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  transition: transform 0.25s;
}

.founder-card:hover { transform: translateY(-4px); }

.founder-avatar {
  width: 68px;
  height: 68px;
  border-radius: 50%;
  border: 2.5px solid var(--border-color);
  display: block;
  transition: border-color 0.25s, box-shadow 0.25s;
}

.founder-card:hover .founder-avatar {
  border-color: var(--accent-purple);
  box-shadow: var(--shadow-glow-purple);
}

.founder-name {
  color: var(--text-secondary);
  font-size: 0.88rem;
  font-weight: 500;
}

.footer-bottom {
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
  color: var(--text-muted);
  font-size: 0.83rem;
}

/* ─────────────────── ANIMATIONS ─────────────────── */
@keyframes livePulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.5; transform: scale(0.8); }
}

/* ─────────────────── RESPONSIVE ─────────────────── */
@media (max-width: 900px) {
  .hero-inner, .feature-block { grid-template-columns: 1fr; gap: 2rem; }
  .feature-block.reverse { direction: ltr; }
  .feature-img { max-width: 480px; margin: 0 auto; }
  .testimonials-grid { grid-template-columns: 1fr; }
  .hero-bg-glow { display: none; }
}

@media (max-width: 640px) {
  .hero-section { padding: 3rem 1rem 2rem; }
  .features-section, .testimonials-section { padding-left: 1rem; padding-right: 1rem; }
  .feature-block { padding: 1.5rem; }
  .links-bar { padding-bottom: 2rem; }
  .dev-card { flex-direction: column; text-align: center; }
  .dev-socials { justify-content: center; }
}
</style>
