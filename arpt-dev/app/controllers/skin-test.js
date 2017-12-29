'use strict'

const mongoose = require('mongoose')
// const User = mongoose.model('User')
const Skin = mongoose.model('Skin')
const Client = mongoose.model('Client')
const config = require('../../config/config')
// const _ = require('lodash')
// const xss = require('xss')
// const sms = require('../service/sms')
const facepp = require('../service/facepp')
// const Msg = require('../libs/msg')

/**
 * @api {get} /skinTest 根据 uuid 或者 手机号码 获取皮肤测试的值
 * @apiName getSkinTest
 * @apiGroup Skin
 * @apiPermission anyBody
 *
 * @apiDescription 在用户 B 打开用户 A 分享出来的连接，根据 uuid 或者 手机号码 获取皮肤测试的值.
 *
 * @apiParam {String} uuid 分享连接里面的 uuid.
 * @apiParam {String} mobile 可选参数，AR 后台用来获取某个用户的皮肤测试值.
 *
 * @apiExample Example usage:
 * http://test.legle.cc/skinTest?uuid=1234&mobile=15501451077
 *
 * @apiSuccess {Number}   code   1 代表成功，0 代表失败.
 * @apiSuccess {Object}   looks   测试返回值.
 *
 * @apiError code 0.
 * @apiError err   err message.
 *
 * @apiErrorExample Response (example):
 *    HTTP/1.1 200 Ok
 *		{
 *	    "code":1,
 *	    "skin":{
 *	        "WATER_FLAG":Array[1],
 *	        "INFLAMMATION_FLAG":Array[1],
 *	        "WRINKLES_FLAG":Array[3],
 *	        "COLOR_FLAG":Array[1],
 *	        "OIL_FLAG":Array[1],
 *	        "PROSE_FLAG":Array[1]
 *	    },
 *	    "shareUrl":"http://wxarpt.pjnice.com/arpt-wxarpt/report.html?uuid=1234&clientId=59152155a88c48266d2ec6a7"
 *		}
 *     
 *     	
 */
exports.getTest = function *(next) {
	let uuid = this.query.uuid || ''
	let mobile = this.query.mobile || ''
	let clientId = this.query.clientId || ''

	if(!uuid || !clientId) {
		return (this.body = {code:0,err:'请求参数不能为空'})
	}

	let skin = yield Skin.findOne({uuid: uuid, clientId: clientId}).exec()

	if(!skin) {
		return (this.body = {
			code: 0,
			err: '没有找到皮肤测试数据'
		})
	}

	// if(mobile && clientId) {
	// 	let mskin = yield Skin.findOne({mobile: mobile.toString(), clientId: clientId}).exec()
	// 	if(mskin) {
	// 		skin = mskin
	// 	}
	// }

 	let returnData = {
		WATER_FLAG: skin.water_flag,
	  INFLAMMATION_FLAG: skin.inflammation_flag,
	  WRINKLES_FLAG: skin.wrinkles_flag,
	  COLOR_FLAG: skin.color_flag,
	  OIL_FLAG: skin.oil_flag,
	  PROSE_FLAG: skin.prose_flag,
	  uuid: skin.uuid,
	  shareUrl: skin.shareUrl,
	  image_path: skin.image_path
	}


	return (this.body = {
		code: 1,
		looks: returnData
	})

}

/**
 * @api {post} /skinTest 根据 uuid 或者 手机号码 生成皮肤测试的值
 * @apiName postSkinTest
 * @apiGroup Skin
 * @apiPermission anyBody
 *
 * @apiDescription 在用户 B 根据 uuid 或者 手机号码 产生皮肤测试的值.
 *
 * @apiParam {String} uuid 前端产品的一个随机字符串 uuid，来作为这个用户的唯一ID.
 * @apiParam {String} clientId 美容院或者分享连接里面的 clientId.
 * @apiParam {String} mobile 可选参数，AR 后台用来获取某个用户的皮肤测试值.
 * @apiParam {String} deviceId 可选参数，AR专用 后台用来判断这个设备是否有权限测试.
 * @apiParam {Object} data 用来包裹上面四个参数.
 * @apiParam {file} file 上传的图片，前端压缩后上传.
 *
 * @apiExample Example usage:
 * http://test.legle.cc/skinTest
 *
 * @apiSuccess {Number}   code   1 代表成功，0 代表失败.
 * @apiSuccess {Object}   looks   测试返回值.
 *
 * @apiError code 0.
 * @apiError err   err message.
 *
 * @apiErrorExample Response (example):
 *    HTTP/1.1 200 Ok
 *		{
 *	    "code":1,
 *	    "skin":{
 *	        "WATER_FLAG":Array[1],
 *	        "INFLAMMATION_FLAG":Array[1],
 *	        "WRINKLES_FLAG":Array[3],
 *	        "COLOR_FLAG":Array[1],
 *	        "OIL_FLAG":Array[1],
 *	        "PROSE_FLAG":Array[1]
 *	    },
 *	    "shareUrl":"http://wxarpt.pjnice.com/arpt-wxarpt/report.html?uuid=1234&clientId=59152155a88c48266d2ec6a7"
 *		}
 */
exports.skinTest = function *(next) {
	let body = this.request.body.fields.data
	body = JSON.parse(body)
	console.log('###', body)
	let uuid = body.uuid || ''
	let clientId = body.clientId || ''
	let deviceId = body.deviceId
	let mobile = body.mobile || ''

	if(this.session.client && this.session.client.clientId) {
		clientId = this.session.client.clientId
	}

	if(!clientId || clientId === 'undefined') {
		return (this.body = {code:0,err:'clientId not found'})
	}

	if(!uuid) {
		uuid = Math.random().toString(36).substring(3, 11)
	}

  if(!this.request.body.files || !this.request.body.files.file || !this.request.body.files.file.path) {
  	return (this.body = {code:0,err:'没有收到文件'})
  }

	let client = yield Client.findOne({_id: clientId}).exec()
	if(!client) {
        return (this.body = {
            code: 0,
            err: '用户不存在'
        })
	}
	let skinRole = client.skinRole
	let toDate = skinRole.to
	let timeNow = new Date()
	timeNow = timeNow.getTime()

	if(!skinRole.role || (timeNow - toDate) > 0) {
		return (this.body = {
			code: 0,
			err: '没有使用权限'
		})
	}

	let oldSkin = yield Skin.findOne({clientId: clientId, uuid: uuid}).exec()
	if(mobile) {
		let mobileSkin = yield Skin.findOne({clientId: clientId, mobile: mobile}).exec()
		if(mobileSkin) {
			oldSkin = mobileSkin
		}
	}

	if(deviceId) {

		let shareUrl = config.reportSkinUrl + '?uuid=' + uuid + '&clientId=' + clientId

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

	  let skindata = yield facepp.detect({
	  	file: this.request.body.files.file
	  })

		if(!skindata) {
			return (this.body = {code:0,err:'皮肤测试异常'})
		}

		// let _skin = facepp.findBigestFace(skindata.faces)

		// // adaptive old skin old Api
		// _skin.attribute=_skin.attributes
	 //  _skin.attribute.smiling=_skin.attribute.smile
	 //  _skin.face_id = _skin.face_token

	  let skin = yield facepp.skincloudtest({
	  	file: this.request.body.files.file
	  })

	  if (oldSkin) {
	  	if (this.request.body.files && this.request.body.files.file && this.request.body.files.file.path) {
        this.request.body.files.file.path = this.request.body.files.file.path.split('public/')[1]
      }
      skin.Image_path = this.request.body.files.file.path

		  oldSkin.water_flag = skin.WATER_FLAG
		  oldSkin.inflammation_flag = skin.INFLAMMATION_FLAG
		  oldSkin.image_path = this.request.body.files.file.path
		  oldSkin.wrinkles_flag = skin.WRINKLES_FLAG
		  oldSkin.color_flag = skin.COLOR_FLAG
		  oldSkin.oil_flag = skin.OIL_FLAG
		  oldSkin.prose_flag = skin.PROSE_FLAG
		  oldSkin.originType = 'AR'
		  oldSkin.testTimes = oldSkin.testTimes + 1

		  if(mobile) {
		  	oldSkin.mobile = mobile
		  }

	  	yield oldSkin.save()

		  return (this.body = {
	  		code: 1,
	  		skin: skin,
	  		uuid: oldSkin.uuid,
	  		clientId: clientId,
	  		shareUrl: oldSkin.shareUrl
	  	})

	  } else {

	  	if (this.request.body.files && this.request.body.files.file && this.request.body.files.file.path) {
	      this.request.body.files.file.path = this.request.body.files.file.path.split('public/')[1]
	    }
	    skin.Image_path = this.request.body.files.file.path

	  	const skinSave = new Skin({
				water_flag: skin.WATER_FLAG, // 水分0
			  inflammation_flag: skin.INFLAMMATION_FLAG, // 炎症（无、轻微、中、严重）数组对象
			  image_path: this.request.body.files.file.path,
			  wrinkles_flag: skin.WRINKLES_FLAG, // 皱纹（鱼尾纹、法令纹、川字纹）数组对象
			  color_flag: skin.COLOR_FLAG, // 肤色0
			  oil_flag: skin.OIL_FLAG, // 油份0
			  prose_flag: skin.PROSE_FLAG, // 毛孔（小，中，大）数组对象
			  originType: 'AR',
			  uuid: uuid,
			  shareUrl: shareUrl,
			  clientId: clientId
			})

			if(mobile) {
		  	skinSave.mobile = mobile
		  }

			yield skinSave.save()


			return (this.body = {
	  		code: 1,
	  		skin: skin,
	  		uuid:uuid,
	  		clientId: clientId,
	  		shareUrl: shareUrl
	  	})
	  }
	}else {

		let skindata = yield facepp.detect({
	  	file: this.request.body.files.file
	  })
		if(!skindata) {
			return (this.body = {code:0,err:'皮肤测试异常'})
		}

		// let _skin = facepp.findBigestFace(skindata.faces)

		// // adaptive old skin old Api
		// _skin.attribute=_skin.attributes
	 //  _skin.attribute.smiling=_skin.attribute.smile
	 //  _skin.face_id = _skin.face_token

	  let skin = yield facepp.skincloudtest({
	  	file: this.request.body.files.file
	  })

		if (oldSkin) {

			if (this.request.body.files && this.request.body.files.file && this.request.body.files.file.path) {
        this.request.body.files.file.path = this.request.body.files.file.path.split('public/')[1]
      }
      skin.Image_path = this.request.body.files.file.path

  		oldSkin.image_path = this.request.body.files.file.path
		  oldSkin.water_flag = skin.WATER_FLAG
		  oldSkin.inflammation_flag = skin.INFLAMMATION_FLAG
		  oldSkin.wrinkles_flag = skin.WRINKLES_FLAG
		  oldSkin.color_flag = skin.COLOR_FLAG
		  oldSkin.oil_flag = skin.OIL_FLAG
		  oldSkin.prose_flag = skin.PROSE_FLAG
		  oldSkin.originType = 'MO'
		  oldSkin.testTimes = oldSkin.testTimes + 1

	  	yield oldSkin.save()
	  	return (this.body = {
	  		code: 1,
	  		skin: skin,
	  		uuid: oldSkin.uuid,
	  		clientId: clientId,
	  		shareUrl: oldSkin.shareUrl
	  	})
	  } else {

	  	if (this.request.body.files && this.request.body.files.file && this.request.body.files.file.path) {
        this.request.body.files.file.path = this.request.body.files.file.path.split('public/')[1]
      }
      skin.Image_path = this.request.body.files.file.path

	  	let shareUrl = config.reportSkinUrl + '?uuid=' + uuid + '&clientId=' + clientId
	  	const skinSave = new Skin({
	  		image_path: this.request.body.files.file.path,
				water_flag: skin.WATER_FLAG, // 水分0
			  inflammation_flag: skin.INFLAMMATION_FLAG, // 炎症（无、轻微、中、严重）数组对象
			  wrinkles_flag: skin.WRINKLES_FLAG, // 皱纹（鱼尾纹、法令纹、川字纹）数组对象
			  color_flag: skin.COLOR_FLAG, // 肤色0
			  oil_flag: skin.OIL_FLAG, // 油份0
			  prose_flag: skin.PROSE_FLAG, // 毛孔（小，中，大）数组对象
			  originType: 'MO',
			  uuid: uuid,
			  shareUrl: shareUrl,
			  clientId: clientId
			})

			yield skinSave.save()

			return (this.body = {
	  		code: 1,
	  		skin: skin,
	  		uuid:uuid,
	  		clientId: clientId,
	  		shareUrl: shareUrl
	  	})
	  }
	}
 }




/**
 * @api {post} /skinTestUrl 根据 uuid 或者 手机号码 和 图片地址 生成皮肤测试的值
 * @apiName postSkinTest
 * @apiGroup Skin
 * @apiPermission anyBody
 *
 * @apiDescription 在用户 B 根据 uuid 或者 手机号码 产生皮肤测试的值.
 *
 * @apiParam {String} uuid 前端产品的一个随机字符串 uuid，来作为这个用户的唯一ID.
 * @apiParam {String} clientId 美容院或者分享连接里面的 clientId.
 * @apiParam {String} mobile 可选参数，AR 后台用来获取某个用户的皮肤测试值.
 * @apiParam {String} deviceId 可选参数，AR专用 后台用来判断这个设备是否有权限测试.
 * @apiParam {String} file 阿里云图片文件名.
 *
 * @apiExample Example usage:
 * http://test.legle.cc/skinTest
 *
 * @apiSuccess {Number}   code   1 代表成功，0 代表失败.
 * @apiSuccess {Object}   looks   测试返回值.
 *
 * @apiError code 0.
 * @apiError err   err message.
 *
 * @apiErrorExample Response (example):
 *    HTTP/1.1 200 Ok
 *		{
 *	    "code":1,
 *	    "skin":{
 *	        "WATER_FLAG":Array[1],
 *	        "INFLAMMATION_FLAG":Array[1],
 *	        "WRINKLES_FLAG":Array[3],
 *	        "COLOR_FLAG":Array[1],
 *	        "OIL_FLAG":Array[1],
 *	        "PROSE_FLAG":Array[1]
 *	    },
 *	    "shareUrl":"http://wxarpt.pjnice.com/arpt-wxarpt/report.html?uuid=1234&clientId=59152155a88c48266d2ec6a7"
 *		}
 */
exports.skinTestUrl = function *(next) {
	console.log('###', this.request.body)
	let body = this.request.body
	let uuid = body.uuid || ''
	let clientId = body.clientId || ''
	let deviceId = body.deviceId
	let mobile = body.mobile || ''
	let imgUrl = body.file

	if(this.session.client && this.session.client.clientId) {
		clientId = this.session.client.clientId
	}

	if(!clientId || clientId === 'undefined') {
		return (this.body = {code:0,err:'clientId not found'})
	}

	if(!uuid) {
		uuid = Math.random().toString(36).substring(3, 11)
	}

	if(!imgUrl) {
  	return (this.body = {code:0,err:'没有收到文件'})
  } else {
  	imgUrl = config.aliyun.ossHost + '/' + imgUrl
  }

	let client = yield Client.findOne({_id: clientId}).exec()
	if(!client) {
        return (this.body = {
            code: 0,
            err: '用户不存在'
        })
	}
	let skinRole = client.skinRole
	let toDate = skinRole.to
	let timeNow = new Date()
	timeNow = timeNow.getTime()

	if(!skinRole.role || (timeNow - toDate) > 0) {
		return (this.body = {
			code: 0,
			err: '没有使用权限'
		})
	}

	let oldSkin = yield Skin.findOne({clientId: clientId, uuid: uuid}).exec()
	if(mobile) {
		let mobileSkin = yield Skin.findOne({clientId: clientId, mobile: mobile}).exec()
		if(mobileSkin) {
			oldSkin = mobileSkin
		}
	}

	if(deviceId) {

		let shareUrl = config.reportSkinUrl + '?uuid=' + uuid + '&clientId=' + clientId

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

	 //  let skindata = yield facepp.detect()

		// if(!skindata) {
		// 	return (this.body = {code:0,err:'皮肤测试异常'})
		// }

		// let _skin = facepp.findBigestFace(skindata.faces)

		// // adaptive old skin old Api
		// _skin.attribute=_skin.attributes
	 //  _skin.attribute.smiling=_skin.attribute.smile
	 //  _skin.face_id = _skin.face_token

	  let skin = yield facepp.skincloudtestImg(imgUrl)

	  if (oldSkin) {

      skin.Image_path = imgUrl

		  oldSkin.water_flag = skin.WATER_FLAG
		  oldSkin.inflammation_flag = skin.INFLAMMATION_FLAG
		  oldSkin.image_path = imgUrl
		  oldSkin.wrinkles_flag = skin.WRINKLES_FLAG
		  oldSkin.color_flag = skin.COLOR_FLAG
		  oldSkin.oil_flag = skin.OIL_FLAG
		  oldSkin.prose_flag = skin.PROSE_FLAG
		  oldSkin.originType = 'AR'
		  oldSkin.testTimes = oldSkin.testTimes + 1

		  if(mobile) {
		  	oldSkin.mobile = mobile
		  }

	  	yield oldSkin.save()

		  return (this.body = {
	  		code: 1,
	  		skin: skin,
	  		uuid: oldSkin.uuid,
	  		clientId: clientId,
	  		shareUrl: oldSkin.shareUrl
	  	})

	  } else {

	    skin.Image_path = imgUrl

	  	const skinSave = new Skin({
				water_flag: skin.WATER_FLAG, // 水分0
			  inflammation_flag: skin.INFLAMMATION_FLAG, // 炎症（无、轻微、中、严重）数组对象
			  image_path: imgUrl,
			  wrinkles_flag: skin.WRINKLES_FLAG, // 皱纹（鱼尾纹、法令纹、川字纹）数组对象
			  color_flag: skin.COLOR_FLAG, // 肤色0
			  oil_flag: skin.OIL_FLAG, // 油份0
			  prose_flag: skin.PROSE_FLAG, // 毛孔（小，中，大）数组对象
			  originType: 'AR',
			  uuid: uuid,
			  shareUrl: shareUrl,
			  clientId: clientId
			})

			if(mobile) {
		  	skinSave.mobile = mobile
		  }

			yield skinSave.save()


			return (this.body = {
	  		code: 1,
	  		skin: skin,
	  		uuid:uuid,
	  		clientId: clientId,
	  		shareUrl: shareUrl
	  	})
	  }
	}else {

		// let skindata = yield facepp.detect({
	 //  	file: this.request.body.files.file
	 //  })
		// if(!skindata) {
		// 	return (this.body = {code:0,err:'皮肤测试异常'})
		// }

		// let _skin = facepp.findBigestFace(skindata.faces)

		// // adaptive old skin old Api
		// _skin.attribute=_skin.attributes
	 //  _skin.attribute.smiling=_skin.attribute.smile
	 //  _skin.face_id = _skin.face_token

	  let skin = yield facepp.skincloudtestImg(imgUrl)

		if (oldSkin) {
      skin.Image_path = imgUrl

  		oldSkin.image_path = imgUrl
		  oldSkin.water_flag = skin.WATER_FLAG
		  oldSkin.inflammation_flag = skin.INFLAMMATION_FLAG
		  oldSkin.wrinkles_flag = skin.WRINKLES_FLAG
		  oldSkin.color_flag = skin.COLOR_FLAG
		  oldSkin.oil_flag = skin.OIL_FLAG
		  oldSkin.prose_flag = skin.PROSE_FLAG
		  oldSkin.originType = 'MO'
		  oldSkin.testTimes = oldSkin.testTimes + 1

	  	yield oldSkin.save()
	  	return (this.body = {
	  		code: 1,
	  		skin: skin,
	  		uuid: oldSkin.uuid,
	  		clientId: clientId,
	  		shareUrl: oldSkin.shareUrl
	  	})
	  } else {

      skin.Image_path = imgUrl

	  	let shareUrl = config.reportSkinUrl + '?uuid=' + uuid + '&clientId=' + clientId
	  	const skinSave = new Skin({
	  		image_path: imgUrl,
				water_flag: skin.WATER_FLAG, // 水分0
			  inflammation_flag: skin.INFLAMMATION_FLAG, // 炎症（无、轻微、中、严重）数组对象
			  wrinkles_flag: skin.WRINKLES_FLAG, // 皱纹（鱼尾纹、法令纹、川字纹）数组对象
			  color_flag: skin.COLOR_FLAG, // 肤色0
			  oil_flag: skin.OIL_FLAG, // 油份0
			  prose_flag: skin.PROSE_FLAG, // 毛孔（小，中，大）数组对象
			  originType: 'MO',
			  uuid: uuid,
			  shareUrl: shareUrl,
			  clientId: clientId
			})

			yield skinSave.save()

			return (this.body = {
	  		code: 1,
	  		skin: skin,
	  		uuid:uuid,
	  		clientId: clientId,
	  		shareUrl: shareUrl
	  	})
	  }
	}
 }

