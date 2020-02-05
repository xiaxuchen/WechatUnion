import Vue from 'vue'
import Router from 'vue-router'
import Frame from '../Frame'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/user/login')
    },
    {
      path: '/',
      name: 'frame',
      component: Frame,
      children: [
        {
          path: 'hello',
          name: 'hello',
          components: {
            content: () =>
              import('../views/selectReceiver')
          }
        },
        {
          path: 'select',
          name: 'selectReceiver',
          components: {
            content: () => import('../views/selectReceiver')
          }
        },
        {
          path: 'pushInfo',
          name: 'pushInfo',
          components: {
            content: () => import('../views/pushInfo')
          }
        }
      ]
    },
    {
      path: '*',
      name: 'notfound',
      component: () => import('../views/notFound')
    }
  ]
})
