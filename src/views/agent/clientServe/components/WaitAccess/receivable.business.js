import BaseBusiness from '@/common/BaseBusiness'

export default class ReceivableBusiness extends BaseBusiness {
  /**
   * 发送消息加载可接入的用户列表
   * @param 当前页
   * @param 是否强制获取
   **/
  loadList () {
    if (!this.context.webSocket || this.context.waitLoading) {
      return
    }
    const searcher = {
      curPage: this.context.receivableData.curPage,
      ...this.context.searcher[this.context.curTab]
    }
    if (searcher.agentId) {
      searcher.agentId = this.context.managerId
    } else {
      delete searcher.agentId
    }
    this.context.webSocket.send('/message/receivableUser/users', searcher)
    this.context.receivableLoading = true
  }

  /*
 * 更新可接入用户列表
 * */
  updateReceivableUsers (userPage) {
    // 设置记录总数
    this.context.receivableData.total = userPage.total
    // 清除原来的
    this.context.receivableData.userList.clear()
    // 添加
    userPage.data.forEach((user) => {
      this.context.receivableData.userList.push(user.id, user)
    })
    this.context.receivableLoading = false
  }

  /**
   * 接受可接受的用户
   */
  receiveReceivableUser () {
    let selectMap = this.context.receivableData.selectMap
    const idList = Object.keys(selectMap).map(value => {
      return selectMap[value].id
    })
    if (idList.length === 0) {
      this.context.$message.error('请至少选中一个用户')
      return
    }
    this.$common.showLoading()
    this.context.api.message.receiveReceivableUser(idList)
      .commonThen((success, data) => {
        if (success) {
          if (data.length > 0) {
            const errorList = data.map((openId) => {
              return this.context.receivableData.userList.get(openId).name
            }).toString()
            this.context.$message.error(errorList + ' 接入失败，已被其他经理接入或已离线')
          } else {
            this.context.$message('接入成功')
          }
          // 将选择的用户清除
          idList.forEach((openId) => {
            this.context.receivableData.userList.delete(openId)
          })
          this.context.receivableData.selectMap = {}
        }
      }, this).finally(() => {
        this.$common.hideLoading()
      })
  }
}
