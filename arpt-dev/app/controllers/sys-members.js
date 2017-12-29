'use strict'

const mongoose = require('mongoose')
const Client = mongoose.model('Client')
const SysMember = mongoose.model('SysMember')
const xss = require('xss')
const sms = require('../service/sms')
const Msg = require('../libs/msg')


/**
 * @api {post} /setSkinRole  公司销售设置美容院皮肤测试权限
 * @apiName setSkinRole
 * @apiGroup sys members
 * @apiPermission admin
 *
 * @apiDescription 公司销售设置美容院皮肤测试权限.
 *
 * @apiParam {String} mobile 美容院关联手机.
 * @apiParam {Boolean} role 美容院使用权限 true or false.
 * @apiParam {Date} from 时间戳  没有使用期限头.
 * @apiParam {Date} to 时间戳  没有使用期限尾.
 *
 * @apiExample Example usage:
 * http://test.legle.cc/setSkinRole
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
 *       "error": "手机参数必填"
 *     }
 */
exports.setSkinRole = function *(next) {
  let body = this.request.body
  let mobile = body.mobile

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

  let update = {
    $set: {
      skinRole: {
      	role: body.role,
      	from: body.from,
      	to: body.ro
      }
    }
  }

  yield Client.update({mobile: mobile}, update).exec()

  this.body = {
    code: 1,
    err: 'ok'
  }

}

/**
 * @api {post} /setSkinRole  公司销售设置美容院颜值测试权限
 * @apiName setSkinRole
 * @apiGroup sys members
 * @apiPermission admin
 *
 * @apiDescription 公司销售设置美容院颜值测试权限.
 *
 * @apiParam {String} mobile 美容院关联手机.
 * @apiParam {Boolean} role 美容院使用权限 true or false.
 * @apiParam {Date} from 时间戳  没有使用期限头.
 * @apiParam {Date} to 时间戳  没有使用期限尾.
 *
 * @apiExample Example usage:
 * http://test.legle.cc/setSkinRole
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
 *       "error": "手机参数必填"
 *     }
 */
exports.setFaceRole = function *(next) {
  let body = this.request.body
  let mobile = body.mobile

  if(!body) {
    return(this.body = {
      code: 0,
      err: Msg.COMMON.DATA_EMPTY
    })
  }

  if(!mobile) {
    return(this.body = {
      code: 4,
      err: Msg.USER.PHONE_IS_REQUIRED
    })
  }

  let update = {
    $set: {
      faceRole: {
      	role: body.role,
      	from: body.from,
      	to: body.to
      }
    }
  }

  yield Client.update({mobile: mobile}, update).exec()

  this.body = {
    code: 1,
    err: 'ok'
  }

}


/**
 * @api {post} /setStarRole  公司销售设置美容院明星面对面测试权限
 * @apiName setSkinRole
 * @apiGroup sys members
 * @apiPermission admin
 *
 * @apiDescription 公司销售设置美容院明星面对面测试权限.
 *
 * @apiParam {String} mobile 美容院关联手机.
 * @apiParam {Boolean} role 美容院使用权限 true or false.
 * @apiParam {Date} from 时间戳  没有使用期限头.
 * @apiParam {Date} to 时间戳  没有使用期限尾.
 *
 * @apiExample Example usage:
 * http://test.legle.cc/setSkinRole
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
 *       "error": "手机参数必填"
 *     }
 */
exports.setStarRole = function *(next) {
    let body = this.request.body
    let mobile = body.mobile

    if(!body) {
        return(this.body = {
            code: 0,
            err: Msg.COMMON.DATA_EMPTY
        })
    }

    if(!mobile) {
        return(this.body = {
            code: 4,
            err: Msg.USER.PHONE_IS_REQUIRED
        })
    }

    let update = {
        $set: {
            starRole: {
                role: body.role,
                from: body.from,
                to: body.to
            }
        }
    }

    yield Client.update({mobile: mobile}, update).exec()
    this.body = {
        code: 1,
        err: 'ok'
    }

}

/**
 * @api {post} /setLogin  Client rootuser login arpt
 * @apiName Login
 * @apiGroup sys members
 * @apiPermission ClieSysmembernt
 *
 * @apiDescription Sysmember  user  login.
 *
 * @apiParam {String} username The Sysmember-username.
 * @apiParam {String} password The Sysmember-password.
 *
 * @apiExample Example usage:
 * http://test.legle.cc/rootLogin
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
    const existSysMember = yield SysMember.findOne({username:username}).exec()

    if(!existSysMember) {
        return (this.body = {
            ret: 0,
            errors: {
                msg: Msg.USER.USER_NOT_EXIST
            }
        })
    }

    let match = yield existSysMember.comparePassword(password, existSysMember.password)
    if (!match) {
        return (this.body = {
            code: 0,
            err: Msg.USER.PWD_ERROR
        })
    }

    this.session.sysMember = {
        sysMemberId:existSysMember._id,
        mobile:existSysMember.mobile,
        username:existSysMember.username
    }

    this.body = {
        code: 1,
        err: 'ok'
    }
}

/**
 * @api {post} /sysMemberSignupPhone  sysMember signup by phone
 * @apiName SetsysMember
 * @apiGroup sys members
 * @apiPermission anyBody
 *
 * @apiDescription signup for sysMember.
 *
 * @apiParam {String} username The sysMember-name.
 * @apiParam {String} mobile The sysMember-mobile.
 * @apiParam {String} password The sysMember-password.
 * @apiParam {String} conformPassword The sysMember-conformPassword.
 * @apiParam {Number} code The sysMember-phone verify code.
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
 *       "code": 0
 *       "error": "用户密码不匹配"
 *     }
 */
exports.signupPhone = function *(next) {

  let username = this.request.body.username
  let mobile = this.request.body.mobile
  let password = this.request.body.password
  let conformPassword = this.request.body.conformPassword
  let code = this.request.body.code.toString()

  let existSysMember = yield SysMember.findOne({username: username}).exec()
  let mobileSysMember = yield SysMember.findOne({mobile: mobile}).exec()
  if (existSysMember) {
    this.body = {
      code: 0,
      err: Msg.USER.USERNAME_EXIST
    }
  }
  else if (mobileSysMember) {
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
      const updateData = {
        mobile: xss(mobile),
        username: xss(username),
        password: xss(password)
      }

      const savedSysMember = new SysMember(updateData)
      yield savedSysMember.save()

      this.session.sysMember = {
        sysMemberId: savedSysMember._id,
        username: savedSysMember.username,
        mobile: savedSysMember.mobile
      }

      this.body = {
        code: 1,
        sysMemberId: savedSysMember._id,
        err: 'ok'
      }
    }
  }
}



/**
 * @api {post} /getClientList  Client get client list  arpt
 * @apiName getClientList
 * @apiGroup Client
 * @apiPermission Client
 *
 * @apiDescription Client get client list .
 *
 * @apiParam {String} mobile The Client-mobile.
 * @apiParam {String} pagination The Client-pagination.
 *
 * @apiExample Example usage:
 * http://test.legle.cc/setGetClientList
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
exports.getClientList = function *(next) {
    let number = 15
    let pagination = Number(this.request.body.pagination) - 1
    let mobile = this.request.body.mobile
    let result
    if(mobile) {
        result = yield Client.findOne({mobile:mobile}).exec()
        if (!result) {
            return (this.body = {
                code: 0,
                err: Msg.USER.USER_NOT_EXIST
            })
        }
    }else{
        result = yield Client.find().skip(number*pagination).limit(number*pagination + 15).sort({'meta.createdAt': -1}).exec()
        console.log(result.length);
    }
    this.body = {
        code: 1,
        err: 'ok',
        result:result
    }
}


/**
 * @api {post} /setGetClientInfo  Client get client Info  arpt
 * @apiName getClientInfo
 * @apiGroup Client
 * @apiPermission Client
 *
 * @apiDescription Client get client Info .
 *
 * @apiParam {String} clientId The clientId.
 *
 * @apiExample Example usage:
 * http://test.legle.cc/setGetClientInfo
 *
 * @apiSuccess {Number}   code   1.
 * @apiSuccess {String}   err 'ok'.
 *
 * @apiError code 0.
 * @apiError err   err message
 *
 * @apiErrorExample Response (example):
 *     HTTP/1.1 200 Ok
 *     {
 *       "code": 0
 *       "error": "用户不存在"
 *     }
 */
exports.getClientInfo = function *(next) {
    let clientId = this.request.query.clinetId
    let result = yield Client.findOne({_id:clientId}).exec()
    if(!result) {
        return (this.body = {
            code: 0,
            err: Msg.USER.USER_NOT_EXIST
        })
    }
    this.body = {
        code: 1,
        err: 'ok',
        result:result
    }
}



/**
 * @api {post} /sysSignOut  sys sign out  arpt
 * @apiName signOut
 * @apiGroup sys
 * @apiPermission sys
 *
 * @apiDescription sys sign out  arpt.
 *
 * @apiExample Example usage:
 * http://test.legle.cc/sysSignOut
 *
 * @apiError code 0.
 * @apiError err   err message
 *
 * @apiErrorExample Response (example):
 *     HTTP/1.1 200 Ok
 *     {
 *       "code": 0
 *       "error": "用户不存在"
 *     }
 */
exports.signOut = function *(next) {
    this.logout()
    delete this.session.sysMember
    this.body = {
        code:1,
        err: 'ok'
    }
}






