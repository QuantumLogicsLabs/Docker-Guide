<template>
  <div>
    <div class="page-header">
      <div class="page-tag">Chapter 05 — Reference</div>
      <h1 class="page-title">CLI <span>Reference</span></h1>
      <p class="page-desc">Every Docker command you'll need as a Node.js developer — organized by category with real examples, tags, and copy functionality.</p>
    </div>

    <!-- Search -->
    <div class="search-bar">
      <div class="search-input-wrap">
        <svg class="search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.5"/>
          <path d="M11 11l3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        <input
          v-model="search"
          type="text"
          placeholder="Search commands, descriptions..."
          class="search-input"
        />
        <button v-if="search" @click="search = ''" class="search-clear">✕</button>
      </div>
      <div class="search-results" v-if="search">
        {{ totalFiltered }} command{{ totalFiltered !== 1 ? 's' : '' }} found
      </div>
    </div>

    <!-- Filter Pills -->
    <div class="filter-bar">
      <button
        v-for="tag in allTags"
        :key="tag.id"
        class="filter-pill"
        :class="{ active: activeTag === tag.id }"
        @click="activeTag = activeTag === tag.id ? 'all' : tag.id"
      >
        <span class="tag-dot" :class="tag.color"></span>
        {{ tag.label }}
      </button>
    </div>

    <!-- Command Groups -->
    <div v-for="group in filteredGroups" :key="group.title" class="cmd-section">
      <div class="section-title">{{ group.icon }} {{ group.title }}</div>
      <div class="cmd-grid">
        <div
          class="cmd-card"
          v-for="cmd in group.commands"
          :key="cmd.cmd"
          :class="{ 'cmd-copied': copiedCmd === cmd.cmd }"
        >
          <div class="cmd-top">
            <div class="cmd-name">{{ cmd.cmd }}</div>
            <div class="cmd-right">
              <span class="tag-pill" :class="tagColor(cmd.tag)">{{ cmd.tag }}</span>
              <button class="copy-btn" @click="copyCmd(cmd.example || cmd.cmd)" :title="'Copy command'">
                <span v-if="copiedCmd === (cmd.example || cmd.cmd)">✓</span>
                <span v-else>⧉</span>
              </button>
            </div>
          </div>
          <div class="cmd-desc">{{ cmd.desc }}</div>
          <div class="code-block cmd-example" v-if="cmd.example">
            <div class="code-header">
              <div class="code-dots"><span></span><span></span><span></span></div>
              <span class="code-lang">example</span>
            </div>
            <div class="code-body" style="padding: 10px 16px"><pre style="font-size: 12.5px">{{ cmd.example }}</pre></div>
          </div>
        </div>
      </div>
    </div>

    <!-- No Results -->
    <div class="no-results" v-if="filteredGroups.length === 0">
      <div class="no-results-icon">🔍</div>
      <div class="no-results-title">No commands found</div>
      <div class="no-results-sub">Try a different search term or clear the filter</div>
      <button class="clear-btn" @click="search = ''; activeTag = 'all'">Clear Search</button>
    </div>

    <!-- Cheatsheet -->
    <div class="section" v-if="!search">
      <div class="section-title">Quick Reference Cheatsheet</div>
      <div class="cheatsheet">
        <div class="cs-col" v-for="col in cheatsheet" :key="col.title">
          <div class="cs-title">{{ col.title }}</div>
          <div class="cs-item" v-for="item in col.items" :key="item.cmd" @click="copyCmd(item.cmd)">
            <code>{{ item.cmd }}</code>
            <span>{{ item.desc }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="nav-footer">
      <router-link to="/compose" class="nav-prev">← Docker Compose</router-link>
      <router-link to="/" class="nav-next">Back to Start →</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const search = ref('')
const activeTag = ref('all')
const copiedCmd = ref('')

const allTags = [
  { id: 'all', label: 'All', color: 'gray' },
  { id: 'essential', label: 'Essential', color: 'green' },
  { id: 'debug', label: 'Debug', color: 'orange' },
  { id: 'cleanup', label: 'Cleanup', color: 'purple' },
  { id: 'deploy', label: 'Deploy', color: 'blue' },
]

const tagColor = (tag) => {
  const map = { essential: 'green', debug: 'orange', cleanup: 'purple', deploy: 'blue', dev: 'yellow' }
  return map[tag] || 'gray'
}

const groups = [
  {
    icon: '🏗️', title: 'Image Commands',
    commands: [
      { cmd: 'docker build -t <name> .', desc: 'Build an image from the Dockerfile in the current directory. -t assigns a name and optional tag.', example: 'docker build -t my-backend:1.0 .', tag: 'essential' },
      { cmd: 'docker build -f <file> -t <name> .', desc: 'Build using a specific Dockerfile — useful when you have separate dev/prod files.', example: 'docker build -f Dockerfile.dev -t my-backend:dev .', tag: 'essential' },
      { cmd: 'docker images', desc: 'List all images on your machine with their name, tag, ID, creation date, and size.', example: 'docker images\ndocker images --filter "dangling=true"', tag: 'essential' },
      { cmd: 'docker rmi <image>', desc: 'Remove an image by name or ID. Add -f to force-remove even if a container references it.', example: 'docker rmi my-backend:1.0\ndocker rmi -f abc123', tag: 'cleanup' },
      { cmd: 'docker pull <image>', desc: 'Download an image from Docker Hub without running it. Useful for pre-caching.', example: 'docker pull node:20-alpine', tag: 'essential' },
      { cmd: 'docker push <image>', desc: 'Upload your tagged image to Docker Hub or a private registry.', example: 'docker push myusername/my-backend:1.0', tag: 'deploy' },
      { cmd: 'docker tag <image> <new-name>', desc: 'Create an additional tag for an existing image (useful before pushing to a registry).', example: 'docker tag my-backend myusername/my-backend:1.0', tag: 'deploy' },
      { cmd: 'docker image prune', desc: 'Remove dangling (untagged) images that are not referenced by any container.', example: 'docker image prune -a', tag: 'cleanup' },
    ]
  },
  {
    icon: '🚀', title: 'Container Commands',
    commands: [
      { cmd: 'docker run -p <host>:<container> <image>', desc: 'Create and start a container. Maps a port on your machine to a port in the container.', example: 'docker run -p 5000:5000 my-backend', tag: 'essential' },
      { cmd: 'docker run -d ...', desc: 'Run container in detached (background) mode. Returns the container ID.', example: 'docker run -d -p 5000:5000 --name backend my-backend', tag: 'essential' },
      { cmd: 'docker run -e KEY=value ...', desc: 'Pass environment variables into the container. Use multiple -e flags for multiple vars.', example: 'docker run -e NODE_ENV=production -e PORT=5000 my-backend', tag: 'essential' },
      { cmd: 'docker run -v <host>:<container> ...', desc: 'Mount a host directory as a volume inside the container. Changes sync both ways.', example: 'docker run -v $(pwd):/app my-backend', tag: 'essential' },
      { cmd: 'docker run --rm ...', desc: 'Automatically remove the container when it exits. Great for one-off tasks.', example: 'docker run --rm node:20-alpine node --version', tag: 'essential' },
      { cmd: 'docker ps', desc: 'List all currently running containers with IDs, images, and ports.', example: 'docker ps\ndocker ps -a  # include stopped', tag: 'essential' },
      { cmd: 'docker stop <container>', desc: 'Gracefully stop a container (SIGTERM → SIGKILL after 10s). Use name or ID.', example: 'docker stop backend\ndocker stop abc123', tag: 'essential' },
      { cmd: 'docker start <container>', desc: 'Start a stopped container (preserves all its data and configuration).', example: 'docker start backend', tag: 'essential' },
      { cmd: 'docker restart <container>', desc: 'Stop then start a container. Useful after config changes.', example: 'docker restart backend', tag: 'essential' },
      { cmd: 'docker rm <container>', desc: 'Remove a stopped container. Use -f to force-remove a running container.', example: 'docker rm backend\ndocker rm -f backend', tag: 'cleanup' },
    ]
  },
  {
    icon: '🔍', title: 'Debugging Commands',
    commands: [
      { cmd: 'docker logs <container>', desc: 'View stdout/stderr output from a container. Add -f to stream continuously.', example: 'docker logs backend\ndocker logs -f --tail 50 backend', tag: 'debug' },
      { cmd: 'docker exec -it <container> sh', desc: 'Open an interactive shell inside a running container. Use bash if sh isn\'t available.', example: 'docker exec -it backend sh\ndocker exec -it backend bash', tag: 'debug' },
      { cmd: 'docker inspect <container>', desc: 'Dump full JSON metadata: networking, mounts, environment variables, and config.', example: 'docker inspect backend\ndocker inspect backend | grep IPAddress', tag: 'debug' },
      { cmd: 'docker stats', desc: 'Live real-time CPU, memory, network I/O, and disk usage for all running containers.', example: 'docker stats\ndocker stats backend', tag: 'debug' },
      { cmd: 'docker top <container>', desc: 'Show processes currently running inside a container (like ps aux inside).', example: 'docker top backend', tag: 'debug' },
      { cmd: 'docker diff <container>', desc: 'Show files changed (Added/Modified/Deleted) inside a container since it started.', example: 'docker diff backend', tag: 'debug' },
      { cmd: 'docker cp <src> <dst>', desc: 'Copy files between host and container in either direction.', example: 'docker cp backend:/app/logs ./logs\ndocker cp ./config.json backend:/app/', tag: 'debug' },
    ]
  },
  {
    icon: '🧹', title: 'Cleanup Commands',
    commands: [
      { cmd: 'docker system prune', desc: 'Remove all stopped containers, unused networks, and dangling images at once. Frees significant disk space.', example: 'docker system prune\ndocker system prune -a  # also removes unused images', tag: 'cleanup' },
      { cmd: 'docker volume ls', desc: 'List all named and anonymous volumes. Named volumes persist your database data.', example: 'docker volume ls\ndocker volume ls -f dangling=true', tag: 'cleanup' },
      { cmd: 'docker volume rm <vol>', desc: 'Delete a named volume permanently. ⚠️ All data in the volume is gone forever.', example: 'docker volume rm my_project_mongo_data', tag: 'cleanup' },
      { cmd: 'docker volume prune', desc: 'Remove all volumes not used by at least one container.', example: 'docker volume prune', tag: 'cleanup' },
      { cmd: 'docker network ls', desc: 'List all Docker networks including bridge, host, none, and custom networks.', example: 'docker network ls', tag: 'cleanup' },
      { cmd: 'docker network prune', desc: 'Remove all networks not used by any containers.', example: 'docker network prune', tag: 'cleanup' },
    ]
  },
]

const filteredGroups = computed(() => {
  const q = search.value.toLowerCase()
  const tag = activeTag.value

  return groups.map(g => ({
    ...g,
    commands: g.commands.filter(c => {
      const matchesSearch = !q || c.cmd.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q) || (c.example && c.example.toLowerCase().includes(q))
      const matchesTag = tag === 'all' || c.tag === tag
      return matchesSearch && matchesTag
    })
  })).filter(g => g.commands.length > 0)
})

const totalFiltered = computed(() => filteredGroups.value.reduce((sum, g) => sum + g.commands.length, 0))

const copyCmd = async (cmd) => {
  try {
    await navigator.clipboard.writeText(cmd)
    copiedCmd.value = cmd
    setTimeout(() => { copiedCmd.value = '' }, 1500)
  } catch (e) {}
}

const cheatsheet = [
  {
    title: '🛠️ Build & Run',
    items: [
      { cmd: 'docker build -t app .', desc: 'Build image' },
      { cmd: 'docker run -p 3000:3000 app', desc: 'Run container' },
      { cmd: 'docker run -d app', desc: 'Run in background' },
      { cmd: 'docker run --rm app', desc: 'Auto-remove on exit' },
      { cmd: 'docker run -v $(pwd):/app app', desc: 'Mount source volume' },
    ]
  },
  {
    title: '📋 Inspect',
    items: [
      { cmd: 'docker ps', desc: 'Running containers' },
      { cmd: 'docker images', desc: 'All images' },
      { cmd: 'docker logs -f app', desc: 'Stream logs' },
      { cmd: 'docker exec -it app sh', desc: 'Enter container' },
      { cmd: 'docker stats', desc: 'Live resource usage' },
    ]
  },
  {
    title: '🧩 Compose',
    items: [
      { cmd: 'docker compose up -d', desc: 'Start all (background)' },
      { cmd: 'docker compose down', desc: 'Stop all' },
      { cmd: 'docker compose logs -f', desc: 'Stream all logs' },
      { cmd: 'docker compose up --build', desc: 'Rebuild & start' },
      { cmd: 'docker compose exec svc sh', desc: 'Shell into service' },
    ]
  },
  {
    title: '🧹 Cleanup',
    items: [
      { cmd: 'docker stop $(docker ps -q)', desc: 'Stop all containers' },
      { cmd: 'docker system prune -a', desc: 'Remove everything' },
      { cmd: 'docker volume prune', desc: 'Remove unused volumes' },
      { cmd: 'docker rmi $(docker images -q)', desc: 'Remove all images' },
      { cmd: 'docker rm $(docker ps -aq)', desc: 'Remove all containers' },
    ]
  },
]
</script>

<style scoped>
/* Search */
.search-bar { margin-bottom: 20px; }
.search-input-wrap {
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}
.search-icon {
  position: absolute;
  left: 14px;
  color: var(--text3);
  pointer-events: none;
}
.search-input {
  width: 100%;
  padding: 12px 14px 12px 44px;
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  color: var(--text);
  font-family: var(--font-mono);
  font-size: 13.5px;
  outline: none;
  transition: border-color 0.2s;
}
.search-input:focus { border-color: var(--accent); }
.search-input::placeholder { color: var(--text3); }
.search-clear {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  color: var(--text3);
  cursor: pointer;
  font-size: 12px;
  padding: 4px;
  border-radius: 4px;
  transition: color 0.2s;
}
.search-clear:hover { color: var(--text); }
.search-results {
  font-size: 12px;
  color: var(--text3);
  font-family: var(--font-mono);
  padding: 0 4px;
}

/* Filter Bar */
.filter-bar {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 32px;
}
.filter-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 20px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  color: var(--text2);
  font-family: var(--font-body);
  transition: all 0.18s ease;
}
.filter-pill:hover { border-color: var(--border2); color: var(--text); }
.filter-pill.active { background: rgba(14,181,245,0.08); border-color: var(--accent); color: var(--accent); }
.tag-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: var(--text4);
}
.tag-dot.green { background: var(--green); }
.tag-dot.orange { background: var(--orange); }
.tag-dot.purple { background: var(--purple); }
.tag-dot.blue { background: var(--accent); }
.tag-dot.gray { background: var(--text3); }

/* Command Section */
.cmd-section { margin-bottom: 40px; }
.cmd-grid { display: flex; flex-direction: column; gap: 8px; margin-top: 16px; }
.cmd-card {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 16px 20px;
  transition: border-color 0.2s;
}
.cmd-card:hover { border-color: var(--border2); }
.cmd-card.cmd-copied { border-color: var(--green); }
.cmd-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  gap: 12px;
}
.cmd-name {
  font-family: var(--font-mono);
  font-size: 13.5px;
  font-weight: 700;
  color: var(--accent);
  flex: 1;
}
.cmd-right { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
.cmd-desc { font-size: 13px; color: var(--text2); line-height: 1.6; margin-bottom: 10px; }
.cmd-example { margin-top: 10px !important; }

.copy-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text3);
  font-size: 14px;
  padding: 4px 6px;
  border-radius: 5px;
  transition: all 0.2s;
  line-height: 1;
}
.copy-btn:hover { background: var(--bg3); color: var(--text); }

/* No Results */
.no-results {
  text-align: center;
  padding: 64px 32px;
  border: 1px dashed var(--border2);
  border-radius: var(--radius-lg);
}
.no-results-icon { font-size: 40px; margin-bottom: 12px; }
.no-results-title {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 6px;
}
.no-results-sub { font-size: 14px; color: var(--text2); margin-bottom: 20px; }
.clear-btn {
  padding: 10px 24px;
  background: var(--bg3);
  border: 1px solid var(--border2);
  border-radius: var(--radius);
  color: var(--text2);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  font-family: var(--font-body);
  transition: all 0.2s;
}
.clear-btn:hover { border-color: var(--accent); color: var(--accent); }

/* Cheatsheet */
.cheatsheet {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  margin-top: 24px;
}
.cs-col {
  border-right: 1px solid var(--border);
  background: var(--bg2);
}
.cs-col:last-child { border-right: none; }
.cs-title {
  padding: 12px 16px;
  font-size: 12px;
  font-weight: 700;
  color: var(--text);
  background: var(--bg3);
  border-bottom: 1px solid var(--border);
}
.cs-item {
  padding: 9px 16px;
  border-bottom: 1px solid var(--border);
  cursor: pointer;
  transition: background 0.15s;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.cs-item:last-child { border-bottom: none; }
.cs-item:hover { background: var(--bg3); }
.cs-item code {
  font-size: 11px;
  color: var(--accent);
  background: transparent;
  border: none;
  padding: 0;
}
.cs-item span { font-size: 11px; color: var(--text3); }

@media (max-width: 900px) {
  .cheatsheet { grid-template-columns: repeat(2, 1fr); }
  .cs-col:nth-child(2) { border-right: none; }
  .cs-col:nth-child(3) { border-top: 1px solid var(--border); }
  .cs-col:nth-child(4) { border-top: 1px solid var(--border); }
}
@media (max-width: 600px) {
  .cheatsheet { grid-template-columns: 1fr; }
  .cs-col { border-right: none; border-top: 1px solid var(--border); }
  .cs-col:first-child { border-top: none; }
}
</style>