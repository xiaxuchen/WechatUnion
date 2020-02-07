const install = (vue) => {
  vue.prototype.$common = {
    mapAttr (origin, attr, mapFunc) {
      let obj = {...origin}
      let {result, remove} = mapFunc(attr, origin[attr])
      if (remove == null) {
        remove = false
      }
      if (!remove) {
        obj.key = result
      } else {
        delete obj[attr]
      }
      return obj
    }
  }

  /**
   * 将对象的属性进行映射，映射为对应的值
   * @param mapFunc 映射函数，返回一个对象{result:映射结果,remove: false 是否移除}
   */
  // eslint-disable-next-line no-extend-native
  // Object.prototype.map = (mapFunc) => {
  //   let obj = {}
  //   Object.keys(this).forEach((key) => {
  //     console.log("key" + key)
  //     console.log("value" + this[key])
  //     let {result, remove} = mapFunc(key, this[key])
  //     if (remove == null) {
  //       remove = false
  //     }
  //     if (!remove) {
  //       obj.key = result
  //     }
  //   })
  //   return obj
  // }
}

export default {
  install
}
