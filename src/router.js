import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import store from './store/index'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/restaurants',
      name: 'RestaurantList',
      component: () => import('./views/RestaurantList.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (!store.getters['auth/userIsLoggedIn'] && to.name !== 'Home') {
    next('/')
  }
  next()
})

export default router
