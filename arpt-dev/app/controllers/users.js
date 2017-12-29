'use strict'

const mongoose = require('mongoose')
const User = mongoose.model('User')
const Userred = mongoose.model('Userred')
const Taian = mongoose.model('Taian')
const Usercoupon = mongoose.model('Usercoupon')
const Face = mongoose.model('Face')
const Skin = mongoose.model('Skin')
const Client = mongoose.model('Client')
const StarTest = mongoose.model('Startest')
const Star = mongoose.model('Star')
const FaceSet = mongoose.model('FaceSet')
const facepp = require('../service/facepp')
const xss = require('xss')
// const moment = require('moment')
const sms = require('../service/sms')
const Msg = require('../libs/msg')
const aliyun = require('../service/aliyun')
const weixin = require('./weixin')
const queryArea = require('query-mobile-phone-area')
const config = require('../../config/config')
const schedule = require('node-schedule')
const request = require('request-promise')

exports.index = function *(next) {


  // let stars = yield Star.find().exec()

  // function imgCrop(src) {
  //   var _src = src + '?x-oss-process=image/info'
  //   return new Promise(function(resolve, reject) {
  //     let x,y,w,h,mw,mh
  //     request(_src).then(function(data) {
  //         try{
  //           data = JSON.parse(data)
  //         } catch(errr) {
  //           data = data
  //         }
  //     　　mw = data.ImageWidth.value
  //         mw = Number(mw)
  //     　　mh = data.ImageHeight.value
  //         mh = Number(mh)
  //         if(mh > mw) {
  //           h = mw * 1.143
  //           w = mw
  //           x = 0
  //           y = (mh - h)/2
  //           if(y < 0) {
  //             y = 0
  //           }
  //         } else {
  //             h = mh
  //             w = mh * 0.875
  //             y = 0
  //             x = (mw - w)/2
  //             if(x < 0) {
  //               x = 0
  //             }
  //         }
  //         x = Math.floor(x)
  //         y = Math.floor(y)
  //         w = Math.floor(w)
  //         h = Math.floor(h)
  //         console.log(x,y,w,h)
  //         resolve(src + '?x-oss-process=image/crop,x_'+ x +',y_'+ y +',w_'+ w +',h_' + h)
  //       })
  //     })
  // }

  // let aa = 0

  // for (var i = stars.length - 1; i >= 0; i--) {
  //   let star = stars[i]
  //   if(star.picture && star.picture.indexOf('arpt-user.oss-cn-shenzhen.aliyuncs.com') > -1 && star.picture.indexOf('x-oss-process=image') === -1) {
  //     aa++
  //     console.log('aa===', aa)
  //     star.picture = yield imgCrop(star.picture)
  //     yield star.save()
  //   } 
  // }

  this.body = {
    ret: 0,
    err: 'users'
  }
}

exports.azz = function *(next) {
  this.body = 'd17dd23e7b5c6b9076ccb37a178bCZZ9'
}

// 微信 优惠卷授权登录回调
exports.wxcbCounpon = function *(next) {
  let _id = ''
  if(this.session && this.session.passport && this.session.passport.user) {
    _id = this.session.passport.user
  }

  let url = '/h5/coupon/index.html?id=' + _id

  this.redirect(url)
  // this.body = {
  //   ret: 1,
  //   _id: _id
  // }
}

// 微信h5 优惠卷活动 确认是否已经授权
exports.wxCouponConfirm = function *(next) {
  let id = this.request.body.id || ''
  if(!id) {
    return (this.body = {
      ret: 0,
      err: 'id不能为空'
    })
  }

  let usercoupon = yield Usercoupon.findOne({_id: id}).exec()

  if(usercoupon && usercoupon.coupon) {
     return (this.body = {
      ret: 1,
      err: '你已经领取过了',
      user: usercoupon
    })
  } else {
    return (this.body = {
      ret: 0,
      err: '用户没有报名'
    })
  }
}

// 微信h5 优惠卷活动 报名
exports.wxCoupon = function *(next) {

  let name = this.request.body.name
  let mobile = this.request.body.mobile
  let coupon = this.request.body.coupon || ''
  let code = this.request.body.code
  let id = this.request.body.id || ''

  if (!sms.checkCode({mobi:mobile,code:code})) {
    return (this.body = {
      code: 0,
      err: Msg.USER.CODE_ERROR
    })
  }

  if(!id) {
    return (this.body = {
      ret: 0,
      err: 'id不能为空'
    })
  }

  let usercoupon = yield Usercoupon.findOne({_id: id}).exec()

  if(!usercoupon) {
    return (this.body = {
      ret: 0,
      err: '用户没有授权，请重新扫二维码授权!'
    })
  }

  usercoupon.nickname = name
  usercoupon.mobile = mobile
  usercoupon.coupon = coupon

  yield usercoupon.save()

  this.body = {
    ret: 1,
    err: 'ok',
    user: usercoupon
  }
}

// 微信h5 优惠卷活动 获取优惠卷列表
exports.wxCouponList = function *(next) {

  let number = 10

  let nickname = this.request.body.nickname
  let sex = this.request.body.sex
  let mobile = this.request.body.mobile
  let dateFrom = this.request.body.dateFrom
  let dateTo = this.request.body.dateTo
  let pagination = this.request.body.pagination || 0

  let dateField
  let findField = {coupon: {$exists: true}}

  let a = new Date(new Date().setHours(0, 0, 0, 0))
  a = a.getTime()
  let b = new Date().getTime()

  if(dateFrom && dateTo) {
    dateFrom = new Date(dateFrom).getTime()
    dateTo = new Date(dateTo).getTime()
    dateField = {$gte: dateFrom, $lte: dateTo}
    findField['meta.createdAt'] = dateField
  }
  if(nickname) {
    findField.nickname = nickname
  }
  if(sex) {
    findField.sex = sex
  }
  if(mobile) {
    findField.mobile = mobile
  }

  let today = yield Usercoupon.count({coupon: {$exists: true}, 'meta.createdAt': {$gte: a, $lte: b}}).exec()

  let length = yield Usercoupon.count(findField).exec()
  let users = yield Usercoupon.find(findField).sort({coupon: 1}).skip(number*pagination).limit(number).exec()


  return (this.body = {
    ret: 1,
    err: 'ok',
    length: length,
    today: today,
    users: users
  })
}

// 微信h5 红包活动 保存 session
exports.taianPayTest = function *(next) {
  
  // weixin.taianPay('oGhqSvyj4NRen5WZwkdlzsVYdcTI', 1)
  // Taian.find().sort({shareNum: -1})
  //   .then(function(users) { 
  //     let money = 1 + Number(Math.random().toFixed(1))
  //     users[0].money = money
  //     users[0].save()
  //   })

  if(this.query.key !== 'taian666') {
    return this.body = 'Fuck you, gun!'
  }

  let num = Number(this.query.num) || 0


  let her = yield Taian.findOne({openid: 'oGhqSv-Z1CAxj_V6qnYgEovbORtA'}).exec()

  her.shareNum += num

  yield her.save()

  this.body = {
    ret: 0,
    ok: her.shareNum
  }

}


// 微信h5 红包活动 发红包
function sendRed() {

  let number = 7
  let date = new Date('2017-11-29 18:00:00')
  console.log('红包截止时间:  ', date)

  function send() {
    Taian.find().sort({shareNum: -1})
    .then(function(users) {
      if(users && users.length >= 1) {
        users = users.slice(0, number)
        for(let index in users) {
          if(users[index]) {
            let openid = users[index].openid
            // let money = 1 + Number(Math.random().toFixed(1))
            if(index == 0) {
              if(openid) {
                weixin.taianPay(openid, 10)
                users[index].money = 10
                users[index].save()
              }
            }
            else if(index == 1) {
              if(openid) {
                weixin.taianPay(openid, 5)
                users[index].money = 5
                users[index].save()
              }
            }
            else if(index == 2) {
              if(openid) {
                weixin.taianPay(openid, 3)
                users[index].money = 3
                users[index].save()
              }
            }
            else {
              if(openid) {
                weixin.taianPay(openid, 1)
                users[index].money = 1
                users[index].save()
              }
            }
            console.log('获奖名字:  ', users[index].nickname)
            // console.log('获奖金额:  ', money)
          }
        }
      }
    })
  }

  schedule.scheduleJob(date, function() {
    send()
  })

}

sendRed()

// 微信h5 红包活动 保存 session
exports.RedSession = function *(next) {
  let openid = this.query.openid
  let clientId = this.query.clientId
  let uuid = this.query.uuid
  let model = this.query.model

  this.session.redPacket = {
    openid: openid,
    clientId: clientId,
    uuid: uuid,
    model: model
  }

  yield next

}

// 微信h5 泰安 保存 session
exports.taianSession = function *(next) {
  let openid = this.query.openid

  this.session.redPacket = {
    openid: openid
  }

  yield next

}

// 微信授权确认
exports.wxcbRedConfirm = function *(next) {

  let openid = this.request.body.openid || ''

  if(!openid) {
    return (this.body = {
      ret: 0,
      err: 'openid 不能为空'
    })
  }

  let user = yield Userred.findOne({openid: openid}).exec()

  if(user) {
    return (this.body = {
      ret: 1,
      err: 'yes',
      user: user
    })
  } else {
    return (this.body = {
      ret: 2,
      err: 'no'
    })
  }
  

  // this.body = {
  //   ret: 1,
  //   _id: _id
  // }
}

// 微信授权登录回调
exports.wxcbRed = function *(next) {

  let openid = ''
  let clientId = ''
  let uuid = ''
  let model = ''

  if(this.session && this.session.redPacket) {
    openid = this.session.redPacket.openid
    clientId = this.session.redPacket.clientId
    uuid = this.session.redPacket.uuid
    model = this.session.redPacket.model
  }

  let id = ''
  if(this.session && this.session.passport && this.session.passport.user) {
    id = this.session.passport.user
  }
  let Userred = yield userred.findOne({_id: id}).exec()

  if(!Userred) {
    return (this.body = {
      ret: 0,
      err: '授权不被允许'
    })
  }

  // 成功授权，分享人 分享次数 +1
  if(!Userred.fatherOpenid) {
    let userPre = yield userred.findOne({openid: openid}).exec()
    if(userPre) {
      userPre.shareNum = userPre.shareNum + 1
      yield userPre.save()
    }
  }

  // 保存上级openid 用于统计转发量
  Userred.fatherOpenid = openid
  let childOpenid = Userred.openid
  yield Userred.save()


  let url = 'http://test.legle.cc/face/report.html?uuid='+ uuid +'&clientId='+ clientId +'&model=' + model + '&childOpenid=' + childOpenid


  this.redirect(url)
  // this.body = {
  //   ret: 1,
  //   _id: _id
  // }
}

exports.taianStatus = function *(next) {
  if(this.session && this.session.redPacket && this.session.redPacket.myOpenid) {
    let myOpenid = this.session.redPacket.myOpenid || ''
    let taian = yield Taian.findOne({openid: myOpenid}).exec()
    if(taian) {
      return (this.body = {
        ret: 1,
        myOpenid: myOpenid
      })
    }
  }

  this.body = {
    ret: 0
  }
}


// 泰安回调
exports.taiancb = function *(next) {

  let openid = ''
  if(this.session && this.session.redPacket) {
    openid = this.session.redPacket.openid
  }

  let id = ''
  if(this.session && this.session.passport && this.session.passport.user) {
    id = this.session.passport.user
  }
  let taian = yield Taian.findOne({_id: id}).exec()

  if(!taian) {
    return (this.body = {
      ret: 0,
      err: '授权不被允许'
    })
  }

  // 成功授权，分享人 分享次数 +1
  if(!taian.fatherOpenid) {
    let userPre = yield Taian.findOne({openid: openid}).exec()
    if(userPre) {
      userPre.shareNum = userPre.shareNum + 1
      yield userPre.save()
    }
    taian.fatherOpenid = openid
  }

  // 保存上级openid 用于统计转发量
  yield taian.save()

  this.session.redPacket.myOpenid = taian.openid


  let url = 'http://arpt.leglear.com/s11/index.html?openid=' + taian.openid


  this.redirect(url)
  // this.body = {
  //   ret: 1,
  //   _id: _id
  // }
}

// 微信h5 泰安 用户获取自己的排名
exports.tananRankin = function *(next) {

  if(!this.session || !this.session.redPacket || !this.session.redPacket.myOpenid) {
    return (this.body = {
      ret: 0,
      err: '重新打开分享链接'
    })
  }

  let number = 5
  let openid = this.session.redPacket.myOpenid

  if(!openid) {
    return (this.body = {
      ret: 0,
      err: '没有找到 openid'
    })
  }

  let findField = {openid: openid}

  let taian = yield Taian.findOne(findField).exec()

  if(!taian) {
    return (this.body = {
      ret: 0,
      err: '没有找到 user'
    })
  }

  let taians = yield Taian.find().sort({shareNum: -1}).exec()

  let position = 0

  for (var i = 0; i < taians.length; i++) {
    if(taians[i].openid === taian.openid) {
      position = i + 1
    }
  }

  if(taians && taians.length > number) {
    taians = taians.slice(0, number)
  }

  let dateStart = config.dateStart
  let dateEnd = config.dateEnd

  return (this.body = {
    ret: 1,
    err: 'ok',
    position: position,
    dateStart: dateStart,
    dateEnd: dateEnd,
    user: taian,
    users: taians
  })
}


// 微信h5 现金红包活动 获取红包列表
exports.wxRedList = function *(next) {

  let number = 10

  let nickname = this.request.body.nickname
  let sex = this.request.body.sex
  let mobile = this.request.body.mobile
  let dateFrom = this.request.body.dateFrom
  let dateTo = this.request.body.dateTo
  let pagination = this.request.body.pagination || 0

  let dateField
  let findField = {shareNum: {$exists: true}}

  let a = new Date(new Date().setHours(0, 0, 0, 0))
  a = a.getTime()
  let b = new Date().getTime()

  if(dateFrom && dateTo) {
    dateFrom = new Date(dateFrom).getTime()
    dateTo = new Date(dateTo).getTime()
    dateField = {$gte: dateFrom, $lte: dateTo}
    findField['meta.updatedAt'] = dateField
  }
  if(nickname) {
    findField.nickname = nickname
  }
  if(sex) {
    findField.sex = sex
  }
  if(mobile) {
    findField.mobile = mobile
  }

  let today = yield Userred.count({shareNum: {$exists: true}, 'meta.updatedAt': {$gte: a, $lte: b}}).exec()

  let length = yield Userred.count(findField).exec()
  let users = yield Userred.find(findField).sort({shareNum: -1}).skip(number*pagination).limit(number).exec()


  return (this.body = {
    ret: 1,
    err: 'ok',
    length: length,
    today: today,
    users: users
  })
}

// 微信h5 泰安活动 获取红包列表
exports.taianList = function *(next) {

  let number = 10

  let nickname = this.request.body.nickname
  let sex = this.request.body.sex
  let mobile = this.request.body.mobile
  let dateFrom = this.request.body.dateFrom
  let dateTo = this.request.body.dateTo
  let pagination = this.request.body.pagination || 0

  let dateField
  let findField = {shareNum: {$exists: true}}

  let a = new Date(new Date().setHours(0, 0, 0, 0))
  a = a.getTime()
  let b = new Date().getTime()

  if(dateFrom && dateTo) {
    dateFrom = new Date(dateFrom).getTime()
    dateTo = new Date(dateTo).getTime()
    dateField = {$gte: dateFrom, $lte: dateTo}
    findField['meta.updatedAt'] = dateField
  }
  if(nickname) {
    findField.nickname = nickname
  }
  if(sex) {
    findField.sex = sex
  }
  if(mobile) {
    findField.mobile = mobile
  }

  let today = yield Taian.count({shareNum: {$exists: true}, 'meta.updatedAt': {$gte: a, $lte: b}}).exec()

  let length = yield Taian.count(findField).exec()
  let users = yield Taian.find(findField).sort({shareNum: -1}).skip(number*pagination).limit(number).exec()


  return (this.body = {
    ret: 1,
    err: 'ok',
    length: length,
    today: today,
    users: users
  })
}

// 微信h5 现金红包活动 统计每天分享次数
exports.wxRedStat = function *(next) {


  let dateStart = config.dateStart
  let dateEnd = config.dateEnd

  let oneDay = 86400000

  dateStart = new Date(dateStart).getTime()
  dateEnd = new Date(dateEnd).getTime()

  let timeOne = dateStart
  let counts = []

  while(timeOne < dateEnd) {
    let timeTwo = timeOne + oneDay
    let count = yield Userred.count({shareNum: {$exists: true}, 'meta.createdAt': {$gte: timeOne, $lte: timeTwo}}).exec()
    counts.push(count)
    timeOne += oneDay
  }

  return (this.body = {
    ret: 1,
    err: 'ok',
    dateStart: dateStart,
    dateEnd: dateEnd,
    counts: counts
  })
}

// 微信h5 泰安 统计每天分享次数
exports.taianStat = function *(next) {


  let dateStart = config.dateStart
  let dateEnd = config.dateEnd

  let oneDay = 86400000

  dateStart = new Date(dateStart).getTime()
  dateEnd = new Date(dateEnd).getTime()

  let timeOne = dateStart
  let counts = []

  while(timeOne < dateEnd) {
    let timeTwo = timeOne + oneDay
    let count = yield Taian.count({shareNum: {$exists: true}, 'meta.createdAt': {$gte: timeOne, $lte: timeTwo}}).exec()
    counts.push(count)
    timeOne += oneDay
  }

  return (this.body = {
    ret: 1,
    err: 'ok',
    dateStart: dateStart,
    dateEnd: dateEnd,
    counts: counts
  })
}


// 微信h5 现金红包活动 用户获取自己的排名
exports.wxRedDetail = function *(next) {

  let number = 5
  let openid = this.query.openid

  if(!openid) {
    return (this.body = {
      ret: 0,
      err: '没有找到 openid'
    })
  }

  let findField = {openid: openid}

  let user = yield Userred.findOne(findField)

  if(!user) {
    return (this.body = {
      ret: 0,
      err: '没有找到 user'
    })
  }

  let users = yield Userred.find().sort({shareNum: -1}).exec()

  let position = 0

  for (var i = 0; i < users.length; i++) {
    if(users[i].openid === user.openid) {
      position = i + 1
    }
  }

  if(users && users.length > number) {
    users = users.slice(0, number)
  }

  let dateStart = config.dateStart
  let dateEnd = config.dateEnd

  return (this.body = {
    ret: 1,
    err: 'ok',
    position: position,
    dateStart: dateStart,
    dateEnd: dateEnd,
    user: user,
    users: users
  })
}

// 微信授权登录回调
exports.wxcb = function *(next) {
  let _id = ''
  if(this.session && this.session.passport && this.session.passport.user) {
    _id = this.session.passport.user
  }

  let url = '/h5/apply/index.html?id=' + _id

  this.redirect(url)
  // this.body = {
  //   ret: 1,
  //   _id: _id
  // }
}

// 微信h5 报名活动 确认是否已经授权
exports.wxSignupConfirm = function *(next) {
  let id = this.request.body.id || ''
  if(!id) {
    return (this.body = {
      ret: 0,
      err: 'id不能为空'
    })
  }

  let user = yield User.findOne({_id: id}).exec()

  if(user && user.rangeNum) {
     return (this.body = {
      ret: 1,
      err: '你已经报名过了',
      user: user
    })
  } else {
    return (this.body = {
      ret: 0,
      err: '用户没有报名'
    })
  }
}

// 微信h5 报名活动
exports.wxSignup = function *(next) {

  let name = this.request.body.name
  let mobile = this.request.body.mobile
  let remark = this.request.body.remark || ''
  let code = this.request.body.code
  let id = this.request.body.id || ''

  if (!sms.checkCode({mobi:mobile,code:code})) {
    return (this.body = {
      code: 0,
      err: Msg.USER.CODE_ERROR
    })
  }

  if(!id) {
    return (this.body = {
      ret: 0,
      err: 'id不能为空'
    })
  }

  let user = yield User.findOne({_id: id}).exec()

  if(!user) {
    return (this.body = {
      ret: 0,
      err: '用户没有授权，请重新扫二维码授权!'
    })
  }

  if(user && user.rangeNum) {
     return (this.body = {
      ret: 2,
      err: '你已经报名过了',
      user: user
    })
  }

  let rangeNum = yield User.count({rangeNum: { $exists: true} }).exec()

  user.nickname = name
  user.mobile = mobile
  user.remark = remark
  user.rangeNum = rangeNum + 1

  yield user.save()

  this.body = {
    ret: 1,
    err: 'ok',
    user: user
  }
}

// 微信h5 报名活动 获取报名列表
exports.wxSignupList = function *(next) {

  let number = 10

  let nickname = this.request.body.nickname
  let sex = this.request.body.sex
  let mobile = this.request.body.mobile
  let dateFrom = this.request.body.dateFrom
  let dateTo = this.request.body.dateTo
  let pagination = this.request.body.pagination || 0

  let dateField
  let findField = {rangeNum: {$exists: true}}

  let a = new Date(new Date().setHours(0, 0, 0, 0))
  a = a.getTime()
  let b = new Date().getTime()

  if(dateFrom && dateTo) {
    dateFrom = new Date(dateFrom).getTime()
    dateTo = new Date(dateTo).getTime()
    dateField = {$gte: dateFrom, $lte: dateTo}
    findField['meta.updatedAt'] = dateField
  }
  if(nickname) {
    findField.nickname = nickname
  }
  if(sex) {
    findField.sex = sex
  }
  if(mobile) {
    findField.mobile = mobile
  }

  let today = yield User.count({rangeNum: {$exists: true}, 'meta.updatedAt': {$gte: a, $lte: b}}).exec()

  let length = yield User.count(findField).exec()
  let users = yield User.find(findField).sort({rangeNum: 1}).skip(number*pagination).limit(number).exec()


  return (this.body = {
    ret: 1,
    err: 'ok',
    length: length,
    today: today,
    users: users
  })
}


exports.indexPost = function *(next) {
  // test port

  // let results = yield aliyun.accessToken()

  this.body = {
    ret: 1,
    results: this.request.body
  }
}

// get aliyun sts
exports.getSts = function *(next) {

  let results = yield aliyun.accessSts()

  this.body = results
}

exports.getStarToken = function *(next) {

  let results = yield aliyun.accessToken('star')

  this.body = results
}

exports.getStarsToken = function *(next) {

  let results = yield aliyun.accessToken('stars')

  this.body = results
}

exports.getFaceToken = function *(next) {

  let results = yield aliyun.accessToken('face')

  this.body = results
}

exports.getAdvertisementToken = function *(next) {

    let results = yield aliyun.accessToken()

    this.body = results
}


exports.getSkinToken = function *(next) {

  let results = yield aliyun.accessToken('skin')

  this.body = results
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
 * @api {post} /userVerifyMobile  用户验证手机号码
 * @apiName 验证手机
 * @apiGroup user
 * @apiPermission anyBody
 *
 * @apiDescription 用户颜值测试 或者 皮肤测试以后，验证手机
 *
 * @apiParam {String} uuid 用户uuid.
 * @apiParam {String} clientId 用户clientId.
 * @apiParam {String} mobile 用户mobile.
 * @apiParam {Number/String} code 用户code.
 * @apiParam {String} deviceId AR使用的 deviceId.
 *
 * @apiExample Example usage:
 * http://test.legle.cc/userVerifyMobile
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
exports.userVerifyMobile = function *(next) {
  console.log(this.request.body)
  let type = this.request.body.type || ''
  let uuid = this.request.body.uuid || ''
  let skinUuid = this.request.body.skinUuid || ''
  let faceUuid = this.request.body.faceUuid || ''
  let clientId = this.request.body.clientId || ''
  let mobile = this.request.body.mobile || ''
  let loc = this.request.body.loc || ''
  let deviceId = this.request.body.deviceId
  let code = this.request.body.code
  code = code.toString()

  let shareFaceUrl
  let shareSkinUrl
  let shareStarUrl

  let face
  let skin
  let star

  let faceP
  let skinP
  let starP


  if(skinUuid || faceUuid) {
    if (!clientId || clientId === 'undefined' || skinUuid === 'undefined' || faceUuid === 'undefined') {
      return (this.body = {
        ret: 0,
        err: 'skinUuid or faceUuid or clientId not found'
      })
    }
  } else {
    if (!uuid || !clientId || clientId === 'undefined' || uuid === 'undefined') {
      return (this.body = {
        ret: 0,
        err: 'uuid or clientId not found'
      })
    }
  }
  if (!sms.checkCode({mobi:mobile,code:code})) {
    return (this.body = {
      ret: 0,
      err: Msg.USER.CODE_ERROR
    })
  }

  if(skinUuid || faceUuid) {
    if(skinUuid) {
      skin = yield Skin.findOne({uuid:skinUuid, clientId:clientId}).exec()
      skinP = yield Skin.findOne({mobile:mobile, clientId:clientId}).exec()
    }
    if(faceUuid) {
      face = yield Face.findOne({uuid:faceUuid, clientId:clientId}).exec()
      faceP = yield Face.findOne({mobile:mobile, clientId:clientId}).exec()
    }
  } else {
    if(type === 'skin') {
      skin = yield Skin.findOne({uuid:uuid, clientId:clientId}).exec()
      skinP = yield Skin.findOne({mobile:mobile, clientId:clientId}).exec()
    }
    if(type === 'face') {
      face = yield Face.findOne({uuid:uuid, clientId:clientId}).exec()
      faceP = yield Face.findOne({mobile:mobile, clientId:clientId}).exec()
    }
    if(type === 'star') {
      star = yield StarTest.findOne({uuid:uuid, clientId:clientId}).exec()
      starP = yield StarTest.findOne({mobile:mobile, clientId:clientId}).exec()
    }
  }


  if(faceP && face) {
    faceP.looksTotalScore = face.looksTotalScore
    faceP.face = face.Face
    faceP.image_path = face.image_path
    faceP.ima_width = face.ima_width
    faceP.ima_height = face.ima_height
    faceP.sKanXiang = face.sKanXiang
    faceP.kanXiangScore = face.kanXiangScore
    faceP.sOutLine = face.sOutLine
    faceP.outLineScore = face.outLineScore
    faceP.sEyebrow = face.sEyebrow
    faceP.eyebrowScore = face.eyebrowScore
    faceP.sEye = face.sEye
    faceP.eyeScore = face.eyeScore
    faceP.sNose = face.sNose
    faceP.noseScore = face.noseScore
    faceP.sMouth = face.sMouth
    faceP.mouthScore = face.mouthScore
    faceP.testValue = face.testValue
    faceP.originType = face.originType
    faceP.testTimes = faceP.testTimes + 1
  }

  if(skinP && skin) {
    skinP.water_flag = skin.water_flag
    skinP.inflammation_flag = skin.inflammation_flag
    skinP.image_path = skin.image_path
    skinP.wrinkles_flag = skin.wrinkles_flag
    skinP.color_flag = skin.color_flag
    skinP.oil_flag = skin.oil_flag
    skinP.prose_flag = skin.prose_flag
    skinP.originType = skinP.originType
    skinP.testTimes = skinP.testTimes + 1
  }

  if(starP && star) {
    starP.search = star.search
    starP.skinTest = star.skinTest
    starP.faceTest = star.faceTest
    starP.image_path = star.image_path
    starP.sex = star.sex
    starP.country = star.country
    starP.country_id = star.country_id
    starP.starInfo = star.starInfo
    starP.originType = star.originType
    starP.testTimes = starP.testTimes + 1
  }

  if(faceP) {
    shareFaceUrl = faceP.shareUrl
    if(face) {
      if(!faceP.loc) {
        if(loc) {
          faceP.loc = loc
        } else {
          let _loc = queryArea(mobile)
          if(_loc) {
            faceP.loc = _loc.province + _loc.city
          }
        }
      }
      yield faceP.save()
    }
  }
  else {
    if(face) {
      shareFaceUrl = face.shareUrl
      face.mobile = mobile
      if(!face.loc) {
        if(loc) {
          face.loc = loc
        } else {
          let _loc = queryArea(mobile)
          if(_loc) {
            face.loc = _loc.province + _loc.city
          }
        }
      }
      yield face.save()
    }
  }

  if(skinP) {
    shareSkinUrl = skinP.shareUrl
    if(skin) {
      if(!skinP.loc) {
        if(loc) {
          skinP.loc = loc
        } else {
          let _loc = queryArea(mobile)
          if(_loc) {
            skinP.loc = _loc.province + _loc.city
          }
        }
      }
      yield skinP.save()
    }
  }
  else {
    if(skin) {
      shareSkinUrl = skin.shareUrl
      skin.mobile = mobile
      if(!skin.loc) {
        if(loc) {
          skin.loc = loc
        } else {
          let _loc = queryArea(mobile)
          if(_loc) {
            skin.loc = _loc.province + _loc.city
          }
        }
      }
      yield skin.save()
    }
  }

  if(starP) {
    shareStarUrl = starP.shareUrl
    if(star) {
      if(!starP.loc) {
        if(loc) {
          starP.loc = loc
        } else {
          let _loc = queryArea(mobile)
          if(_loc) {
            starP.loc = _loc.province + _loc.city
          }
        }
      }
      yield starP.save()
    }
  }
  else {
    if(star) {
      shareStarUrl = star.shareUrl
      star.mobile = mobile
      if(!star.loc) {
        if(loc) {
          star.loc = loc
        } else {
          let _loc = queryArea(mobile)
          if(_loc) {
            star.loc = _loc.province + _loc.city
          }
        }
      }
      yield star.save()
    }
  }

  if(deviceId) {
    if(!this.session.client) {
      return (this.body = {
        code: 0,
        err: '请先登录'
      })
    }

    let client = yield Client.findOne({_id: this.session.client.clientId}).exec()
    if(mobile === client.mobile) {
      if(faceP || face) {
        client.shareFaceUrl = shareFaceUrl
        yield client.save()
      }

      if(skinP || skin) {
        client.shareSkinUrl = shareSkinUrl
        yield client.save()
      }

      if(starP || star) {
        client.shareStarUrl = shareStarUrl
        yield client.save()
      }
    }

    return (this.body = {
      code: 1,
      err: 'ok'
    })
  }

  this.body = {
    code: 1,
    shareFaceUrl: shareFaceUrl,
    shareSkinUrl: shareSkinUrl,
    shareStarUrl: shareStarUrl,
    err: 'ok'
  }

}


/**
 * @api {post} /pcVerifyMobile  pc端 明星面对面 验证手机
 * @apiName pcVerifyMobile
 * @apiGroup PcStarTest
 * @apiPermission anyBody
 *
 * @apiDescription pc端 明星面对面 验证手机
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

  let star = yield StarTest.findOne({uuid:uuid}).exec()

  star.mobile = mobile

  yield star.save()

  this.body = {
    code: 1,
    err: 'ok'
  }

}



/**
 * @api {post} /userSignupPhone   Client login arpt
 * @apiName userSignupPhone
 * @apiGroup User
 * @apiPermission User
 *
 * @apiDescription user Signup Phone.
 *
 * @apiParam {String} username The User-username.
 * @apiParam {String} mobile   The User-mobile.
 * @apiParam {String} password The User-password.
 * @apiParam {String} code The User-mobileCode.
 *
 * @apiExample Example usage:
 * http://test.legle.cc/clientLogin
 *
 * @apiSuccess {Number}   code   1.
 * @apiSuccess {String}   err 'ok'.
 *
 * @apiError code 0.
 * @apiError err   err message.
 *
 * @apiErrorExample Response (example):
 *     HTTP/1.1 200 Ok
 *     {
 *       "code": 0
 *       "error": "用户不存在"
 *     }
 */
exports.signupPhone = function *(next) {
  let username = this.request.body.username || ''
  let cientId = this.request.body.cientId || ''
  let mobile = this.request.body.mobile || ''
  let password = this.request.body.password
  let code = this.request.body.code
  code = String(code)

  let newId = mongoose.Types.ObjectId() // 测试用 id

  if (this.session.user) {
    return (this.body = {
      ret: 0,
      errors: {
        msg: Msg.USER.LOGINED
      }
    })
  }
  // if (!sms.checkCode({mobi:mobile,code:code})) {
  //   return (this.body = {
  //     ret: 0,
  //     errors: {
  //       msg: Msg.USER.CODE_ERROR
  //     }
  //   })
  // }

  let existUser = yield User.findOne({mobile: mobile}).exec()

  if(existUser) {
    return (this.body = {
      ret: 0,
      errors: {
        msg: Msg.USER.USER_PHONE_EXIST
      }
    })
  }

  let mobileUser = new User({
  	cientId: newId,
    mobile: xss(mobile),
    username: xss(username),
    password: xss(password)
  })

  yield mobileUser.save()

  this.session.mobileUser = {
    _id: mobileUser._id,
    username: mobileUser.username,
    cientId: mobileUser.cientId,
    mobile: mobileUser.mobile
  }

  this.body = {
    ret: 1,
    errors: {
      msg: 'ok'
    }
  }
}

/**
 * @api {post} /getTestList   get user  Test data List arpt
 * @apiName getTestDataList
 * @apiGroup User
 * @apiPermission User
 *
 * @apiDescription User getTestDataList.
 *
 * @apiParam {String} clientId The Client_id.
 * @apiParam {String} mobile The User-mobile.
 * @apiParam {String} pagination The User-pagination.
 * @apiParam {String} otherCondition The other Condition.
 *
 * @apiExample Example usage:
 * http://test.legle.cc/userGetTestDataList
 *
 * @apiSuccess {Number}   code   1.
 * @apiSuccess {String}   err 'ok'.
 *
 */
exports.getTestDataList = function *(next) {
    //show number 15
    let number = 10
    let pagination = Number(this.request.body.pagination)
    let mobile = this.request.body.mobile
    let otherCondition = this.request.body.otherCondition
    otherCondition = Number(otherCondition)
    let results
    let countFace
    let countSkin
    let countStarTest
    let count
    //0：all     1：face      2：skin  3:star  //4：到店
     if(!this.session.client) {
       return (this.body = {
         code: 0,
         err: '请先登录'
       })
     }
    let clientId =  this.session.client.clientId
    switch (otherCondition)
    {
        case 0:
         if(mobile) {
            results = yield [
             yield Face.find({clientId: clientId, mobile:mobile}).exec(),
             yield Skin.find({clientId: clientId, mobile:mobile}).exec(),
             yield StarTest.find({clientId: clientId, mobile:mobile}).exec()
           ]
           countFace = yield Face.count({clientId: clientId, mobile:mobile}).exec()
           countSkin = yield Skin.count({clientId: clientId, mobile:mobile}).exec()
           countStarTest = yield StarTest.count({clientId: clientId, mobile:mobile}).exec()
           count = countFace + countSkin + countStarTest
        }else{
             results = yield [
             yield Face.find({clientId: clientId,mobile: {$exists: true}}).skip(number*pagination).limit(10).sort({'meta.updatedAt': -1}).exec(),
             yield Skin.find({clientId: clientId,mobile: {$exists: true}}).skip(number*pagination).limit(10).sort({'meta.updatedAt': -1}).exec(),
             yield StarTest.find({clientId: clientId,mobile: {$exists: true}}).skip(number*pagination).limit(10).sort({'meta.updatedAt': -1}).exec()
           ]
           countFace = yield Face.count({clientId: clientId,mobile: {$exists: true}}).exec()
           countSkin = yield Skin.count({clientId: clientId,mobile: {$exists: true}}).exec()
           countStarTest = yield StarTest.count({clientId: clientId,mobile: {$exists: true}}).exec()
           count = countFace + countSkin + countStarTest
        }
        break
      case 1:
        if(mobile) {
           results = yield Face.find({clientId: clientId,mobile:mobile}).exec()
           count = yield Face.count({clientId: clientId,mobile:mobile}).exec()
            
        }else{
           results = yield Face.find({clientId: clientId,mobile: {$exists: true}}).skip(number*pagination).limit(10).sort({'meta.updatedAt': -1}).exec()
           count = yield Face.count({clientId: clientId,mobile: {$exists: true}}).exec()
        }
        break
      case 2:
        if(mobile) {
           results = yield Skin.find({clientId: clientId,mobile:mobile}).exec()
           count = yield Skin.count({clientId: clientId,mobile:mobile}).exec()
            
        }else{
           results = yield Skin.find({clientId: clientId,mobile: {$exists: true}}).skip(number*pagination).limit(10).sort({'meta.updatedAt': -1}).exec()
           count = yield Skin.count({clientId: clientId,mobile: {$exists: true}}).exec()
           
        }
        break
       case 3:
            if(mobile) {
                results = yield StarTest.find({clientId: clientId,mobile:mobile}).exec()
                count = yield StarTest.count({clientId: clientId,mobile:mobile}).exec()
            }else{
                results = yield StarTest.find({clientId: clientId,mobile: {$exists: true}}).skip(number*pagination).limit(10).sort({'meta.updatedAt': -1}).exec()
                count = yield StarTest.count({clientId: clientId,mobile: {$exists: true}}).exec()
                
            }
            break
      case 4:
          if(mobile) {
              results = yield [
                  yield Face.find({clientId: clientId,mobile:mobile,originType:'AR'}).exec(),
                  yield Skin.find({clientId: clientId,mobile:mobile,originType:'AR'}).exec(),
                  yield StarTest.find({clientId: clientId, mobile:mobile,originType:'AR'}).exec()
              ]
              countFace = yield Face.count({clientId: clientId,mobile:mobile,originType:'AR'}).exec()
             countSkin = yield Skin.count({clientId: clientId,mobile:mobile,originType:'AR'}).exec()
             countStarTest = yield StarTest.count({clientId: clientId,mobile:mobile,originType:'AR'}).exec()
             count = countFace + countSkin + countStarTest
          }else{
              results = yield [
                  yield Face.find({clientId: clientId,originType:'AR',mobile: {$exists: true}}).skip(number*pagination).limit(10).sort({'meta.updatedAt': -1}).exec(),
                  yield Skin.find({clientId: clientId,originType:'AR',mobile: {$exists: true}}).skip(number*pagination).limit(10).sort({'meta.updatedAt': -1}).exec(),
                  yield StarTest.find({clientId: clientId,originType:'AR',mobile: {$exists: true}}).skip(number*pagination).limit(10).sort({'meta.updatedAt': -1}).exec()
              ]
              countFace = yield Face.count({clientId: clientId,originType:'AR',mobile: {$exists: true}}).exec()
             countSkin = yield Skin.count({clientId: clientId,originType:'AR',mobile: {$exists: true}}).exec()
             countStarTest = yield StarTest.count({clientId: clientId,originType:'AR',mobile: {$exists: true}}).exec()
             count = countFace + countSkin + countStarTest
          }
          break
        }
    this.body = {
      code: 1,
      results:results,
      count:count
    }
}


/**
 * @api {post} /userGetInfo  User userGetInfo arpt
 * @apiName userGetInfo
 * @apiGroup User
 * @apiPermission User
 *
 * @apiDescription userGetInfo.
 *
 * @apiParam {String} userId The user Id.
 * @apiParam {Number} otherCondition 1 is face // 2 is skin.
 *
 * @apiExample Example usage:
 * http://test.legle.cc/userGetInfo
 *
 * @apiSuccess {Number}   code   1.
 * @apiSuccess {String}   err 'ok'.
 *
 */
exports.getUserInfo = function *(next) {
  let uuid = this.request.query.uuid || ''
  let otherCondition = this.request.query.otherCondition
  otherCondition = Number(otherCondition)
  let result


  if(!this.session.client) {
    return (this.body = {
        code:1,
        err: 'please login first'
    })
  }

  let clientId = this.session.client.clientId

  if(!uuid) {
        return (this.body = {
            code: 0,
            err: 'user not found'
        })
  }
  // 1：face  2：skin 3 star
  switch (otherCondition)
    {
        case 1:
            result = yield Face.findOne({uuid:uuid, clientId: clientId}).exec()
          break;
        case 2:
            result = yield Skin.findOne({uuid:uuid, clientId: clientId}).exec()
          break;
        case 3:
            result = yield StarTest.findOne({uuid:uuid, clientId: clientId}).exec()
          break;
    }

  this.body = {
    code: 1,
    err: 'ok',
    result:result
  }
}

// H5 活动 登录
exports.H5Login = function *(next) {
  let username = this.request.body.username
  let password = this.request.body.password

  // if (this.session.client) {
  //   return (this.body = {
  //     code: 0,
  //     err: Msg.USER.LOGINED
  //   })
  // }
  // const existClient = yield Client.findOne({username:username}).exec()
  // if (!existClient) {
  //   return (this.body = {
  //     code: 0,
  //     err: Msg.USER.USER_NOT_EXIST
  //   })
  // }
  // let match = yield existClient.comparePassword(password, existClient.password)
  // if (!match) {
  //   return (this.body = {
  //     code: 0,
  //     err: Msg.USER.PWD_ERROR
  //   })
  // }
  if(username !== 'arpt' || password !== '123321') {
    return (this.body = {
      code: 0,
      err: '账号或者密码有误!'
    })
  }
  this.session.h5client = {
    username:username
  }
  this.body = {
    code: 1,
    username: username,
    err: 'ok'
  }
}



