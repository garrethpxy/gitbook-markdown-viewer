import Vue from 'vue'
import VueRouter from 'vue-router'
import Docs from '../views/Docs.vue'

Vue.use(VueRouter)

const routes = [
  /*eslint-disable */
  {
    path: `/:pathToDoc*\/:docName*.md`,
    name: 'DocViewer',
    component: Docs
  },
  /*eslint-enable */
  {
    path: '*',
    redirect: { name: 'DocViewer' }
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
