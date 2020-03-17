const state = {
  curChatUser: null,
  waitCount: 0,
  respondCount: 0
}

const mutations = {
  setCurChatUser (state, curChatUser) {
    state.curChatUser = curChatUser
  },
  setWaitCount (state, waitCount) {
    state.waitCount = waitCount
  },
  setRespondCount (state, respondCount) {
    state.respondCount = respondCount
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
