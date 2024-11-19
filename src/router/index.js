import { createRouter, createWebHistory } from 'vue-router/auto'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/explore',
    },
    {
      path: '/deploy',
      component: () => import('/src/pages/deployPlateau.vue')
    },
    {
      path: '/plateaus',
      component: () => import('/src/pages/plateaus.vue')
    },
    {
      path: '/rovers',
      component: () => import('/src/pages/rovers.vue')
    },
    {
      path: '/deploy/plateau/:plateauId/rover',
      component: () => import('/src/pages/deployRovers.vue'),
      props: true,
    },
    {
      path: '/explore',
      component: () => import('/src/pages/commandRover.vue'),
      props: true,
    }
  ],
})

router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router
