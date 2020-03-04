const selectedUserMap = window.storage.getItem('push/selectedUserMap')
let selectedSize = 0
if (selectedUserMap) {
  Object.keys(selectedUserMap).forEach(key => {
    if (selectedUserMap[key] != null) {
      selectedSize++
    }
  })
}

const state = {
  selectedUserMap: selectedUserMap || {},
  selectedSize: selectedSize || 0
}

/**
 * 生成用户id，用于map存储
 * @param id 原id
 * @returns {string}
 */
const generateUserId = (id) => {
  return `user${id}`
}

const mutations = {
  /**
   * 将多个用户信息添加到selectUserMap中
   * @param users 用户信息
   */
  addUsers (state, users) {
    let obj = {}
    // 循环遍历所有用户
    users.forEach((user) => {
      let userId = generateUserId(user.id)
      // 确定用户是否已选中，如果原状态未选中同时map中不存在，则添加
      if (!user.selected && !state.selectedUserMap[userId]) {
        // 添加用户
        obj[userId] = user
        user.selected = true
        state.selectedSize++
      }
    })
    // 更新map
    state.selectedUserMap = Object.assign({}, state.selectedUserMap, obj)
    // 持久化
    window.storage.setItem('push/selectedUserMap', state.selectedUserMap)
  },
  /**
   *  释放已选中的用户
   * @param user 用户信息
   */
  releaseUsers (state, users) {
    let obj = {}
    // 循环遍历所有用户
    users.forEach((user) => {
      let userId = generateUserId(user.id)
      // 确定用户是否已选中，如果原状态已选中同时map中存在，则删除
      if (user.selected && state.selectedUserMap[userId]) {
        obj[userId] = null
        user.selected = false
        state.selectedSize--
      }
    })
    // 更新map
    state.selectedUserMap = Object.assign({}, state.selectedUserMap, obj)
    // 持久化
    window.storage.setItem('push/selectedUserMap', state.selectedUserMap)
  },
  clear (state) {
    state.selectedUserMap = {}
    state.selectedSize = 0
    window.storage.removeItem('push/selectedUserMap')
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
