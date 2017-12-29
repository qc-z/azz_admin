'use strict'

const mongoose = require('mongoose')
const Client = mongoose.model('Client')
// const _ = require('lodash')
const xss = require('xss')
const sms = require('../service/sms')
const Msg = require('../libs/msg')
const facepp = require('../service/facepp')
const recommendJson = require('../../config/json/recommend.json')
const recommendsJson = require('../../config/json/recommends.json')
const Face = mongoose.model('Face')
const Advertisement = mongoose.model('Advertisement')
const Newpic = mongoose.model('Newpic')
const Skin = mongoose.model('Skin')
const StarTest = mongoose.model('Startest')
const config = require('../../config/config')
const BeautyProject = mongoose.model('BeautyProject')
const xlsx = require('node-xlsx')
const moment = require('moment')



exports.exportExel = function *(next) {

  if(!this.session.client) {
    return (this.body = {
      ret: 0,
      err: '请先登录'
    })
  }

  let id = this.session.client.clientId

  let faces = yield Face.find({clientId: id, mobile: {$exists: true}}).exec()
  let skins = yield Skin.find({clientId: id, mobile: {$exists: true}}).exec()
  let startests = yield StarTest.find({clientId: id, mobile: {$exists: true}}).exec()


  let faceArrs = [['客户电话','访问日期','客户来源','测试次数']]
  for(let i in faces) {
    let faceArr = []
    faceArr.push(faces[i].mobile)
    faceArr.push(moment(faces[i]['meta.updatedAt']).format('YYYY-MM-DD HH:mm'))

    let ot = faces[i].originType == 'AR' ? '到店测试' : '在线测试'

    faceArr.push(ot)
    faceArr.push(faces[i].testTimes)
    faceArrs.push(faceArr)
  }

  let skinArrs = [['客户电话','访问日期','客户来源','测试次数']]
  for(let i in skins) {
    let skinArr = []
    skinArr.push(skins[i].mobile)
    skinArr.push(moment(skins[i]['meta.updatedAt']).format('YYYY-MM-DD HH:mm'))

    let ot = skins[i].originType == 'AR' ? '到店测试' : '在线测试'

    skinArr.push(ot)
    skinArr.push(skins[i].testTimes)
    skinArrs.push(skinArr)
  }

  let startestArrs = [['客户电话','访问日期','客户来源','测试次数']]
  for(let i in startests) {
    let startestArr = []
    startestArr.push(startests[i].mobile)
    startestArr.push(moment(startests[i]['meta.updatedAt']).format('YYYY-MM-DD HH:mm'))

    let ot = startests[i].originType == 'AR' ? '到店测试' : '在线测试'

    startestArr.push(ot)
    startestArr.push(startests[i].testTimes)
    startestArrs.push(startestArr)
  }

  var buffer = xlsx.build([{name: '颜值测试', data: faceArrs}, {name: '皮肤测试', data: skinArrs}, {name: '明星面对面', data: startestArrs}]) // returns a buffer
  var excelname = 'user-data.xlsx'

  this.set('Content-disposition', 'attachment; filename=' + excelname)
  this.set('Content-type', 'application/vnd.openxmlformats')

  this.body = buffer

}

/**
 * @api {post} /clientSignupPhone  Client signup by phone
 * @apiName SetClient
 * @apiGroup Client
 * @apiPermission anyBody
 *
 * @apiDescription signup for client.
 *
 * @apiParam {String} username The Client-name.
 * @apiParam {String} mobile The Client-mobile.
 * @apiParam {String} password The Client-password.
 * @apiParam {String} conformPassword The Client-conformPassword.
 * @apiParam {Number} code The Client-phone verify code.
 *
 * @apiExample Example usage:
 * http://test.legle.cc/userSignupPhone
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
 *       'code': 0
 *       "error": "用户密码不匹配"
 *     }
 */
exports.signupPhone = function *(next) {

  let username = this.request.body.username
  let mobile = this.request.body.mobile
  let password = this.request.body.password
  let conformPassword = this.request.body.conformPassword
  let code = this.request.body.code.toString()

  let existClient = yield Client.findOne({username: username}).exec()
  let mobileClient = yield Client.findOne({mobile: mobile}).exec()
  if (existClient) {
    this.body = {
      code: 0,
      err: Msg.USER.USERNAME_EXIST
    }
  }
  else if (mobileClient) {
    this.body = {
      code: 0,
      err: Msg.USER.USER_PHONE_EXIST
    }
  }
  else if (password !== conformPassword) {
  	this.body = {
      code: 0,
      err: Msg.USER.TWO_PWD_UNMATCH
    }
  }
  else {
    if (!sms.checkCode({mobi:mobile,code:code})) {
      this.body = {
        code: 0,
      	err: Msg.USER.CODE_ERROR
      }
    }
    else {
    	let date = new Date()
    	let oneYearDate = date.setFullYear(date.getFullYear() + 1)

      const updateData = {
        mobile: xss(mobile),
        username: xss(username),
        password: xss(password),
        deviceId: [],
        deviceLimit: 1,
        skinRole: {
          role: true,
          from: Date.now(),
          to: oneYearDate
        },
        starRole: {
          role: true,
          from: Date.now(),
          to: oneYearDate
        },
        faceRole: {
          role: true,
          from: Date.now(),
          to: oneYearDate
        }
      }

      const savedClient = new Client(updateData)
      yield savedClient.save()

      this.session.client = {
        clientId: savedClient._id,
        username: savedClient.username,
        mobile: savedClient.mobile
      }

      //初始化企业用户的项目管理
      for(let i=0;i<recommendsJson.length;i++)
        {
            for(let j=0;j<recommendsJson[i].length;j++)
            {
                const newData = {
                projectType: recommendsJson[i][j].projectType,
                projectName: recommendsJson[i][j].name,
                projectPrice: recommendsJson[i][j].price,
                typeName:recommendsJson[i][j].typeName,
                clientId:this.session.client.clientId
                }
                const savedProject = new BeautyProject(newData)
                yield savedProject.save()
            }
        }
      this.body = {
        code: 1,
        clientId: savedClient._id,
      	err: 'ok'
      }
    }
  }
}


/**
 * @api {post} /editInfo  Client user edit their company information
 * @apiName EditClientInfo
 * @apiGroup Client
 * @apiPermission Client
 *
 * @apiDescription Client user edit their company information.
 *
 * @apiParam {String} shopName The Client-shop name.
 * @apiParam {String} shopAddr The Client-shopAddr.
 * @apiParam {String} qrcode The Client-qrcode.
 * @apiParam {String} logo The Client-logo.
 * @apiParam {String} customerInfo The Client-introduction.
 * @apiParam {String} customerAd The Client-Ad.
 * @apiParam {String} autoReply The Client-the auto reply for SocketIo.
 *
 * @apiExample Example usage:
 * http://test.legle.cc/editInfo
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
 *       "error": "用户没有登录"
 *     }
 */
exports.editInfo = function *(next) {
  const body = this.request.body
  // if(!this.session.client) {
  //   return(this.body = {
  //     code: 0,
  //     err: '请先登录'
  //   })
  // }
  let mobile =  body.mobile
  if(!body) {
    return(this.body = {
      code: 0,
      err: Msg.COMMON.DATA_EMPTY
    })
  }

  if(!mobile) {
    return(this.body = {
      code: 0,
      err: Msg.USER.PHONE_IS_REQUIRED
    })
  }

  const update = {
    $set: {
      phoneNumber: xss(body.phoneNumber),
      shopName: xss(body.shopName),
      shopAddr: xss(body.shopAddr),
      avartor: xss(body.avartor),
      customerInfo: xss(body.customerInfo),
      customerAd: xss(body.customerAd),
      autoReply: xss(body.autoReply)
    }
  }




  yield Client.update({mobile: mobile}, update).exec()

  this.body = {
    code: 1,
    err: 'ok'
  }

}

exports.getRecommend = function *(next) {
  this.body = recommendJson || {}
}

exports.getRecommendArr = function *(next) {
  this.body = recommendsJson || []
}

/**
 * @api {post} /clientLogin  Client login arpt
 * @apiName ClientLogin
 * @apiGroup Client
 * @apiPermission Client
 *
 * @apiDescription Client login.
 *
 * @apiParam {String} username The Client-username.
 * @apiParam {String} password The Client-password.
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
exports.Login = function *(next) {
    let username = this.request.body.username
    let password = this.request.body.password

    if (this.session.client) {
    return (this.body = {
      code: 0,
      err: Msg.USER.LOGINED
    })
   }
  const existClient = yield Client.findOne({username:username}).exec()
  if (!existClient) {
    return (this.body = {
      code: 0,
      err: Msg.USER.USER_NOT_EXIST
    })
  }
  let match = yield existClient.comparePassword(password, existClient.password)
  if (!match) {
    return (this.body = {
      code: 0,
      err: Msg.USER.PWD_ERROR
    })
  }
  this.session.client = {
    clientId:existClient._id,
    username:existClient.username,
    mobile:existClient.mobile
  }
  this.body = {
    code: 1,
    clientId:existClient.id,
    err: 'ok'
  }
}

/**
 * @api {post} /clientUpdatePassword  Client update password arpt
 * @apiName updatePassword
 * @apiGroup Client
 * @apiPermission Client
 *
 * @apiDescription Client update password.
 *
 * @apiParam {String} oldPassword The Client-oldPassword.
 * @apiParam {String} newPassword The Client-newPassword.
 * @apiParam {String} conformPassword The Client-conformPassword.
 *
 * @apiExample Example usage:
 * http://test.legle.cc/clientUpdatePassword
 *
 * @apiSuccess {Number}   code  1.
 * @apiSuccess {String}   err 'ok'.
 *
 * @apiError code 0.
 * @apiError err   err message.
 *
 * @apiErrorExample Response (example):
 *     HTTP/1.1 200 Ok
 *     {
 *       "code": 0
 *       "error": "用户密码错误"
 *     }
 */
exports.updatePassword = function *(next) {

    let oldPassword = this.request.body.oldPassword
    let newPassword = this.request.body.newPassword
    let conformPassword = this.request.body.conformPassword

    if(!this.session.client) {
      return (this.body = {
          code:1,
          err: 'please login first'
      })
    }
    let clientId = this.session.client.clientId
    if (newPassword !== conformPassword) {
        return (this.body = {
            code: 0,
            err: Msg.USER.TWO_PWD_UNMATCH
        })
    }
    const existClient = yield Client.findOne({_id:clientId}).exec()
    let match = yield existClient.comparePassword(oldPassword, existClient.password)
    if (!match) {
        return (this.body = {
            code: 0,
            err: Msg.USER.PWD_ERROR
        })
    }
    existClient.password=newPassword
    yield existClient.save()
    this.body = {
        code:1,
        err: 'ok'
    }
}


/**
 * @api {post} /clientSignOut  Client login out
 * @apiName Client signout
 * @apiGroup Client
 * @apiPermission Client
 *
 * @apiDescription Client logOut.
 *
 *
 * @apiExample Example usage:
 * http://test.legle.cc/clientSignOut
 *
 * @apiSuccess {Number}   code   1.
 * @apiSuccess {String}   err 'ok'.
 *
 * @apiError code 0.
 * @apiError err   err message.
 *
 */
exports.signOut = function *(next) {
  this.logout()
  delete this.session.client
  this.body = {
    code:1,
    err: 'ok'
  }
}


/**
 * @api {post} /clientGetBackPassword  Client Get Back password arpt
 * @apiName getBackPassword
 * @apiGroup Client
 * @apiPermission Client
 *
 * @apiDescription Client get back password.
 *
 * @apiParam {String} mobile The Client-mobile.
 * @apiParam {String} newPassword The Client-newPassword.
 * @apiParam {String} conformPassword The Client-conformPassword.
 * @apiParam {String} code The Client-mobileCode.
 *
 *
 * @apiExample Example usage:
 * http://test.legle.cc/clientUpdatePassword
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
 *       "error": "手机验证码错误"
 *     }
 */
exports.getBackPassword = function *(next) {

    let mobile = this.request.body.mobile
    let newPassword = this.request.body.newPassword
    let conformPassword = this.request.body.conformPassword
    let code = this.request.body.code.toString()



    if (newPassword !== conformPassword) {
        return (this.body = {
            code: 0,
            err: Msg.USER.TWO_PWD_UNMATCH
        })
    }

    if (sms.checkCode({mobi:mobile,code:code})) {
        return(this.body = {
            code: 0,
            err: Msg.USER.CODE_ERROR
        })
    }

    const existClient = yield Client.findOne({mobile:mobile}).exec()
    existClient.password = newPassword
    yield existClient.save()

    this.body = {
        code:1,
        err: 'ok'
    }
}

exports.getInfo = function *(next) {
  // let client = this.session.client
  // if(!client) {
  //   return (this.body = {
  //     code: 0,
  //     err: '请先登录'
  //   })
  // }
  let clientId = this.query.clientId

  let _client = yield Client.findOne({_id: clientId})

  this.body = {
    code: 1,
    client: _client
  }

}

exports.creatChat = function *(next) {
  let clients = yield Client.find().exec()

  for (var i = 0; i < clients.length; ++i) {
    yield facepp.creatChat(clients[i]._id)
  }

  this.body = {
    code: 1,
    err: 'ok'
  }
}

exports.uploadImg = function *(next) {

  let body = this.request.body.fields.data

  if(!body) {
    return (this.body = {code:0,err:'传入参数有误'})
  }

  body = JSON.parse(body)

  if(!this.request.body.files || !this.request.body.files.file || !this.request.body.files.file.path) {
    return (this.body = {code:0,err:'没有收到文件'})
  }


  let _client = yield Client.findOne({_id: body.clientId}).exec()

  if(!_client) {
    return (this.body = {
      code: 0,
      err: '没有这个用户'
    })
  }

  if (this.request.body.files && this.request.body.files.file && this.request.body.files.file.path) {
    this.request.body.files.file.path = this.request.body.files.file.path.split('public/')[1]
  }
  if(body.type === 'qrcode') {
    _client.qrcode = this.request.body.files.file.path
  }

  if(body.type === 'logo') {
    _client.logo = this.request.body.files.file.path
  }

  yield _client.save()

  this.body = {
    code: 1,
    err: 'ok',
  }
}


/**
 * @api {get} /clientDeleteTestData  Client Delete User Test Data arpt
 * @apiName DeleteTestData
 * @apiGroup Client
 * @apiPermission Client
 *
 * @apiDescription  Client Delete User Test Data.
 *
 * @apiParam {String} userId The user-userId.
 * @apiParam {String} otherCondition The delete-otherCondition.
 *
 * @apiExample Example usage:
 * http://test.legle.cc/clientUpdatePassword
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
 *       "error": "user not found"
 *     }
 */
exports.deleteTestData = function *(next) {
    let uuid = this.request.query.uuid
    let otherCondition = this.request.query.otherCondition
    otherCondition = Number(otherCondition)
    if(!uuid) {
        return (this.body = {
            code: 0,
            err: Msg.USER.NOT_FOUND_USER
        })
    }
    // 1：face  2：skin
    switch (otherCondition)
    {
        case 1:
            yield Face.remove({uuid:uuid}).exec()
            break;
        case 2:
            yield Skin.remove({uuid:uuid}).exec()
            break;
    }
    this.body = {
        code: 1,
        err: Msg.USER.DELETE_SUCCESS
    }
}


/**
 * @api {get} /clientGetCountData  Client Delete User Test Data arpt
 * @apiName DeleteTestData
 * @apiGroup Client
 * @apiPermission Client
 *
 * @apiDescription  Client Delete User Test Data.
 *
 * @apiParam {String} queryDate The date.
 * @apiParam {String} clienId The clienId.
 *
 * @apiExample Example usage:
 * http://test.legle.cc/clientGetCountData
 *
 * @apiSuccess {Number}   code   1.
 * @apiSuccess {String}   err 'ok'.
 *
 */
exports.getCountData = function *(next) {

    var oneDay = 86400000;
    let queryDate = this.request.query.queryDate
    let clientId = this.request.query.clientId

    if(this.session.client) { 
      clientId =  this.session.client.clientId
    }
    var toDay
    var obj
    if(!queryDate) {
        let toDay = new Date(new Date().setHours(0, 0, 0, 0))
        toDay = toDay.getTime()
        var a = toDay + oneDay
        var b = toDay - oneDay
        var c = toDay - oneDay * 2
        var d = toDay - oneDay * 3
        var e = toDay - oneDay * 4
        var f = toDay - oneDay * 5
        var g = toDay - oneDay * 6
        let faceCount1 = yield Face.count({mobile: {$exists: true}, clientId: clientId ,'meta.updatedAt':{$gte: toDay, $lt: a}}).exec()  //18~19
        let faceCount2 = yield Face.count({mobile: {$exists: true}, clientId: clientId ,'meta.updatedAt':{$gte: b    , $lt: toDay}}).exec() //17—~18
        let faceCount3 = yield Face.count({mobile: {$exists: true}, clientId: clientId ,'meta.updatedAt':{$gte: c    , $lt: b}}).exec() //16~17
        let faceCount4 = yield Face.count({mobile: {$exists: true}, clientId: clientId ,'meta.updatedAt':{$gte: d    , $lt: c}}).exec() //15~16
        let faceCount5 = yield Face.count({mobile: {$exists: true}, clientId: clientId ,'meta.updatedAt':{$gte: e    , $lt: d}}).exec() //14~15
        let faceCount6 = yield Face.count({mobile: {$exists: true}, clientId: clientId ,'meta.updatedAt':{$gte: f    , $lt: e}}).exec() //13~14
        let faceCount7 = yield Face.count({mobile: {$exists: true}, clientId: clientId ,'meta.updatedAt':{$gte: g    , $lt: f}}).exec() //12~13

        let skinCount1 = yield Skin.count({mobile: {$exists: true}, clientId: clientId ,'meta.updatedAt':{$gte: toDay, $lt: a}}).exec()  //18~19
        let skinCount2 = yield Skin.count({mobile: {$exists: true}, clientId: clientId ,'meta.updatedAt':{$gte: b    , $lt: toDay}}).exec() //17—~18
        let skinCount3 = yield Skin.count({mobile: {$exists: true}, clientId: clientId ,'meta.updatedAt':{$gte: c    , $lt: b}}).exec() //16~17
        let skinCount4 = yield Skin.count({mobile: {$exists: true}, clientId: clientId ,'meta.updatedAt':{$gte: d    , $lt: c}}).exec() //15~16
        let skinCount5 = yield Skin.count({mobile: {$exists: true}, clientId: clientId ,'meta.updatedAt':{$gte: e    , $lt: d}}).exec() //14~15
        let skinCount6 = yield Skin.count({mobile: {$exists: true}, clientId: clientId ,'meta.updatedAt':{$gte: f    , $lt: e}}).exec() //13~14
        let skinCount7 = yield Skin.count({mobile: {$exists: true}, clientId: clientId ,'meta.updatedAt':{$gte: g    , $lt: f}}).exec() //12~13

        let starCount1 = yield StarTest.count({mobile: {$exists: true}, clientId: clientId ,'meta.updatedAt':{$gte: toDay, $lt: a}}).exec()  //18~19
        let starCount2 = yield StarTest.count({mobile: {$exists: true}, clientId: clientId ,'meta.updatedAt':{$gte: b    , $lt: toDay}}).exec() //17—~18
        let starCount3 = yield StarTest.count({mobile: {$exists: true}, clientId: clientId ,'meta.updatedAt':{$gte: c    , $lt: b}}).exec() //16~17
        let starCount4 = yield StarTest.count({mobile: {$exists: true}, clientId: clientId ,'meta.updatedAt':{$gte: d    , $lt: c}}).exec() //15~16
        let starCount5 = yield StarTest.count({mobile: {$exists: true}, clientId: clientId ,'meta.updatedAt':{$gte: e    , $lt: d}}).exec() //14~15
        let starCount6 = yield StarTest.count({mobile: {$exists: true}, clientId: clientId ,'meta.updatedAt':{$gte: f    , $lt: e}}).exec() //13~14
        let starCount7 = yield StarTest.count({mobile: {$exists: true}, clientId: clientId ,'meta.updatedAt':{$gte: g    , $lt: f}}).exec() //12~13


        let toTheStore1 =
             Number(yield Face.count({mobile: {$exists: true}, clientId: clientId,originType:"AR",'meta.updatedAt':{$gte: toDay, $lt: a}}).exec()) //18~19
            +Number(yield Skin.count({mobile: {$exists: true}, clientId: clientId,originType:"AR",'meta.updatedAt':{$gte: toDay, $lt: a}}).exec())//18~19
            +Number(yield StarTest.count({mobile: {$exists: true}, clientId: clientId,originType:"AR",'meta.updatedAt':{$gte: toDay, $lt: a}}).exec()) //18~19

        let toTheStore2 =
             Number(yield Face.count({mobile: {$exists: true}, clientId: clientId,originType:"AR",'meta.updatedAt':{$gte: b, $lt: toDay}}).exec()) //18~19
            +Number(yield Skin.count({mobile: {$exists: true}, clientId: clientId,originType:"AR",'meta.updatedAt':{$gte: b, $lt: toDay}}).exec()) //18~19
            +Number(yield StarTest.count({mobile: {$exists: true}, clientId: clientId,originType:"AR",'meta.updatedAt':{$gte: b, $lt: toDay}}).exec()) //18~19

        let toTheStore3 =
             Number(yield Face.count({mobile: {$exists: true}, clientId: clientId,originType:"AR",'meta.updatedAt':{$gte: c, $lt: b}}).exec()) //18~19
            +Number(yield Skin.count({mobile: {$exists: true}, clientId: clientId,originType:"AR",'meta.updatedAt':{$gte: c, $lt: b}}).exec())  //18~19
            +Number(yield StarTest.count({mobile: {$exists: true}, clientId: clientId,originType:"AR",'meta.updatedAt':{$gte: c, $lt: b}}).exec())  //18~19

        let toTheStore4 =
             Number(yield Face.count({mobile: {$exists: true}, clientId: clientId,originType:"AR",'meta.updatedAt':{$gte: d, $lt: c}}).exec())  //18~19
            +Number(yield Skin.count({mobile: {$exists: true}, clientId: clientId,originType:"AR",'meta.updatedAt':{$gte: d, $lt: c}}).exec()) //18~19
            +Number(yield StarTest.count({mobile: {$exists: true}, clientId: clientId,originType:"AR",'meta.updatedAt':{$gte: d, $lt: c}}).exec())  //18~19

        let toTheStore5 =
             Number(yield Face.count({mobile: {$exists: true}, clientId: clientId,originType:"AR",'meta.updatedAt':{$gte: e, $lt: d}}).exec()) //18~19
            +Number(yield Skin.count({mobile: {$exists: true}, clientId: clientId,originType:"AR",'meta.updatedAt':{$gte: e, $lt: d}}).exec())  //18~19
            +Number(yield StarTest.count({mobile: {$exists: true}, clientId: clientId,originType:"AR",'meta.updatedAt':{$gte: e, $lt: d}}).exec()) //18~19

        let toTheStore6 =
             Number(yield Face.count({mobile: {$exists: true}, clientId: clientId,originType:"AR",'meta.updatedAt':{$gte: f, $lt: e}}).exec())  //18~19
            +Number(yield Skin.count({mobile: {$exists: true}, clientId: clientId,originType:"AR",'meta.updatedAt':{$gte: f, $lt: e}}).exec())  //18~19
            +Number(yield StarTest.count({mobile: {$exists: true}, clientId: clientId,originType:"AR",'meta.updatedAt':{$gte: f, $lt: e}}).exec())  //18~19

        let toTheStore7 =
             Number(yield Face.count({mobile: {$exists: true}, clientId: clientId,originType:"AR",'meta.updatedAt':{$gte: g, $lt: f}}).exec()) //18~19
            +Number(yield Skin.count({mobile: {$exists: true}, clientId: clientId,originType:"AR",'meta.updatedAt':{$gte: g, $lt: f}}).exec()) //18~19
            +Number(yield StarTest.count({mobile: {$exists: true}, clientId: clientId,originType:"AR",'meta.updatedAt':{$gte: g, $lt: f}}).exec())  //18~19



        obj = {
            obj1: [{ time: new Date(toDay).format('yyyy/MM/dd'), facecount: faceCount1,skinCount:skinCount1,starCount:starCount1,toTheStore: toTheStore1,count:Number(faceCount1+skinCount1+starCount1)}],
            obj2: [{ time: new Date(b).format('yyyy/MM/dd'),     facecount: faceCount2,skinCount:skinCount2,starCount:starCount2,toTheStore: toTheStore2,count:Number(faceCount2+skinCount2+starCount2)}],
            obj3: [{ time: new Date(c).format('yyyy/MM/dd'),     facecount: faceCount3,skinCount:skinCount3,starCount:starCount3,toTheStore: toTheStore3,count:Number(faceCount3+skinCount3+starCount3)}],
            obj4: [{ time: new Date(d).format('yyyy/MM/dd'),     facecount: faceCount4,skinCount:skinCount4,starCount:starCount4,toTheStore: toTheStore4,count:Number(faceCount4+skinCount4+starCount4)}],
            obj5: [{ time: new Date(e).format('yyyy/MM/dd'),     facecount: faceCount5,skinCount:skinCount5,starCount:starCount5,toTheStore: toTheStore5,count:Number(faceCount5+skinCount5+starCount5)}],
            obj6: [{ time: new Date(f).format('yyyy/MM/dd'),     facecount: faceCount6,skinCount:skinCount6,starCount:starCount6,toTheStore: toTheStore6,count:Number(faceCount6+skinCount6+starCount6)}],
            obj7: [{ time: new Date(g).format('yyyy/MM/dd'),     facecount: faceCount7,skinCount:skinCount7,starCount:starCount7,toTheStore: toTheStore7,count:Number(faceCount7+skinCount7+starCount7)}],
        }
    }else{
        toDay = new Date(queryDate)
        var a = new Date(toDay.getTime() + oneDay)//19
        let faceCount1 = yield Face.count({mobile: {$exists: true}, clientId: clientId ,'meta.updatedAt':{$gte: toDay.getTime(), $lt: a.getTime()}}).exec()  //18~19
        let skinCount1 = yield Skin.count({mobile: {$exists: true}, clientId: clientId ,'meta.updatedAt':{$gte: toDay.getTime(), $lt: a.getTime()}}).exec()  //18~19
        let starCount1 = yield StarTest.count({mobile: {$exists: true}, clientId: clientId ,'meta.updatedAt':{$gte: toDay.getTime(), $lt: a.getTime()}}).exec()
        let toTheStore1 =
            Number(yield Face.count({mobile: {$exists: true}, clientId: clientId,originType:"AR",'meta.updatedAt':{$gte: toDay.getTime(), $lt: a.getTime()}}).exec())
            +Number(yield Skin.count({mobile: {$exists: true}, clientId: clientId,originType:"AR",'meta.updatedAt':{$gte: toDay.getTime(), $lt: a.getTime()}}).exec())
            +Number(yield StarTest.count({mobile: {$exists: true}, clientId: clientId,originType:"AR",'meta.updatedAt':{$gte: toDay.getTime(), $lt: a.getTime()}}).exec())
        obj = {
            obj1: [{ time: toDay.format('yyyy/MM/dd'), facecount: faceCount1,skinCount:skinCount1,starCount:starCount1,toTheStore: toTheStore1,count:Number(faceCount1+skinCount1+starCount1)}]
        }
    }

    this.body = {
        code: 1,
        err: "OK",
        obj:obj
    }
}






Date.prototype.format = function(format) {
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    }
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
}


/**
 * @api {get} /addAdvertisement  Client add Advertisement
 * @apiName addAdvertisement
 * @apiGroup Client
 * @apiPermission Client
 *
 * @apiDescription  Client add Advertisement.
 *
 * @apiParam {String} userId The user-userId.
 * @apiParam {String} otherCondition The delete-otherCondition.
 *
 * @apiExample Example usage:
 * http://test.legle.cc/clientUpdatePassword
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
 *       "error": "user not found"
 *     }
 */
exports.addAdvertisement = function *(next) {
    if(!this.session.client){
        return (
            this.body = {
                code: 0,
                err: "用户没有登录，请登录"
            }
        )
    }
    let clientId =  this.session.client.clientId
    let imgUrl = this.request.body.imgUrl
    let adUrl = this.request.body.adUrl
    let toolType = this.request.body.toolType
    let editionType = this.request.body.editionType
    let adName = this.request.body.adName
    //1: '颜值测试',2: '皮肤测试',3: '明星面对面'
    toolType = config.toolTypes[Number(toolType)]
    let toolCount = yield Advertisement.count({clientId: clientId ,toolType:toolType,editionType:editionType}).exec()
     if(Number(toolCount) >= 3) {
        return (
            this.body = {
                code: 0,
                err: "添加失败"+toolType + "广告数量最多3条。"
            }
        )
     }
    if(!imgUrl) {
      return (this.body = {code:0,err:'没有收到文件'})
    } else {
      imgUrl = config.aliyun.ossHost + '/' + imgUrl
    }

    const AdData = {
        imgUrl: imgUrl,
        adName:adName,
        adUrl: adUrl,
        editionType: editionType,
        toolType: toolType,
        clientId: clientId
    }
    const advertisement = new Advertisement(AdData)
    yield advertisement.save()
    this.body = {
        code: 1,
        err: "添加广告成功"
    }
}

var editRoll = function(roll) {

  if(roll && roll.length > 0) {
    for (var i = roll.length - 1; i >= 0; i--) {
      roll[i] = config.aliyun.ossHost + '/' + roll[i]
    }
  }

  return roll

}

/**
 * @api {get} /addArad  Client add Arad
 * @apiName addAdvertisement
 * @apiGroup Client
 * @apiPermission Client
 *
 * @apiDescription  Client add Advertisement for Ar.
 *
 * @apiParam {String} userId The user-userId.
 * @apiParam {String} otherCondition The delete-otherCondition.
 *
 * @apiExample Example usage:
 * http://test.legle.cc/clientUpdatePassword
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
 *       "error": "user not found"
 *     }
 */
exports.addArad = function *(next) {
    if(!this.session.client) {
        return (
            this.body = {
                code: 0,
                err: '用户没有登录，请登录'
            }
        )
    }
    let clientId =  this.session.client.clientId || ''

    let roll = this.request.body.roll
    let info = this.request.body.info
    let video = this.request.body.video
    let skin = this.request.body.skin
    let face = this.request.body.face
    let star = this.request.body.star
    let live = this.request.body.live
    let tattoo = this.request.body.tattoo
    let hengping = this.request.body.hengping
    let weizheng = this.request.body.weizheng

    console.log('body======', this.request.body)

    if(info) {
      info = config.aliyun.ossHost + '/' + info
    }
    if(skin) {
      skin = config.aliyun.ossHost + '/' + skin
    }
    if(star) {
      star = config.aliyun.ossHost + '/' + star
    }
    if(video) {
      video = config.aliyun.ossHost + '/' + video
    }
    if(face) {
      face = config.aliyun.ossHost + '/' + face
    }
    if(live) {
      live = config.aliyun.ossHost + '/' + live
    }
    if(roll) {
      roll = editRoll(roll)
    }
    if(tattoo) {
      tattoo = config.aliyun.ossHost + '/' + tattoo
    }
    if(hengping) {
      hengping = editRoll(hengping)
    }
    if(weizheng) {
      weizheng = editRoll(weizheng)
    }
    let client = yield Client.findOne({_id: clientId}).exec()

    if(!client) {
        return (
            this.body = {
                code: 0,
                err: '用户不存在'
            }
        )
    }

    let ad = client.ad
    if(ad) {
      client.ad.roll = roll
      client.ad.info = info
      client.ad.video = video
      client.ad.skin = skin
      client.ad.face = face
      client.ad.live = live
      client.ad.star = star
      client.ad.tattoo = tattoo
      client.ad.hengping = hengping
      client.ad.weizheng = weizheng
    } else {
      let newAd = {
        roll: roll,
        info: info,
        video: video,
        skin: skin,
        face: face,
        live: live,
        star: star,
        tattoo: tattoo,
        hengping: hengping,
        weizheng: weizheng
      }
      client.ad = newAd
    }

    client.markModified('ad')

    console.log('client ad======', client.ad)

    yield client.save()
    
    this.body = {
        code: 1,
        err: '添加广告成功'
    }
}


/**
 * @api {get} /getAdvertisementList  Client  get Advertisement List
 * @apiName addAdvertisement
 * @apiGroup Client
 * @apiPermission Client
 *
 * @apiDescription  get Advertisement List

 * @apiSuccess {Number}   code   1.
 * @apiSuccess {String}   err 'ok'.
 *
 * @apiError code 0.
 * @apiError err   err message.
 * @apiErrorExample Response (example):
 *     HTTP/1.1 200 Ok
 *     {
 *       "code": 0
 *       "error": "user not found"
 *     }
 */
exports.getAdvertisementList = function *(next) {
    if(!this.session.client){
        return (this.body = {
            code: 0,
            err: "用户未登录，请登录"
        })
    }
    let clientId =  this.session.client.clientId
    let results = yield Advertisement.find({clientId: clientId}).sort({toolType: -1}).exec()
    this.body = {
        code: 1,
        err: "OK",
        results:results
    }
}

/**
 * @api {get} /getAdar  Client  get Adar
 * @apiName addAdar
 * @apiGroup Client
 * @apiPermission Client
 *
 * @apiDescription  广告机获取广告

 * @apiSuccess {Number}   code   1.
 * @apiSuccess {String}   err 'ok'.
 * @apiSuccess {Object}   results {}.
 *
 * @apiError code 0.
 * @apiError err   err message.
 * @apiErrorExample Response (example):
 *     HTTP/1.1 200 Ok
 *     {
 *       "code": 0
 *       "error": "user not found"
 *     }
 */
exports.getAdar = function *(next) {
    if(!this.session.client) {
        return (this.body = {
            code: 0,
            err: '用户未登录，请登录'
        })
    }
    let clientId =  this.session.client.clientId || ''
    let client = yield Client.findOne({_id: clientId}).exec()
    let ad = client.ad
    
    if(!ad) {
        return (this.body = {
            code: 0,
            err: '没有找到广告'
        })
    }

    ad.optTool = client.optTool

    this.body = {
        code: 1,
        err: 'OK',
        results:ad
    }
}


/**
 * @api {get} /setOptTool  Client  set opt tool
 * @apiName setOptTool
 * @apiGroup Client
 * @apiPermission Client
 *
 * @apiDescription  美容院后台设置广告机显示工具

 * @apiSuccess {Number}   code   1.
 * @apiSuccess {String}   err 'ok'.
 *
 * @apiError code 0.
 * @apiError err   err message.
 * @apiErrorExample Response (example):
 *     HTTP/1.1 200 Ok
 *     {
 *       "code": 1
 *       "error": "ok"
 *     }
 */
exports.setOptTool = function *(next) {
    if(!this.session.client) {
        return (this.body = {
            code: 0,
            err: '用户未登录，请登录'
        })
    }
    let tool = this.request.body.tool || ''
    let clientId =  this.session.client.clientId || ''
    let client = yield Client.findOne({_id: clientId}).exec()

    client.optTool = tool
    yield client.save()

    this.body = {
        code: 1,
        err: 'OK'
    }
}


/**
 * @api {get} /deleteAdvertisement  Client  delete Advertisement
 * @apiName Client  delete Advertisement
 * @apiGroup Client
 * @apiPermission Client
 *
 * @apiDescription Client  delete Advertisement
 *
 * @apiParam {String} toolId The tool  _Id
 *
 * @apiSuccess {Number}   code   1.
 * @apiSuccess {String}   err 'ok'.
 *
 * @apiError code 0.
 * @apiError err   err message.
 * @apiErrorExample Response (example):
 *     HTTP/1.1 200 Ok
 *     {
 *       "code": 0
 *       "error": "user not found"
 *     }
 */
exports.deleteAdvertisement = function *(next) {
    let toolId =  this.request.query.toolId
    if(!this.session.client) {
        return (this.body = {
            code: 0,
            err: "用户未登录，请登录"
        })
    }
    if(!toolId) {
        return (this.body = {
            code: 0,
            err: "该数据不存在"
        })
    }
    yield Advertisement.remove({_id: toolId}).exec()
    this.body = {
        code: 1,
        err: "删除成功"
    }
}


/**
 * @api {get} /deleteAdar  Client  delete Adar
 * @apiName Client  delete Adar
 * @apiGroup Client
 * @apiPermission Client
 *
 * @apiDescription Client  delete Adar
 *
 * @apiParam {String} toolId The tool  _Id
 *
 * @apiSuccess {Number}   code   1.
 * @apiSuccess {String}   err 'ok'.
 *
 * @apiError code 0.
 * @apiError err   err message.
 * @apiErrorExample Response (example):
 *     HTTP/1.1 200 Ok
 *     {
 *       "code": 0
 *       "error": "user not found"
 *     }
 */
exports.deleteAdar = function *(next) {
    if(!this.session.client) {
        return (this.body = {
            code: 0,
            err: '用户未登录，请登录'
        })
    }
    let roll = this.query.roll
    let info = this.query.info
    let skin = this.query.skin
    let video = this.query.video
    let face = this.query.face
    let live = this.query.live


    let clientId =  this.session.client.clientId || ''
    let client = yield Client.findOne({_id: clientId}).exec()
    
    if(roll && client.ad && client.ad.roll) {
      client.ad.roll = ''
    }
    if(skin && client.ad && client.ad.skin) {
      client.ad.skin = ''
    }
    if(video && client.ad && client.ad.video) {
      client.ad.video = ''
    }
    if(face && client.ad && client.ad.face) {
      client.ad.face = ''
    }
    if(live && client.ad && client.ad.live) {
      client.ad.live = ''
    }
    if(info && client.ad && client.ad.info) {
      client.ad.info = ''
    }

    yield client.save()

    this.body = {
        code: 1,
        err: '删除成功'
    }
}



/**
 * @api {get} /editAdvertisement  Client edit Advertisement
 * @apiName editAdvertisement
 * @apiGroup Client
 * @apiPermission Client
 *
 * @apiDescription  Client edit Advertisement.
 *
 * @apiParam {String} toolId
 * @apiParam {String} imgUrl
 * @apiParam {String} adName
 * @apiParam {String} adUrl
 * @apiParam {String} toolType
 * @apiParam {String} editionType
 *
 * @apiExample Example usage:
 * http://test.legle.cc/editAdvertisement
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
 *       "error": "user not found"
 *     }
 */
exports.editAdvertisement = function *(next) {
    if(!this.session.client) {
        return (
            this.body = {
                code: 0,
                err: '用户没有登录，请登录'
            }
        )
    }
    let clientId =  this.session.client.clientId
    let toolId = this.request.body.toolId || ''
    let imgUrl = this.request.body.imgUrl
    let adName = this.request.body.adName
    let adUrl = this.request.body.adUrl
    let toolType = this.request.body.toolType
    let editionType = this.request.body.editionType
    //1: '颜值测试',2: '皮肤测试',3: '明星面对面'
    toolType = config.toolTypes[toolType]
    let tool = yield Advertisement.findOne({_id: toolId}).exec()
    if(!tool) {
        return (
            this.body = {
                code: 0,
                err: '编辑失败，该广告对应的ID数据不存在。'
            }
        )
    }
    if(!imgUrl) {
      return (this.body = {code:0,err:'没有收到文件'})
    } else {
      imgUrl = config.aliyun.ossHost + '/' + imgUrl
    }
    const AdData = {
        imgUrl: imgUrl,
        adUrl: adUrl,
        adName: adName,
        editionType: editionType,
        toolType: toolType,
        clientId: clientId
    }

    yield Advertisement.update({_id: toolId}, AdData).exec()
    this.body = {
        code: 1,
        err: '编辑广告成功'
    }
}


/**
 * @api {get} /editAdar  Client edit Adar
 * @apiName editAdar
 * @apiGroup Client
 * @apiPermission Client
 *
 * @apiDescription  Client edit Adar.
 *
 * @apiParam {String} roll
 * @apiParam {String} info
 * @apiParam {String} video
 * @apiParam {String} skin
 * @apiParam {String} face
 * @apiParam {String} live
 *
 * @apiExample Example usage:
 * http://test.legle.cc/editAdar
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
 *       "error": "user not found"
 *     }
 */
exports.editAdar = function *(next) {
    if(!this.session.client) {
        return (
            this.body = {
                code: 0,
                err: '用户没有登录，请登录'
            }
        )
    }
    let roll = this.request.body.roll
    let info = this.request.body.info
    let video = this.request.body.video
    let skin = this.request.body.skin
    let face = this.request.body.face
    let live = this.request.body.live
    let star = this.request.body.star
    let tattoo = this.request.body.tattoo
    let hengping = this.request.body.hengping
    let weizheng = this.request.body.weizheng
    if(info) {
      info = config.aliyun.ossHost + '/' + info
    }
    if(skin) {
      skin = config.aliyun.ossHost + '/' + skin
    }
    if(star) {
      star = config.aliyun.ossHost + '/' + star
    }
    if(video) {
      video = config.aliyun.ossHost + '/' + video
    }
    if(face) {
      face = config.aliyun.ossHost + '/' + face
    }
    if(live) {
      live = config.aliyun.ossHost + '/' + live
    }
    if(roll) {
      roll = editRoll(roll)
    }
    if(tattoo) {
      tattoo = config.aliyun.ossHost + '/' + tattoo
    }
    if(hengping) {
      hengping = editRoll(hengping)
    }
    if(weizheng) {
      weizheng = editRoll(weizheng)
    }

    let clientId =  this.session.client.clientId || ''
    let client = yield Client.findOne({_id: clientId}).exec()
    console.log(this.request.body)
    if(roll && client.ad) {
      client.ad.roll = roll
    }

    if(info && client.ad) {
      client.ad.info = info
    }
    if(star && client.ad) {
      client.ad.star = star
    }

    if(video && client.ad) {
      client.ad.video = video
    }

    if(skin && client.ad) {
      client.ad.skin = skin

    }

    if(face && client.ad) {
      client.ad.face = face
    }

    if(live && client.ad) {
      client.ad.live = live
    }
    if(tattoo && client.ad) {
      client.ad.tattoo = tattoo
    }
    if(hengping && client.ad) {
      client.ad.hengping = hengping
    }
    if(weizheng && client.ad) {
      client.ad.weizheng = weizheng
    }
    if(!client.ad) {
      let ad = {
        roll: roll,
        info: info,
        skin: skin,
        video: video,
        face: face,
        live: live,
        star: star,
        tattoo: tattoo,
        hengping: hengping,
        weizheng: weizheng
      }
      client.ad = ad
    }

    client.markModified('ad')
    yield client.save()

    this.body = {
        code: 1,
        err: '编辑广告成功'
    }
}


exports.getAdvertisementInfo = function *(next) {
    let adId =  this.request.query.AdId || ''
    if(!this.session.client) {
        return (this.body = {
            code: 0,
            err: '用户未登录，请登录'
        })
    }
    let clientId =  this.session.client.clientId
    let result = yield Advertisement.findOne({clientId: clientId,_id:adId}).exec()
    this.body = {
        code: 1,
        err: 'OK',
        results:result
    }
}

/**
 * @api {get} /getAd  get Advertisement List
 * @apiName getAd
 * @apiGroup Ad
 * @apiPermission anybody
 *
 * @apiDescription  get Advertisement List

 * @apiSuccess {Number}   code   1.
 * @apiSuccess {String}   err 'ok'.
 *
 * @apiError code 0.
 * @apiError err   err message.
 * @apiErrorExample Response (example):
 *     HTTP/1.1 200 Ok
 *     {
 *       "code": 0,
 *       "error": "user not found",
 *       "results": []
 *     }
 */
exports.getAd = function *(next) {
    let clientId =  this.request.query.clientId
    let toolType =  this.request.query.toolType
    let editionType =  this.request.query.editionType
    toolType = config.toolTypes[toolType]
    let results = yield Advertisement.find({clientId: clientId ,toolType:toolType,editionType:editionType}).exec()
    this.body = {
        code: 1,
        err: 'OK',
        results:results
    }
}


exports.addFourPic = function *(next) {
    if(!this.session.client){
        return (
            this.body = {
                code: 0,
                err: "用户没有登录，请登录"
            }
        )
    }
    let clientId =  this.session.client.clientId
    let imgUrl = this.request.body.imgUrl
    let adName = this.request.body.name
    let fistprice = this.request.body.fistprice
    let newprice = this.request.body.newprice
    let count = yield Newpic.count({clientId: clientId}).exec()
     if(Number(count) >= 4) {
        return (
            this.body = {
                code: 0,
                err: "添加失败,广告数量最多4条。"
            }
        )
     }
    if(!imgUrl) {
      return (this.body = {code:0,err:'请上传一张图片'})
    } else {
      imgUrl = config.aliyun.ossHost + '/' + imgUrl
    }

    let AdData = new Newpic({
        clientId: clientId,
        imgUrl: imgUrl,
        fistPrice:fistprice,
        newPrice: newprice,
        adName: adName
    })
    console.log('clientId=======',clientId)

    yield AdData.save()
    this.body = {
        code: 1,
        err: "添加广告成功"
    }
}


exports.getFourPic = function *(next) {

    let clientId =  this.query.clientId
    if(this.session.client) {
      clientId =  this.session.client.clientId
    }
    let results = yield Newpic.find({clientId: clientId}).sort({'meta.updatedAt': -1}).exec()
    this.body = {
        code: 1,
        err: "OK",
        results:results
    }
}



exports.deleteFourPic = function *(next) {
    let toolId =  this.request.query.toolId
    if(!this.session.client) {
        return (this.body = {
            code: 0,
            err: "用户未登录，请登录"
        })
    }
    
    yield Newpic.remove({_id: toolId}).exec()

    this.body = {
        code: 1,
        err: "删除成功"
    }
}

