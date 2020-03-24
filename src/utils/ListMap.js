// 键的前缀
const KEY_PREFIX = 'keys'

// 获取真正的键
const getKey = (key) => {
  return `${KEY_PREFIX}-key`
}

// 判断非空
const notNull = (obj) => {
  return (!obj && typeof (obj) !== 'undefined') || obj === 0
}

export class ListMap {
  constructor () {
    // 真正的数据
    this.__data = []
    // 键的对应位置
    this.__keyMap = {}
  }

  /**
   * 将数据放入列表的最后
   * @param key 键
   * @param value 值
   */
  push (key, value) {
    this.__data.push(value)
    this.__keyMap[getKey(key)] = this.__data.length - 1
  }

  /**
   * 根据键去删除元素
   * @param key 键
   */
  delete (key) {
    const index = this.__keyMap[getKey(key)]
    console.log(notNull(index))
    if (notNull(index)) {
      // 删除掉键map中的对应index
      delete this.__keyMap[getKey(key)]
      console.log('before delete :', JSON.stringify(this.__data))
      // 删除该值
      this.__data.splice(index, 1)
      console.log('after delete :', JSON.stringify(this.__data))
    }
  }

  /**
   * 获取指定键的元素
   * @param key 元素的键
   * @returns {null} 如果没有则返回空
   */
  get (key) {
    const index = this.__keyMap[getKey(key)]
    if (notNull(index)) {
      // 返回
      return this.__data[index]
    }
    return null
  }

  /**
   * 更新指定键的值
   * @param key 键
   * @param value 值
   * @return boolean 是否更新成功
   */
  set (key, value) {
    const index = this.__keyMap[getKey(key)]
    if (notNull(index)) {
      // 更新
      this.__data[index] = value
      return true
    }
    // 找不到就返回false
    return false
  }

  /**
   * 获取指定键的索引
   * @param key 键
   */
  indexOf (key) {
    return this.__keyMap[getKey(key)]
  }

  /**
   * 是否存在指定的key
   * @param 键
   * @return {boolean} 是否存在
   */
  exist (key) {
    const index = this.indexOf(key)
    if (notNull(index)) {
      return true
    }
    return false
  }

  /**
   * 根据排序规则排序
   * @param compare 排序函数，返回0、1、-1表示两个数之间的大小
   */
  sort (compare) {
    // 不为空则排序
    if (compare) {
      const len = this.__data.length
      // 键的数组,位置与元素对应
      const keyArr = []
      // 初始化数组
      for (let i = 0; i < len; i++) {
        keyArr[i] = ''
      }
      Object.keys(this.__keyMap).forEach(key => {
        // 获取到对应的索引
        const index = this.__keyMap[getKey(key)]
        // 放入数组中
        keyArr[index] = key
      })
      // 排序
      for (let i = 0; i < len; i++) {
        for (let j = 0; j < len - 1 - i; j++) {
          // 调用比较函数相邻元素两两对比，如前面的比后面的打则往后移
          if (compare(this.__data[j], this.__data[j + 1]) === 1) {
            // 元素交换
            let temp = this.__data[j + 1]
            this.__data[j + 1] = this.__data[j]
            this.__data[j] = temp
            // 元素交换的同时，对应的键也要交换
            let tempKey = keyArr[j + 1]
            keyArr[j + 1] = keyArr[j]
            keyArr[j] = tempKey
          }
        }
      }
      // 排序完成后重新组装keyMap
      this.__keyMap = {}
      keyArr.forEach(index => {
        this.__keyMap[keyArr[index]] = index
      })
    }
  }

  /**
   * 清空
   */
  clear () {
    this.__data = []
    this.__keyMap = {}
  }

  /**
   * 获取排好序的元素的范围
   // * @param start 开始
   // * @param end 结束
   */
  getRange () {
    return this.__data
    // if (!notNull(start) && !notNull(end)) {
    //
    // }
    //
    // if (!notNull(end)) {
    //   end = this.__data.length
    // }
    //
    // return this.__data.slice(start, end)
  }

  /**
   * 是否是空
   * @return {boolean} 是否为空
   */
  isEmpty () {
    return this.__data.length === 0
  }
}
