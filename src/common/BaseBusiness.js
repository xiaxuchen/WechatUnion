export default class BaseBusiness {
  /**
   * 构造一个业务类
   * @param context 上下文环境，也就是当前所处的vue组件
   */
  constructor (context) {
    this.context = context
    this.$common = context.$common
  }
}
