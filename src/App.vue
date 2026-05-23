<template>
  <div class="app-shell">
    <aside class="sidebar" :class="{ open: menuOpen }">
      <div class="sidebar-logo">
        <span class="logo-icon">🐳</span>
        <span class="logo-text">DockerMaster</span>
      </div>
      <nav class="sidebar-nav">
        <router-link v-for="item in navItems" :key="item.path" :to="item.path" class="nav-item" @click="menuOpen = false">
          <span class="nav-icon">{{ item.icon }}</span>
          <span class="nav-label">{{ item.label }}</span>
          <span class="nav-arrow">›</span>
        </router-link>
      </nav>
      <div class="sidebar-footer">
        <span>Built for Developers</span>
      </div>
    </aside>

    <div class="main-area">
      <header class="topbar">
        <button class="menu-toggle" @click="menuOpen = !menuOpen">
          <span></span><span></span><span></span>
        </button>
        <div class="topbar-title">{{ currentPage }}</div>
        <div class="topbar-badge">v24.0</div>
      </header>
      <main class="content-area">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>

    <div class="overlay" v-if="menuOpen" @click="menuOpen = false"></div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const menuOpen = ref(false)
const route = useRoute()

const navItems = [
  { path: '/', icon: '⚡', label: 'Introduction' },
  { path: '/what-is-docker', icon: '📦', label: 'What is Docker?' },
  { path: '/why-docker', icon: '🎯', label: 'Why Use Docker?' },
  { path: '/converting', icon: '🔄', label: 'npm → Docker' },
  { path: '/compose', icon: '🧩', label: 'Docker Compose' },
  { path: '/commands', icon: '💻', label: 'CLI Commands' },
]

const currentPage = computed(() => {
  const item = navItems.find(n => n.path === route.path)
  return item ? item.label : 'DockerMaster'
})
</script>

<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: #0a0c10;
  --bg2: #0f1217;
  --bg3: #161b24;
  --border: #1e2533;
  --border2: #2a3347;
  --text: #e2e8f0;
  --text2: #8b97b0;
  --text3: #4a5568;
  --accent: #00d4ff;
  --accent2: #0099cc;
  --green: #00ff88;
  --orange: #ff6b35;
  --yellow: #ffd700;
  --purple: #9d4edd;
  --font-body: 'Syne', sans-serif;
  --font-mono: 'Space Mono', monospace;
  --radius: 8px;
}

html { scroll-behavior: smooth; }
body { background: var(--bg); color: var(--text); font-family: var(--font-body); line-height: 1.6; overflow-x: hidden; }

.app-shell { display: flex; min-height: 100vh; }

/* SIDEBAR */
.sidebar {
  width: 260px;
  min-height: 100vh;
  background: var(--bg2);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0; left: 0; bottom: 0;
  z-index: 100;
  transition: transform 0.3s ease;
}
.sidebar-logo {
  padding: 24px 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid var(--border);
}
.logo-icon { font-size: 28px; }
.logo-text { font-size: 18px; font-weight: 800; color: var(--accent); letter-spacing: -0.5px; }

.sidebar-nav { flex: 1; padding: 16px 0; overflow-y: auto; }
.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  color: var(--text2);
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s;
  border-left: 3px solid transparent;
  position: relative;
}
.nav-item:hover { background: var(--bg3); color: var(--text); border-left-color: var(--border2); }
.nav-item.router-link-exact-active { color: var(--accent); background: rgba(0,212,255,0.06); border-left-color: var(--accent); }
.nav-icon { font-size: 16px; width: 20px; text-align: center; }
.nav-label { flex: 1; }
.nav-arrow { opacity: 0.3; font-size: 16px; }
.nav-item.router-link-exact-active .nav-arrow { opacity: 1; color: var(--accent); }

.sidebar-footer { padding: 16px 20px; border-top: 1px solid var(--border); font-size: 11px; color: var(--text3); font-family: var(--font-mono); }

/* MAIN */
.main-area { margin-left: 260px; flex: 1; display: flex; flex-direction: column; min-height: 100vh; }

.topbar {
  height: 56px;
  background: var(--bg2);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  padding: 0 24px;
  gap: 16px;
  position: sticky; top: 0; z-index: 50;
}
.menu-toggle { display: none; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; padding: 4px; }
.menu-toggle span { display: block; width: 22px; height: 2px; background: var(--text2); border-radius: 2px; transition: 0.3s; }
.topbar-title { flex: 1; font-size: 14px; font-weight: 700; color: var(--text2); font-family: var(--font-mono); }
.topbar-badge { background: rgba(0,212,255,0.1); color: var(--accent); border: 1px solid rgba(0,212,255,0.3); padding: 2px 10px; border-radius: 20px; font-size: 11px; font-family: var(--font-mono); }

.content-area { flex: 1; padding: 40px 48px; max-width: 900px; }

/* OVERLAY */
.overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 90; }

/* TRANSITIONS */
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s, transform 0.2s; }
.fade-enter-from { opacity: 0; transform: translateY(8px); }
.fade-leave-to { opacity: 0; transform: translateY(-4px); }

/* SHARED CONTENT STYLES */
.page-header { margin-bottom: 40px; }
.page-tag { font-family: var(--font-mono); font-size: 11px; color: var(--accent); text-transform: uppercase; letter-spacing: 2px; margin-bottom: 12px; }
.page-title { font-size: 42px; font-weight: 800; line-height: 1.1; color: var(--text); margin-bottom: 16px; }
.page-title span { color: var(--accent); }
.page-desc { font-size: 16px; color: var(--text2); line-height: 1.7; max-width: 680px; }

.section { margin-bottom: 48px; }
.section-title { font-size: 22px; font-weight: 700; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; }
.section-title::after { content: ''; flex: 1; height: 1px; background: var(--border); }

.card {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 24px;
  margin-bottom: 16px;
  transition: border-color 0.2s;
}
.card:hover { border-color: var(--border2); }

.code-block {
  background: #060810;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  margin: 16px 0;
  font-family: var(--font-mono);
}
.code-header {
  background: var(--bg3);
  padding: 8px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border);
}
.code-lang { font-size: 11px; color: var(--text3); text-transform: uppercase; letter-spacing: 1px; }
.code-filename { font-size: 12px; color: var(--accent); }
.code-body { padding: 20px; overflow-x: auto; }
.code-body pre { font-size: 13px; line-height: 1.7; color: var(--text); }
.kw { color: var(--accent); }
.str { color: var(--green); }
.cm { color: var(--text3); font-style: italic; }
.num { color: var(--orange); }
.fn { color: var(--yellow); }
.tag { color: #ff79c6; }

.highlight-box {
  background: rgba(0,212,255,0.05);
  border: 1px solid rgba(0,212,255,0.2);
  border-left: 3px solid var(--accent);
  border-radius: var(--radius);
  padding: 16px 20px;
  margin: 20px 0;
  font-size: 14px;
  color: var(--text2);
}
.highlight-box.green { background: rgba(0,255,136,0.05); border-color: rgba(0,255,136,0.2); border-left-color: var(--green); }
.highlight-box.orange { background: rgba(255,107,53,0.05); border-color: rgba(255,107,53,0.2); border-left-color: var(--orange); }

.tag-pill { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; font-family: var(--font-mono); margin-right: 6px; }
.tag-pill.blue { background: rgba(0,212,255,0.1); color: var(--accent); border: 1px solid rgba(0,212,255,0.3); }
.tag-pill.green { background: rgba(0,255,136,0.1); color: var(--green); border: 1px solid rgba(0,255,136,0.3); }
.tag-pill.orange { background: rgba(255,107,53,0.1); color: var(--orange); border: 1px solid rgba(255,107,53,0.3); }

p { color: var(--text2); line-height: 1.8; margin-bottom: 16px; font-size: 15px; }
strong { color: var(--text); }
ul { color: var(--text2); padding-left: 20px; margin-bottom: 16px; }
li { margin-bottom: 8px; font-size: 15px; line-height: 1.7; }

@media (max-width: 768px) {
  .sidebar { transform: translateX(-100%); }
  .sidebar.open { transform: translateX(0); }
  .main-area { margin-left: 0; }
  .menu-toggle { display: flex; }
  .overlay { display: block; }
  .content-area { padding: 24px 20px; }
  .page-title { font-size: 28px; }
}
</style>
