const state = {
  availableHeight: 0
}

const mutations = {
  setAvailableHeight (state, height) {
    state.availableHeight = height
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
