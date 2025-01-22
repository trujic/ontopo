import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Homepage from "./pages/Homepage.vue";
import SearchPage from "./pages/SearchPage.vue";

// Define routes with proper typing
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: Homepage,
  },
  {
    path: "/search",
    name: "search",
    component: SearchPage,
  },
];

// Create and export the router
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
