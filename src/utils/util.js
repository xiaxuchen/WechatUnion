const emotions = ['/::)', '/::~', '/::B', '/::|', '/:8-)', '/::<', '/::$', '/::X', '/::Z', "/::'(", '/::-|', '/::@', '/::P', '/::D', '/::O', '/::(', '/::+', '[囧]', '/::Q', '/::T', '/:,@P', '/:,@-D', '/::d', '/:,@o', '/::g', '/:|-)', '/::!', '/::L', '/::>', '/::,@', '/:,@f', '/::-S', '/:?', '/:,@x', '/:,@@', '/::8', '/:,@!', '/:!!!', '/:xx', '/:bye', '/:wipe', '/:dig', '/:handclap', '/:&-(', '/:B-)', '/:<@', '/:@>', '/::-O', '/:>-|', '/:P-(', "/::'|", '/:X-)', '/::*', '/:@x', '/:8*', '/:pd', '/:<W>', '/:beer', '/:basketb', '/:oo', '/:coffee', '/:eat', '/:pig', '/:rose', '/:fade', '/:showlove', '/:heart', '/:break', '/:cake', '/:li', '/:bome', '/:kn', '/:footb', '/:ladybug', '/:shit', '/:moon', '/:sun', '/:gift', '/:hug', '/:strong', '/:weak', '/:share', '/:v', '/:@)', '/:jj', '/:@@', '/:bad', '/:lvu', '/:no', '/:ok', '/:love', '/:<L>', '/:jump', '/:shake', '/:<O>', '/:circle', '/:kotow', '/:turn', '/:skip', '/:oY', '/:#-0', '/:hiphot', '/:kiss', '/:<&', '/:&>']
const emotionIndexs = {'/::)': 0, '/::~': 1, '/::B': 2, '/::|': 3, '/:8-)': 4, '/::<': 5, '/::$': 6, '/::X': 7, '/::Z': 8, "/::'(": 9, '/::-|': 10, '/::@': 11, '/::P': 12, '/::D': 13, '/::O': 14, '/::(': 15, '/::+': 16, '[囧]': 17, '/::Q': 18, '/::T': 19, '/:,@P': 20, '/:,@-D': 21, '/::d': 22, '/:,@o': 23, '/::g': 24, '/:|-)': 25, '/::!': 26, '/::L': 27, '/::>': 28, '/::,@': 29, '/:,@f': 30, '/::-S': 31, '/:?': 32, '/:,@x': 33, '/:,@@': 34, '/::8': 35, '/:,@!': 36, '/:!!!': 37, '/:xx': 38, '/:bye': 39, '/:wipe': 40, '/:dig': 41, '/:handclap': 42, '/:&-(': 43, '/:B-)': 44, '/:<@': 45, '/:@>': 46, '/::-O': 47, '/:>-|': 48, '/:P-(': 49, "/::'|": 50, '/:X-)': 51, '/::*': 52, '/:@x': 53, '/:8*': 54, '/:pd': 55, '/:<W>': 56, '/:beer': 57, '/:basketb': 58, '/:oo': 59, '/:coffee': 60, '/:eat': 61, '/:pig': 62, '/:rose': 63, '/:fade': 64, '/:showlove': 65, '/:heart': 66, '/:break': 67, '/:cake': 68, '/:li': 69, '/:bome': 70, '/:kn': 71, '/:footb': 72, '/:ladybug': 73, '/:shit': 74, '/:moon': 75, '/:sun': 76, '/:gift': 77, '/:hug': 78, '/:strong': 79, '/:weak': 80, '/:share': 81, '/:v': 82, '/:@)': 83, '/:jj': 84, '/:@@': 85, '/:bad': 86, '/:lvu': 87, '/:no': 88, '/:ok': 89, '/:love': 90, '/:<L>': 91, '/:jump': 92, '/:shake': 93, '/:<O>': 94, '/:circle': 95, '/:kotow': 96, '/:turn': 97, '/:skip': 98, '/:oY': 99, '/:#-0': 100, '/:hiphot': 101, '/:kiss': 102, '/:<&': 103, '/:&>': 104}
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
  },
  /**
   * 转换emotion为图片标签
   * @param emotion
   * @return {string}
   */
  emotionImg (emotion) {
    return `<img src="https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/${emotionIndexs[emotion]}.gif" >`
  },
  /**
   * TODO 目前只能转化一个 将字符串转换为表情字符
   * @param str
   * @return {*}
   */
  emotionStr (str) {
    emotions.forEach((e) => {
      str = str.replace(e, this.emotionImg(e))
    })
    return str
  }
}
