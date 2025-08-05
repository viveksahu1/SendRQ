import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  // Future routes can be added here
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
