import store from '@/store'
const install = (vue) => {
  vue.prototype.$common = {
    /**
     * 显示正在加载
     */
    showLoading () {
      store.commit('system/toggleLoading', true)
    },
    /**
     * 隐藏正在加载
     */
    hideLoading () {
      store.commit('system/toggleLoading', false)
    }
  }
}

export default {
  install
}
