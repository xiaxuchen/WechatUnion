const state = {
  curChatUser: null
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
