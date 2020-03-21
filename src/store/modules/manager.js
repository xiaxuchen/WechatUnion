import api from '@/api'
const token = window.storage.getItem('manager/token')
const state = {
  manager: {},
  // 用户身份码
  token: token
}
const mutations = {
  setManager (state, manager) {
    state.manager = manager
  },
  setToken (state, token) {
    state.token = token
    window.storage.setItem('manager/token', token)
  },
  clear () {
    state.token = null
    state.manager = {}
    window.storage.removeItem('manager/token')
  }
}

const actions = {
  logout ({commit}) {
    commit('clear')
    api.sysuser.logout()
  },
  refresh ({commit}) {
    api.sysuser.getMineInfo()
      .commonThen((success, data) => {
        if (success) {
          commit('setManager', data)
        }
      })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
