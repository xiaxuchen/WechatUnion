import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes'
import Frame from '@/Frame'

Vue.use(Router)

export default new Router({
  loginPath: 'login',
  base: '/union/',
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
            index: '/push',
            keep: true
          }
        },
        {
          path: 'clientServe',
          name: 'clientServe',
          component: () => import('@/views/agent/clientServe'),
          meta: {
            title: '用户接入',
            index: '/clientServe',
            keep: true
          }
        },
        {
          path: 'sysUser',
          name: 'sysUser',
          component: () => import('@/views/admin/sysUser'),
          meta: {
            title: '管理员管理',
            index: '/sysUser',
            keep: true
          }
        },
        {
          path: 'tags',
          name: 'tag',
          component: () => import('@/views/admin/tags'),
          meta: {
            title: '用户管理',
            index: '/tags',
            keep: true
          }
        },
        {
          path: 'mine',
          name: 'mine',
          component: () => import('@/views/user/mine'),
          meta: {
            title: '我的资料',
            index: '/mine',
            keep: true
          }
        },
        {
          path: 'relation/:id',
          name: 'relation',
          component: () => import('@/views/admin/relation'),
          meta: {
            title: '关系管理',
            index: '/relation',
            keep: true
          },
          props: true
        }
      ]
    }
  ]
})
