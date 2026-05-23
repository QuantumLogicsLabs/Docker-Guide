<template>
  <div>
    <div class="page-header">
      <div class="page-tag">Chapter 02 — Purpose</div>
      <h1 class="page-title">Why Use <span>Docker?</span></h1>
      <p class="page-desc">Docker solves real, painful developer problems. Here's exactly why you should containerize your Node.js apps — with real scenarios, not marketing fluff.</p>
    </div>

    <!-- Benefits Grid -->
    <div class="section">
      <div class="section-title">The 6 Core Benefits</div>
      <div class="section-sub">Concrete advantages that change how you develop and ship software</div>
      <div class="benefits-grid">
        <div class="benefit-card" v-for="(b, i) in benefits" :key="b.title">
          <div class="benefit-num">0{{ i + 1 }}</div>
          <div class="benefit-icon">{{ b.icon }}</div>
          <div class="benefit-title">{{ b.title }}</div>
          <div class="benefit-desc">{{ b.desc }}</div>
          <div class="benefit-impact">
            <span class="impact-label">Impact</span>
            <span class="impact-bar">
              <span class="impact-fill" :style="{ width: b.impact + '%' }"></span>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Real Scenarios -->
    <div class="section">
      <div class="section-title">Real Developer Scenarios</div>
      <div class="section-sub">Pain points you've probably experienced — and how Docker fixes them</div>
      <div class="scenarios">
        <div class="scenario" v-for="s in scenarios" :key="s.problem">
          <div class="scenario-before">
            <div class="scenario-badge red">
              <span>😤</span> Without Docker
            </div>
            <p>{{ s.problem }}</p>
          </div>
          <div class="scenario-sep">
            <div class="sep-line"></div>
            <svg class="sep-arrow" width="20" height="20" viewBox="0 0 20 20">
              <path d="M4 10h12M12 6l4 4-4 4" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
            </svg>
            <div class="sep-line"></div>
          </div>
          <div class="scenario-after">
            <div class="scenario-badge green">
              <span>✅</span> With Docker
            </div>
            <p>{{ s.solution }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Workflow -->
    <div class="section">
      <div class="section-title">Docker in Your Dev Workflow</div>
      <div class="section-sub">How containers fit at each stage from development to production</div>
      <div class="workflow-grid">
        <div class="wf-card" v-for="phase in workflow" :key="phase.phase">
          <div class="wf-header">
            <span class="tag-pill" :class="phase.color">{{ phase.phase }}</span>
            <span class="wf-icon">{{ phase.icon }}</span>
          </div>
          <ul class="wf-items">
            <li v-for="item in phase.items" :key="item">{{ item }}</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Who Uses Docker -->
    <div class="section">
      <div class="section-title">Industry Adoption</div>
      <div class="highlight-box">
        Docker is the de facto industry standard for containerization. <strong>Netflix, Spotify, PayPal, Airbnb, Pinterest, and thousands of startups</strong> run their services in containers. Every major cloud platform — AWS ECS/EKS, Google Cloud Run, Azure Container Apps, Railway, Render, Fly.io — uses Docker images under the hood.
      </div>
      <div class="users-grid">
        <div class="user-card" v-for="u in users" :key="u.role">
          <div class="user-icon">{{ u.icon }}</div>
          <div class="user-body">
            <div class="user-role">{{ u.role }}</div>
            <div class="user-use">{{ u.use }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Docker Adoption Timeline -->
    <div class="section">
      <div class="section-title">Quick Facts</div>
      <div class="facts-row">
        <div class="fact-card" v-for="f in facts" :key="f.num">
          <div class="fact-num">{{ f.num }}</div>
          <div class="fact-label">{{ f.label }}</div>
        </div>
      </div>
    </div>

    <div class="nav-footer">
      <router-link to="/what-is-docker" class="nav-prev">← What is Docker?</router-link>
      <router-link to="/converting" class="nav-next">npm → Docker →</router-link>
    </div>
  </div>
</template>

<script setup>
const benefits = [
  {
    icon: '🌍', title: 'Environment Consistency', impact: 95,
    desc: '"Works on my machine" becomes irrelevant. Your app runs identically on every developer laptop, CI server, and production host.'
  },
  {
    icon: '⚡', title: 'Fast Onboarding', impact: 90,
    desc: 'New team member? docker compose up and they have the full stack running in 3 minutes — no manual setup guides, no OS-specific instructions.'
  },
  {
    icon: '🔒', title: 'Process Isolation', impact: 80,
    desc: 'Each service runs in its own container. A crash or memory leak in one container won\'t take down your entire application.'
  },
  {
    icon: '📦', title: 'Dependency Bundling', impact: 85,
    desc: 'Node version, npm packages, system libraries — all baked into the image. No more "you need to install libvips manually" in your README.'
  },
  {
    icon: '🚀', title: 'Predictable Deployments', impact: 92,
    desc: 'Build once, deploy anywhere. The same image that passed tests gets deployed to production. No surprises from environment differences.'
  },
  {
    icon: '↩️', title: 'Instant Rollbacks', impact: 75,
    desc: 'Every image is tagged. If a new release breaks production, roll back to the previous image in seconds — no git revert, no rebuild.'
  },
]

const scenarios = [
  {
    problem: 'Junior dev joins the team. Spends 2 days following a 40-step setup guide, hits macOS-specific errors, gives up and asks for help.',
    solution: 'git clone → docker compose up. Full stack running in 3 minutes. Every OS, same result. Setup guide is one command.'
  },
  {
    problem: 'Your app works on Node 18 locally but production runs Node 16. Obscure bugs appear after every deployment. Hours of debugging.',
    solution: 'Dockerfile pins node:18-alpine. Dev and prod use the exact same Node version, same binary, same behavior. Always.'
  },
  {
    problem: 'CI pipeline fails because the test runner has different system packages than your MacBook. Tests pass locally, fail in CI.',
    solution: 'CI runs your Docker image. Same image, same environment, same result everywhere. If it passes locally, it passes in CI.'
  },
  {
    problem: 'You need MongoDB 7 for a new project but your machine has MongoDB 5 installed for another project. Conflicts everywhere.',
    solution: 'Run mongo:7 on port 27018 alongside mongo:5 on 27017. No system-level conflicts. Isolated per project.'
  },
  {
    problem: 'Scaling your app means re-doing all the setup on new servers. Each new VM takes hours of provisioning and configuration.',
    solution: 'docker pull + docker run. New instances running in under a minute. Scale horizontally with a load balancer and identical containers.'
  },
]

const workflow = [
  {
    phase: 'Development', icon: '💻', color: 'blue',
    items: [
      'Mount source as volume for instant hot-reload',
      'Run databases locally — no system installation',
      'Test against exact production environment',
      'Switch Node versions per project, no conflicts',
    ]
  },
  {
    phase: 'CI/CD', icon: '🔄', color: 'orange',
    items: [
      'Build image in pipeline from your Dockerfile',
      'Run all tests inside the container',
      'Tag image with commit SHA or semver',
      'Push to registry on success',
    ]
  },
  {
    phase: 'Production', icon: '🚀', color: 'green',
    items: [
      'Pull the tested image from registry',
      'Inject environment-specific config via env vars',
      'Run behind reverse proxy (nginx/traefik)',
      'Scale horizontally with orchestration (K8s)',
    ]
  },
]

const users = [
  { icon: '👨‍💻', role: 'Solo Developer', use: 'Consistent local setup, easy context-switching between projects, simple deployment to cloud providers.' },
  { icon: '👥', role: 'Dev Team', use: 'Everyone runs the same stack. No "works on my machine." Onboarding takes minutes, not days.' },
  { icon: '🔧', role: 'DevOps Engineer', use: 'Predictable deployments, blue-green deploys, easy rollbacks, infrastructure as code.' },
  { icon: '🏢', role: 'Enterprise', use: 'Microservices architecture, multi-team isolation, Kubernetes at scale, compliance containers.' },
]

const facts = [
  { num: '13M+', label: 'Images on Docker Hub' },
  { num: '11B+', label: 'Monthly image pulls' },
  { num: '20M+', label: 'Active developers' },
  { num: '87%', label: 'Containers use Docker' },
]
</script>

<style scoped>
.benefits-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 24px;
}
.benefit-card {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 24px;
  position: relative;
  transition: border-color 0.2s, transform 0.2s;
  overflow: hidden;
}
.benefit-card:hover { border-color: var(--border2); transform: translateY(-2px); }
.benefit-num {
  position: absolute;
  top: 16px;
  right: 20px;
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--text4);
}
.benefit-icon { font-size: 28px; margin-bottom: 14px; }
.benefit-title {
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 8px;
}
.benefit-desc { font-size: 13px; color: var(--text2); line-height: 1.65; margin-bottom: 16px; }
.benefit-impact {
  display: flex;
  align-items: center;
  gap: 8px;
}
.impact-label {
  font-family: var(--font-mono);
  font-size: 9px;
  color: var(--text3);
  text-transform: uppercase;
  letter-spacing: 0;
  white-space: nowrap;
}
.impact-bar {
  flex: 1;
  height: 3px;
  background: var(--border);
  border-radius: 2px;
  overflow: hidden;
}
.impact-fill {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, var(--accent), var(--green));
  border-radius: 2px;
  transition: width 1s ease;
}

/* Scenarios */
.scenarios { display: flex; flex-direction: column; gap: 12px; margin-top: 24px; }
.scenario {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
}
.scenario-before {
  padding: 20px 24px;
  background: rgba(244, 71, 71, 0.03);
}
.scenario-after {
  padding: 20px 24px;
  background: rgba(0, 232, 135, 0.03);
}
.scenario p { font-size: 13.5px; color: var(--text2); line-height: 1.65; margin-top: 10px; }
.scenario-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  font-weight: 700;
  font-family: var(--font-mono);
  padding: 3px 10px;
  border-radius: 20px;
  text-transform: uppercase;
  letter-spacing: 0;
}
.scenario-badge.red { background: rgba(244,71,71,0.12); color: var(--red); border: 1px solid rgba(244,71,71,0.2); }
.scenario-badge.green { background: rgba(0,232,135,0.12); color: var(--green); border: 1px solid rgba(0,232,135,0.2); }
.scenario-sep {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  background: var(--bg3);
  border-left: 1px solid var(--border);
  border-right: 1px solid var(--border);
  gap: 8px;
}
.sep-line { flex: 1; width: 1px; background: var(--border2); }
.sep-arrow { flex-shrink: 0; }

/* Workflow */
.workflow-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 24px;
}
.wf-card {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 20px;
}
.wf-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.wf-icon { font-size: 20px; }
.wf-items { list-style: none; padding: 0; }
.wf-items li {
  font-size: 13px;
  color: var(--text2);
  padding: 8px 0;
  border-bottom: 1px solid var(--border);
  line-height: 1.5;
  display: flex;
  gap: 8px;
}
.wf-items li:last-child { border-bottom: none; }
.wf-items li::before { content: '→'; color: var(--accent); flex-shrink: 0; font-family: var(--font-mono); }

/* Users */
.users-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-top: 16px;
}
.user-card {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 18px 20px;
  transition: border-color 0.2s;
}
.user-card:hover { border-color: var(--border2); }
.user-icon { font-size: 24px; flex-shrink: 0; }
.user-role {
  font-family: var(--font-display);
  font-size: 14px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 4px;
}
.user-use { font-size: 13px; color: var(--text2); line-height: 1.55; }

/* Facts */
.facts-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  margin-top: 16px;
}
.fact-card {
  padding: 24px 20px;
  text-align: center;
  border-right: 1px solid var(--border);
  background: var(--bg2);
}
.fact-card:last-child { border-right: none; }
.fact-num {
  font-family: var(--font-display);
  font-size: 26px;
  font-weight: 700;
  color: var(--accent);
  margin-bottom: 4px;
}
.fact-label { font-size: 12px; color: var(--text3); font-family: var(--font-mono); }

@media (max-width: 900px) {
  .benefits-grid { grid-template-columns: repeat(2, 1fr); }
  .workflow-grid { grid-template-columns: 1fr; }
  .facts-row { grid-template-columns: repeat(2, 1fr); }
  .fact-card:nth-child(2) { border-right: none; }
  .fact-card:nth-child(3) { border-right: 1px solid var(--border); border-top: 1px solid var(--border); }
  .fact-card:nth-child(4) { border-top: 1px solid var(--border); }
}
@media (max-width: 700px) {
  .benefits-grid { grid-template-columns: 1fr; }
  .users-grid { grid-template-columns: 1fr; }
  .scenario { grid-template-columns: 1fr; }
  .scenario-sep { flex-direction: row; padding: 12px 24px; }
  .sep-line { height: 1px; width: auto; flex: 1; }
  .sep-arrow { transform: rotate(0deg); }
}

@media (max-width: 520px) {
  .benefit-card,
  .wf-card,
  .user-card { padding: 16px; }
  .scenario-before,
  .scenario-after { padding: 16px; }
  .facts-row { grid-template-columns: 1fr; }
  .fact-card,
  .fact-card:nth-child(2),
  .fact-card:nth-child(3),
  .fact-card:nth-child(4) { border-right: none; border-top: 1px solid var(--border); }
  .fact-card:first-child { border-top: none; }
  .user-card { gap: 10px; }
}
</style>
