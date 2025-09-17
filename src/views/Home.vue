<template>
  <div class="home">
    <main role="main">
        <section class="ui-section-hero">
            <div class="ui-layout-container">
                <div class="ui-section-hero__layout ui-layout-grid ui-layout-grid-2">
                    <!-- COPYWRITING -->
                    <div>
                        <h1>VALORANT rank yoinker</h1>
                        <p class="ui-text-intro">See VALORANT players' ranks, skins, and more mid-game.</p>
                        <!-- CTA -->
                        <div class="ui-component-cta ui-layout-flex">
                            <a href="https://github.com/zayKenyon/VALORANT-rank-yoinker/releases/latest" role="link" class="ui-component-button ui-component-button-normal ui-component-button-primary">Download Now</a>
                            <p class="ui-text-note" id="downloads"></p>
                        </div>
                    </div>
                    <!-- IMAGE -->
                    <img src="assets/Example.png" alt="Showcase Image" class="zoom">
                </div>
            </div>
        </section>
        <section class="ui-section-customer">
            <div class="ui-layout-container" align="center">
                <div class="ui-section-customer__layout ui-layout-flex white-box">
                    <a href="https://github.com/zayKenyon/VALORANT-rank-yoinker">
                        <img alt="GitHub Logo" src="assets/GitHub.png" class="ui-section-customer--logo">
                    </a>
                    <a href="https://discord.gg/HeTKed64Ka">
                        <img alt="Discord Logo" src="assets/Discord.png" class="ui-section-customer--logo">
                    </a>
                </div>
            </div>
        </section>
        <section class="ui-section-feature">
            <div class="ui-layout-container">
                <div id="Features" class="ui-section-feature__layout ui-layout-grid ui-layout-grid-2">
                    <!-- IMAGE -->
                    <img src="assets/PeakRank.png" alt="Peak Rank Showcase Image" class="ui-image">
                    <!-- FEATURE -->
                    <div>
                        <h2>Peak Rank</h2>
                        <p class="ui-text-intro">"That Jett who is going 22/9 can't be Bronze 2!" Correct, she used to be Gold 3.</p>
                        <ul class="ui-component-list ui-component-list-feature ui-layout-grid">
                            <li class="ui-component-list--item ui-component-list--item-check">Work out if it's a boost.</li>
                            <li class="ui-component-list--item ui-component-list--item-check">Works for both sides.</li>
                        </ul>
                    </div>
                </div>
                <div class="ui-section-feature__layout ui-layout-grid ui-layout-grid-2">
                    <!-- FEATURE -->
                    <div>
                        <h2>Skin Tracking</h2>
                        <p class="ui-text-intro">Now you can efficiently beg for skins!
                            <small><br>Note: vRY is not responsible in-case you get muted for being a twerp.</small>
                        </p>
                        <ul class="ui-component-list ui-component-list-feature ui-layout-grid">
                            <li class="ui-component-list--item ui-component-list--item-check">See who's got your favourite skin.</li>
                            <li class="ui-component-list--item ui-component-list--item-check">Works for both sides.</li>
                        </ul>
                    </div>
                    <!-- IMAGE -->
                    <img src="assets/Skin.png" alt="Skin Showcase Image" class="ui-image">
                </div>
                <div class="ui-section-feature__layout ui-layout-grid ui-layout-grid-2">
                    <!-- IMAGE -->
                    <img src="assets/HS.png" alt="Headshot Showcase Image" class="ui-image">
                    <!-- FEATURE -->
                    <div>
                        <h2>Headshot %</h2>
                        <p class="ui-text-intro">"WHY DO THEY KEEP ONE-SHOTTING ME?! Oh, they've got a 34% headshot percentage..."</p>
                        <ul class="ui-component-list ui-component-list-feature ui-layout-grid">
                            <li class="ui-component-list--item ui-component-list--item-check">Green colour means touch grass.</li>
                            <li class="ui-component-list--item ui-component-list--item-check">Works for both sides.</li>
                        </ul>
                    </div>
                </div>
                <div class="ui-section-feature__layout ui-layout-grid ui-layout-grid-2">
                    <!-- FEATURE -->
                    <div>
                        <h2>Discord Status</h2>
                        <p class="ui-text-intro">Updates your Discord Game Activity to reflect your match.</p>
                        <ul class="ui-component-list ui-component-list-feature ui-layout-grid">
                            <li class="ui-component-list--item ui-component-list--item-check">Toggleable</li>
                            <li class="ui-component-list--item ui-component-list--item-check">Updates live.</li>
                        </ul>
                    </div>
                    <!-- IMAGE -->
                    <img src="assets/rpc.png" alt="Discord Rich Presence Showcase Image" class="ui-image">
                </div>
                <div class="ui-section-feature__layout ui-layout-grid ui-layout-grid-2">
                    <!-- IMAGE -->
                    <img src="assets/Party.png" alt="Peak Rank Showcase Image" class="ui-image">
                    <!-- FEATURE -->
                    <div>
                        <h2>Party Indicator</h2>
                        <p class="ui-text-intro">Have you ever had the sneaking suspicion that the Reyna and Skye who have used their mic once and constantly drop for each other are queued? Well now you can tell for certain.</p>
                        <ul class="ui-component-list ui-component-list-feature ui-layout-grid">
                            <li class="ui-component-list--item ui-component-list--item-check">Colour represents party.</li>
                            <li class="ui-component-list--item ui-component-list--item-check">Works for both sides.</li>
                        </ul>
                    </div>
                </div>
                <div class="ui-section-feature__layout ui-layout-grid ui-layout-grid-2">
                    <!-- FEATURE -->
                    <div>
                        <h2>Winrate %</h2>
                        <p class="ui-text-intro">Wondering why that low ranked player is in your lobby, surely they're not getting boosted? Well, it's because they have a high winrate % (good for them).</p>
                        <ul class="ui-component-list--item ui-component-list-feature ui-layout-grid">
                            <li class="ui-component-list--item ui-component-list--item-check">See who's grinding.</li>
                            <li class="ui-component-list--item ui-component-list--item-check">Works for both sides.</li>
                        </ul>
                    </div>
                    <!-- IMAGE -->
                    <img src="assets/WR.png" alt="Winrate Percentage Showcase Image" class="ui-image">
                </div>
            </div>
        </section>
        <section class="ui-section-testimonial">
            <div class="ui-layout-container">
                <!-- REVIEWS -->
                <div class="ui-layout-flex ui-layout-flex-start ui-layout-flex-wrap ">
                    <div class="ui-layout-column-4">
                        <img src="assets/Zombs.png" alt="'Real' Review" class="ui-section-testimonial--avatar">
                        <p class="ui-section-testimonial--quote ui-text-intro">&ldquo;I used to live a sad life, begging for skins, wondering who owned that majestically beautiful Reaver Vandal, but now, thanks to vRY my life is a lot better - I can now efficiently beg for skins!&rdquo;</p>
                        <p class="ui-section-testimonial--author"><strong>Zombs</strong><br><small class="ui-text-note">A Funny Person</small></p>
                    </div>
                    <div class="ui-layout-column-4">
                        <img src="assets/Ovo.png" alt="Real Review" class="ui-section-testimonial--avatar">
                        <p class="ui-section-testimonial--quote ui-text-intro">&ldquo;Now I can flame the smurfs more efficiently, by knowing why the Level 2 instalock reyna is completely DESTROYING me.&rdquo;</p>
                        <p class="ui-section-testimonial--author"><strong>Ovo Simpático</strong><br><small class="ui-text-note">'Chief User Representative'</small></p>
                    </div>
                </div>
            </div>
        </section>
    </main>
    <footer role="contentinfo" class="ui-section-footer">
        <div class="ui-layout-container">
            <!-- MENU -->
            <div id="Founders">
                <h2>Founders :</h2>
            </div>
            <div class="avatar-container">
                <div>
                    <a href="https://github.com/zayKenyon">
                        <img src="https://avatars.githubusercontent.com/u/87788699?v=4" alt="Zay's Avatar" class="avatar-container--avatar zoom">
                    </a>
                </div>
                <div>
                    <a href="https://github.com/OwOHamper">
                        <img src="https://avatars.githubusercontent.com/u/74879467?v=4" alt="Hamper's Avatar" class="avatar-container--avatar zoom">
                    </a>
                </div>
            </div>
        </div>
    </footer>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Home',
  components: {
    
  }
}
</script>
<style scoped src="@/assets/style.css"></style>