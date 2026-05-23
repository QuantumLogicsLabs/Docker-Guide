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
const stats = [
  { num: '6', label: 'Chapters' },
  { num: '50+', label: 'Commands' },
  { num: '10+', label: 'Code Examples' },
  { num: '1hr', label: 'Read Time' },
]

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
  letter-spacing: 0.3px;
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
  letter-spacing: -2px;
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
  letter-spacing: 0.8px;
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
  letter-spacing: 0.5px;
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
  letter-spacing: 3px;
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
  letter-spacing: -0.3px;
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

@media (max-width: 700px) {
  .problem-vs { grid-template-columns: 1fr; }
  .pv-divider { writing-mode: horizontal-tb; padding: 12px 24px; }
  .stats-bar { width: 100%; }
  .stat-item { flex: 1; padding: 12px 16px; }
  .card-tags { display: none; }
}
</style>