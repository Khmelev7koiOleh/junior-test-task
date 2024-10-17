import { createRouter, createWebHistory } from 'vue-router'

// Create and configure the router
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'), // Home view component
    },
    {
      path: '/countries/:name-:countryCode', // Dynamic path for country routes
      name: 'country',
      component: () => import('../views/CountryView.vue'), // Direct reference to the view file
    },
  ],
})

export default router
