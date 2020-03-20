import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes'
import Frame from '@/Frame'

Vue.use(Router)

export default new Router({
  loginPath: '/',
  mode: 'history',
  routes: [
    ...routes,
    {
      path: '/',
      name: 'frame',
      component: Frame,
      children: [
        {
          path: 'index',
          name: 'index',
          component: () => import('@/views/agent/index'),
          meta: {
            title: '系统首页',
            index: '/index'
          }
        },
        {
          path: 'push',
          name: 'push',
          component: () => import('@/views/agent/push'),
          meta: {
            title: '用户推送',
            index: '/push'
          }
        },
        {
          path: 'clientServe',
          name: 'clientServe',
          component: () => import('@/views/agent/clientServe'),
          meta: {
            title: '用户接入',
            index: '/clientServe'
          }
        },
        {
          path: 'sysUser',
          name: 'sysUser',
          component: () => import('@/views/admin/sysUser'),
          meta: {
            title: '用户管理',
            index: '/sysUser'
          }
        },
        {
          path: 'mine',
          name: 'mine',
          component: () => import('@/views/user/mine'),
          meta: {
            title: '我的资料',
            index: '/mine'
          }
        },
        {
          path: 'relation',
          name: 'relation',
          component: () => import('@/views/admin/relation'),
          meta: {
            title: '关系管理',
            index: '/relation'
          }
        }
      ]
    }
  ]
})
