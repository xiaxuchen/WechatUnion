import BaseBusiness from '@/common/BaseBusiness'
import api from '@/api'

export default class TagBusiness extends BaseBusiness {
  constructor (props) {
    super(props)
    this.$common = this.context.$common
  }

  /**
   * 根据当前的搜索条件加载用户信息
   */
  loadUsers () {
    this.$common.showLoading()
    this.netLoadUsers(() => {
      this.$common.hideLoading()
    })
  }

  /**
   * 根据当前的搜索条件加载用户信息
   */
  netLoadUsers (success) {
    api.push.loadUserList([this.context.curTagId], this.context.curPage,
      this.context.pageSize, this.context.searchKey)
      .commonThen((success, data) => {
        this.context.total = data.total
        this.context.userList = data.data
      }, this.context).finally(() => {
        if (success) {
          success()
        }
      })
  }

  /**
   * 添加标签
   * @param tagName 标签名称
   */
  addTag (tagName) {
    this.$common.showLoading()
    api.tag.addTag(tagName)
      .commonThen((success, data) => {
        // 将列表添加进标签列表
        this.context.tagList.splice(0, 0, data)
      }, this.context).finally(() => {
        this.$common.hideLoading()
      })
  }

  /**
   * 删除标签
   * @param tagId 标签id
   */
  deleteTag (tagId, index) {
    this.$common.showLoading()
    api.tag.deleteTag(tagId)
      .commonThen((success, data) => {
        this.context.tagList.splice(index, 1)
      }, this.context).finally(() => {
        this.$common.hideLoading()
      })
  }

  /**
   * 更新标签
   * @param tagId 标签的id
   * @param tagName 标签的新名称
   */
  updateTag (tagName, tagId, index) {
    this.$common.showLoading()
    api.tag.updateTag(tagName, tagId)
      .commonThen((success, data) => {
        this.context.tagList[index].name = tagName
      }, this.context).finally(() => {
        this.$common.hideLoading()
      })
  }

  /**
   * 获取所有的标签
   */
  init () {
    api.tag.getTagListWithCount()
      .commonThen((success, data) => {
        this.context.tagList = data
        this.netLoadUsers(() => {
          this.$common.hideLoading()
        })
      }, this.context).catch(() => {
        this.$common.hideLoading()
      })
  }

  /**
   * 给用户添加标签
   */
  addUserTag () {
    const alreadyExist = this.context.curUser.tags.some((tag) => {
      return tag.id === this.context.toAddTagId
    })
    if (alreadyExist) {
      this.context.$message.error('该用户已有此标签')
      return
    }
    this.$common.showLoading()
    // 添加
    api.tag.addTagToUser(this.context.curUser.id, this.context.toAddTagId)
      .commonThen((success, data) => {
        this.context.$message('添加成功')
        this.context.addTagVisible = false
        this.init()
      }).finally(() => {
        this.$common.hideLoading()
      })
  }

  /**
   * 删除用户的标签
   */
  deleteTagOfUser (userTagId) {
    this.$common.showLoading()
    // 添加
    api.tag.deleteTagOfUser(userTagId)
      .commonThen((success, data) => {
        this.context.$message('删除成功')
        this.init()
        this.context.allTagVisible = false
      }).finally(() => {
        this.$common.hideLoading()
      })
  }
}
