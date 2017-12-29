'use strict'

const mongoose = require('mongoose')
const Operation = mongoose.model('Operation')

exports.add = function *(next) {

  if(!this.session.client) {
    return (this.body = {
      ret: 0,
      err: '请先登录'
    })
  }

  let clientId = this.session.client.clientId

  let body = this.request.body
  console.log(body)
  let bodykeys = Object.keys(body)

  let id = Math.random().toString(36).substring(3, 11)

  let operation = new Operation({id: id, clientId: clientId})

  if(bodykeys.length > 0) {
    for (var i = bodykeys.length - 1; i >= 0; i--) {
      operation[bodykeys[i]] = body[bodykeys[i]]
    }
    yield operation.save()
  }

  this.body = {
    code: 1,
    operation: operation,
    err: 'ok'
  }
}

exports.edit = function *(next) {

  if(!this.session.client) {
    return (this.body = {
      ret: 0,
      err: '请先登录'
    })
  }

  let body = this.request.body
  console.log(body)
  let bodykeys = Object.keys(body)

  let id = body.id

  let operation = yield Operation.findOne({id: id}).exec()


  if(bodykeys.length > 0 && operation) {
    for (var i = bodykeys.length - 1; i >= 0; i--) {
      if(bodykeys[i] == 'collationschematic' && body[bodykeys[i]] == '') {
        body[bodykeys[i]] = []
      }
      if(bodykeys[i] == 'schematicschematic' && body[bodykeys[i]] == '') {
        body[bodykeys[i]] = []
      }
      if(body[bodykeys[i]]) {
        operation[bodykeys[i]] = body[bodykeys[i]]
      }
    }
    yield operation.save()
  }

  this.body = {
    code: 1,
    operation: operation,
    err: 'ok'
  }
}

exports.del = function *(next) {

  if(!this.session.client) {
    return (this.body = {
      ret: 0,
      err: '请先登录'
    })
  }
  let clientId = this.session.client.clientId

  let id = this.request.body.id

  let operation = yield Operation.findOne({id: id, clientId: clientId}).exec()

  let childOperation = yield Operation.findOne({parentid: id, clientId: clientId}).exec()
  if(childOperation) {
    let childOperation2 = yield Operation.findOne({parentid: childOperation.id, clientId: clientId}).exec()
    if(childOperation2) {
      yield childOperation2.remove()
    }
    yield childOperation.remove()
  }
  yield operation.remove()

  this.body = {
    code: 1,
    err: 'ok'
  }
}

exports.info = function *(next) {

  if(!this.session.client) {
    return (this.body = {
      ret: 0,
      err: '请先登录'
    })
  }

  let operations = yield Operation.find({clientId: this.session.client.clientId}).exec()

  this.body = {
    code: 1,
    operations: operations,
    err: 'ok'
  }
}

