<template>
  <div>
    <div class="page-header">
      <div class="page-tag">Chapter 04 — Orchestration</div>
      <h1 class="page-title">Docker <span>Compose</span></h1>
      <p class="page-desc">Docker Compose lets you define and run your entire multi-container application with a single YAML file. One command boots your backend, frontend, database — everything wired together.</p>
    </div>

    <!-- Why Compose -->
    <div class="section">
      <div class="section-title">Why Compose?</div>
      <div class="comparison">
        <div class="comp-col bad">
          <div class="comp-header">
            <span class="comp-badge red">😤 Without Compose</span>
            <span class="comp-count">3 terminal commands</span>
          </div>
          <div class="code-block">
            <div class="code-header">
              <div class="code-dots"><span></span><span></span><span></span></div>
              <span class="code-lang">terminal</span>
            </div>
            <div class="code-body"><pre><span class="cm"># Terminal 1 — Start MongoDB</span>
docker run -d -p 27017:27017 \
  --name mongo \
  -v mongo_data:/data/db \
  mongo:7

<span class="cm"># Terminal 2 — Start backend (depends on mongo)</span>
docker run -d -p 5000:5000 \
  --name backend \
  --link mongo:mongo \
  -e MONGO_URI=mongodb://mongo:27017/db \
  -e JWT_SECRET=secret \
  my-backend

<span class="cm"># Terminal 3 — Start frontend</span>
docker run -d -p 3000:3000 \
  --name frontend \
  -e REACT_APP_API=http://localhost:5000 \
  my-frontend</pre>
            </div>
          </div>
          <div class="comp-issues">
            <div class="issue-item" v-for="i in badIssues" :key="i">✗ {{ i }}</div>
          </div>
        </div>
        <div class="comp-sep">
          <div class="sep-vs">VS</div>
        </div>
        <div class="comp-col good">
          <div class="comp-header">
            <span class="comp-badge green">✅ With Compose</span>
            <span class="comp-count">1 command</span>
          </div>
          <div class="code-block">
            <div class="code-header">
              <div class="code-dots"><span></span><span></span><span></span></div>
              <span class="code-lang">terminal</span>
            </div>
            <div class="code-body"><pre><span class="cm"># All services start in the right order</span>
<span class="cm"># with the right network, volumes, env vars</span>
docker compose up -d

<span class="cm"># Or with a rebuild:</span>
docker compose up -d --build</pre>
            </div>
          </div>
          <div class="comp-benefits">
            <div class="benefit-item" v-for="b in goodBenefits" :key="b">✓ {{ b }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Full Compose File -->
    <div class="section">
      <div class="section-title">Full Stack docker-compose.yml</div>
      <p>A complete example for a Node.js backend + React/Vue frontend + MongoDB database. Place this in your project root.</p>
      <div class="code-block">
        <div class="code-header">
          <div class="code-dots"><span></span><span></span><span></span></div>
          <span class="code-filename">docker-compose.yml</span>
        </div>
        <div class="code-body"><pre><span class="kw">version</span>: <span class="str">'3.9'</span>

<span class="kw">services</span>:

  <span class="cm"># ─── MongoDB Database ─────────────────────────────────</span>
  <span class="fn">mongo</span>:
    <span class="kw">image</span>: mongo:<span class="num">7</span>
    <span class="kw">container_name</span>: mongo
    <span class="kw">restart</span>: unless-stopped
    <span class="kw">ports</span>:
      - <span class="str">"27017:27017"</span>
    <span class="kw">volumes</span>:
      - mongo_data:/data/db      <span class="cm"># persist between restarts</span>
    <span class="kw">environment</span>:
      MONGO_INITDB_ROOT_USERNAME: <span class="str">${MONGO_USER}</span>
      MONGO_INITDB_ROOT_PASSWORD: <span class="str">${MONGO_PASS}</span>
    <span class="kw">networks</span>:
      - app-network
    <span class="kw">healthcheck</span>:
      test: echo 'db.runCommand("ping").ok' | mongosh localhost/test --quiet
      interval: 10s
      timeout: 5s
      retries: 5

  <span class="cm"># ─── Backend (Express / Node.js) ──────────────────────</span>
  <span class="fn">backend</span>:
    <span class="kw">build</span>:
      <span class="kw">context</span>: ./backend
      <span class="kw">dockerfile</span>: Dockerfile.dev
    <span class="kw">container_name</span>: backend
    <span class="kw">restart</span>: unless-stopped
    <span class="kw">ports</span>:
      - <span class="str">"5000:5000"</span>
    <span class="kw">volumes</span>:
      - ./backend:/app          <span class="cm"># mount source for hot-reload</span>
      - /app/node_modules       <span class="cm"># preserve container's node_modules</span>
    <span class="kw">environment</span>:
      NODE_ENV: development
      MONGO_URI: mongodb://<span class="str">${MONGO_USER}</span>:<span class="str">${MONGO_PASS}</span>@mongo:27017/<span class="str">${MONGO_DB}</span>
      JWT_SECRET: <span class="str">${JWT_SECRET}</span>
      PORT: <span class="num">5000</span>
    <span class="kw">depends_on</span>:
      mongo:
        <span class="kw">condition</span>: service_healthy  <span class="cm"># wait for mongo to be ready</span>
    <span class="kw">networks</span>:
      - app-network

  <span class="cm"># ─── Frontend (React / Vue) ───────────────────────────</span>
  <span class="fn">frontend</span>:
    <span class="kw">build</span>:
      <span class="kw">context</span>: ./frontend
      <span class="kw">dockerfile</span>: Dockerfile.dev
    <span class="kw">container_name</span>: frontend
    <span class="kw">restart</span>: unless-stopped
    <span class="kw">ports</span>:
      - <span class="str">"3000:3000"</span>
    <span class="kw">volumes</span>:
      - ./frontend:/app
      - /app/node_modules
    <span class="kw">environment</span>:
      REACT_APP_API_URL: http://localhost:5000
    <span class="kw">depends_on</span>:
      - backend
    <span class="kw">networks</span>:
      - app-network

<span class="cm"># ─── Persistent Volumes ───────────────────────────────</span>
<span class="kw">volumes</span>:
  mongo_data:              <span class="cm"># data survives container restarts</span>

<span class="cm"># ─── Internal Network ─────────────────────────────────</span>
<span class="kw">networks</span>:
  app-network:
    <span class="kw">driver</span>: bridge         <span class="cm"># services reach each other by name</span></pre>
        </div>
      </div>
    </div>

    <!-- Key Concepts -->
    <div class="section">
      <div class="section-title">Key Concepts Explained</div>
      <div class="explain-list">
        <div class="explain-item" v-for="e in explanations" :key="e.key">
          <div class="explain-key">
            <code>{{ e.key }}</code>
          </div>
          <div class="explain-val">{{ e.val }}</div>
        </div>
      </div>
    </div>

    <!-- .env File -->
    <div class="section">
      <div class="section-title">Using .env Files</div>
      <p>Never hardcode secrets in your compose file. Use a <code>.env</code> file for sensitive values.</p>
      <div class="env-grid">
        <div class="code-block">
          <div class="code-header">
            <div class="code-dots"><span></span><span></span><span></span></div>
            <span class="code-filename">.env (project root)</span>
          </div>
          <div class="code-body"><pre>MONGO_USER=admin
MONGO_PASS=supersecret123
MONGO_DB=myapp
JWT_SECRET=your-very-long-random-secret-key</pre>
          </div>
        </div>
        <div class="code-block">
          <div class="code-header">
            <div class="code-dots"><span></span><span></span><span></span></div>
            <span class="code-filename">.env.example (commit this)</span>
          </div>
          <div class="code-body"><pre>MONGO_USER=
MONGO_PASS=
MONGO_DB=myapp
JWT_SECRET=</pre>
          </div>
        </div>
      </div>
      <div class="highlight-box orange">
        <strong>⚠️ Security:</strong> Add <code>.env</code> to your <code>.gitignore</code> immediately. Commit <code>.env.example</code> with empty values as a template for teammates. Never commit real secrets to version control.
      </div>
    </div>

    <!-- Compose Commands -->
    <div class="section">
      <div class="section-title">Essential Compose Commands</div>
      <div class="compose-cmds">
        <div class="compose-cmd" v-for="cmd in composeCmds" :key="cmd.cmd">
          <div class="cc-left">
            <div class="cc-code"><code>{{ cmd.cmd }}</code></div>
            <div class="cc-desc">{{ cmd.desc }}</div>
          </div>
          <span class="tag-pill" :class="cmd.color">{{ cmd.type }}</span>
        </div>
      </div>
    </div>

    <div class="nav-footer">
      <router-link to="/converting" class="nav-prev">← npm → Docker</router-link>
      <router-link to="/commands" class="nav-next">CLI Reference →</router-link>
    </div>
  </div>
</template>

<script setup>
const badIssues = [
  'Manual ordering — mongo must start first',
  'Lose all flags on restart',
  'No shared network — need --link hack',
  'Impossible to script reliably',
]

const goodBenefits = [
  'Correct service ordering via depends_on',
  'All config in version-controlled YAML',
  'Automatic shared network by default',
  'One command for the entire stack',
]

const explanations = [
  { key: 'volumes: ./backend:/app', val: 'Mounts your local backend/ folder into the container at /app. Any file save instantly reflects inside the container — enabling hot-reload without rebuilding the image.' },
  { key: '/app/node_modules', val: 'An anonymous volume that "shadows" the node_modules mount. Prevents your local (Mac/Windows) node_modules from overwriting the container\'s Linux-compiled native modules. Critical for packages like bcrypt or sharp.' },
  { key: 'depends_on', val: 'Controls startup order. With condition: service_healthy, the backend won\'t start until MongoDB passes its healthcheck — avoiding connection errors at startup.' },
  { key: 'networks: app-network', val: 'All services on the same Docker network reach each other by service name. Backend connects via mongodb://mongo:27017 — "mongo" is the service name in the compose file, not a hostname you configure.' },
  { key: 'volumes: mongo_data', val: 'A named volume that persists MongoDB data on the Docker host filesystem. Without this, all your database data is permanently lost every time the container stops or is removed.' },
  { key: 'restart: unless-stopped', val: 'Automatically restart the container if it crashes or if Docker restarts after a reboot. unless-stopped means a manual docker stop won\'t be overridden.' },
]

const composeCmds = [
  { cmd: 'docker compose up -d', type: 'Start', color: 'green', desc: 'Start all services in background. Builds images if they don\'t exist.' },
  { cmd: 'docker compose up -d --build', type: 'Rebuild', color: 'blue', desc: 'Force rebuild all images before starting. Use when Dockerfiles change.' },
  { cmd: 'docker compose down', type: 'Stop', color: 'orange', desc: 'Stop and remove all containers + networks. Add -v to also delete volumes.' },
  { cmd: 'docker compose down -v', type: 'Reset', color: 'orange', desc: 'Stop everything AND delete named volumes. ⚠️ Permanently deletes DB data.' },
  { cmd: 'docker compose logs -f', type: 'Debug', color: 'blue', desc: 'Stream logs from all services. Add service name to filter: logs -f backend.' },
  { cmd: 'docker compose ps', type: 'Status', color: 'gray', desc: 'Show status of all services — running, exited, ports.' },
  { cmd: 'docker compose exec backend sh', type: 'Debug', color: 'blue', desc: 'Open a shell inside the running backend container. Use bash if sh is unavailable.' },
  { cmd: 'docker compose restart backend', type: 'Restart', color: 'gray', desc: 'Restart a single service without stopping others.' },
]
</script>

<style scoped>
.comparison {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 0;
  margin-top: 24px;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}
.comp-col { padding: 24px; }
.comp-col.bad { background: rgba(244,71,71,0.02); }
.comp-col.good { background: rgba(0,232,135,0.02); }
.comp-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.comp-badge {
  font-size: 11px;
  font-weight: 700;
  font-family: var(--font-mono);
  padding: 4px 12px;
  border-radius: 20px;
  text-transform: uppercase;
}
.comp-badge.red { background: rgba(244,71,71,0.12); color: var(--red); border: 1px solid rgba(244,71,71,0.2); }
.comp-badge.green { background: rgba(0,232,135,0.12); color: var(--green); border: 1px solid rgba(0,232,135,0.2); }
.comp-count { font-size: 11px; color: var(--text3); font-family: var(--font-mono); }
.comp-sep {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  background: var(--bg3);
  border-left: 1px solid var(--border);
  border-right: 1px solid var(--border);
}
.sep-vs {
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 700;
  color: var(--text3);
  writing-mode: vertical-rl;
  letter-spacing: 3px;
}
.comp-issues, .comp-benefits {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 12px;
}
.issue-item, .benefit-item {
  font-size: 12.5px;
  padding: 6px 0;
  border-bottom: 1px solid var(--border);
}
.issue-item:last-child, .benefit-item:last-child { border-bottom: none; }
.issue-item { color: var(--red); }
.benefit-item { color: var(--green); }

.explain-list {
  display: flex;
  flex-direction: column;
  gap: 0;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  margin-top: 24px;
}
.explain-item {
  display: flex;
  gap: 20px;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
  align-items: flex-start;
  transition: background 0.15s;
}
.explain-item:last-child { border-bottom: none; }
.explain-item:hover { background: var(--bg3); }
.explain-key { min-width: 220px; flex-shrink: 0; padding-top: 2px; }
.explain-val { font-size: 13.5px; color: var(--text2); line-height: 1.65; }

.env-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 16px; }

.compose-cmds { display: flex; flex-direction: column; gap: 8px; margin-top: 24px; }
.compose-cmd {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 14px 18px;
  transition: border-color 0.2s;
}
.compose-cmd:hover { border-color: var(--border2); }
.cc-left { flex: 1; }
.cc-code { margin-bottom: 4px; }
.cc-desc { font-size: 12.5px; color: var(--text2); line-height: 1.5; }

@media (max-width: 700px) {
  .comparison { grid-template-columns: 1fr; }
  .comp-sep { padding: 12px 24px; }
  .sep-vs { writing-mode: horizontal-tb; letter-spacing: normal; }
  .explain-item { flex-direction: column; }
  .explain-key { min-width: unset; }
  .env-grid { grid-template-columns: 1fr; }
  .compose-cmd { flex-direction: column; align-items: flex-start; }
}
</style>