'use strict'

const mongoose = require('mongoose')
const Face = mongoose.model('Face')
const Eyebrow = mongoose.model('Eyebrow')
const StarTest = mongoose.model('Startest')
const sms = require('../service/sms')
const Msg = require('../libs/msg')


exports.index = function *(next) {

  this.body = {
    ret: 0,
    err: 'users'
  }
}


/**
 * @api {get} /sendVerifyCode  用手机号码发验证码，AR  或者 客户端 都是可以的
 * @apiName sendVerifyCode
 * @apiGroup user
 * @apiPermission anyBody
 *
 * @apiDescription signup for client or user.
 *
 * @apiParam {String} mobile 手机号码.
 *
 * @apiExample Example usage:
 * http://test.legle.cc/sendVerifyCode
 *
 * @apiSuccess {Number}   code   1.
 * @apiSuccess {String}   err 'ok'.
 * @apiError code 0.
 * @apiError err   err message.
 *
 * @apiErrorExample Response (example):
 *     HTTP/1.1 200 Ok
 *     {
 *       "ret": 0
 *       "code": 0
 *     }
 */
exports.sendVerify = function *(next) {
  let mobile = this.query.mobile

  if(!mobile) {
    return (this.body = {
      code: 0,
      err: 'mobile not found'
    })
  }

  sms.newCode({mobi:mobile})

  this.body = {
    code: 1
  }
}


/**
 * @api {post} /pcVerifyMobile  明星面对面 验证手机
 * @apiName pcVerifyMobile
 * @apiGroup PcStarTest
 * @apiPermission anyBody
 *
 * @apiDescription 明星面对面 验证手机
 *
 * @apiParam {String} uuid 用户uuid.
 * @apiParam {String} mobile 用户mobile.
 * @apiParam {Number/String} code 用户code.
 *
 * @apiExample Example usage:
 * http://test.legle.cc/pcVerifyMobile
 *
 * @apiSuccess {uuid}   code   1.
 * @apiSuccess {String}   err 'ok'.
 * @apiError code 0.
 * @apiError err   err message.
 *
 * @apiErrorExample Response (example):
 *     HTTP/1.1 200 Ok
 *     {
 *       "code": 1
 *       "err": 'ok'
 *     }
 */ 
exports.pcVerifyMobile = function *(next) {

  let uuid = this.request.body.uuid || ''
  let mobile = this.request.body.mobile || ''
  let code = this.request.body.code || ''
  let type = this.request.body.type || ''

  if (!uuid || uuid === 'undefined' || !mobile) {
    return (this.body = {
      ret: 0,
      err: 'uuid or mobile not found'
    })
  }
  if (!sms.checkCode({mobi:mobile,code:code})) {
    return (this.body = {
      ret: 0,
      err: Msg.USER.CODE_ERROR
    })
  }

  if(type == 'star') {
    let star = yield StarTest.findOne({uuid:uuid}).exec()
    star.mobile = mobile
    yield star.save()
  }

  if(this.session.test) { 
    this.session.test.mobile = mobile
  }
  else {
    this.session.test = {
      mobile: mobile
    }
  }

  if(type == 'face') {
    let face = yield Face.findOne({uuid:uuid}).exec()
    face.mobile = mobile
    yield face.save()
  }


  if(type == 'eyebrow') {
    let eyebrow = yield Eyebrow.findOne({uuid:uuid}).exec()
    eyebrow.mobile = mobile
    yield eyebrow.save()
  }


  this.body = {
    code: 1,
    err: 'ok'
  }

}

exports.getStarsToken = function *(next) {

  let results = yield aliyun.accessToken('stars')

  this.body = results
}

exports.getSts = function *(next) {

  let results = yield aliyun.accessSts()

  this.body = results
}



