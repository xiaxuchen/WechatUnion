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
      },
      {
        path: 'sysUser',
        name: 'sysUser',
        components: {
          content: () => import('@/views/admin/sysUser')
        }
      }
    ]
  },
  {
    path: '*',
    redirect: '/404'
  }
]
