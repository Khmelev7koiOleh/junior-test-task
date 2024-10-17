import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/countries/:CountryView-:countryCode',
      name: 'country',
      component: () => import('../views/countries/CountryView.vue'),
    },
  ],
})

export default router
