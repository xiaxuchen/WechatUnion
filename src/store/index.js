import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'
import push from './modules/push'
import manager from './modules/manager'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    push,
    manager
  },
  plugins: [createLogger()]
})
