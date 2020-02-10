import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'
import push from './modules/push'
import manager from './modules/manager'
import message from './modules/message'
import system from './modules/system'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    push,
    manager,
    message,
    system
  },
  plugins: [createLogger()]
})
