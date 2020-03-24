import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
export class ChatWebSocket {
  /**
   * 创建聊天的websocket对象
   * @param url 路径
   * @param ready 连接成功回调
   * @param headers 连接时发送的头信息
   * @param error 错误回调
   */
  constructor (url, ready, headers, error) {
    this.__url = url
    this.__status = 0
    this.__headers = headers
    this.__ready = ready
    this.__error = error
  }

  /**
   * 订阅
   * @param destination 订阅的目的地
   * @param callback 回调
   */
  subscribe (destination, callback) {
    if (this.__status === 1) {
      return this.__stompClient.subscribe(destination, (resp) => {
        let body = resp.body
        try {
          body = JSON.parse(resp.body)
        } catch (e) {
          console.log(e)
        }
        callback(body, resp)
      })
    }
    return null
  }

  /**
   * 发送消息
   * @param destination 目的地
   * @param headers 消息头
   * @param body 消息体
   * @return {*}
   */
  sendJson (destination, body = '{}', headers = {}) {
    if (this.__status === 1) {
      return this.__stompClient.send(destination, headers, JSON.stringify(body))
    }
  }

  /**
   * 发送消息
   * @param destination 目的地
   * @param headers 消息头
   * @param body 消息体
   * @return {*}
   */
  send (destination, body = '', headers = {}) {
    console.log(body)
    if (this.__status === 1) {
      return this.__stompClient.send(destination, headers, JSON.stringify(body))
    }
  }

  /**
   * 设置被动关闭时的事件
   * @param onclose 关闭回调
   */
  setOnCloseEvent (onclose) {
    this.__onClose = onclose
    return this
  }

  /**
   * 关闭连接
   */
  close () {
    if (this.__status === 1) {
      // 断开连接回调
      let onClose = () => {
        console.log('连接已断开')
      }
      if (this.__onClose) {
        onClose = this.__onClose
      }
      this.__stompClient.disconnect(onClose)
    } else {
      this.__status = 0
      console.log('webSocket closed')
    }
  }

  /**
   * 打开连接
   */
  open () {
    if ('WebSocket' in window) {
      if (typeof this.__stompClient === 'undefined') {
        const sock = new SockJS(this.__url)
        // 这个stompClient对象主要是用于前后台交互用的
        this.__stompClient = Stomp.over(sock)
        // 组装headers
        let headers = {}
        if (this.__headers) {
          headers = this.__headers
        }
        this.__stompClient.connect(headers, (resp) => {
          // 连接成功状态设置为1
          this.__status = 1
          if (this.__ready) {
            this.__ready(resp)
          }
        }, (error) => {
          if (this.__error) {
            this.__error(error)
          }
          // 连接失败为-1
          this.__status = -1
        })
      }
    } else {
      throw '浏览器不支持websocket'
    }
  }

  /**
   * 是否已连接
   * @return {boolean}
   */
  isConnected () {
    return this.__status === 1
  }
}
