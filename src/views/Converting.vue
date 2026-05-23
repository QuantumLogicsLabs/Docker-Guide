<template>
  <div>
    <div class="page-header">
      <div class="page-tag">Chapter 03 — Conversion</div>
      <h1 class="page-title"><span>npm → Docker</span></h1>
      <p class="page-desc">Step-by-step: turn your <code>npm run dev</code> backend and <code>npm start</code> frontend into proper Docker containers. We cover both development and production setups with real Dockerfiles.</p>
    </div>

    <!-- Project Structure -->
    <div class="section">
      <div class="section-title">Typical Project Structure</div>
      <p>We'll use a common MERN/MEAN full-stack structure as our example:</p>
      <div class="code-block">
        <div class="code-header">
          <div class="code-dots"><span></span><span></span><span></span></div>
          <span class="code-lang">project structure</span>
        </div>
        <div class="code-body"><pre><span class="fn">my-project/</span>
├── <span class="fn">backend/</span>           <span class="cm">← Express / Node.js app (npm run dev)</span>
│   ├── package.json
│   ├── server.js
│   ├── routes/
│   └── models/
├── <span class="fn">frontend/</span>          <span class="cm">← React or Vue app (npm start / npm run dev)</span>
│   ├── package.json
│   ├── src/
│   └── public/
└── docker-compose.yml <span class="cm">← Orchestrates everything</span></pre>
        </div>
      </div>
    </div>

    <!-- Backend Dockerfile -->
    <div class="section">
      <div class="section-title">Step 1: Backend Dockerfile</div>
      <p>Create a Dockerfile inside your <code>backend/</code> folder. We make two versions: dev for local work and prod for deployment.</p>

      <div class="tab-group">
        <button
          v-for="tab in ['Development', 'Production']"
          :key="tab"
          class="tab-btn"
          :class="{ active: backendTab === tab }"
          @click="backendTab = tab"
        >{{ tab }}</button>
      </div>

      <div v-if="backendTab === 'Development'">
        <div class="code-block">
          <div class="code-header">
            <div class="code-dots"><span></span><span></span><span></span></div>
            <span class="code-filename">backend/Dockerfile.dev</span>
          </div>
          <div class="code-body"><pre><span class="cm"># Alpine = minimal Linux ~5MB, perfect for Node apps</span>
<span class="kw">FROM</span> node:<span class="num">20-alpine</span>

<span class="cm"># All commands run from here inside the container</span>
<span class="kw">WORKDIR</span> <span class="str">/app</span>

<span class="cm"># Copy package files FIRST — enables Docker layer caching</span>
<span class="cm"># If package.json doesn't change, this layer is cached ✓</span>
<span class="kw">COPY</span> package*.json ./

<span class="cm"># Install ALL deps including devDependencies (nodemon, etc.)</span>
<span class="kw">RUN</span> npm install

<span class="cm"># Copy the rest of the source code</span>
<span class="kw">COPY</span> . .

<span class="cm"># Tell Docker this container uses port 5000</span>
<span class="kw">EXPOSE</span> <span class="num">5000</span>

<span class="cm"># Start the app with nodemon for hot-reload</span>
<span class="kw">CMD</span> [<span class="str">"npm"</span>, <span class="str">"run"</span>, <span class="str">"dev"</span>]</pre>
          </div>
        </div>
        <div class="highlight-box">
          <strong>💡 Layer caching trick:</strong> Copy <code>package*.json</code> first, run <code>npm install</code>, then copy source code. If only your code changes (not dependencies), Docker reuses the cached <code>npm install</code> layer — saving 30–60 seconds per build.
        </div>
      </div>

      <div v-if="backendTab === 'Production'">
        <div class="code-block">
          <div class="code-header">
            <div class="code-dots"><span></span><span></span><span></span></div>
            <span class="code-filename">backend/Dockerfile.prod</span>
          </div>
          <div class="code-body"><pre><span class="cm"># ── Stage 1: Install dependencies ─────────────</span>
<span class="kw">FROM</span> node:<span class="num">20-alpine</span> <span class="kw">AS</span> deps

<span class="kw">WORKDIR</span> <span class="str">/app</span>
<span class="kw">COPY</span> package*.json ./

<span class="cm"># Only install production deps — no devDependencies</span>
<span class="kw">RUN</span> npm ci --only=production

<span class="cm"># ── Stage 2: Final image ───────────────────────</span>
<span class="kw">FROM</span> node:<span class="num">20-alpine</span>

<span class="kw">WORKDIR</span> <span class="str">/app</span>

<span class="cm"># Run as non-root user for security</span>
<span class="kw">RUN</span> addgroup -S appgroup &amp;&amp; adduser -S appuser -G appgroup
<span class="kw">USER</span> appuser

<span class="cm"># Copy only production deps from stage 1</span>
<span class="kw">COPY</span> --from=deps /app/node_modules ./node_modules

<span class="cm"># Copy application code</span>
<span class="kw">COPY</span> --chown=appuser:appgroup . .

<span class="kw">EXPOSE</span> <span class="num">5000</span>
<span class="kw">ENV</span> NODE_ENV=production

<span class="cm"># Use node directly — not npm (better signal handling)</span>
<span class="kw">CMD</span> [<span class="str">"node"</span>, <span class="str">"server.js"</span>]</pre>
          </div>
        </div>
        <div class="highlight-box">
          <strong>🔐 Multi-stage builds:</strong> The production Dockerfile uses multi-stage builds to keep only what's needed in the final image. No devDependencies, no build tools — smaller image, smaller attack surface.
        </div>
      </div>
    </div>

    <!-- Frontend Dockerfile -->
    <div class="section">
      <div class="section-title">Step 2: Frontend Dockerfile</div>
      <p>The frontend has a different build process — compile in one stage, serve with Nginx in production.</p>

      <div class="tab-group">
        <button v-for="tab in ['Development', 'Production']" :key="tab" class="tab-btn" :class="{ active: frontendTab === tab }" @click="frontendTab = tab">{{ tab }}</button>
      </div>

      <div v-if="frontendTab === 'Development'">
        <div class="code-block">
          <div class="code-header">
            <div class="code-dots"><span></span><span></span><span></span></div>
            <span class="code-filename">frontend/Dockerfile.dev</span>
          </div>
          <div class="code-body"><pre><span class="kw">FROM</span> node:<span class="num">20-alpine</span>

<span class="kw">WORKDIR</span> <span class="str">/app</span>

<span class="kw">COPY</span> package*.json ./
<span class="kw">RUN</span> npm install

<span class="kw">COPY</span> . .

<span class="cm"># React dev server uses 3000, Vite uses 5173</span>
<span class="kw">EXPOSE</span> <span class="num">3000</span>

<span class="cm"># React: "npm start" | Vue/Vite: "npm run dev"</span>
<span class="kw">CMD</span> [<span class="str">"npm"</span>, <span class="str">"start"</span>]</pre>
          </div>
        </div>
      </div>

      <div v-if="frontendTab === 'Production'">
        <div class="code-block">
          <div class="code-header">
            <div class="code-dots"><span></span><span></span><span></span></div>
            <span class="code-filename">frontend/Dockerfile.prod</span>
          </div>
          <div class="code-body"><pre><span class="cm"># ── Stage 1: Build the React/Vue app ──────────</span>
<span class="kw">FROM</span> node:<span class="num">20-alpine</span> <span class="kw">AS</span> builder

<span class="kw">WORKDIR</span> <span class="str">/app</span>
<span class="kw">COPY</span> package*.json ./
<span class="kw">RUN</span> npm ci

<span class="kw">COPY</span> . .
<span class="kw">RUN</span> npm run build       <span class="cm"># Creates /app/dist or /app/build</span>

<span class="cm"># ── Stage 2: Serve with Nginx ─────────────────</span>
<span class="kw">FROM</span> nginx:<span class="num">alpine</span>

<span class="cm"># Copy built assets from the builder stage</span>
<span class="kw">COPY</span> --from=builder /app/dist /usr/share/nginx/html

<span class="cm"># Custom Nginx config for SPA routing</span>
<span class="kw">COPY</span> nginx.conf /etc/nginx/conf.d/default.conf

<span class="kw">EXPOSE</span> <span class="num">80</span>
<span class="kw">CMD</span> [<span class="str">"nginx"</span>, <span class="str">"-g"</span>, <span class="str">"daemon off;"</span>]</pre>
          </div>
        </div>
        <div class="code-block" style="margin-top:12px">
          <div class="code-header">
            <div class="code-dots"><span></span><span></span><span></span></div>
            <span class="code-filename">frontend/nginx.conf</span>
          </div>
          <div class="code-body"><pre>server {
  listen 80;
  root /usr/share/nginx/html;
  index index.html;

  <span class="cm"># Handle client-side routing (React Router, Vue Router)</span>
  location / {
    try_files $uri $uri/ /index.html;
  }

  <span class="cm"># Cache static assets aggressively</span>
  location ~* \.(js|css|png|jpg|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }
}</pre>
          </div>
        </div>
      </div>
    </div>

    <!-- .dockerignore -->
    <div class="section">
      <div class="section-title">Step 3: Add .dockerignore</div>
      <p>Always add a <code>.dockerignore</code> file — it works like <code>.gitignore</code> but for Docker. Prevents massive <code>node_modules</code> from being sent to the Docker daemon.</p>
      <div class="dockerignore-grid">
        <div class="code-block">
          <div class="code-header">
            <div class="code-dots"><span></span><span></span><span></span></div>
            <span class="code-filename">backend/.dockerignore</span>
          </div>
          <div class="code-body"><pre>node_modules
npm-debug.log
.git
.env
*.local
dist
coverage</pre>
          </div>
        </div>
        <div class="dockerignore-impact">
          <div class="impact-item">
            <span class="impact-icon">📦</span>
            <div>
              <div class="impact-title">Without .dockerignore</div>
              <div class="impact-val red">400+ MB build context</div>
            </div>
          </div>
          <div class="impact-arrow">→</div>
          <div class="impact-item">
            <span class="impact-icon">⚡</span>
            <div>
              <div class="impact-title">With .dockerignore</div>
              <div class="impact-val green">~2 MB build context</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Build and Run -->
    <div class="section">
      <div class="section-title">Step 4: Build & Run</div>
      <div class="commands-list">
        <div class="command-item" v-for="cmd in buildCmds" :key="cmd.cmd">
          <div class="cmd-meta">
            <span class="tag-pill" :class="cmd.tag">{{ cmd.tag }}</span>
          </div>
          <div class="code-block" style="margin:0">
            <div class="code-header">
              <div class="code-dots"><span></span><span></span><span></span></div>
              <span class="code-lang">terminal</span>
            </div>
            <div class="code-body" style="padding: 12px 20px"><pre style="font-size:13px">{{ cmd.cmd }}</pre></div>
          </div>
          <div class="cmd-explain">{{ cmd.desc }}</div>
        </div>
      </div>
    </div>

    <div class="nav-footer">
      <router-link to="/why-docker" class="nav-prev">← Why Use Docker?</router-link>
      <router-link to="/compose" class="nav-next">Docker Compose →</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const backendTab = ref('Development')
const frontendTab = ref('Development')

const buildCmds = [
  {
    cmd: '# Build the backend dev image\ndocker build -f Dockerfile.dev -t my-backend:dev .',
    desc: 'Builds from Dockerfile.dev in the backend/ directory. Tags the image as my-backend:dev.',
    tag: 'blue'
  },
  {
    cmd: '# Run with port mapping and source volume\ndocker run -p 5000:5000 \\\n  -v $(pwd):/app \\\n  -v /app/node_modules \\\n  -e NODE_ENV=development \\\n  my-backend:dev',
    desc: 'Maps port 5000, mounts source code for hot-reload, preserves the container\'s node_modules.',
    tag: 'orange'
  },
  {
    cmd: '# Or just use Docker Compose (recommended!)\ndocker compose up',
    desc: 'The recommended workflow. Compose handles all volumes, networks, and env vars automatically.',
    tag: 'green'
  },
]
</script>

<style scoped>
.tab-group {
  display: flex;
  gap: 4px;
  margin: 20px 0 16px;
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 4px;
  width: fit-content;
}
.tab-btn {
  padding: 8px 20px;
  background: none;
  border: none;
  border-radius: 7px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  color: var(--text3);
  transition: all 0.18s ease;
  font-family: var(--font-body);
}
.tab-btn:hover { color: var(--text2); background: var(--bg4); }
.tab-btn.active {
  background: var(--bg);
  color: var(--accent);
  border: 1px solid var(--border2);
}

.dockerignore-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 16px; align-items: center; }
.dockerignore-impact {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px;
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: var(--radius);
}
.impact-item { display: flex; align-items: center; gap: 12px; }
.impact-icon { font-size: 24px; }
.impact-title { font-size: 12px; color: var(--text3); font-family: var(--font-mono); margin-bottom: 4px; }
.impact-val { font-family: var(--font-display); font-size: 18px; font-weight: 700; }
.impact-val.red { color: var(--red); }
.impact-val.green { color: var(--green); }
.impact-arrow { font-size: 20px; color: var(--accent); font-family: var(--font-mono); }

.commands-list { display: flex; flex-direction: column; gap: 16px; margin-top: 24px; }
.command-item { display: flex; flex-direction: column; gap: 8px; }
.cmd-explain { font-size: 13px; color: var(--text2); padding: 0 4px; line-height: 1.6; }

@media (max-width: 700px) {
  .dockerignore-grid { grid-template-columns: 1fr; }
}
</style>