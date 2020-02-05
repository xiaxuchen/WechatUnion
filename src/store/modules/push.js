const selectedUserMap = window.storage.getItem('selectedUserMap')
const selectedSize = window.storage.getItem('selectedSize')
const state = {
  selectedUserMap: selectedUserMap || {},
  selectedSize: selectedSize || 0
}

const mutations = {
  /**
   * 将多个用户信息添加到selectUserMap中
   * @param users 用户信息
   */
  addUsers (state, users) {
    let obj = {}
    users.forEach((user) => {
      user.selected = true
      obj[`user${user.id}`] = user
    })
    state.selectedUserMap = Object.assign({}, state.selectedUserMap, obj)
    state.selectedSize = Object.keys(state.selectedUserMap).length
    window.storage.setItem('push/selectedUserMap', state.selectedUserMap)
    window.storage.setItem('push/selectedSize', state.selectedSize)
  },
  /**
   *  选中用户加入已选列表
   * @param user 用户信息
   */
  selectUser (state, user) {
    let selectedUserMap = state.selectedUserMap
    // 首先要保证不在列表当中
    if (selectedUserMap[`user${user.id}`] == null || selectedUserMap[`user${user.id}`] === undefined) {
      state.selectedSize++
      let obj = {}
      obj[`user${user.id}`] = user
      state.selectedUserMap = Object.assign({}, state.selectedUserMap, obj)
      window.storage.setItem('push/selectedUserMap', state.selectedUserMap)
      window.storage.setItem('push/selectedSize', state.selectedSize)
    }
  },
  /**
   *  释放已选中的用户
   * @param user 用户信息
   */
  releaseUser (state, user) {
    let selectedUserMap = state.selectedUserMap
    // 首先要保证在列表当中
    if (selectedUserMap[`user${user.id}`]) {
      state.selectedSize--
      state.selectedUserMap[`user${user.id}`] = null
      delete state.selectedUserMap[`user${user.id}`]
      state.selectedUserMap = Object.assign({}, state.selectedUserMap)
      window.storage.setItem('push/selectedUserMap', state.selectedUserMap)
      window.storage.setItem('push/selectedSize', state.selectedSize)
    }
  },
  clear (state) {
    state.selectedUserMap = {}
    state.selectedSize = 0
    window.storage.removeItem('push/selectedUserMap')
    window.storage.removeItem('push/selectedSize')
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
