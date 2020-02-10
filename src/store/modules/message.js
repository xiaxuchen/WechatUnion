const state = {
  curChatUser: {}
}

const mutations = {
  setCurChatUser (state, curChatUser) {
    state.curChatUser = curChatUser
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
