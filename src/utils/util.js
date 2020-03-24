export default {
  /**
   * 生成uuid
   * @return {string} uuid
   */
  uuid () {
    let d = new Date().getTime()
    if (window.performance && typeof window.performance.now === 'function') {
      d += performance.now() // use high-precision timer if available
    }
    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0
      d = Math.floor(d / 16)
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
    })
    return uuid
  },
  /**
   * 智能的定时器
   * @param callback 回调,会传递一个方法给callback,直接调用即可退出执行
   * @param interval 时间间隔，默认500ms
   * @param duration 执行时间，默认为-1 一直执行
   */
  timeoutInterval (fn, interval = 500, duration = -1) {
    if (duration == null || typeof duration !== 'number') {
      throw 'type of duration need be number'
    }
    let count = -1
    if (duration >= 0) {
      count = duration / interval
    }
    const id = setInterval(() => {
      // 如果到了指定次数，就停止
      if (count >= 0 && --count <= 0) {
        clearInterval(id)
      }
      if (fn) {
        fn(() => {
          clearInterval(id)
        })
      }
    }, interval)
    return id
  }
}
