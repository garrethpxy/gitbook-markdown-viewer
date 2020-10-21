import Vue from 'vue'
import VueRouter from 'vue-router'
import Docs from '../views/Docs.vue'

Vue.use(VueRouter)

const routes = [
  /*eslint-disable */
  { path: '/:docPath*\/:docName*.md',
      // redirect: to => {
      //   const { hash, params, query } = to
      //   console.log(hash, params, query);
      //   return "/bar"
      // },
    name: 'Markdown',
    component: Docs
  },
  /*eslint-enable */
  {
    path: '*',
    name: 'Docs',
    component: Docs
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
