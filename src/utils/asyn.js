export class MyWebSocket {
  constructor (url) {
    this.url = url

    // close来源判断及后续操作
    this.closeConfig = {
      resolve: null,
      closing: false
    }
    // promise池
    this.promisePool = {}
  }

  tokenCheck (req, rsp) {
    // 此处根据自己的数据结构进行tokenCheck的判断，返回一个boolean
  }

  open () {
    return new Promise((resolve, reject) => {
      if (typeof this._websocket === 'undefined') {
        this._websocket = new WebSocket(this.url)
        this._websocket.open = (e) => {
          resolve({e, ws: this})
        }
        this._websocket.onerror = (e) => {
          reject(e)
        }
      }
      this._websocket.onclose = (e) => {
        // 非主动close
        if (!this.closeConfig.closing) {
          console.log('reconnect')
          // 对应的重连操作
        }
        // 若手动close，恢复初始状态
        this.closeConfig.closing = false
      }

      this._websocket.onmessage = (e) => {
        const key = e.content.token
        const req = this.promisePool[key]
        req.resolve(e)
        delete this.promisePool[key]
      }
    })
  }

  close () {
    this.closeConfig.closing = true
    this._websocket.close()
  }

  // token包含在content中
  send (name, content) {
    return new Promise((resolve, reject) => {
      this.promisePool[content.token] = {
        content,
        resolve,
        reject,
        name
      }
      this._websocket.send({content, name})
    })
  }
}
