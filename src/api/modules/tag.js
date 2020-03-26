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
    return http.del('/tag', {
      tagId
    })
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
  }
}
