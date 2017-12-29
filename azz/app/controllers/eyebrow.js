'use strict'

const mongoose = require('mongoose')
const Eyebrow = mongoose.model('Eyebrow')
const Client = mongoose.model('Client')
const config = require('../../config/config')
const facepp = require('../service/facepp')

/**
 * @api {post} /eyebrowTest 纹眉测试
 * @apiName eyebrowTest
 * @apiGroup eyebrowTest
 * @apiPermission anyBody
 *
 * @apiDescription 纹眉测试 在服务端数据保存和同人分析.
 *
 * @apiParam {String} clientId 美容院或者分享连接里面的 clientId.
 * @apiParam {String} deviceId 安卓注册id
 * @apiParam {String} file 图片地址
 *
 * @apiExample Example usage:
 * http://test.legle.cc/eyebrowTest
 *
 * @apiSuccess {Number}   code   1 代表成功，0 代表失败.
 * @apiSuccess {Object}   stars   看下面例子.
 *
 * @apiError code 0.
 * @apiError err   err message.
 *
 * @apiErrorExample Response (example):
 *     HTTP/1.1 200 Ok
 *     {
 *       "code":1,
 *		    "uuid":"6x0g55e0",
 *		    "mobile":"15501451077",
 *		    "clientId":"591984001573d4687d6b5ded",
 *		    "shareUrl":"http://arpt.pjnice.com/arpt-wxarpt/report.html?uuid=6x0g55e0&clientId=591984001573d4687d6b5ded"
 *     	}
 */
exports.eyebrowTest = function *(next) {
	console.log(this.request.body)
	let body = this.request.body
	let clientId = body.clientId || ''
	let deviceId = body.deviceId
	let sex = body.sex
	let imgUrl = body.file

	sex = Number(sex)

	if(this.session.client && this.session.client.clientId) {
		clientId = this.session.client.clientId
	}


	if(!clientId || clientId === 'undefined' || clientId === 'null') {
		return (this.body = {code:0,err:'clientId not found'})
	}

	let	uuid = Math.random().toString(36).substring(3, 11)


	let client = yield Client.findOne({_id: clientId}).exec()

	if(!client) {
		return (this.body = {code:0,err:'client not found'})
	}

	// check role
	let eyebrowRole = client.eyebrowRole
	let toDate = eyebrowRole.to
	let timeNow = new Date()
	timeNow = timeNow.getTime()

	if(!eyebrowRole.role || (timeNow - toDate) > 0) {
		return (this.body = {
			code: 0,
			err: '没有使用权限'
		})
	}

	let shareUrl = config.reportStarUrlPc + '?uuid=' + uuid + '&clientId=' + clientId

	if(client.deviceId.length > 0 && client.deviceId.indexOf(deviceId) === -1 &&  client.deviceLimit <= client.deviceId.length) {
		return (this.body = {
			code: 0,
			err: '设备已经超过使用次数'
		})
	}

	if(client.deviceId.indexOf(deviceId) === -1) {
		client.deviceId.push(deviceId)
		yield client.save()
	}

  let detect = yield facepp.detectUrl(imgUrl)

	if(!detect) {
		return (this.body = {code:0,err:'detect error'})
	}

	let _detect = facepp.findBigestFace(detect.faces)

	if(!_detect) {
		return (this.body = {code:0,err:'人脸识别失败'})
	}

  let compareR
  if(this.session.test && this.session.test.face_token) {
    compareR = yield facepp.compare(_detect.face_token, this.session.test.face_token)
  }

  if(!compareR) {
    this.session.test = {
        face_token: _detect.face_token
    }
  }

  let mobile = ''
  if(compareR && this.session.test.mobile) {
      mobile = this.session.test.mobile
  }

  // 找相似明星
  let originType = 'AR'

	const eyebrowSave = new Eyebrow({
	  image_path: imgUrl,
	  sex: sex,
	  originType: originType,
	  uuid: uuid,
	  shareUrl: shareUrl,
	  mobile: mobile,
	  clientId: clientId
	})

	yield eyebrowSave.save()

	this.body = {
		code: 1,
		uuid: uuid,
		clientId: clientId,
		image_path: imgUrl,
		shareUrl: shareUrl,
		mobile: mobile
	}

}







