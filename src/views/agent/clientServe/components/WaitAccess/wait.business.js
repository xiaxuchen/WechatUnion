import BaseBusiness from '@/common/BaseBusiness'

export default class WaitBusiness extends BaseBusiness {
  /*
   ** 接受等待中的用户
   * */
  receiveWaitingUser () {
    let selectMap = this.context.waitData.selectMap
    const idList = Object.keys(selectMap).map(value => {
      return selectMap[value].id
    })
    if (idList.length === 0) {
      this.context.$message.error('请至少选中一个用户')
      return
    }
    this.context.$store.commit('system/toggleLoading', true)
    this.context.api.message.receiveUsers(idList)
      .commonThen((success, data) => {
        if (data.length > 0) {
          const errorList = data.map((openId) => {
            return this.context.waitData.userList.get(openId).name
          }).toString()
          this.context.$message.error(errorList + ' 接入失败，已被其他经理接入或已离线')
        }
        // 将选择的用户清除
        idList.forEach((openId) => {
          this.context.waitData.userList.delete(openId)
        })
        if (data.length === 0) {
          this.context.$message('接入成功')
        }
        this.context.waitData.selectMap = {}
      }).finally(() => {
        this.context.$store.commit('system/toggleLoading', false)
      })
  }
  /*
  * 更新等待用户列表
  * */
  updateWaitingUsers (userPage, isInit = false) {
    if (isInit) {
      this.updateWaitTotal(userPage.total, new Date().getTime())
    }
    // 设置记录总数
    this.context.waitData.total = userPage.total
    // 清除原来的
    this.context.waitData.userList.clear()
    // 添加
    userPage.data.forEach((user) => {
      this.context.waitData.userList.push(user.id, user)
    })
    this.context.waitLoading = false
  }
  /**
   * 发送消息加载用户列表
   * @param 当前页
   * @param 是否强制获取
   **/
  loadList (curPage = this.context.curPage, focus = false) {
    if (!this.context.webSocket || this.context.waitLoading) {
      return
    }
    const searcher = {
      curPage,
      ...this.context.searcher[this.context.curTab]
    }
    if (searcher.agentId) {
      searcher.agentId = this.context.managerId
    } else {
      delete searcher.agentId
    }
    this.context.webSocket.send('/message/waitUser/users', searcher)
    this.context.waitLoading = true
  }
  // 当前列表空了才更新
  updateWhenEmpty () {
    // 没有人在等或者当前列表不为空就不更新
    if (this.context.waitCount === 0 || !this.context.waitData.userList.isEmpty()) {
      return
    }
    this.updateList()
  }
  /*
  * 当由于列表的用户都被其他经理接受时，重新加载此列表
  * @param focus 是否强制更新
  * **/
  updateList (focus = false) {
    let {curPage, total} = this.context.waitData
    const pageCount = (total / this.context.pageSize + total % this.context.page ? 1 : 0)
    // 如果当前页比真实页小，就跳转到第一页去
    if (pageCount < curPage) {
      curPage = 1
    }
    // 请求服务器
    this.loadList(curPage)
  }
  /**
   * 将子组件中的选中的数据传输到父组件中
   * */
  onWaitSelectChange (selectMap) {
    this.context.waitData.selectMap = selectMap
  }
  updateWaitTotal (count, time) {
    if (!time || this.context.lastCountUpdateTime < time) {
      // 设置等待的数量
      this.context.$store.commit('message/setWaitCount', count)
    }
  }

  searchUsers () {
    if (this.context.curTab === '待接入') {
      this.context.updateList(true)
    }
  }
}
