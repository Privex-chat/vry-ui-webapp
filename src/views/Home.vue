<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-container">
        <div class="hero-content">
          <h1>VALORANT Rank Yoinker</h1>
          <p class="hero-intro">
            Discover VALORANT players' ranks, loadouts, and skins in real-time.  
            Stay informed and explore match insights as you play.
          </p>
          <div class="cta-buttons">
            <a 
              :href="vryhref || 'https://github.com/zayKenyon/VALORANT-rank-yoinker/releases/latest'" 
              class="btn-primary"
            >
              <span>Download {{ version || 'Now' }}</span>
            </a>
            <a 
              href="https://github.com/zayKenyon/VALORANT-rank-yoinker" 
              target="_blank"
              class="btn-secondary"
            >
              <span>View on GitHub</span>
            </a>
          </div>
          <p class="download-count" v-if="downloads">
            <span class="count-badge">{{ downloads }}</span> downloads and counting
          </p>
        </div>
        <div class="hero-visual">
          <img src="assets/Example.png" alt="VRY Screenshot" class="hero-image">
        </div>
      </div>
    </section>

    <!-- Quick Links -->
    <section class="quick-links">
      <div class="links-container">
        <a href="https://github.com/zayKenyon/VALORANT-rank-yoinker" target="_blank" class="quick-link-card">
          <img src="assets/GitHub.png" alt="GitHub" class="link-icon">
          <span>GitHub Repository</span>
        </a>
        <a href="https://discord.gg/HeTKed64Ka" target="_blank" class="quick-link-card">
          <img src="assets/Discord.png" alt="Discord" class="link-icon">
          <span>Join Discord</span>
        </a>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section" id="features">
      <div class="section-header">
        <h2 class="section-title">Key Features</h2>
        <p class="section-subtitle">Tools to explore player stats, ranks, and cosmetics</p>
      </div>

      <!-- Peak Rank Feature -->
      <div class="feature-card">
        <div class="feature-content">
          <span class="feature-badge">RANK TRACKING</span>
          <h3>Peak Rank Analysis</h3>
          <p class="feature-description">
            "That Jett who is going 22/9 can't be Bronze 2!" 
            Correct, she used to be Gold 3.
          </p>
          <ul class="feature-list">
            <li>
              <span class="check-icon">✓</span>
              <span>Detect boosted accounts instantly</span>
            </li>
            <li>
              <span class="check-icon">✓</span>
              <span>Works for both teams</span>
            </li>
            <li>
              <span class="check-icon">✓</span>
              <span>Historical rank data</span>
            </li>
          </ul>
        </div>
        <div class="feature-visual">
          <img src="assets/PeakRank.png" alt="Peak Rank" class="ui-image">
        </div>
      </div>

      <!-- Skin Tracking Feature -->
      <div class="feature-card reverse">
        <div class="feature-content">
          <span class="feature-badge rare">SKIN SNIPING</span>
          <h3>Advanced Skin Tracking</h3>
          <p class="feature-description">
            Now you can efficiently beg for skins! 
            <small>Note: vRY is not responsible if you get muted for being a twerp.</small>
          </p>
          <ul class="feature-list">
            <li>
              <span class="check-icon">✓</span>
              <span>Find rare skins instantly</span>
            </li>
            <li>
              <span class="check-icon">✓</span>
              <span>Gun buddy detection</span>
            </li>
            <li>
              <span class="check-icon">✓</span>
              <span>Both team visibility</span>
            </li>
          </ul>
        </div>
        <div class="feature-visual">
          <img src="assets/Skin.png" alt="Skin Tracking" class="ui-image">
        </div>
      </div>

      <!-- Headshot Percentage -->
      <div class="feature-card">
        <div class="feature-content">
          <span class="feature-badge">STATISTICS</span>
          <h3>Headshot Percentage</h3>
          <p class="feature-description">
            "WHY DO THEY KEEP ONE-SHOTTING ME?! 
            Oh, they've got a 34% headshot percentage..."
          </p>
          <ul class="feature-list">
            <li>
              <span class="check-icon">✓</span>
              <span>Color-coded skill indicators</span>
            </li>
            <li>
              <span class="check-icon">✓</span>
              <span>Real-time accuracy tracking</span>
            </li>
            <li>
              <span class="check-icon">✓</span>
              <span>Comprehensive team analysis</span>
            </li>
          </ul>
        </div>
        <div class="feature-visual">
          <img src="assets/HS.png" alt="Headshot Stats" class="ui-image">
        </div>
      </div>

      <!-- Discord RPC -->
      <div class="feature-card reverse">
        <div class="feature-content">
          <span class="feature-badge discord">DISCORD RPC</span>
          <h3>Discord Rich Presence</h3>
          <p class="feature-description">
            Updates your Discord Game Activity to reflect your match in real-time.
          </p>
          <ul class="feature-list">
            <li>
              <span class="check-icon">✓</span>
              <span>Toggleable status updates</span>
            </li>
            <li>
              <span class="check-icon">✓</span>
              <span>Live score tracking</span>
            </li>
            <li>
              <span class="check-icon">✓</span>
              <span>Match details display</span>
            </li>
          </ul>
        </div>
        <div class="feature-visual">
          <img src="assets/rpc.png" alt="Discord RPC" class="ui-image">
        </div>
      </div>

      <!-- Party Indicator -->
      <div class="feature-card">
        <div class="feature-content">
          <span class="feature-badge">TEAM INFO</span>
          <h3>Party Detection</h3>
          <p class="feature-description">
            Have you ever suspected that the Reyna and Skye who constantly drop for each other are queued? 
            Now you can tell for certain.
          </p>
          <ul class="feature-list">
            <li>
              <span class="check-icon">✓</span>
              <span>Color-coded party indicators</span>
            </li>
            <li>
              <span class="check-icon">✓</span>
              <span>Works for both teams</span>
            </li>
            <li>
              <span class="check-icon">✓</span>
              <span>Stack detection</span>
            </li>
          </ul>
        </div>
        <div class="feature-visual">
          <img src="assets/Party.png" alt="Party Indicator" class="ui-image">
        </div>
      </div>

      <!-- Winrate -->
      <div class="feature-card reverse">
        <div class="feature-content">
          <span class="feature-badge">PERFORMANCE</span>
          <h3>Win Rate Analysis</h3>
          <p class="feature-description">
            Wondering why that low ranked player is in your lobby? 
            It's because they have a high winrate % (good for them).
          </p>
          <ul class="feature-list">
            <li>
              <span class="check-icon">✓</span>
              <span>See who's grinding ranked</span>
            </li>
            <li>
              <span class="check-icon">✓</span>
              <span>Performance metrics</span>
            </li>
            <li>
              <span class="check-icon">✓</span>
              <span>Both team analysis</span>
            </li>
          </ul>
        </div>
        <div class="feature-visual">
          <img src="assets/WR.png" alt="Winrate" class="ui-image">
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="testimonials-section">
      <div class="section-header">
        <h2 class="section-title">What Players Say</h2>
        <p class="section-subtitle">Real feedback from the community</p>
      </div>
      
      <div class="testimonials-grid">
        <div class="testimonial-card">
          <div class="quote-mark">"</div>
          <img src="assets/Zombs.png" alt="Zombs" class="testimonial-avatar">
          <p class="testimonial-content">
            I used to live a sad life, begging for skins, wondering who owned that 
            majestically beautiful Reaver Vandal, but now, thanks to vRY my life is 
            a lot better - I can now efficiently beg for skins!
          </p>
          <div class="testimonial-author">
            <strong>Zombs</strong>
            <span class="author-role">A Funny Person</span>
          </div>
        </div>
        
        <div class="testimonial-card">
          <div class="quote-mark">"</div>
          <img src="assets/Ovo.png" alt="Ovo" class="testimonial-avatar">
          <p class="testimonial-content">
            Now I can flame the smurfs more efficiently, by knowing why the Level 2 
            instalock Reyna is completely DESTROYING me.
          </p>
          <div class="testimonial-author">
            <strong>Ovo Simpático</strong>
            <span class="author-role">'Chief User Representative'</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer" id="founders">
      <div class="footer-content">
        <div class="founders-section">
          <h2 class="footer-title">Meet the Founders</h2>
          <div class="founders-grid">
            <a href="https://github.com/zayKenyon" target="_blank" class="founder-card">
              <img 
                src="https://avatars.githubusercontent.com/u/87788699?v=4" 
                alt="Zay" 
                class="founder-avatar"
              >
              <div class="founder-info">
                <div class="founder-name">Zay</div>
              </div>
            </a>
            
            <a href="https://github.com/OwOHamper" target="_blank" class="founder-card">
              <img 
                src="https://avatars.githubusercontent.com/u/74879467?v=4" 
                alt="Hamper" 
                class="founder-avatar"
              >
              <div class="founder-info">
                <div class="founder-name">Hamper</div>
              </div>
            </a>
          </div>
        </div>

        
        <div class="footer-bottom">
          <p>VALORANT Rank Yoinker is Not affiliated with Riot Games.</p>
        </div>
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
      downloads: null
    }
  },
  methods: {
    async getVersion() {
      try {
        const response = await fetch('https://api.github.com/repos/isaacKenyon/VALORANT-rank-yoinker/releases')
        const data = await response.json()

        if (data && data.length > 0) {
          // latest version
          this.version = data[0].tag_name
          this.vryhref = data[0].assets[0]?.browser_download_url

          // calculate total downloads across all releases
          let downloads_count = 0
          for (let release of data) {
            for (let asset of release.assets) {
              downloads_count += asset.download_count
            }
          }

          this.downloads = downloads_count.toLocaleString() // formatted with commas
        }
      } catch (error) {
        console.error('Failed to fetch version or downloads:', error)
      }
    }
  },
  mounted() {
    this.getVersion()
  }
}
</script>


<style scoped>
/* Hero Section */
.hero-section {
  padding: 4rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.hero-container {
  background: var(--bg-secondary);
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  border: 1px solid var(--border-color);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
  backdrop-filter: blur(10px);
  background: linear-gradient(135deg, 
    rgba(var(--bg-secondary-rgb), 0.9), 
    rgba(var(--bg-card-rgb), 0.9));
}

.hero-content h1 {
  font-size: 3.5rem;
  margin-bottom: 1rem;
  background: var(--gradient-accent);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.1;
  font-weight: 800;
}

.hero-intro {
  color: var(--text-secondary);
  font-size: 1.25rem;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}

.btn-primary, .btn-secondary {
  padding: 1rem 2rem;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  text-decoration: none;
  display: inline-block;
  position: relative;
  overflow: hidden;
}

.btn-primary {
  background: var(--gradient-accent);
  color: white;
  border: none;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(0, 180, 216, 0.4);
}

.btn-secondary {
  background: transparent;
  color: var(--text-primary);
  border: 2px solid var(--border-color);
}

.btn-secondary:hover {
  background: var(--bg-card);
  border-color: var(--accent-purple);
  transform: translateY(-2px);
}

.download-count {
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.count-badge {
  color: var(--accent-gold);
  font-weight: bold;
  font-size: 1.1rem;
}

.hero-image {
  width: 100%;
  height: auto;
  border-radius: 15px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s;
  border: 2px solid var(--border-color);
}

.hero-image:hover {
  transform: scale(1.05) rotate(1deg);
}

/* Quick Links */
.quick-links {
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
}

.links-container {
  display: flex;
  gap: 2rem;
  justify-content: center;
}

.quick-link-card {
  background: var(--bg-card);
  padding: 1.5rem 2rem;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  gap: 1rem;
  text-decoration: none;
  color: var(--text-primary);
  transition: all 0.3s;
  flex: 1;
}

.quick-link-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  border-color: var(--accent-purple);
}

.link-icon {
  width: 30px;
  height: 30px;
}

/* Features Section */
.features-section {
  padding: 4rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-title {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.section-subtitle {
  color: var(--text-secondary);
  font-size: 1.1rem;
}

.feature-card {
  background: var(--bg-card);
  border-radius: 20px;
  padding: 2.5rem;
  margin-bottom: 2rem;
  border: 1px solid var(--border-color);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
  transition: all 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  border-color: var(--ally-color);
}

.feature-card.reverse {
  direction: rtl;
}

.feature-card.reverse > * {
  direction: ltr;
}

.feature-badge {
  display: inline-block;
  padding: 0.3rem 0.8rem;
  background: var(--ally-color);
  color: white;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: bold;
  letter-spacing: 1px;
  margin-bottom: 1rem;
}

.feature-badge.rare {
  background: linear-gradient(135deg, var(--accent-gold), var(--accent-purple));
}

.feature-badge.discord {
  background: #5865F2;
}

.feature-content h3 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.feature-description {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
}

.feature-description small {
  display: block;
  margin-top: 0.5rem;
  opacity: 0.8;
  font-size: 0.9rem;
}

.feature-list {
  list-style: none;
  padding: 0;
}

.feature-list li {
  padding: 0.75rem 0;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.feature-list li:last-child {
  border-bottom: none;
}

.check-icon {
  color: var(--success-color);
  font-weight: bold;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.feature-image {
  width: 60%;
  height: 100%;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  border: 1px solid var(--border-color);
}

/* Testimonials */
.testimonials-section {
  padding: 4rem 2rem;
  background: var(--bg-secondary);
  border-radius: 20px;
  margin: 2rem auto;
  max-width: 1400px;
}

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
}

.testimonial-card {
  background: var(--bg-card);
  padding: 2rem;
  border-radius: 16px;
  border: 1px solid var(--border-color);
  position: relative;
  transition: all 0.3s;
}

.testimonial-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
}

.quote-mark {
  position: absolute;
  top: 1rem;
  right: 1.5rem;
  font-size: 3rem;
  color: var(--accent-purple);
  opacity: 0.3;
  font-family: Georgia, serif;
}

.testimonial-avatar {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  margin-bottom: 1rem;
  border: 3px solid var(--accent-purple);
}

.testimonial-content {
  color: var(--text-secondary);
  font-style: italic;
  margin-bottom: 1.5rem;
  line-height: 1.7;
}

.testimonial-author {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.testimonial-author strong {
  color: var(--text-primary);
  font-size: 1.1rem;
}

.author-role {
  color: var(--text-secondary);
  font-size: 0.9rem;
  opacity: 0.8;
}

/* Footer */
.footer {
  background: var(--header-bg);
  padding: 4rem 2rem 2rem;
  margin-top: 4rem;
  border-top: 2px solid var(--border-color);
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
}

.footer-title {
  text-align: center;
  color: var(--text-primary);
  margin-bottom: 3rem;
  font-size: 2rem;
}

.founders-grid {
  display: flex;
  justify-content: center;
  gap: 4rem;
  margin-bottom: 3rem;
}

.founder-card {
  text-align: center;
  text-decoration: none;
  transition: transform 0.3s;
}

.founder-card:hover {
  transform: scale(1.1);
}

.founder-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 3px solid var(--accent-purple);
  margin-bottom: 1rem;
  transition: all 0.3s;
}

.founder-avatar:hover {
  box-shadow: 0 0 30px rgba(255, 70, 85, 0.5);
  border-color: var(--accent-gold);
}

.founder-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.founder-name {
  color: var(--text-primary);
  font-weight: 600;
  font-size: 1.2rem;
}

.founder-role {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin: 3rem 0;
  padding: 2rem 0;
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
}

.footer-link {
  background: var(--bg-card);
  padding: 1rem 2rem;
  border-radius: 10px;
  color: var(--text-primary);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border: 1px solid var(--border-color);
  transition: all 0.3s;
}

.footer-link:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  border-color: var(--accent-purple);
}

.footer-icon {
  width: 24px;
  height: 24px;
}

.footer-bottom {
  text-align: center;
  padding-top: 2rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

/* Responsive Design */
@media (max-width: 968px) {
  .hero-container,
  .feature-card {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .hero-content h1 {
    font-size: 2.5rem;
  }
  
  .feature-card.reverse {
    direction: ltr;
  }
  
  .testimonials-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .hero-content h1 {
    font-size: 2rem;
  }
  
  .links-container {
    flex-direction: column;
  }
  
  .founders-grid {
    flex-direction: column;
    gap: 2rem;
  }
  
  .footer-links {
    flex-direction: column;
    align-items: center;
  }
}
</style>