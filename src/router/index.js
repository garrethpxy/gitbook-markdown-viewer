import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Docs from '../views/Docs.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/docs',
    name: 'Docs',
    component: Docs
  },
  /*eslint-disable */
  { path: '/:docPath*\/:docName*.md',
      // redirect: to => {
      //   const { hash, params, query } = to
      //   console.log(hash, params, query);
      //   return "/bar"
      // },
    name: 'Markdown',
    component: Docs
  }
  /*eslint-enable */
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
