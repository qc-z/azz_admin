'use strict'

const mongoose = require('mongoose')
const Pengai = mongoose.model('Pengai')
const request = require('request-promise')
const crypto = require('crypto')
const randomstring = require('randomstring')
const moment = require('moment')
const md5 = require('md5')
const fs = require('fs')
const parseString = require('xml2js').parseString
const querystring = require('querystring')
const wxMethod = require('../service/weixin')
const wxConfig = require('../../config/config').weixin
const pengaiCf = require('../../config/config').pengai
// const schedule = require('node-schedule')


// 微信h5 红包活动 发红包
// function sendRed() {

//   let number = 150
//   let date = new Date(pengaiCf.dateEnd)
//   console.log('红包截止时间:  ', date)

//   function send() {
//     Pengai.find().sort({shareNum: -1})
//     .then(function(users) {
//       if(users && users.length >= 1) {
//         users = users.slice(0, number)
//         for(let index in users) {
//           if(users[index]) {
//             let openid = users[index].openid
//             let money = 1 + Number(Math.random().toFixed(1))
//             if(index == 0) {
//               if(openid) {
//                 pay(openid, 38)
//                 users[index].money = money
//                 users[index].save()
//               }
//             }
//             else {
//               if(openid) {
//                 pay(openid, money)
//                 users[index].money = money
//                 users[index].save()
//               }
//             }
//             console.log('获奖名字:  ', users[index].nickname)
//             console.log('获奖金额:  ', money)
//           }
//         }
//       }
//     })
//   }

//   schedule.scheduleJob(date, function() {
//     send()
//   })

// }

// sendRed()

exports.pengaiPayTest = function *(next) {
  
  let openid = this.query.openid
  let key = this.query.key
  if(key !== 'jigezuishuai') {
    return (this.body = {
      ret: 0,
      err: 'get out sb'
    })
  }
  // pay(openid, 45)

  this.body = {
    ret: 0,
    ok: '红包'
  }

}


// 微信h5 鹏爱 保存 session
exports.pengaiSession = function *(next) {
  let openid = this.query.openid

  this.session.redPacket = {
    openid: openid
  }

  yield next

}


exports.pengaiStatus = function *(next) {
  if(this.session && this.session.redPacket && this.session.redPacket.myOpenid) {
    let myOpenid = this.session.redPacket.myOpenid || ''
    let pengai = yield Pengai.findOne({openid: myOpenid}).exec()
    if(pengai) {
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

// 微信h5 鹏爱 用户获取自己的排名
exports.pengaiRankin = function *(next) {

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

  let pengai = yield Pengai.findOne(findField).exec()

  if(!pengai) {
    return (this.body = {
      ret: 0,
      err: '没有找到 user'
    })
  }

  let pengais = yield Pengai.find().sort({shareNum: -1}).exec()

  let position = 0

  for (var i = 0; i < pengais.length; i++) {
    if(pengais[i].openid === pengai.openid) {
      position = i + 1
    }
  }

  if(pengais && pengais.length > number) {
    pengais = pengais.slice(0, number)
  }

  let dateStart = pengaiCf.dateStart
  let dateEnd = pengaiCf.dateEnd

  return (this.body = {
    ret: 1,
    err: 'ok',
    position: position,
    dateStart: dateStart,
    dateEnd: dateEnd,
    user: pengai,
    users: pengais
  })
}

// 微信h5 鹏爱 统计每天分享次数
exports.pengaiStat = function *(next) {


  let dateStart = config.dateStart
  let dateEnd = config.dateEnd

  let oneDay = 86400000

  dateStart = new Date(dateStart).getTime()
  dateEnd = new Date(dateEnd).getTime()

  let timeOne = dateStart
  let counts = []

  while(timeOne < dateEnd) {
    let timeTwo = timeOne + oneDay
    let count = yield Pengai.count({shareNum: {$exists: true}, 'meta.createdAt': {$gte: timeOne, $lte: timeTwo}}).exec()
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

// 微信h5 鹏爱活动 获取红包列表
exports.pengaiList = function *(next) {

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

  let today = yield Pengai.count({shareNum: {$exists: true}, 'meta.updatedAt': {$gte: a, $lte: b}}).exec()

  let length = yield Pengai.count(findField).exec()
  let users = yield Pengai.find(findField).sort({shareNum: -1}).skip(number*pagination).limit(number).exec()


  return (this.body = {
    ret: 1,
    err: 'ok',
    length: length,
    today: today,
    users: users
  })
}



// 鹏爱回调
exports.pengaicb = function *(next) {

  let openid = ''
  if(this.session && this.session.redPacket) {
    openid = this.session.redPacket.openid
  }

  let id = ''
  if(this.session && this.session.passport && this.session.passport.user) {
    id = this.session.passport.user
  }
  let pengai = yield Pengai.findOne({_id: id}).exec()

  if(!pengai) {
    return (this.body = {
      ret: 0,
      err: '授权不被允许'
    })
  }

  // 成功授权，分享人 分享次数 +1
  if(!pengai.fatherOpenid) {
    let userPre = yield Pengai.findOne({openid: openid}).exec()
    if(userPre) {
      userPre.shareNum = userPre.shareNum + 1
      yield userPre.save()
    }
    pengai.fatherOpenid = openid
  }

  // 保存上级openid 用于统计转发量
  yield pengai.save()

  this.session.redPacket.myOpenid = pengai.openid


  let url = 'http://arpt.leglear.com/pengai/index.html?openid=' + pengai.openid


  this.redirect(url)
  // this.body = {
  //   ret: 1,
  //   _id: _id
  // }
}


/**
 * @api {get} /pengai/pay  微信发红包
 * @apiName pengai pay
 * @apiGroup pengai
 * @apiPermission anyBody
 *
 * @apiDescription pay by pengai.
 *
 * @apiParam {String} url The use url.
 *
 * @apiExample Example usage:
 * http://test.legle.cc/pengai/pay
 *
 * @apiSuccess {String}   appId   'xxx'.
 * @apiSuccess {String}   timestamp 'xxx'.
 * @apiSuccess {nonceStr}   nonceStr 'xxx'.
 * @apiSuccess {signature}   signature 'xxx'.
 *
 *
 * @apiErrorExample Response (example):
 *     HTTP/1.1 200 Ok
 *     {
 *       appId: wxConfig.appId,
 *       timestamp: timestamp,
 *       nonceStr: noncestr,
 *       signature: string1
 *     }
 */
function pay(openid, money) {
  //调用该接口的地址
  var random_str = randomstring.generate({
    length: 4,
    charset: 'alphanumeric'
  })
  var ORDER_ID = random_str + moment().format('YYYYMMDD') + moment().format('MMDDHHmmss')
  var RANDOM_NUM = randomstring.generate({
    length: 16,
    charset: 'alphanumeric'
  })

  var MCHID = '1482964112'
  var APPID = 'wxe92fab20bfaf18dc'
  var MCHNM = '聆歌科技'
  var peopleNum = 1
  var moneyNum = 100 * money // 单位是分
  // var openid = 'oS_4zxJFOK_CyO-AEiua2L3uVdxU'
  var wishing = '感谢您参与鹏爱美丽约分享得红包活动，恭喜你获得红包'
  // var wishing = 'goodluck'
  var client_ip = '106.75.64.209'

  var PFX = process.cwd() + '/config/apiclient_cert.p12'
  var url = 'https://api.mch.weixin.qq.com/mmpaymkttransfers/sendredpack'

  var postData = {
      nonce_str: RANDOM_NUM, //随机字符串
      mch_billno: ORDER_ID, //商户订单号,
      mch_id: MCHID, // 商户号,
      wxappid: APPID, // 公众账号appid
      send_name: MCHNM, // 商户名称
      re_openid: openid, // 用户openid  
      total_amount: moneyNum, // 付款金额
      total_num: peopleNum, // 红包发放总人数
      wishing: wishing, //红包祝福语
      client_ip: client_ip, // Ip地址  
      act_name: '广州鹏爱医疗美容', // 活动名称
      remark: 'test' // 备注,
  }
  var sign = getSign(postData)
  postData.sign = sign
  
  var  postXMLData = '<xml>'
      postXMLData += '<act_name>'+postData.act_name+'</act_name>'
      postXMLData += '<client_ip>'+postData.client_ip+'</client_ip>'
      postXMLData += '<mch_billno>'+postData.mch_billno+'</mch_billno>'
      postXMLData += '<mch_id>'+postData.mch_id+'</mch_id>'
      postXMLData += '<nonce_str>'+postData.nonce_str+'</nonce_str>'
      postXMLData += '<re_openid>'+postData.re_openid+'</re_openid>'
      postXMLData += '<remark>'+postData.remark+'</remark>'
      postXMLData += '<send_name>'+postData.send_name+'</send_name>'
      postXMLData += '<total_amount>'+postData.total_amount+'</total_amount>'
      postXMLData += '<total_num>'+postData.total_num+'</total_num>'
      postXMLData += '<wishing>'+postData.wishing+'</wishing>'
      postXMLData += '<wxappid>'+postData.wxappid+'</wxappid>'
      postXMLData += '<sign>'+postData.sign+'</sign>'
      postXMLData += '</xml>'

  request({
    url: url,
    method: 'POST',
    body: postXMLData,
    agentOptions: {
          pfx: fs.readFileSync(PFX),
          passphrase: MCHID
    }
  }, function(err, response, body) {
      console.log(body)
      parseString(body, function(err, result) {
          var result = {
              code: 200,
              data: result.xml,
              message: 'success'
          }
          // callback(null, result)
      })
      
  })
}

// 获取签名
function getSign(obj) {
    // console.log('元素obj:')
    // console.log(obj)
    var parmsString = querystring.stringify(obj)
    var stringAArr = parmsString.split('&')

    stringAArr[4] = 'send_name=聆歌科技'
    stringAArr[8] = 'wishing=感谢您参与鹏爱美丽约分享得红包活动，恭喜你获得红包'
    stringAArr[10] = 'act_name=广州鹏爱医疗美容'


    var stringA = stringAArr.sort().join('&')
    // console.log('第一步:' + stringA)

    // 以上是按ASCII排序

    var stringSignTemp = stringA + '&key=' + 'Ling123Ge888LegLe321Ge888Le66688'
    // console.log('第二步：'+stringSignTemp)

    // stringSignTemp = (stringSignTemp)
    var sign = md5(stringSignTemp).toUpperCase()

    // console.log('第四步：'+sign)
    return sign
}



/**
 * @api {get} /pengai/share  获取微信认证信息
 * @apiName pengai share
 * @apiGroup pengai
 * @apiPermission anyBody
 *
 * @apiDescription share by pengai.
 *
 * @apiParam {String} url The use url.
 *
 * @apiExample Example usage:
 * http://test.legle.cc/pengai/share
 *
 * @apiSuccess {String}   appId   'xxx'.
 * @apiSuccess {String}   timestamp 'xxx'.
 * @apiSuccess {nonceStr}   nonceStr 'xxx'.
 * @apiSuccess {signature}   signature 'xxx'.
 *
 *
 * @apiErrorExample Response (example):
 *     HTTP/1.1 200 Ok
 *     {
 *       appId: wxConfig.appId,
 *       timestamp: timestamp,
 *       nonceStr: noncestr,
 *       signature: string1
 *     }
 */
exports.share = function *(next) {
  //调用该接口的地址
  let url1 = this.request.body.url
  let now = parseInt(new Date().getTime() / 1000)

  if (wxConfig.expire == null || wxConfig.access_token == null || now > wxConfig.expire) {
    let data = yield request.get('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + wxConfig.appId + '&secret=' + wxConfig.secret)
    data = JSON.parse(data)


    wxConfig.access_token = data.access_token
    wxConfig.expire = parseInt(now)+3600

    let url = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=' + data.access_token + '&type=jsapi'

    let wxData = yield request.get(url)
    wxData = JSON.parse(wxData)

    let noncestr = wxMethod.getNonceStr()
    let timestamp = wxMethod.getTimeStamp()

    let string1 = 'jsapi_ticket=' + wxData.ticket + '&noncestr=' + noncestr + '&timestamp=' + timestamp + '&url=' + url1

    let md5sum = crypto.createHash('sha1')
    md5sum.update(string1)
    string1 = md5sum.digest('hex')

    // console('JSSDK签名:' + string1)

    this.body = {
        //debug: true,
        appId: wxConfig.appId,
        timestamp: timestamp,
        nonceStr: noncestr,
        signature: string1
    }

  }else{
    let url = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=' + wxConfig.access_token + '&type=jsapi'

    let data = yield request.get(url)
    data = JSON.parse(data)

    let noncestr = wxMethod.getNonceStr()
    let timestamp = wxMethod.getTimeStamp()

    let string1 = 'jsapi_ticket=' + data.ticket + '&noncestr=' + noncestr + '&timestamp=' + timestamp + '&url=' + url1

    let md5sum = crypto.createHash('sha1')
    md5sum.update(string1)
    string1 = md5sum.digest('hex')


    this.body = {
      //debug: true,
      appId: wxConfig.appId,
      timestamp: timestamp,
      nonceStr: noncestr,
      signature: string1
    }
  }
}
