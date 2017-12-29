'use strict'

const service = {
  getNonceStr: function () {
    return Math.random().toString(36).substr(2, 15)
  },
  getIp: function (req) {
    var ip = req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress
    return ip.replace('::ffff:', '')
  },
  getTimeStamp: function () {
    var timestamp = new Date()
    return timestamp.getTime().toString()
  }
}

module.exports = service