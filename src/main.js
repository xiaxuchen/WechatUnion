// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'element-ui/lib/theme-chalk/index.css'
import ElementUI from 'element-ui'
import storage from './utils/storage'
import api from '@/api'
import __ from 'lodash'
import store from '@/store'
import 'font-awesome/css/font-awesome.min.css'

Vue.config.productionTip = false

console.log(storage)

Vue.prototype.api = api
Vue.prototype.__ = __
// 事件总线
Vue.prototype.$bus = new Vue()

Vue.use(ElementUI)

// 页面切换效果
let loadingInstance = null

router.beforeEach((to, from, next) => {
  loadingInstance = ElementUI.Loading.service({
    lock: true,
    text: 'Loading',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  api.verifyPermit(to.path)
    .then(api.commonResp((success) => {
      if (success) {
        next()
      } else {
        loadingInstance.close()
      }
    }))
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
