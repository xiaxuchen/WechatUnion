export default {
  /**
   * format the sex from number to str
   * @param sex the number represent sex
   * @returns {string}
   */
  formatSex (sex) {
    switch (sex) {
      case 1: return '男'
      case 2: return '女'
      default: return '未知'
    }
  },
  /**
   * 将时间戳转换为日期格式
   * @param timestamp
   * @return {string}
   */
  formatTimeInMillis (timestamp) {
    if (timestamp) {
      if (timestamp.toString().length === 10) {
        timestamp = timestamp * 1000
      }
      let date = new Date(timestamp)
      let Y = date.getFullYear()
      let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)
      let D = date.getDate()
      let h = date.getHours()
      let m = date.getMinutes()
      let s = date.getSeconds()
      return `${Y}-${M}-${D} ${h}:${m}:${s}`
    }
    return ''
  }
}
