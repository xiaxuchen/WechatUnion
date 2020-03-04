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
    path: '*',
    redirect: '/404'
  }
]
