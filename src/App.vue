<template>
  <div id="app">
    <div class="home">
      <header role="banner" class="ui-section-header" style="margin-bottom: 2rem;">
        <div class="ui-layout-container">
          <div class="ui-section-header__layout ui-layout-flex">
            
            <!-- LOGO + HOME grouped -->
            <div class="ui-section-header--logo ui-layout-flex" style="align-items: center; gap: 2rem;">
              <!-- Logo (clickable) -->
              <router-link to="/">
                <img src="assets/Logo.png" alt="Logo" style="width:80px;height:80px; cursor: pointer;">
              </router-link>

              <!-- Home button -->
              <router-link to="/" class="ui-section-header--nav-link">Home</router-link>
            </div>

            <!-- HAMBURGER -->
            <input type="checkbox" id="ui-section-header--menu-id">
            <label for="ui-section-header--menu-id" class="ui-section-header--menu-icon"></label>

            <!-- MENU -->
            <nav role="navigation" class="ui-section-header--nav ui-layout-flex">
              <a href="/#Features" role="link" aria-label="#" class="ui-section-header--nav-link">Features</a>
              <a href="https://discord.gg/HeTKed64Ka" role="link" aria-label="#" class="ui-section-header--nav-link">Support</a>
              <a href="/#Founders" role="link" aria-label="#" class="ui-section-header--nav-link">Founders</a>
              <router-link to="/matchLoadouts" class="ui-section-header--nav-link">Match Loadouts</router-link>
            </nav>
          </div>
        </div>
      </header>
    </div>
    <!-- Page contents render here -->
    <router-view />
  </div>
</template>



<script>
export default {
  name: 'App',
  methods: {
    redirectToGithub() {
      window.open('https://github.com/isaacKenyon/VALORANT-rank-yoinker')
    },
    redirectToDiscord() {
      window.open('https://discord.gg/HeTKed64Ka')
    },
  }
}
</script>



<style>
#app {
  min-height: 100vh;
  background: var(--ui-color-background-primary);
  color: var(--ui-color-typography-body);
  font-family: 'Inter', sans-serif;
}
body {
  position: relative;
  margin: 0;
  padding: 0;
  background-color: var(--background);
  /* background-image: url('./assets/PhoenixArtwork.png'); */
  /* background-repeat: no-repeat; */
  /* background-attachment: fixed; */
  /* background-position: left; */
  
}
.img {
  position: fixed;
  top: 0;
  bottom: 0;
  margin-top: auto;
  margin-bottom: auto;
  width: 30%;
  z-index: -1;
  opacity: 0.5;
}
.phoenix {
  left: 50px;
  /* background-color: red; */
}
.killjoy {
  right: 50px;
  /* background-color: red; */
}
.logo {
  position: relative;
  top: 0;
  margin-bottom: 25px;
  width: 30vmin;
  margin: 0, 0, 100px;
}

#nav {
  position: fixed;
  top: 0;
  z-index: 2;
  height: 5%;
  /* padding: 100px; */
  /* list-style-type: none; */
  margin: 0;
  padding: 0;
  width: 100%;
  text-align: left;
  /* overflow: hidden; */
  background-color: #111111;
  /* box-sizing: border-box; */
}

#nav a {
  position: relative;
  top: 30%;
  /* bottom: 0; */
  /* margin: auto; */
  /* vertical-align: middle; */
  padding: 1%;
  font-weight: bold;
  color: #2c3e50;
  /* display: block; */
  color: white;
  /* text-align: center; */
  /* padding: 14px 16px; */
  text-decoration: none;
  /* border-bottom: 2px solid #111111; */
}

#nav a.router-link-exact-active {
  border-bottom: 1px solid #ff4655;
}

#nav a:hover {
  /* background-color: #ff4655; */
  border-bottom: 1px solid #ff4655;
  /* -webkit-box-shadow:inset 0px 0px 0px 1px #ff4655; */
  /* -moz-box-shadow:inset 0px 0px 0px 1px #ff4655; */
  /* box-shadow:inset 0px -10px 1px 0px #ff4655; */
}

.github {
  cursor: pointer;
}
</style>
