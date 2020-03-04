// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import 'babel-polyfill'
import App from './App'
import router from './router'
import 'element-ui/lib/theme-chalk/index.css'
import ElementUI from 'element-ui'
import './utils/storage'
import api from '@/api'
import __ from 'lodash'
import store from '@/store'
import 'font-awesome/css/font-awesome.min.css'
import Common from '@/common/common'
import VeLine from 'v-charts/lib/line.common'
import 'animate.css'
import routes from '@/router/routes'
import filters from '@/filter'

require('promise.prototype.finally').shim()
// 初始化折线图
Vue.component(VeLine.name, VeLine)

Vue.config.productionTip = false

// 将常用库以及网络请求加入vue实例，方便调用
Vue.prototype.api = api
Vue.prototype.__ = __
// 事件总线
Vue.prototype.$bus = new Vue()

Vue.use(ElementUI)
Vue.use(Common)

// 页面切换效果
let loadingInstance = null

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// 无需权限的页面
const freePath = routes.map(route => {
  return route.path
})

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

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
