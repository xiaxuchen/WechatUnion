import Frame from '@/Frame'
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
        path: 'select',
        name: 'selectReceiver',
        component: () => import('@/views/agent/selectReceiver'),
        meta: {
          title: '用户推送',
          index: '/select'
        }
      },
      {
        path: 'pushInfo',
        name: 'pushInfo',
        component: () => import('@/views/agent/pushInfo'),
        meta: {
          title: '用户推送',
          index: '/select'
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
