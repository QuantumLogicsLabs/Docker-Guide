import { createApp } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";
import App from "./App.vue";
import Home from "./views/Home.vue";
import WhatIsDocker from "./views/WhatIsDocker.vue";
import WhyDocker from "./views/WhyDocker.vue";
import Converting from "./views/Converting.vue";
import Compose from "./views/Compose.vue";
import Commands from "./views/Commands.vue";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: "/", component: Home },
    { path: "/what-is-docker", component: WhatIsDocker },
    { path: "/why-docker", component: WhyDocker },
    { path: "/converting", component: Converting },
    { path: "/compose", component: Compose },
    { path: "/commands", component: Commands },
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});

createApp(App).use(router).mount("#app");
