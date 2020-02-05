const manager = window.storage.getItem('manager/manager')
const token = window.storage.getItem('manager/token')
const state = {
  manager: manager,
  // 用户身份码
  token
}
const mutations = {
  setManager (state, manager) {
    state.manager = manager
    window.storage.setItem('manager/manager', manager)
  },
  setToken (state, token) {
    state.token = token
    window.storage.setItem('manager/token', token)
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
