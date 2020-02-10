import Frame from '@/Frame'

// function createComponent (name, ) {
//
// }

export default [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/components/404')
  },
  {
    path: '/403',
    name: '403',
    component: () => import('@/components/403')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/user/login')
  },
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
      }
    ]
  },
  {
    path: '*',
    redirect: '/404'
  }
]
