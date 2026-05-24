<template>
  <div class="app-shell" :class="{ compact: compactMode }">
    <aside class="sidebar" :class="{ open: menuOpen }">
      <div class="sidebar-logo">
        <span class="logo-icon">DM</span>
        <span>
          <span class="logo-text">DockerMaster</span>
          <span class="logo-sub">Node.js field guide</span>
        </span>
      </div>

      <div class="learn-progress">
        <div class="progress-copy">
          <span>{{ completedChapters }} / {{ navItems.length }} chapters</span>
          <strong>{{ progressPercent }}%</strong>
        </div>
        <div class="progress-track">
          <span :style="{ width: `${progressPercent}%` }"></span>
        </div>
      </div>

      <nav class="sidebar-nav">
        <router-link
          v-for="(item, index) in navItems"
          :key="item.path"
          :to="item.path"
          class="nav-item"
          @click="menuOpen = false"
        >
          <span class="nav-step">{{ String(index + 1).padStart(2, '0') }}</span>
          <span class="nav-label">{{ item.label }}</span>
          <span class="nav-status" :class="{ done: visitedPaths.includes(item.path) }"></span>
        </router-link>
      </nav>

      <div class="sidebar-footer">
        <button class="shell-btn" @click="toggleTheme">{{ darkMode ? 'Light' : 'Dark' }}</button>
        <button class="shell-btn" @click="compactMode = !compactMode">{{ compactMode ? 'Comfort' : 'Compact' }}</button>
      </div>
    </aside>

    <div class="main-area">
      <header class="topbar">
        <button class="menu-toggle" aria-label="Open navigation" @click="menuOpen = !menuOpen">
          <span></span><span></span><span></span>
        </button>
        <button class="quick-search" @click="paletteOpen = true">
          <span>Search chapters and tools</span>
          <kbd>/</kbd>
        </button>
        <div class="topbar-title">{{ currentPage }}</div>
        <div class="topbar-badge">Vue 3</div>
      </header>

      <main class="content-area">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>

    <Teleport to="body">
      <div v-if="paletteOpen" class="palette-backdrop" @click.self="paletteOpen = false">
        <div class="palette" role="dialog" aria-modal="true">
          <input
            ref="paletteInput"
            v-model="paletteQuery"
            class="palette-input"
            placeholder="Jump to a chapter, command reference, or workflow..."
            @keydown.esc="paletteOpen = false"
          />
          <div class="palette-list">
            <router-link
              v-for="item in filteredPalette"
              :key="item.path"
              :to="item.path"
              class="palette-item"
              @click="paletteOpen = false; paletteQuery = ''"
            >
              <span class="palette-kicker">{{ item.kicker }}</span>
              <strong>{{ item.label }}</strong>
              <small>{{ item.hint }}</small>
            </router-link>
            <div v-if="filteredPalette.length === 0" class="palette-empty">
              No matching chapter found
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <div class="overlay" v-if="menuOpen" @click="menuOpen = false"></div>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, provide, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const menuOpen = ref(false)
const paletteOpen = ref(false)
const paletteInput = ref(null)
const paletteQuery = ref('')
const route = useRoute()

const storedTheme = localStorage.getItem('dockermaster-theme')
const darkMode = ref(storedTheme ? storedTheme === 'dark' : true)
const compactMode = ref(localStorage.getItem('dockermaster-density') === 'compact')
const visitedPaths = ref(JSON.parse(localStorage.getItem('dockermaster-visited') || '[]'))

const navItems = [
  { path: '/', label: 'Introduction', kicker: 'Start', hint: 'Course overview, quick start, learning plan' },
  { path: '/what-is-docker', label: 'What is Docker?', kicker: 'Chapter 01', hint: 'Images, containers, registry, volumes' },
  { path: '/why-docker', label: 'Why Use Docker?', kicker: 'Chapter 02', hint: 'Benefits, team workflows, production fit' },
  { path: '/converting', label: 'npm to Docker', kicker: 'Chapter 03', hint: 'Dockerfiles for backend and frontend apps' },
  { path: '/compose', label: 'Docker Compose', kicker: 'Chapter 04', hint: 'Full stack orchestration with YAML' },
  { path: '/commands', label: 'CLI Commands', kicker: 'Reference', hint: 'Searchable command library and cheatsheet' },
]

provide('navItems', navItems)
provide('visitedPaths', visitedPaths)

const currentPage = computed(() => navItems.find((n) => n.path === route.path)?.label || 'DockerMaster')
const completedChapters = computed(() => visitedPaths.value.length)
const progressPercent = computed(() => Math.round((completedChapters.value / navItems.length) * 100))

const filteredPalette = computed(() => {
  const query = paletteQuery.value.toLowerCase().trim()
  if (!query) return navItems
  return navItems.filter((item) =>
    [item.label, item.kicker, item.hint].some((value) => value.toLowerCase().includes(query))
  )
})

const toggleTheme = () => {
  darkMode.value = !darkMode.value
}

watch(route, () => {
  if (!visitedPaths.value.includes(route.path)) {
    visitedPaths.value = [...visitedPaths.value, route.path]
  }
}, { immediate: true })

watch(visitedPaths, (value) => {
  localStorage.setItem('dockermaster-visited', JSON.stringify(value))
}, { deep: true })

watch(darkMode, (value) => {
  document.documentElement.dataset.theme = value ? 'dark' : 'light'
  localStorage.setItem('dockermaster-theme', value ? 'dark' : 'light')
}, { immediate: true })

watch(compactMode, (value) => {
  localStorage.setItem('dockermaster-density', value ? 'compact' : 'comfort')
})

watch(paletteOpen, async (open) => {
  if (open) {
    await nextTick()
    paletteInput.value?.focus()
  }
})

const handleGlobalKeydown = (event) => {
  if (event.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
    event.preventDefault()
    paletteOpen.value = true
  }
  if (event.key === 'Escape') {
    paletteOpen.value = false
    menuOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleGlobalKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeydown)
})
</script>

<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: #081017;
  --bg2: #101922;
  --bg3: #172431;
  --bg4: #203040;
  --surface: #13202b;
  --border: #243445;
  --border2: #385064;
  --text: #eef7fb;
  --text2: #aab8c5;
  --text3: #6f8190;
  --text4: #516272;
  --accent: #20c7e8;
  --accent2: #5ee0a4;
  --green: #5ee0a4;
  --orange: #ff9a62;
  --yellow: #f2ce5b;
  --purple: #b99cff;
  --red: #ff6f79;
  --font-body: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-display: Inter, ui-sans-serif, system-ui, sans-serif;
  --font-mono: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
  --radius: 8px;
  --radius-lg: 12px;
}

:root[data-theme="light"] {
  --bg: #f5f8fb;
  --bg2: #ffffff;
  --bg3: #eef4f8;
  --bg4: #e3edf4;
  --surface: #ffffff;
  --border: #d8e3ec;
  --border2: #b8c9d8;
  --text: #10202d;
  --text2: #485969;
  --text3: #748596;
  --text4: #96a4af;
}

html { scroll-behavior: smooth; }
body { background: var(--bg); color: var(--text); font-family: var(--font-body); line-height: 1.6; overflow-x: hidden; }
button, input { font: inherit; }
code { font-family: var(--font-mono); color: var(--accent); }

.app-shell { display: flex; min-height: 100vh; background: radial-gradient(circle at top left, rgba(32,199,232,0.12), transparent 34%), var(--bg); }
.app-shell.compact .content-area { padding-top: 28px; }
.app-shell.compact .section { margin-bottom: 34px; }

.sidebar {
  width: 280px;
  min-height: 100vh;
  background: color-mix(in srgb, var(--bg2) 92%, transparent);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  position: fixed;
  inset: 0 auto 0 0;
  z-index: 100;
  transition: transform 0.3s ease;
  backdrop-filter: blur(16px);
}
.sidebar-logo { padding: 24px 20px; display: flex; align-items: center; gap: 12px; border-bottom: 1px solid var(--border); }
.logo-icon { width: 38px; height: 38px; display: grid; place-items: center; border-radius: 8px; background: linear-gradient(135deg, var(--accent), var(--green)); color: #061016; font-weight: 900; font-size: 13px; }
.logo-text { display: block; font-size: 17px; font-weight: 850; color: var(--text); letter-spacing: 0; }
.logo-sub { display: block; font-size: 11px; color: var(--text3); font-family: var(--font-mono); }
.learn-progress { padding: 18px 20px; border-bottom: 1px solid var(--border); }
.progress-copy { display: flex; justify-content: space-between; color: var(--text3); font-size: 11px; font-family: var(--font-mono); margin-bottom: 9px; }
.progress-copy strong { color: var(--accent); }
.progress-track { height: 6px; background: var(--bg3); border-radius: 99px; overflow: hidden; }
.progress-track span { display: block; height: 100%; background: linear-gradient(90deg, var(--accent), var(--green)); border-radius: inherit; transition: width 0.25s ease; }
.sidebar-nav { flex: 1; padding: 14px 12px; overflow-y: auto; }
.nav-item {
  display: grid;
  grid-template-columns: 34px 1fr 10px;
  align-items: center;
  gap: 10px;
  padding: 11px 10px;
  color: var(--text2);
  text-decoration: none;
  font-size: 14px;
  font-weight: 700;
  border-radius: var(--radius);
  transition: all 0.18s ease;
}
.nav-item:hover { background: var(--bg3); color: var(--text); }
.nav-item.router-link-exact-active { color: var(--text); background: rgba(32,199,232,0.12); box-shadow: inset 0 0 0 1px rgba(32,199,232,0.25); }
.nav-step { color: var(--text4); font-family: var(--font-mono); font-size: 11px; }
.nav-status { width: 8px; height: 8px; border-radius: 50%; background: var(--border2); }
.nav-status.done { background: var(--green); }
.sidebar-footer { padding: 16px 20px; border-top: 1px solid var(--border); display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.shell-btn { border: 1px solid var(--border); background: var(--bg3); color: var(--text2); border-radius: var(--radius); padding: 8px 10px; cursor: pointer; font-size: 12px; font-weight: 750; }
.shell-btn:hover { color: var(--text); border-color: var(--border2); }

.main-area { margin-left: 280px; flex: 1; display: flex; flex-direction: column; min-height: 100vh; }
.topbar {
  height: 62px;
  background: color-mix(in srgb, var(--bg2) 88%, transparent);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  padding: 0 28px;
  gap: 14px;
  position: sticky;
  top: 0;
  z-index: 50;
  backdrop-filter: blur(16px);
}
.menu-toggle { display: none; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; padding: 4px; }
.menu-toggle span { display: block; width: 22px; height: 2px; background: var(--text2); border-radius: 2px; }
.quick-search {
  min-width: min(360px, 48vw);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  color: var(--text3);
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 9px 10px 9px 14px;
  cursor: pointer;
  text-align: left;
  font-size: 13px;
}
kbd { border: 1px solid var(--border2); background: var(--bg2); color: var(--text2); border-radius: 5px; padding: 1px 7px; font-family: var(--font-mono); font-size: 11px; }
.topbar-title { flex: 1; font-size: 13px; font-weight: 800; color: var(--text2); font-family: var(--font-mono); }
.topbar-badge { background: rgba(94,224,164,0.1); color: var(--green); border: 1px solid rgba(94,224,164,0.25); padding: 3px 10px; border-radius: 99px; font-size: 11px; font-family: var(--font-mono); }
.content-area { flex: 1; padding: 44px clamp(28px, 4vw, 56px); width: min(1180px, 100%); }
.overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.58); z-index: 90; }

.palette-backdrop { position: fixed; inset: 0; z-index: 200; background: rgba(0,0,0,0.54); display: grid; place-items: start center; padding-top: 12vh; }
.palette { width: min(680px, calc(100vw - 32px)); background: var(--bg2); border: 1px solid var(--border2); border-radius: var(--radius-lg); overflow: hidden; box-shadow: 0 24px 80px rgba(0,0,0,0.34); }
.palette-input { width: 100%; background: var(--bg3); border: 0; border-bottom: 1px solid var(--border); color: var(--text); padding: 18px 20px; outline: none; }
.palette-list { max-height: 420px; overflow: auto; padding: 8px; }
.palette-item { display: grid; grid-template-columns: 110px 1fr; gap: 4px 14px; padding: 13px 12px; color: var(--text2); text-decoration: none; border-radius: var(--radius); }
.palette-item:hover { background: var(--bg3); }
.palette-item strong { color: var(--text); }
.palette-item small { grid-column: 2; color: var(--text3); }
.palette-kicker { color: var(--accent); font-family: var(--font-mono); font-size: 11px; text-transform: uppercase; }
.palette-empty { color: var(--text3); padding: 22px 14px; text-align: center; font-size: 13px; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s, transform 0.2s; }
.fade-enter-from { opacity: 0; transform: translateY(8px); }
.fade-leave-to { opacity: 0; transform: translateY(-4px); }

.page-header { margin-bottom: 42px; }
.page-tag { font-family: var(--font-mono); font-size: 11px; color: var(--accent); text-transform: uppercase; letter-spacing: 0; margin-bottom: 12px; }
.page-title { font-size: clamp(32px, 5vw, 54px); font-weight: 850; line-height: 1.04; color: var(--text); margin-bottom: 16px; letter-spacing: 0; }
.page-title span { color: var(--accent); }
.page-desc { font-size: 16px; color: var(--text2); line-height: 1.75; max-width: 760px; }
.section { margin-bottom: 52px; }
.section-title { font-size: 22px; font-weight: 820; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; letter-spacing: 0; }
.section-title::after { content: ''; flex: 1; height: 1px; background: var(--border); }
.section-sub { color: var(--text3); margin-top: -10px; margin-bottom: 18px; font-size: 14px; }
.card { background: var(--bg2); border: 1px solid var(--border); border-radius: var(--radius); padding: 24px; margin-bottom: 16px; transition: border-color 0.2s; }
.card:hover { border-color: var(--border2); }
.code-block { background: #071019; border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; margin: 16px 0; font-family: var(--font-mono); }
:root[data-theme="light"] .code-block { background: #0d1720; }
.code-header { background: var(--bg3); padding: 8px 16px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border); }
.code-lang { font-size: 11px; color: var(--text3); text-transform: uppercase; letter-spacing: 0; }
.code-filename { font-size: 12px; color: var(--accent); }
.code-dots { display: flex; gap: 6px; }
.code-dots span { width: 9px; height: 9px; border-radius: 50%; background: var(--border2); }
.code-body { padding: 20px; overflow-x: auto; max-width: 100%; }
.code-body pre { font-size: 13px; line-height: 1.7; color: #eaf4f8; min-width: max-content; }
.kw { color: var(--accent); }
.str { color: var(--green); }
.cm { color: #788895; font-style: italic; }
.num { color: var(--orange); }
.fn { color: var(--yellow); }
.tag { color: #ff8fcb; }
.highlight-box { background: rgba(32,199,232,0.07); border: 1px solid rgba(32,199,232,0.22); border-left: 3px solid var(--accent); border-radius: var(--radius); padding: 16px 20px; margin: 20px 0; font-size: 14px; color: var(--text2); }
.highlight-box.green { background: rgba(94,224,164,0.07); border-color: rgba(94,224,164,0.22); border-left-color: var(--green); }
.highlight-box.orange { background: rgba(255,154,98,0.07); border-color: rgba(255,154,98,0.22); border-left-color: var(--orange); }
.tag-pill { display: inline-block; padding: 3px 10px; border-radius: 99px; font-size: 11px; font-weight: 800; font-family: var(--font-mono); margin-right: 6px; }
.tag-pill.blue { background: rgba(32,199,232,0.1); color: var(--accent); border: 1px solid rgba(32,199,232,0.3); }
.tag-pill.green { background: rgba(94,224,164,0.1); color: var(--green); border: 1px solid rgba(94,224,164,0.3); }
.tag-pill.orange { background: rgba(255,154,98,0.1); color: var(--orange); border: 1px solid rgba(255,154,98,0.3); }
.tag-pill.purple { background: rgba(185,156,255,0.12); color: var(--purple); border: 1px solid rgba(185,156,255,0.3); }
.tag-pill.yellow { background: rgba(242,206,91,0.12); color: var(--yellow); border: 1px solid rgba(242,206,91,0.3); }
.nav-footer { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-top: 48px; padding-top: 24px; border-top: 1px solid var(--border); }
.nav-prev,
.nav-next { display: inline-flex; align-items: center; justify-content: center; min-height: 42px; padding: 10px 16px; border: 1px solid var(--border); border-radius: var(--radius); color: var(--text2); background: var(--bg2); text-decoration: none; font-weight: 800; font-size: 13px; }
.nav-next { margin-left: auto; color: var(--accent); border-color: rgba(32,199,232,0.3); }
.nav-prev:hover,
.nav-next:hover { border-color: var(--border2); color: var(--text); }
p { color: var(--text2); line-height: 1.8; margin-bottom: 16px; font-size: 15px; }
strong { color: var(--text); }
ul { color: var(--text2); padding-left: 20px; margin-bottom: 16px; }
li { margin-bottom: 8px; font-size: 15px; line-height: 1.7; }

@media (max-width: 1180px) {
  .content-area { width: 100%; }
  .page-title { font-size: clamp(32px, 6vw, 48px); }
}

@media (max-width: 880px) {
  .sidebar { transform: translateX(-100%); }
  .sidebar.open { transform: translateX(0); }
  .main-area { margin-left: 0; }
  .menu-toggle { display: flex; }
  .overlay { display: block; }
  .topbar { padding: 0 18px; }
  .quick-search { min-width: 0; flex: 1; }
  .topbar-title { display: none; }
  .content-area { padding: 28px 20px; }
  .palette-item { grid-template-columns: 1fr; }
  .palette-item small { grid-column: 1; }
}

@media (max-width: 560px) {
  .sidebar { width: min(320px, 86vw); }
  .topbar { height: auto; min-height: 58px; padding: 10px 14px; gap: 10px; }
  .quick-search { order: 3; flex-basis: 100%; font-size: 12px; padding: 8px 10px; }
  .topbar-badge { margin-left: auto; }
  .content-area { padding: 24px 14px 32px; }
  .page-header { margin-bottom: 30px; }
  .page-title { font-size: 30px; }
  .page-desc,
  p,
  li { font-size: 14px; }
  .section { margin-bottom: 36px; }
  .section-title { align-items: flex-start; font-size: 19px; line-height: 1.25; }
  .section-title::after { display: none; }
  .card,
  .highlight-box { padding: 16px; }
  .code-header { padding: 8px 12px; }
  .code-body { padding: 14px; }
  .code-body pre { font-size: 12px; }
  .palette-backdrop { padding-top: 8vh; align-items: start; }
  .palette { width: calc(100vw - 20px); }
  .palette-input { padding: 15px 14px; font-size: 14px; }
  .nav-footer { align-items: stretch; flex-direction: column; margin-top: 36px; }
  .nav-prev,
  .nav-next { width: 100%; margin-left: 0; }
}
</style>
