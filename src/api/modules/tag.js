import http from '../http'
export default {

  /**
   * 添加标签
   * @param tagName标签名称
   * @param tagId
   */
  addTag (tagName) {
    return http.post('/tag', {
      tagName
    })
  },
  /**
   * 删除标签
   * @param tagId 标签id
   * @return {*}
   */
  deleteTag (tagId) {
    return http.del(`/tag/${tagId}`)
  },
  /**
   * 更新标签
   * @param tagName 标签名称
   * @param tagId 标签id
   * @return {*}
   */
  updateTag (tagName, tagId) {
    return http.put('/tag', {
      tagName,
      tagId
    })
  },
  /**
   * 获取标签以及标签的人数
   */
  getTagListWithCount () {
    return http.get('/tag/list')
  },
  /**
   * 给用户添加标签
   * @param id 用户id
   * @param tagId 标签id
   */
  addTagToUser (id, tagId) {
    return http.post('/tag/user', {
      id,
      tagId
    })
  },
  /**
   * 删除用户与标签的关系
   * @param userTagId 标签关系id
   * @return {*}
   */
  deleteTagOfUser (userTagId) {
    return http.del(`/tag/user/${userTagId}`)
  }
}
