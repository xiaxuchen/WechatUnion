import ElementUI from 'element-ui'
import api from '@/api'
import routes from './routes'
import router from './router'

// 无需权限的页面
const freePath = routes.map(route => {
  return route.path
})

// 页面切换效果
let loadingInstance = null
router.beforeEach((to, from, next) => {
  loadingInstance = ElementUI.Loading.service({
    lock: true,
    text: 'Loading',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  for (let i = 0; i < freePath.length; i++) {
    if (to.path === freePath[i]) {
      next()
      return
    }
  }
  next()
  // 请求权限验证
  api.sysuser.verifyPermit(to.path)
    .then(api.commonResp((success) => {
      if (success) {
        next()
      } else {
        router.push({name: '403'})
      }
    })).catch((e) => {
      router.push({name: '403'})
      this.$message.error(e)
      loadingInstance.close()
    })
})

router.afterEach(() => {
  if (loadingInstance) {
    loadingInstance.close()
  }
})

export default router
