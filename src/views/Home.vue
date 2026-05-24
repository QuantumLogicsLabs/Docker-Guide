<template>
  <div>
    <!-- Hero -->
    <div class="hero">
      <div class="hero-eyebrow">
        <span class="eyebrow-dot"></span>
        Complete Node.js Developer Guide
      </div>
      <h1 class="hero-title">
        Docker for<br>
        <span class="hero-gradient">Modern Developers</span>
      </h1>
      <p class="hero-desc">
        Everything you need to containerize, orchestrate, and ship Node.js applications with Docker — from zero to production-ready in one guide.
      </p>
      <div class="hero-cta">
        <router-link to="/what-is-docker" class="cta-primary">
          Start Learning
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </router-link>
        <router-link to="/commands" class="cta-secondary">CLI Reference</router-link>
      </div>

      <!-- Stats -->
      <div class="stats-bar">
        <div class="stat-item" v-for="s in stats" :key="s.label">
          <div class="stat-num">{{ s.num }}</div>
          <div class="stat-label">{{ s.label }}</div>
        </div>
      </div>
    </div>

    <!-- Learning Dashboard -->
    <div class="section">
      <div class="section-title">Personal Learning Dashboard</div>
      <div class="dashboard-grid">
        <div class="focus-panel">
          <div class="panel-top">
            <span class="panel-label">Recommended next</span>
            <strong>{{ activeTrack.title }}</strong>
          </div>
          <p>{{ activeTrack.desc }}</p>
          <div class="track-tabs">
            <button
              v-for="track in tracks"
              :key="track.id"
              class="track-tab"
              :class="{ active: selectedTrack === track.id }"
              @click="selectedTrack = track.id"
            >
              {{ track.label }}
            </button>
          </div>
          <div class="track-list">
            <router-link v-for="item in activeTrack.items" :key="item.path" :to="item.path" class="track-item">
              <span>{{ item.step }}</span>
              <strong>{{ item.title }}</strong>
              <small>{{ item.time }}</small>
            </router-link>
          </div>
        </div>
        <div class="checklist-panel">
          <div class="panel-top">
            <span class="panel-label">Launch checklist</span>
            <strong>{{ doneCount }} / {{ checklist.length }} done</strong>
          </div>
          <label v-for="item in checklist" :key="item.id" class="check-row">
            <input v-model="checkedItems" :value="item.id" type="checkbox" />
            <span>{{ item.text }}</span>
          </label>
        </div>
      </div>
    </div>

    <!-- Stack Builder -->
    <div class="section">
      <div class="section-title">Starter Kit Builder</div>
      <div class="section-sub">Pick a stack and generate a local-ready compose file instantly</div>
      <div class="builder-grid">
        <div class="builder-panel">
          <div class="panel-top">
            <span class="panel-label">Project profile</span>
            <strong>{{ selectedServices.length }} services</strong>
          </div>

          <div class="builder-field">
            <label for="projectName">Project name</label>
            <input id="projectName" v-model.trim="projectName" type="text" placeholder="my-node-app" />
          </div>

          <div class="builder-field split">
            <div>
              <label for="packageManager">Package manager</label>
              <select id="packageManager" v-model="packageManager">
                <option value="npm">npm</option>
                <option value="pnpm">pnpm</option>
                <option value="yarn">yarn</option>
              </select>
            </div>
            <div>
              <label for="backendPort">Backend port</label>
              <input id="backendPort" v-model.number="backendPort" type="number" min="1000" max="9999" />
            </div>
          </div>

          <div class="service-picker" role="group" aria-label="Choose services">
            <button
              v-for="service in stackOptions"
              :key="service.id"
              class="service-chip"
              :class="{ active: selectedServices.includes(service.id) }"
              @click="toggleService(service.id)"
            >
              <span>{{ service.icon }}</span>
              <strong>{{ service.label }}</strong>
              <small>{{ service.note }}</small>
            </button>
          </div>

          <div class="builder-summary">
            <div v-for="item in builderSummary" :key="item.label">
              <span>{{ item.label }}</span>
              <strong>{{ item.value }}</strong>
            </div>
          </div>
        </div>

        <div class="builder-preview">
          <div class="code-block">
            <div class="code-header">
              <div class="code-dots"><span></span><span></span><span></span></div>
              <span class="code-filename">docker-compose.yml</span>
              <button class="copy-code-btn" @click="copyGeneratedCompose">
                {{ copiedCompose ? 'Copied' : 'Copy' }}
              </button>
            </div>
            <div class="code-body"><pre>{{ generatedCompose }}</pre></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Chapter Cards -->
    <div class="section">
      <div class="section-title">Course Chapters</div>
      <div class="section-sub">Six structured chapters from basics to production</div>
      <div class="cards-grid">
        <router-link
          class="chapter-card"
          v-for="card in cards"
          :key="card.path"
          :to="card.path"
        >
          <div class="card-num">{{ card.num }}</div>
          <div class="card-icon">{{ card.icon }}</div>
          <div class="card-body">
            <div class="card-title">{{ card.title }}</div>
            <div class="card-desc">{{ card.desc }}</div>
          </div>
          <div class="card-tags">
            <span class="tag-pill" :class="card.color" v-for="t in card.tags" :key="t">{{ t }}</span>
          </div>
          <div class="card-arrow">→</div>
        </router-link>
      </div>
    </div>

    <!-- Problem/Solution Section -->
    <div class="section">
      <div class="section-title">The Problem Docker Solves</div>
      <div class="section-sub">The classic developer nightmare — and the fix</div>
      <div class="problem-vs">
        <div class="pv-side bad">
          <div class="pv-label">
            <span class="pv-badge red">Without Docker</span>
          </div>
          <ul>
            <li>"Works on my machine" — breaks in production</li>
            <li>2-day onboarding for new team members</li>
            <li>Node 16 locally, Node 18 in CI, chaos</li>
            <li>Manual dependency installation</li>
            <li>Environment-specific bugs impossible to reproduce</li>
            <li>Deployment = SSH + pray</li>
          </ul>
        </div>
        <div class="pv-divider">VS</div>
        <div class="pv-side good">
          <div class="pv-label">
            <span class="pv-badge green">With Docker</span>
          </div>
          <ul>
            <li>Identical environment on every machine</li>
            <li><code>docker compose up</code> — running in 3 minutes</li>
            <li>Pinned Node version in Dockerfile — always consistent</li>
            <li>Dependencies bundled inside the image</li>
            <li>Reproduce any bug with the exact same container</li>
            <li>Ship the same image that passed tests</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Quick Start -->
    <div class="section">
      <div class="section-title">Quick Start</div>
      <div class="section-sub">Get your first container running in 4 steps</div>
      <div class="steps">
        <div class="step" v-for="(s, i) in steps" :key="i">
          <div class="step-num">{{ i + 1 }}</div>
          <div class="step-content">
            <div class="step-title">{{ s.title }}</div>
            <div class="step-desc">{{ s.desc }}</div>
            <div class="code-block" v-if="s.code" style="margin-top:12px">
              <div class="code-header">
                <div class="code-dots"><span></span><span></span><span></span></div>
                <span class="code-lang">terminal</span>
              </div>
              <div class="code-body"><pre>{{ s.code }}</pre></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tech Stack -->
    <div class="section">
      <div class="section-title">What You'll Containerize</div>
      <div class="tech-grid">
        <div class="tech-card" v-for="t in techStack" :key="t.name">
          <span class="tech-icon">{{ t.icon }}</span>
          <span class="tech-name">{{ t.name }}</span>
        </div>
      </div>
    </div>

    <div class="nav-footer">
      <router-link to="/what-is-docker" class="nav-next">Begin: What is Docker? →</router-link>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const stats = [
  { num: '6', label: 'Chapters' },
  { num: '50+', label: 'Commands' },
  { num: '10+', label: 'Code Examples' },
  { num: '1hr', label: 'Read Time' },
]

const selectedTrack = ref(localStorage.getItem('dockermaster-track') || 'fast')
const checkedItems = ref(JSON.parse(localStorage.getItem('dockermaster-checklist') || '[]'))
const projectName = ref(localStorage.getItem('dockermaster-project-name') || 'node-docker-app')
const packageManager = ref(localStorage.getItem('dockermaster-package-manager') || 'npm')
const backendPort = ref(Number(localStorage.getItem('dockermaster-backend-port')) || 5000)
const selectedServices = ref(JSON.parse(localStorage.getItem('dockermaster-stack-services') || '["backend","frontend","mongo"]'))
const copiedCompose = ref(false)

const tracks = [
  {
    id: 'fast',
    label: 'Fast path',
    title: 'Ship a working container today',
    desc: 'A short route for developers who want enough Docker to build, run, and debug a Node app quickly.',
    items: [
      { step: '01', title: 'Build the mental model', path: '/what-is-docker', time: '8 min' },
      { step: '02', title: 'Convert npm scripts', path: '/converting', time: '18 min' },
      { step: '03', title: 'Keep commands nearby', path: '/commands', time: 'Reference' },
    ],
  },
  {
    id: 'team',
    label: 'Team setup',
    title: 'Standardize a full-stack workflow',
    desc: 'Best when you are preparing a repeatable dev environment for teammates or onboarding.',
    items: [
      { step: '01', title: 'Understand why Docker helps', path: '/why-docker', time: '10 min' },
      { step: '02', title: 'Compose the stack', path: '/compose', time: '16 min' },
      { step: '03', title: 'Debug with the CLI', path: '/commands', time: 'Reference' },
    ],
  },
  {
    id: 'prod',
    label: 'Production',
    title: 'Harden images for deployment',
    desc: 'A focused route through caching, multi-stage builds, environment files, and deployment-safe commands.',
    items: [
      { step: '01', title: 'Review Docker benefits', path: '/why-docker', time: '10 min' },
      { step: '02', title: 'Use production Dockerfiles', path: '/converting', time: '20 min' },
      { step: '03', title: 'Compose with env files', path: '/compose', time: '16 min' },
    ],
  },
]

const checklist = [
  { id: 'dockerfile', text: 'Create a Dockerfile for the backend' },
  { id: 'ignore', text: 'Add .dockerignore before the first build' },
  { id: 'compose', text: 'Wire services with docker-compose.yml' },
  { id: 'env', text: 'Move secrets into .env and commit .env.example' },
  { id: 'debug', text: 'Practice logs, exec, inspect, and stats commands' },
]

const activeTrack = computed(() => tracks.find((track) => track.id === selectedTrack.value) || tracks[0])
const doneCount = computed(() => checkedItems.value.length)

const stackOptions = [
  { id: 'backend', icon: '🟢', label: 'Node API', note: 'Express backend' },
  { id: 'frontend', icon: '⚡', label: 'Vite UI', note: 'Vue or React' },
  { id: 'mongo', icon: '🍃', label: 'MongoDB', note: 'Document data' },
  { id: 'postgres', icon: '🐘', label: 'Postgres', note: 'Relational data' },
  { id: 'redis', icon: '🔴', label: 'Redis', note: 'Cache and queues' },
]

const safeProjectName = computed(() => {
  const name = projectName.value.toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-|-$/g, '')
  return name || 'node-docker-app'
})

const packageCommand = computed(() => {
  const map = {
    npm: 'npm run dev',
    pnpm: 'pnpm dev',
    yarn: 'yarn dev',
  }
  return map[packageManager.value] || map.npm
})

const builderSummary = computed(() => [
  { label: 'Network', value: `${safeProjectName.value}-net` },
  { label: 'Hot reload', value: selectedServices.value.includes('backend') || selectedServices.value.includes('frontend') ? 'Enabled' : 'No app service' },
  { label: 'Data layer', value: selectedServices.value.filter((id) => ['mongo', 'postgres', 'redis'].includes(id)).length || 'None' },
])

const generatedCompose = computed(() => {
  const services = []

  if (selectedServices.value.includes('backend')) {
    services.push(`  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.dev
    command: ${packageCommand.value}
    ports:
      - "${backendPort.value || 5000}:${backendPort.value || 5000}"
    volumes:
      - ./backend:/app
      - /app/node_modules
    environment:
      NODE_ENV: development
      PORT: ${backendPort.value || 5000}
    networks:
      - app-network`)
  }

  if (selectedServices.value.includes('frontend')) {
    services.push(`  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.dev
    command: ${packageCommand.value}
    ports:
      - "5173:5173"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    networks:
      - app-network`)
  }

  if (selectedServices.value.includes('mongo')) {
    services.push(`  mongo:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    networks:
      - app-network`)
  }

  if (selectedServices.value.includes('postgres')) {
    services.push(`  postgres:
    image: postgres:16-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: app
      POSTGRES_PASSWORD: app
      POSTGRES_DB: ${safeProjectName.value.replaceAll('-', '_')}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - app-network`)
  }

  if (selectedServices.value.includes('redis')) {
    services.push(`  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    networks:
      - app-network`)
  }

  const volumes = [
    selectedServices.value.includes('mongo') ? '  mongo_data:' : '',
    selectedServices.value.includes('postgres') ? '  postgres_data:' : '',
  ].filter(Boolean).join('\n')

  return `name: ${safeProjectName.value}

services:
${services.length ? services.join('\n\n') : '  scratch:\n    image: alpine\n    command: ["echo", "Choose at least one service"]'}

${volumes ? `volumes:\n${volumes}\n\n` : ''}networks:
  app-network:
    name: ${safeProjectName.value}-net`
})

const toggleService = (id) => {
  selectedServices.value = selectedServices.value.includes(id)
    ? selectedServices.value.filter((service) => service !== id)
    : [...selectedServices.value, id]
}

const copyGeneratedCompose = async () => {
  try {
    await navigator.clipboard.writeText(generatedCompose.value)
    copiedCompose.value = true
    setTimeout(() => { copiedCompose.value = false }, 1500)
  } catch (e) {
    copiedCompose.value = false
  }
}

watch(selectedTrack, (value) => localStorage.setItem('dockermaster-track', value))
watch(checkedItems, (value) => localStorage.setItem('dockermaster-checklist', JSON.stringify(value)))
watch(projectName, (value) => localStorage.setItem('dockermaster-project-name', value))
watch(packageManager, (value) => localStorage.setItem('dockermaster-package-manager', value))
watch(backendPort, (value) => localStorage.setItem('dockermaster-backend-port', String(value || 5000)))
watch(selectedServices, (value) => localStorage.setItem('dockermaster-stack-services', JSON.stringify(value)))

const cards = [
  {
    path: '/what-is-docker', num: '01', icon: '📦',
    title: 'What is Docker?',
    desc: 'Images, containers, Dockerfile, Docker Hub, volumes, and architecture — the complete mental model.',
    tags: ['Fundamentals', 'Architecture'],
    color: 'blue'
  },
  {
    path: '/why-docker', num: '02', icon: '🎯',
    title: 'Why Use Docker?',
    desc: 'Six core benefits, real developer scenarios, and how Docker fits into your workflow from dev to prod.',
    tags: ['Benefits', 'Use Cases'],
    color: 'green'
  },
  {
    path: '/converting', num: '03', icon: '🔄',
    title: 'npm → Docker',
    desc: 'Migrate your Express backend and React/Vue frontend to Docker. Dev and production Dockerfiles explained.',
    tags: ['Practical', 'Node.js'],
    color: 'orange'
  },
  {
    path: '/compose', num: '04', icon: '🧩',
    title: 'Docker Compose',
    desc: 'Orchestrate your entire stack — MongoDB, backend, frontend — with one YAML file and one command.',
    tags: ['Orchestration', 'Full Stack'],
    color: 'purple'
  },
  {
    path: '/commands', num: '05', icon: '💻',
    title: 'CLI Reference',
    desc: 'Every Docker command organized by category with real examples, tags, and a searchable cheatsheet.',
    tags: ['Reference', 'Commands'],
    color: 'yellow'
  },
]

const steps = [
  {
    title: 'Install Docker Desktop',
    desc: 'Download from docker.com/get-docker. Includes Docker Engine, CLI, and Docker Compose. Supports Mac, Windows, and Linux.',
    code: '# Verify installation\ndocker --version\ndocker compose version'
  },
  {
    title: 'Create a Dockerfile',
    desc: 'Add a Dockerfile to your Node.js project root. This defines how your app gets packaged into an image.',
    code: '# backend/Dockerfile.dev\nFROM node:20-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install\nCOPY . .\nEXPOSE 5000\nCMD ["npm", "run", "dev"]'
  },
  {
    title: 'Build the image',
    desc: 'Docker reads your Dockerfile and builds an image with all dependencies baked in.',
    code: 'docker build -t my-backend:dev .'
  },
  {
    title: 'Run a container',
    desc: 'Start a container from your image. Port 5000 on your machine maps to port 5000 in the container.',
    code: 'docker run -p 5000:5000 my-backend:dev\n# Visit http://localhost:5000 🎉'
  },
]

const techStack = [
  { icon: '🟢', name: 'Node.js' },
  { icon: '⚡', name: 'Express' },
  { icon: '⚛️', name: 'React' },
  { icon: '💚', name: 'Vue' },
  { icon: '🍃', name: 'MongoDB' },
  { icon: '🐘', name: 'PostgreSQL' },
  { icon: '🔴', name: 'Redis' },
  { icon: '🌐', name: 'Nginx' },
]
</script>

<style scoped>
/* Hero */
.hero {
  margin-bottom: 64px;
  padding-bottom: 48px;
  border-bottom: 1px solid var(--border);
}
.hero-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-family: var(--font-mono);
  color: var(--accent);
  background: rgba(14,181,245,0.06);
  border: 1px solid rgba(14,181,245,0.2);
  padding: 5px 14px;
  border-radius: 20px;
  margin-bottom: 24px;
  letter-spacing: 0;
}
.eyebrow-dot {
  width: 7px; height: 7px;
  background: var(--accent);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.7); }
}

.hero-title {
  font-family: var(--font-display);
  font-size: clamp(38px, 6vw, 64px);
  font-weight: 700;
  line-height: 1.0;
  letter-spacing: 0;
  color: var(--text);
  margin-bottom: 20px;
}
.hero-gradient {
  background: linear-gradient(135deg, #0eb5f5 0%, #00e887 60%, #60cdff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.hero-desc {
  font-size: 17px;
  color: var(--text2);
  line-height: 1.7;
  max-width: 560px;
  margin-bottom: 32px;
}
.hero-cta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}
.cta-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: var(--accent);
  color: #000;
  border-radius: var(--radius);
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.2s ease;
  font-family: var(--font-display);
}
.cta-primary:hover {
  background: #35c7ff;
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgba(14,181,245,0.3);
}
.cta-secondary {
  display: inline-flex;
  align-items: center;
  padding: 12px 24px;
  background: var(--bg3);
  border: 1px solid var(--border2);
  color: var(--text2);
  border-radius: var(--radius);
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
}
.cta-secondary:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.stats-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 0;
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  width: fit-content;
}
.stat-item {
  padding: 14px 28px;
  text-align: center;
  border-right: 1px solid var(--border);
}
.stat-item:last-child { border-right: none; }
.stat-num {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 700;
  color: var(--text);
  line-height: 1.1;
}
.stat-label {
  font-size: 10px;
  color: var(--text3);
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 0;
  margin-top: 2px;
}

/* Chapter Cards */
.cards-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 24px;
}
.chapter-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 20px;
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  text-decoration: none;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}
.chapter-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(14,181,245,0.03), transparent);
  opacity: 0;
  transition: opacity 0.2s;
}
.chapter-card:hover { border-color: var(--border2); transform: translateX(2px); }
.chapter-card:hover::before { opacity: 1; }
.card-num {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text4);
  min-width: 24px;
}
.card-icon { font-size: 22px; flex-shrink: 0; }
.card-body { flex: 1; min-width: 0; }
.card-title {
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 4px;
}
.card-desc {
  font-size: 12.5px;
  color: var(--text2);
  line-height: 1.5;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.card-tags { display: flex; gap: 6px; flex-shrink: 0; }
.card-arrow { color: var(--text3); font-size: 16px; transition: transform 0.2s, color 0.2s; }
.chapter-card:hover .card-arrow { transform: translateX(3px); color: var(--accent); }

/* Problem vs */
.problem-vs {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 0;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  margin-top: 24px;
}
.pv-side {
  padding: 28px 28px;
}
.pv-side.bad { background: rgba(244, 71, 71, 0.03); }
.pv-side.good { background: rgba(0, 232, 135, 0.03); }
.pv-label { margin-bottom: 20px; }
.pv-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 14px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  font-family: var(--font-mono);
  letter-spacing: 0;
  text-transform: uppercase;
}
.pv-badge.red { background: rgba(244,71,71,0.12); color: var(--red); border: 1px solid rgba(244,71,71,0.25); }
.pv-badge.green { background: rgba(0,232,135,0.12); color: var(--green); border: 1px solid rgba(0,232,135,0.25); }
.pv-side ul { list-style: none; }
.pv-side li {
  padding: 9px 0;
  font-size: 13.5px;
  border-bottom: 1px solid var(--border);
  color: var(--text2);
  line-height: 1.5;
  display: flex;
  align-items: flex-start;
  gap: 8px;
}
.pv-side li:last-child { border-bottom: none; }
.pv-side.bad li::before { content: '✗'; color: var(--red); flex-shrink: 0; font-weight: 700; }
.pv-side.good li::before { content: '✓'; color: var(--green); flex-shrink: 0; font-weight: 700; }
.pv-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  background: var(--bg3);
  border-left: 1px solid var(--border);
  border-right: 1px solid var(--border);
  font-family: var(--font-display);
  font-size: 12px;
  font-weight: 700;
  color: var(--text3);
  writing-mode: vertical-rl;
  letter-spacing: 0;
}

/* Steps */
.steps { display: flex; flex-direction: column; gap: 0; margin-top: 24px; }
.step {
  display: flex;
  gap: 24px;
  padding-bottom: 36px;
  position: relative;
}
.step:not(:last-child)::before {
  content: '';
  position: absolute;
  left: 19px; top: 46px; bottom: 0;
  width: 1px;
  background: linear-gradient(to bottom, var(--border2), var(--border));
}
.step-num {
  width: 40px; height: 40px; min-width: 40px;
  background: var(--accent);
  color: #000;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 700;
  flex-shrink: 0;
}
.step-content { flex: 1; padding-top: 8px; }
.step-title {
  font-family: var(--font-display);
  font-size: 17px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 6px;
  letter-spacing: 0;
}
.step-desc { font-size: 14px; color: var(--text2); line-height: 1.65; }

/* Tech Stack */
.tech-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 20px;
}
.tech-card {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  font-size: 13px;
  font-weight: 500;
  color: var(--text2);
  transition: all 0.2s;
}
.tech-card:hover { border-color: var(--border2); color: var(--text); }
.tech-icon { font-size: 16px; }
.tech-name { font-family: var(--font-mono); }

/* Learning Dashboard */
.dashboard-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) minmax(280px, 0.75fr);
  gap: 16px;
  margin-top: 24px;
}
.focus-panel,
.checklist-panel {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 20px;
}
.panel-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}
.panel-label {
  color: var(--accent);
  font-family: var(--font-mono);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0;
}
.track-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 18px 0;
}
.track-tab {
  border: 1px solid var(--border);
  background: var(--bg3);
  color: var(--text2);
  border-radius: var(--radius);
  padding: 8px 12px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 800;
}
.track-tab.active {
  color: #061016;
  background: var(--green);
  border-color: var(--green);
}
.track-list {
  display: grid;
  gap: 8px;
}
.track-item {
  display: grid;
  grid-template-columns: 42px 1fr auto;
  gap: 12px;
  align-items: center;
  text-decoration: none;
  color: var(--text2);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 12px;
  background: var(--bg3);
}
.track-item:hover { border-color: var(--accent); color: var(--text); }
.track-item span,
.track-item small {
  color: var(--text3);
  font-family: var(--font-mono);
  font-size: 11px;
}
.track-item strong { color: var(--text); }
.check-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 11px 0;
  border-top: 1px solid var(--border);
  color: var(--text2);
  font-size: 13px;
}
.check-row input {
  margin-top: 3px;
  accent-color: var(--green);
}

/* Starter Kit Builder */
.builder-grid {
  display: grid;
  grid-template-columns: minmax(280px, 0.8fr) minmax(0, 1.2fr);
  gap: 16px;
  align-items: start;
  margin-top: 24px;
}
.builder-panel {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 20px;
}
.builder-field {
  display: grid;
  gap: 7px;
  margin-top: 16px;
}
.builder-field.split {
  grid-template-columns: 1fr 120px;
  gap: 10px;
}
.builder-field.split > div {
  display: grid;
  gap: 7px;
}
.builder-field label {
  color: var(--text3);
  font-family: var(--font-mono);
  font-size: 11px;
  text-transform: uppercase;
}
.builder-field input,
.builder-field select {
  min-height: 40px;
  width: 100%;
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  color: var(--text);
  outline: none;
  padding: 9px 11px;
}
.builder-field input:focus,
.builder-field select:focus {
  border-color: var(--accent);
}
.service-picker {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  margin-top: 16px;
}
.service-chip {
  display: grid;
  grid-template-columns: 28px 1fr;
  gap: 2px 8px;
  align-items: center;
  min-height: 62px;
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  color: var(--text2);
  cursor: pointer;
  padding: 10px;
  text-align: left;
  transition: border-color 0.18s, background 0.18s, transform 0.18s;
}
.service-chip:hover {
  border-color: var(--border2);
  transform: translateY(-1px);
}
.service-chip.active {
  background: rgba(32,199,232,0.1);
  border-color: rgba(32,199,232,0.38);
}
.service-chip span {
  grid-row: span 2;
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: var(--radius);
}
.service-chip strong {
  font-size: 13px;
  line-height: 1.1;
}
.service-chip small {
  color: var(--text3);
  font-size: 11px;
}
.builder-summary {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  margin-top: 16px;
}
.builder-summary div {
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 10px;
  min-width: 0;
}
.builder-summary span {
  display: block;
  color: var(--text3);
  font-family: var(--font-mono);
  font-size: 10px;
  margin-bottom: 3px;
}
.builder-summary strong {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
}
.builder-preview .code-block {
  margin: 0;
}
.builder-preview .code-body {
  max-height: 560px;
}
.copy-code-btn {
  border: 1px solid var(--border2);
  background: var(--bg2);
  color: var(--text2);
  border-radius: var(--radius);
  cursor: pointer;
  font-size: 11px;
  font-weight: 800;
  padding: 5px 10px;
}
.copy-code-btn:hover {
  color: var(--accent);
  border-color: rgba(32,199,232,0.38);
}

@media (max-width: 700px) {
  .dashboard-grid,
  .builder-grid { grid-template-columns: 1fr; }
  .panel-top { align-items: flex-start; flex-direction: column; }
  .track-item { grid-template-columns: 38px 1fr; }
  .track-item small { grid-column: 2; }
  .problem-vs { grid-template-columns: 1fr; }
  .pv-divider { writing-mode: horizontal-tb; padding: 12px 24px; }
  .stats-bar { width: 100%; }
  .stat-item { flex: 1 1 50%; padding: 12px 16px; border-bottom: 1px solid var(--border); }
  .stat-item:nth-child(2n) { border-right: none; }
  .card-tags { display: none; }
}

@media (max-width: 560px) {
  .hero { margin-bottom: 42px; padding-bottom: 34px; }
  .hero-title { font-size: 36px; line-height: 1.08; }
  .hero-desc { font-size: 15px; }
  .hero-cta { align-items: stretch; flex-direction: column; }
  .cta-primary,
  .cta-secondary { justify-content: center; width: 100%; }
  .chapter-card { align-items: flex-start; flex-wrap: wrap; gap: 12px; padding: 16px; }
  .card-body { flex-basis: calc(100% - 64px); }
  .card-desc { white-space: normal; }
  .card-arrow { margin-left: auto; }
  .builder-field.split,
  .service-picker,
  .builder-summary { grid-template-columns: 1fr; }
  .pv-side { padding: 20px 18px; }
  .step { gap: 14px; padding-bottom: 28px; }
  .step-num { width: 34px; height: 34px; min-width: 34px; }
  .step:not(:last-child)::before { left: 16px; top: 40px; }
  .tech-card { flex: 1 1 calc(50% - 8px); justify-content: center; }
}

@media (max-width: 390px) {
  .hero-title { font-size: 32px; }
  .stat-item { flex-basis: 100%; border-right: none; }
  .track-tabs { display: grid; grid-template-columns: 1fr; }
  .tech-card { flex-basis: 100%; }
}
</style>
