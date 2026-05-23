<template>
  <div>
    <div class="page-header">
      <div class="page-tag">Chapter 01 — Fundamentals</div>
      <h1 class="page-title">What is <span>Docker?</span></h1>
      <p class="page-desc">Docker packages your application and all its dependencies into a standardized unit called a container — so it runs identically on any machine, any environment, any cloud.</p>
    </div>

    <!-- Analogy -->
    <div class="section">
      <div class="section-title">The Shipping Container Analogy</div>
      <div class="analogy-box">
        <div class="analogy-col">
          <div class="analogy-icon">🚢</div>
          <div class="analogy-body">
            <div class="analogy-head">Shipping Industry (1950s)</div>
            <p>Before standardized containers, loading cargo was chaotic. Every item needed custom handling. Containers solved this — stack them anywhere, ship them on any vessel, same format.</p>
          </div>
        </div>
        <div class="analogy-arrow">
          <div class="arrow-line"></div>
          <div class="arrow-label">Same Idea</div>
          <div class="arrow-line"></div>
        </div>
        <div class="analogy-col">
          <div class="analogy-icon">🐳</div>
          <div class="analogy-body">
            <div class="analogy-head">Software (Docker, 2013)</div>
            <p>Before containers, deploying apps was chaotic. Different OS, Node versions, library conflicts. Docker packages everything into a container — run it anywhere, same result every time.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Core Concepts -->
    <div class="section">
      <div class="section-title">Core Concepts</div>
      <div class="section-sub">The six building blocks of Docker you must understand</div>
      <div class="concepts-grid">
        <div class="concept-card" v-for="c in concepts" :key="c.term">
          <div class="concept-header">
            <span class="concept-icon">{{ c.icon }}</span>
            <span class="tag-pill blue">{{ c.term }}</span>
          </div>
          <div class="concept-def">{{ c.def }}</div>
          <div class="concept-example" v-if="c.example">
            <span class="eg-badge">Example</span>
            <code>{{ c.example }}</code>
          </div>
        </div>
      </div>
    </div>

    <!-- Container vs VM -->
    <div class="section">
      <div class="section-title">Container vs Virtual Machine</div>
      <div class="section-sub">Similar problem, very different approach</div>
      <div class="compare-table">
        <div class="ct-head">
          <div class="ct-cell ct-label"></div>
          <div class="ct-cell">
            <span class="ct-brand docker">🐳 Docker Container</span>
          </div>
          <div class="ct-cell">
            <span class="ct-brand vm">💻 Virtual Machine</span>
          </div>
        </div>
        <div class="ct-row" v-for="r in compareRows" :key="r.aspect">
          <div class="ct-cell ct-label">{{ r.aspect }}</div>
          <div class="ct-cell ct-docker">
            <span class="ct-badge green">{{ r.docker }}</span>
          </div>
          <div class="ct-cell ct-vm">
            <span>{{ r.vm }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Architecture -->
    <div class="section">
      <div class="section-title">Docker Architecture</div>
      <div class="arch-diagram">
        <div class="arch-layer client-layer">
          <div class="arch-layer-title">
            <span class="arch-layer-icon">🖥️</span>
            Docker CLI / Docker Desktop
          </div>
          <div class="arch-layer-desc">The interface you interact with. Sends REST API commands to the daemon.</div>
          <div class="arch-cmds">
            <span class="arch-cmd" v-for="cmd in ['docker build', 'docker run', 'docker pull', 'docker ps']" :key="cmd">{{ cmd }}</span>
          </div>
        </div>
        <div class="arch-connector">
          <div class="arch-conn-line"></div>
          <span class="arch-conn-label">REST API</span>
          <div class="arch-conn-line"></div>
        </div>
        <div class="arch-layer daemon-layer">
          <div class="arch-layer-title">
            <span class="arch-layer-icon">⚙️</span>
            Docker Daemon (dockerd)
          </div>
          <div class="arch-layer-desc">Background process that manages all Docker objects: images, containers, networks, and volumes.</div>
        </div>
        <div class="arch-connector">
          <div class="arch-conn-line"></div>
          <span class="arch-conn-label">Pulls / Pushes</span>
          <div class="arch-conn-line"></div>
        </div>
        <div class="arch-layer registry-layer">
          <div class="arch-layer-title">
            <span class="arch-layer-icon">🗄️</span>
            Docker Registry (Docker Hub)
          </div>
          <div class="arch-layer-desc">Stores and distributes Docker images. hub.docker.com hosts millions of public images — node, mongo, nginx, etc.</div>
        </div>
      </div>
    </div>

    <!-- Lifecycle -->
    <div class="section">
      <div class="section-title">The Docker Lifecycle</div>
      <div class="lifecycle">
        <div class="lc-step" v-for="(step, i) in lifecycle" :key="i">
          <div class="lc-body">
            <div class="lc-icon">{{ step.icon }}</div>
            <div class="lc-text">{{ step.text }}</div>
            <div class="lc-cmd"><code>{{ step.cmd }}</code></div>
          </div>
          <div class="lc-arrow" v-if="i < lifecycle.length - 1">
            <svg width="32" height="16" viewBox="0 0 32 16"><path d="M0 8h28M22 3l7 5-7 5" stroke="var(--accent)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Key Dockerfile Commands -->
    <div class="section">
      <div class="section-title">Dockerfile Instructions</div>
      <div class="section-sub">The instructions you'll use in every Dockerfile</div>
      <div class="code-block">
        <div class="code-header">
          <div class="code-dots"><span></span><span></span><span></span></div>
          <span class="code-filename">Dockerfile — annotated reference</span>
        </div>
        <div class="code-body"><pre><span class="cm"># Base image — your starting point</span>
<span class="kw">FROM</span> node:<span class="num">20-alpine</span>

<span class="cm"># Set working directory inside container</span>
<span class="kw">WORKDIR</span> <span class="str">/app</span>

<span class="cm"># Copy package files first (enables build layer caching)</span>
<span class="kw">COPY</span> package*.json ./

<span class="cm"># Install dependencies</span>
<span class="kw">RUN</span> npm install

<span class="cm"># Copy source code</span>
<span class="kw">COPY</span> . .

<span class="cm"># Build the app (for production)</span>
<span class="kw">RUN</span> npm run build

<span class="cm"># Document which port the app uses</span>
<span class="kw">EXPOSE</span> <span class="num">5000</span>

<span class="cm"># Default command to start the app</span>
<span class="kw">CMD</span> [<span class="str">"node"</span>, <span class="str">"server.js"</span>]</pre></div>
      </div>
      <div class="instruction-grid">
        <div class="instruction-item" v-for="inst in instructions" :key="inst.cmd">
          <div class="inst-cmd"><span class="tag-pill blue">{{ inst.cmd }}</span></div>
          <div class="inst-desc">{{ inst.desc }}</div>
        </div>
      </div>
    </div>

    <div class="nav-footer">
      <router-link to="/" class="nav-prev">← Introduction</router-link>
      <router-link to="/why-docker" class="nav-next">Why Use Docker? →</router-link>
    </div>
  </div>
</template>

<script setup>
const concepts = [
  { icon: '🖼️', term: 'Image', def: 'A read-only blueprint of your application. Contains the OS base, runtime, dependencies, and your code — all baked in. Think of it as a class in OOP.', example: 'node:20-alpine, mongo:7, your-app:1.0' },
  { icon: '📦', term: 'Container', def: 'A running instance of an image. Isolated, lightweight, and ephemeral. One image can spawn many containers simultaneously. Like an object instance in OOP.', example: 'docker run -p 5000:5000 my-backend' },
  { icon: '📝', term: 'Dockerfile', def: 'A text file with step-by-step instructions to build a Docker image. Docker reads it top-to-bottom and builds an image layer by layer.', example: 'FROM node:20 → COPY → RUN npm install → CMD' },
  { icon: '🗄️', term: 'Registry', def: 'A server that stores and distributes Docker images. Docker Hub is the public default. AWS ECR, GHCR, and GCR are private alternatives.', example: 'hub.docker.com/r/library/node' },
  { icon: '💾', term: 'Volume', def: 'Persistent storage managed by Docker that survives container restarts and removal. Containers are ephemeral — volumes are how data persists.', example: 'mongo_data:/data/db — persists your DB' },
  { icon: '🌐', term: 'Network', def: 'A virtual network connecting containers. Containers on the same Docker network can reach each other by service name, not IP address.', example: 'backend → mongodb://mongo:27017' },
]

const compareRows = [
  { aspect: 'Startup time', docker: 'Milliseconds', vm: 'Minutes' },
  { aspect: 'Disk size', docker: 'MBs (Alpine: ~5MB)', vm: 'GBs (full OS)' },
  { aspect: 'OS', docker: 'Shares host kernel', vm: 'Full guest OS' },
  { aspect: 'Isolation', docker: 'Process-level (namespace)', vm: 'Hardware-level (hypervisor)' },
  { aspect: 'Performance', docker: 'Near-native speed', vm: 'Overhead from hypervisor' },
  { aspect: 'Portability', docker: 'Run any container image', vm: 'Tied to VM image format' },
  { aspect: 'Use case', docker: 'App packaging & deployment', vm: 'Full OS isolation, legacy apps' },
]

const lifecycle = [
  { icon: '📝', text: 'Write', cmd: 'Dockerfile' },
  { icon: '🏗️', text: 'Build', cmd: 'docker build' },
  { icon: '🖼️', text: 'Image', cmd: 'docker images' },
  { icon: '🚀', text: 'Run', cmd: 'docker run' },
  { icon: '📤', text: 'Push', cmd: 'docker push' },
  { icon: '☁️', text: 'Deploy', cmd: 'Production' },
]

const instructions = [
  { cmd: 'FROM', desc: 'Sets the base image. Every Dockerfile must start with this.' },
  { cmd: 'WORKDIR', desc: 'Sets the working directory for all subsequent commands.' },
  { cmd: 'COPY', desc: 'Copies files from host into the container image.' },
  { cmd: 'RUN', desc: 'Executes a command during build time. Creates a new image layer.' },
  { cmd: 'EXPOSE', desc: 'Documents which port the container listens on (informational).' },
  { cmd: 'ENV', desc: 'Sets environment variables accessible at build and runtime.' },
  { cmd: 'ARG', desc: 'Build-time variables passed via --build-arg flag.' },
  { cmd: 'CMD', desc: 'Default command to run when the container starts. Overridable.' },
  { cmd: 'ENTRYPOINT', desc: 'Main executable for the container. Combined with CMD for args.' },
  { cmd: 'VOLUME', desc: 'Creates a mount point for persistent or shared data.' },
]
</script>

<style scoped>
/* Analogy */
.analogy-box {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 0;
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  margin-top: 24px;
}
.analogy-col {
  padding: 32px 28px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.analogy-icon { font-size: 36px; }
.analogy-head {
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 8px;
}
.analogy-body p { font-size: 14px; color: var(--text2); line-height: 1.7; }
.analogy-arrow {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 20px;
  background: var(--bg3);
  border-left: 1px solid var(--border);
  border-right: 1px solid var(--border);
  gap: 10px;
}
.arrow-line { width: 1px; flex: 1; background: var(--border2); }
.arrow-label {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--text3);
  writing-mode: vertical-rl;
  letter-spacing: 2px;
  text-transform: uppercase;
}

/* Concepts */
.concepts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-top: 24px;
}
.concept-card {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 20px;
  transition: border-color 0.2s;
}
.concept-card:hover { border-color: var(--border2); }
.concept-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}
.concept-icon { font-size: 20px; }
.concept-def { font-size: 13.5px; color: var(--text2); line-height: 1.7; margin-bottom: 12px; }
.concept-example {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  flex-wrap: wrap;
}
.eg-badge {
  font-family: var(--font-mono);
  font-size: 9px;
  background: var(--bg4);
  color: var(--text3);
  padding: 2px 6px;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  flex-shrink: 0;
  margin-top: 2px;
}

/* Compare Table */
.compare-table {
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  margin-top: 24px;
}
.ct-head, .ct-row { display: grid; grid-template-columns: 1fr 1.3fr 1.3fr; }
.ct-head {
  background: var(--bg3);
  border-bottom: 1px solid var(--border);
}
.ct-cell {
  padding: 12px 16px;
  font-size: 13px;
  color: var(--text2);
  border-right: 1px solid var(--border);
  display: flex;
  align-items: center;
}
.ct-cell:last-child { border-right: none; }
.ct-row { border-bottom: 1px solid var(--border); transition: background 0.15s; }
.ct-row:last-child { border-bottom: none; }
.ct-row:hover { background: var(--bg3); }
.ct-label { font-size: 13px; font-weight: 600; color: var(--text2); }
.ct-brand { font-weight: 700; font-size: 13px; }
.ct-brand.docker { color: var(--accent); }
.ct-brand.vm { color: var(--text2); }
.ct-badge {
  font-family: var(--font-mono);
  font-size: 12px;
}
.ct-badge.green { color: var(--green); }
.ct-docker code { background: transparent; border: none; color: var(--green); padding: 0; }

/* Architecture */
.arch-diagram { display: flex; flex-direction: column; align-items: stretch; gap: 0; margin-top: 24px; }
.arch-layer {
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 20px 24px;
}
.client-layer { border-color: rgba(14,181,245,0.3); background: rgba(14,181,245,0.03); }
.daemon-layer { border-color: rgba(168,85,247,0.3); background: rgba(168,85,247,0.03); }
.registry-layer { border-color: rgba(0,232,135,0.3); background: rgba(0,232,135,0.03); }
.arch-layer-title {
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.arch-layer-icon { font-size: 20px; }
.arch-layer-desc { font-size: 13.5px; color: var(--text2); line-height: 1.6; }
.arch-cmds { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 12px; }
.arch-cmd {
  font-family: var(--font-mono);
  font-size: 12px;
  background: var(--bg4);
  border: 1px solid var(--border2);
  color: var(--accent);
  padding: 4px 10px;
  border-radius: 6px;
}
.arch-connector {
  display: flex;
  align-items: center;
  padding: 0 24px;
  gap: 12px;
  margin: 4px 0;
}
.arch-conn-line { flex: 1; height: 1px; background: var(--border2); }
.arch-conn-label {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text3);
  white-space: nowrap;
}

/* Lifecycle */
.lifecycle {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0;
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 28px 24px;
  margin-top: 24px;
  overflow-x: auto;
}
.lc-step { display: flex; align-items: center; gap: 0; }
.lc-body { text-align: center; padding: 0 12px; }
.lc-icon { font-size: 24px; margin-bottom: 8px; }
.lc-text {
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 4px;
}
.lc-cmd code { font-size: 11px; }
.lc-arrow { padding: 0 4px; flex-shrink: 0; }

/* Instruction Grid */
.instruction-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-top: 16px;
}
.instruction-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 16px;
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: var(--radius);
}
.inst-cmd { flex-shrink: 0; }
.inst-desc { font-size: 13px; color: var(--text2); line-height: 1.5; }

@media (max-width: 700px) {
  .concepts-grid { grid-template-columns: 1fr; }
  .ct-head, .ct-row { grid-template-columns: 0.8fr 1fr 1fr; }
  .instruction-grid { grid-template-columns: 1fr; }
  .analogy-box { grid-template-columns: 1fr; }
  .analogy-arrow { writing-mode: horizontal-tb; padding: 12px 24px; }
  .arrow-label { writing-mode: horizontal-tb; }
  .arrow-line { width: 32px; height: 1px; }
}
</style>