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
  }
}
