const state = {
  availableHeight: 0,
  loading: false
}

const mutations = {
  setAvailableHeight (state, height) {
    state.availableHeight = height
  },
  toggleLoading (state, loading) {
    state.loading = loading
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
