'use strict'

const mongoose = require('mongoose')
const StarTest = mongoose.model('Startest')
const Star = mongoose.model('Star')
const Client = mongoose.model('Client')
const FaceSet = mongoose.model('FaceSet')
const config = require('../../config/config')
const facepp = require('../service/facepp')
const request = require('request-promise')


// 爬虫 明星数据
exports.getStars = function *(next) {
	let body = config.starFaceSet.body

	let rows = []

	for (var j = 0; j < 15; j++) {
		let reqBody = {
			appid: body.appid,
			core: body.core,
			data: body.data,
			token: body.token
		}
		reqBody.data.offset = j * 15
		let stars = yield facepp.getStars(reqBody)
		let row = stars.result.rows
		rows = rows.concat(row)
	}

	for (var i = 0, l = rows.length; i < l; i++) {
		let item = rows[i]
		let newStar = new Star ({
			star_id: item.star_id,
		  name: item.name,
		  sex: item.sex,
		  picture: config.starFaceSetImg + item.picture,
		  introduction: item.introduction,
		  face_token: item.face_token,
		  country_id: item.country_id,
		  userid: item.userid,
		  extend: item.extend,
		  country: item.country
		})

		yield newStar.save()
	}

	this.body = {
		code: 1,
		stars: rows
	}

}

exports.starInputTest = function *(next) {
	const stars = yield Star.find().exec()
	if(!stars || stars.length === 0) {
		return (this.body = {
			code: 0,
			err: '没有找到数据'
		})
	}

	for(var i = 0; i < stars.length; i++) {
		var star = stars[i]
		let _face = star.extend
		_face = JSON.parse(_face)
		_face = _face[0]

		if(_face) {
			// adaptive old skin old Api
			_face.attribute = _face.attributes
		  _face.attribute.smiling = _face.attribute.smile
		  _face.face_id = _face.face_token

		  let looks = yield facepp.cloudtest(_face)
			let skin = yield facepp.skincloudtestUrl(stars[i].picture)

			star.faceTest = looks
			star.skinTest = skin

			yield star.save()
		}
	}

	this.body = {
		code: 1,
		err: star
	}
}

exports.addFaceToFaceSet = function *(next) {

	let country = this.query.country
	let sex = this.query.sex
	sex = Number(sex)

	if(!country) {
		return (this.body = {
			code: 0,
			err: '参数错误'
		})
	}

	let faceset = yield FaceSet.findOne({name: country, sex: sex}).exec()

    if(!faceset) {
        return (this.body = {code:0,err:'该图片库不存在，请添加图片库'})
    }
    let faceset_token = faceset.faceset_token

	let stars = yield Star.find({'country.name': country, sex:sex}).exec()
	let _stars = []

	if(faceset_token) {
		for (var i = 0, l = stars.length; i < l; i++) {
			let face_token = stars[i].face_token
			if(face_token && faceset_token) {	
				let searchResult = yield facepp.addFace(face_token, faceset_token)
				_stars.push(searchResult)
			}
		}

		return (this.body = {
			code: 1,
			err: _stars
		})
	}


	this.body = {
		code: 1,
		err: _stars
	}
}

exports.starDetect = function *(next) {
	let country = this.query.country

	if(!country) {
		return (this.body = {
			code: 0,
			err: '参数错误'
		})
	}

	let stars = yield Star.find({'country.name': country}).exec()
	let _stars = []


	for (var i = 0, l = stars.length; i < l; i++) {

		let star = stars[i]
		let fileUrl = star.picture
		let fileName = fileUrl.split('star/')[1]
	  let type = fileUrl.split('.')[4]
	  let locaFile = 'public/star/' + fileName

	  let file = {
	  	file: {
		  	path: locaFile,
		  	name: fileName,
		  	type: type
		  }
		}
	  
	  if(fileUrl) {
		  let detect = yield facepp.detect(file)
		  star.extend = detect
		  star.face_token = detect.faces[0].face_token
		  yield star.save()
		  _stars.push(fileUrl)
	  }

	// let star = stars[i]
	// star.face_token = star.extend.faces[0].face_token
	// yield star.save()
	}

	this.body = {
		code: 1,
		err: _stars
	}
}

/**
 * @api {get} /starTest 获取明星面对面的测试值
 * @apiName getStarTest
 * @apiGroup Star
 * @apiPermission anyBody
 *
 * @apiDescription 在用户 B 打开用户 A 分享出来的连接，根据 uuid 或者 手机号码 获取明星面对面测试的值.
 *
 * @apiParam {String} uuid 分享连接里面的 uuid.
 * @apiParam {String} mobile 可选参数，AR 后台用来获取某个用户的颜值测试值.
 * @apiParam {String} clientId 必选参数，分享连接里面的 clientId.
 *
 * @apiExample Example usage:
 * http://test.legle.cc/starTest?uuid=8svvmhnt
 *
 * @apiSuccess {Number}   code   1 代表成功，0 代表失败.
 * @apiSuccess {Object}   star   看下面示例.
 *
 * @apiError code 0  .
 * @apiError err   err message.
 *
 * @apiErrorExample Response (example):
 *     HTTP/1.1 200 Ok
 *     {
 *       "code":1,
 *		    "uuid":"6x0g55e0",
 *		    "image_path":"....",
 *		    "clientId":"591984001573d4687d6b5ded",
 *		    "shareUrl":"http://arpt.pjnice.com/arpt-wxarpt/report.html?uuid=6x0g55e0&clientId=591984001573d4687d6b5ded",
 *		    "confidence":63.504,
 *		    "face":Object{...},
 *		    "skin":Object{...},
 *		    "country":"中国",
 *		    "sex":0,
 *		    "starData":{
 *		        "_id":"591bbbce14cebc8c010a341f",
 *		        "star_id":19,
 *		        "name":"陈乔恩 ",
 *		        "sex":0,
 *		        "picture":"http://120.132.68.45:3004/public/images/star/1492151197260.png",
 *		        "introduction":"陈乔恩随七朵花团体进军乐坛。2005年，其主演的爱情喜剧《王子变青蛙》打破台湾偶像剧收视纪录。 ",
 *		        "face_token":"6198e6319e7bdca7bb9b164ac22af188",
 *		        "country_id":1,
 *		        "userid":"002",
 *		        "extend":Object{...},
 *		        "country":Object{...},
 *		        "__v":0,
 *		        "faceTest":Object{...},
 *		        "skinTest":Object{...},
 *		        "meta":{
 *		            "updatedAt":"2017-05-17T09:05:07.909Z",
 *		            "createdAt":"2017-05-17T02:56:14.969Z"
 *		        }
 *		    }
 *     	}
 */
exports.getStarTest = function *(next) {
	let uuid = this.query.uuid || ''
	// let mobile = this.query.mobile
	let clientId = this.query.clientId || ''
	let app = this.query.app

	if(!uuid) {
		return (this.body = {code:0,err:'请求参数不能为空'})
	}

	let star = yield StarTest.findOne({uuid: uuid, clientId: clientId}).exec()

	if(!star) {
		return (this.body = {
			code: 0,
			err: '没有找到明星面对面测试数据'
		})
	}

	function imgCrop(src) {
    var _src = src + '?x-oss-process=image/info'
    return new Promise(function(resolve, reject) {
      let x,y,w,h,mw,mh
      request(_src).then(function(data) {
          try{
            data = JSON.parse(data)
          } catch(errr) {
            data = data
          }
      　　mw = data.ImageWidth.value
          mw = Number(mw)
      　　mh = data.ImageHeight.value
          mh = Number(mh)
          if(mh > mw) {
            h = mw * 1.143
            w = mw
            x = 0
            y = (mh - h)/2
          } else {
              h = mh
              w = mh * 0.875
              y = 0
              x = (mw - w)/2
          }
          x = Math.floor(x)
          y = Math.floor(y)
          w = Math.floor(w)
          h = Math.floor(h)
          console.log(x,y,w,h)
          resolve(src + '?x-oss-process=image/crop,x_'+ x +',y_'+ y +',w_'+ w +',h_' + h)
        })
      })
  }

	// if(mobile && clientId) {
	// 	let mstar = yield StarTest.findOne({mobile: mobile.toString(), clientId: clientId}).exec()
	// 	if(mstar) {
	// 		star = mstar
	// 	}
	// }
	let confidence
	let starData
	if(star.search && star.search.confidence) {
		confidence = star.search.confidence
	} else if(star.starInfo[star.starInfo.length - 1] && star.starInfo[star.starInfo.length - 1].confidence) {
		confidence = star.starInfo[star.starInfo.length - 1].confidence
	}

	if(star.starInfo && star.starInfo.length > 0 && star.starInfo[star.starInfo.length - 1].star) {
		starData = star.starInfo[star.starInfo.length - 1].star
		if(star.image_path.indexOf('.aliyuncs.com') > -1) {
			star.image_path = yield imgCrop(star.image_path)
		}
	} else {
		starData = star.starInfo
	}

	if(app == 'yes') {
		return (this.body = {
			code: 1,
			uuid: star.uuid,
			clientId: clientId,
			image_path: star.image_path,
			shareUrl: star.shareUrl,
			sex: star.sex,
			starsData: star.starInfo
		})
	}

	this.body = {
		code: 1,
		uuid: star.uuid,
		image_path: star.image_path,
		clientId: clientId,
		shareUrl: star.shareUrl,
		confidence: confidence,
		face: star.faceTest,
		skin: star.skinTest,
		sex: star.sex,
		country: star.country,
		starsData: star.starInfo,
		starData: starData
	}
}



/**
 * @api {post} /starTestUrl 明星面对面提交测试
 * @apiName postStarTestUrl
 * @apiGroup Star
 * @apiPermission anyBody
 *
 * @apiDescription 在用户 B 根据 uuid 或者 手机号码 产生颜值测试的值.
 *
 * @apiParam {String} uuid 前端产品的一个随机字符串 uuid，来作为这个用户的唯一ID.
 * @apiParam {String} clientId 美容院或者分享连接里面的 clientId.
 * @apiParam {String} mobile 可选参数，AR 后台用来获取某个用户的测试值.
 * @apiParam {String} deviceId 可选参数，AR专用 后台用来判断这个设备是否有权限测试.
 * @apiParam {Number} sex 0代表女生，1代表男士.
 * @apiParam {Number} country_id  1代表‘中国',2代表‘韩国',3代表‘马来西亚',4代表‘美国',5代表‘新加坡' 目前只支持 1 和 2
 * @apiParam {String} file 阿里云图片地址.
 *
 * @apiExample Example usage:
 * http://test.legle.cc/starTestUrl
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
 *		    "clientId":"591984001573d4687d6b5ded",
 *		    "shareUrl":"http://arpt.pjnice.com/arpt-wxarpt/report.html?uuid=6x0g55e0&clientId=591984001573d4687d6b5ded",
 *		    "confidence":63.504,
 *		    "face":Object{...},
 *		    "skin":Object{...},
 *		    "country":"中国",
 *		    "sex":0,
 *		    "starData":{
 *		        "_id":"591bbbce14cebc8c010a341f",
 *		        "star_id":19,
 *		        "name":"陈乔恩 ",
 *		        "sex":0,
 *		        "picture":"http://120.132.68.45:3004/public/images/star/1492151197260.png",
 *		        "introduction":"陈乔恩随七朵花团体进军乐坛。2005年，其主演的爱情喜剧《王子变青蛙》打破台湾偶像剧收视纪录。 ",
 *		        "face_token":"6198e6319e7bdca7bb9b164ac22af188",
 *		        "country_id":1,
 *		        "userid":"002",
 *		        "extend":Object{...},
 *		        "country":Object{...},
 *		        "__v":0,
 *		        "faceTest":Object{...},
 *		        "skinTest":Object{...},
 *		        "meta":{
 *		            "updatedAt":"2017-05-17T09:05:07.909Z",
 *		            "createdAt":"2017-05-17T02:56:14.969Z"
 *		        }
 *		    }
 *     	}
 */
exports.starTestUrl = function *(next) {
	console.log(this.request.body)
	let body = this.request.body
	let uuid = body.uuid || ''
	let clientId = body.clientId || ''
	let deviceId = body.deviceId
	let mobile = body.mobile || ''
	let country_id = body.country_id
	let sex = body.sex
	let imgUrl = body.file

	sex = Number(sex)


	body.country = config.countrys[country_id]

	if(this.session.client && this.session.client.clientId) {
		clientId = this.session.client.clientId
	}


	if(!body.country) {
		return (this.body = {code:0,err:'国家必填'})
	}

	if(!clientId || clientId === 'undefined' || clientId === 'null') {
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
		return (this.body = {code:0,err:'client not found'})
	}

	let starRole = client.starRole
	let toDate = starRole.to
	let timeNow = new Date()
	timeNow = timeNow.getTime()

	if(!starRole.role || (timeNow - toDate) > 0) {
		return (this.body = {
			code: 0,
			err: '没有使用权限'
		})
	}

	let oldStar = yield StarTest.findOne({clientId: clientId, uuid: uuid}).exec()
	if(mobile) {
		let mobileStar = yield StarTest.findOne({clientId: clientId, mobile: mobile}).exec()
		if(mobileStar) {
			oldStar = mobileStar
		}
	}

	if(deviceId) {

		let shareUrl = config.reportStarUrl + '?uuid=' + uuid + '&clientId=' + clientId

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

    // try {
    //     yield facepp.gm(this.request.body.files.file.path)
    // } catch(catchErr) {
    //     console.log('catchErr', catchErr)
    // }
    let stardata = yield facepp.detectUrl(imgUrl)

		if(!stardata) {
			return (this.body = {code:0,err:'皮肤测试异常'})
		}

		let _skin = facepp.findBigestFace(stardata.faces)

		if(!_skin) {
			return (this.body = {code:0,err:'人脸识别失败'})
		}

		// adaptive old skin old Api
		_skin.attribute=_skin.attributes
	  _skin.attribute.smiling=_skin.attribute.smile
	  _skin.face_id = _skin.face_token

	  let skin = yield facepp.skincloudtestImg(imgUrl)

		let faceset = yield FaceSet.findOne({name: body.country, sex: sex}).exec()

		if(!faceset) {
			return (this.body = {
				code: 0,
				err: 'faceset not found'
			})
		}

		let faceSetToken = faceset.faceset_token


		if(!faceSetToken) {
			return (this.body = {
				code: 0,
				err: 'faceSetToken not found'
			})
		}

	  let looks = yield facepp.cloudtest(_skin)

	  let search = yield facepp.searchFaceset(_skin.face_token, faceSetToken)

	  if(!search.results || !search.results[0] || !search.results[0].confidence || !search.results[0].face_token) {
	  	return (this.body = {code:0,err:'face 查找失败'})
	  }

	  let confidence = search.results[0].confidence

	  let face_token = search.results[0].face_token

	  let starData = yield Star.findOne({face_token: face_token}).exec()

	  if(!starData && search.results[1].confidence) {
	  	search.results[1].confidence
	  	starData = yield Star.findOne({face_token: search.results[1].face_token}).exec()
	  }

	  if(!starData) {
	  	return (this.body = {
	  		code: 0,
	  		err: '没有找到和他相像的明星'
	  	})
	  }

	  if (oldStar) {
		  oldStar.search.confidence = confidence
		  oldStar.search.face_token = face_token
		  oldStar.skinTest = skin
		  oldStar.faceTest = looks
		  oldStar.image_path = imgUrl
		  oldStar.sex = sex
		  oldStar.country = body.country
		  oldStar.country_id = body.country_id
		  oldStar.starInfo = starData
		  oldStar.originType = 'AR'
		  oldStar.testTimes = oldStar.testTimes + 1

		  if(mobile) {
		  	oldStar.mobile = mobile
		  }

	  	yield oldStar.save()

		  return (this.body = {
	  		code: 1,
	  		uuid: oldStar.uuid,
	  		clientId: clientId,
	  		image_path: oldStar.image_path,
	  		shareUrl: oldStar.shareUrl,
	  		confidence: confidence,
	  		face: looks,
	  		skin: skin,
	  		country: body.country,
	  		sex: sex,
	  		starData: starData
	  	})

	  } else {

	  	const starSave = new StarTest({
				skinTest: skin,
			  faceTest: looks, 
			  image_path: imgUrl,
			  sex: sex,
			  country: body.country,
			  country_id: body.country_id,
			  starInfo: starData,
			  originType: 'AR',
			  uuid: uuid,
			  shareUrl: shareUrl,
			  clientId: clientId,
			  search: {
			  	confidence: confidence,
			  	face_token: face_token
			  }
			})

			if(mobile) {
		  	starSave.mobile = mobile
		  }

			yield starSave.save()

			return (this.body = {
	  		code: 1,
	  		uuid: uuid,
	  		clientId: clientId,
	  		image_path: imgUrl,
	  		shareUrl: shareUrl,
	  		confidence: confidence,
	  		face: looks,
	  		skin: skin,
	  		country: body.country,
	  		sex: sex,
	  		starData: starData
	  	})
	  }
	}else {

    // try {
    //     yield facepp.gm(this.request.body.files.file.path)
    // } catch(catchErr) {
    //     console.log('catchErr', catchErr)
    // }
    let stardata = yield facepp.detectUrl(imgUrl)

		if(!stardata) {
			return (this.body = {code:0,err:'皮肤测试异常'})
		}

		let _skin = facepp.findBigestFace(stardata.faces)

		// adaptive old skin old Api
		_skin.attribute=_skin.attributes
	  _skin.attribute.smiling=_skin.attribute.smile
	  _skin.face_id = _skin.face_token

	  let skin = yield facepp.skincloudtestImg(imgUrl)

	  if(!_skin) {
			return (this.body = {code:0,err:'人脸识别失败'})
		}

	  let looks = yield facepp.cloudtest(_skin)

		let faceset = yield FaceSet.findOne({name: body.country, sex: sex}).exec()

		if(!faceset) {
			return (this.body = {
				code: 0,
				err: 'faceset not found'
			})
		}

		let faceSetToken = faceset.faceset_token

		console.log('faceSetToken', faceSetToken)

		if(!faceSetToken) {
			return (this.body = {
				code: 0,
				err: 'faceSetToken not found'
			})
		}

	  let search = yield facepp.searchFaceset(_skin.face_token, faceSetToken)

	  if(!search.results || !search.results[0] || !search.results[0].confidence || !search.results[0].face_token) {
	  	return (this.body = {code:0,err:'face 查找失败'})
	  }

	  let confidence = search.results[0].confidence

	  let face_token = search.results[0].face_token

	  let starData = yield Star.findOne({face_token: face_token}).exec()

	  if(!starData && search.results[1].confidence) {
	  	search.results[1].confidence
	  	starData = yield Star.findOne({face_token: search.results[1].face_token}).exec()
	  }

	  if(!starData) {
	  	return (this.body = {
	  		code: 0,
	  		err: '没有找到和他相像的明星'
	  	})
	  }

	  if (oldStar) {

		  oldStar.search.confidence = confidence
		  oldStar.search.face_token = face_token
		  oldStar.skinTest = skin
		  oldStar.faceTest = looks
		  oldStar.image_path = imgUrl
		  oldStar.sex = sex
		  oldStar.country = body.country
		  oldStar.country_id = body.country_id
		  oldStar.starInfo = starData
		  oldStar.originType = 'MO'
		  oldStar.testTimes = oldStar.testTimes + 1

		  if(mobile) {
		  	oldStar.mobile = mobile
		  }

	  	yield oldStar.save()

		  return (this.body = {
	  		code: 1,
	  		uuid: oldStar.uuid,
	  		clientId: clientId,
	  		image_path: oldStar.image_path,
	  		shareUrl: oldStar.shareUrl,
	  		confidence: confidence,
	  		face: looks,
	  		skin: skin,
	  		country: body.country,
	  		sex: sex,
	  		starData: starData
	  	})

	  } else {

	  	let shareUrl = config.reportStarUrl + '?uuid=' + uuid + '&clientId=' + clientId
	  	const starSave = new StarTest({
				skinTest: skin,
			  faceTest: looks,
			  image_path: imgUrl,
			  sex: sex,
			  country: body.country,
			  country_id: body.country_id,
			  starInfo: starData,
			  originType: 'MO',
			  uuid: uuid,
			  shareUrl: shareUrl,
			  clientId: clientId,
			  search: {
			  	confidence: confidence,
			  	face_token: face_token
			  }
			})

			if(mobile) {
		  	starSave.mobile = mobile
		  }

			yield starSave.save()

			return (this.body = {
	  		code: 1,
	  		uuid: uuid,
	  		clientId: clientId,
	  		image_path: imgUrl,
	  		confidence: confidence,
	  		face: looks,
	  		skin: skin,
	  		country: body.country,
	  		sex: sex,
	  		starData: starData
	  	})
	  }
  }
}

/**
 * @api {post} /pcStarTest pc端 明星面对面提交测试
 * @apiName pcStarTest
 * @apiGroup PcStarTest
 * @apiPermission anyBody
 *
 * @apiDescription 在用户 B 根据 uuid 或者 手机号码 pc端 明星面对面提交测试.
 *
 * @apiParam {String} clientId 美容院或者分享连接里面的 clientId.
 * @apiParam {String} app 如果是移动端测试 app = 'yes'.
 * @apiParam {String} deviceId 可选参数，Pc专用 后台用来判断这个设备是否有权限测试，移动端不用这个字段.
 * @apiParam {Number} sex 0代表女生，1代表男士.
 * @apiParam {String} file 上传到阿里云后得到的不带阿里云 host 的 图片路径如：star-test/156177833271501495175.jpg
 *
 * @apiExample Example usage:
 * http://test.legle.cc/pcStarTest
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
 *		    "clientId":"591984001573d4687d6b5ded",
 *		    "shareUrl":"http://arpt.pjnice.com/arpt-wxarpt/report.html?uuid=6x0g55e0&clientId=591984001573d4687d6b5ded",
 *		    "confidence":63.504,
 *		    "face":Object{...},
 *		    "skin":Object{...},
 *		    "country":"中国",
 *		    "sex":0,
 *		    "starData": [{star1},{star2},{star3},{star4}]
 *     	}
 */
exports.pcStarTest = function *(next) {
	console.log(this.request.body)
	let body = this.request.body
	let clientId = body.clientId || ''
	let deviceId = body.deviceId
	let sex = body.sex
	let imgUrl = body.file

	let app = body.app

	sex = Number(sex)

	if(this.session.client && this.session.client.clientId) {
		clientId = this.session.client.clientId
	}


	if(!clientId || clientId === 'undefined' || clientId === 'null') {
		return (this.body = {code:0,err:'clientId not found'})
	}

	let	uuid = Math.random().toString(36).substring(3, 11)

  if(!imgUrl) {
  	return (this.body = {code:0,err:'没有收到文件'})
  } else {
  	imgUrl = config.aliyun.ossHost + '/' + imgUrl
  }

	let client = yield Client.findOne({_id: clientId}).exec()

	if(!client) {
		return (this.body = {code:0,err:'client not found'})
	}

	// check role
	let starRole = client.starRole
	let toDate = starRole.to
	let timeNow = new Date()
	timeNow = timeNow.getTime()

	if(!starRole.role || (timeNow - toDate) > 0) {
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

		// adaptive old skin old Api
	_detect.attribute=_detect.attributes
  _detect.attribute.smiling=_detect.attribute.smile
  _detect.face_id = _detect.face_token

	// 皮肤测试
  let skin = yield facepp.skincloudtestImg(imgUrl)

	let faceset = yield FaceSet.findOne({sex: sex, name: '全球'}).exec()

	if(!faceset) {
		return (this.body = {
			code: 0,
			err: 'faceset not found'
		})
	}

	let faceSetToken = faceset.faceset_token


	if(!faceSetToken) {
		return (this.body = {
			code: 0,
			err: 'faceSetToken not found'
		})
	}

	// 颜值测试
  let looks = yield facepp.cloudtest(_detect)

  // 找相似明星
  let search = yield facepp.searchFaceset(_detect.face_token, faceSetToken)
  console.log(search)

  if(!search.results || !search.results[0] || !search.results[0].confidence || !search.results[0].face_token) {
  	return (this.body = {code:0,err:'face 查找失败'})
  }

  let starsData = []

  for (var i = search.results.length - 1; i >= 0; i--) {
  	if(search.results[i] && search.results[i].face_token) {
	  	let starData = yield Star.findOne({face_token: search.results[i].face_token}, {name: 1, sex: 1, picture: 1, introduction: 1, country_id: 1, country: 1}).exec()
	  	let start = {
	  		confidence: search.results[i].confidence,
	  		star: starData
	  	}
	  	starsData.push(start)
  	}
  }


  if(!starsData.length === 0) {
  	return (this.body = {
  		code: 0,
  		err: '没有找到和他相像的明星'
  	})
  }

  let originType = 'AR'
  if(app == 'yes') {
  	originType = 'MO'
  }

	const starSave = new StarTest({
		skinTest: skin,
	  faceTest: looks, 
	  image_path: imgUrl,
	  sex: sex,
	  starInfo: starsData,
	  originType: originType,
	  uuid: uuid,
	  shareUrl: shareUrl,
	  clientId: clientId
	})

	yield starSave.save()

	if(app == 'yes') {
		return (this.body = {
			code: 1,
			uuid: uuid,
			clientId: clientId,
			image_path: imgUrl,
			shareUrl: shareUrl,
			sex: sex,
			starsData: starsData
		})
	}

	this.body = {
		code: 1,
		uuid: uuid,
		clientId: clientId,
		image_path: imgUrl,
		shareUrl: shareUrl,
		face: looks,
		skin: skin,
		sex: sex,
		starsData: starsData
	}


}


/**
 * @api {post} /starTest 明星面对面提交测试老接口
 * @apiName postStarTest
 * @apiGroup Star
 * @apiPermission anyBody
 *
 * @apiDescription 在用户 B 根据 uuid 或者 手机号码 产生颜值测试的值.
 *
 * @apiParam {String} uuid 前端产品的一个随机字符串 uuid，来作为这个用户的唯一ID.
 * @apiParam {String} clientId 美容院或者分享连接里面的 clientId.
 * @apiParam {String} mobile 可选参数，AR 后台用来获取某个用户的测试值.
 * @apiParam {String} deviceId 可选参数，AR专用 后台用来判断这个设备是否有权限测试.
 * @apiParam {Number} sex 0代表女生，1代表男士.
 * @apiParam {Number} country_id  1代表‘中国',2代表‘韩国',3代表‘马来西亚',4代表‘美国',5代表‘新加坡' 目前只支持 1 和 2
 * @apiParam {Object} data 用来包裹上面六个参数.
 * @apiParam {file} file 上传的图片，前端压缩后上传, 不得大于 2m.
 *
 * @apiExample Example usage:
 * http://test.legle.cc/starTest
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
 *		    "clientId":"591984001573d4687d6b5ded",
 *		    "shareUrl":"http://arpt.pjnice.com/arpt-wxarpt/report.html?uuid=6x0g55e0&clientId=591984001573d4687d6b5ded",
 *		    "confidence":63.504,
 *		    "face":Object{...},
 *		    "skin":Object{...},
 *		    "country":"中国",
 *		    "sex":0,
 *		    "starData":{
 *		        "_id":"591bbbce14cebc8c010a341f",
 *		        "star_id":19,
 *		        "name":"陈乔恩 ",
 *		        "sex":0,
 *		        "picture":"http://120.132.68.45:3004/public/images/star/1492151197260.png",
 *		        "introduction":"陈乔恩随七朵花团体进军乐坛。2005年，其主演的爱情喜剧《王子变青蛙》打破台湾偶像剧收视纪录。 ",
 *		        "face_token":"6198e6319e7bdca7bb9b164ac22af188",
 *		        "country_id":1,
 *		        "userid":"002",
 *		        "extend":Object{...},
 *		        "country":Object{...},
 *		        "__v":0,
 *		        "faceTest":Object{...},
 *		        "skinTest":Object{...},
 *		        "meta":{
 *		            "updatedAt":"2017-05-17T09:05:07.909Z",
 *		            "createdAt":"2017-05-17T02:56:14.969Z"
 *		        }
 *		    }
 *     	}
 */
exports.starTest = function *(next) {
	let body = this.request.body.fields.data
	body = JSON.parse(body)
	console.log(body)
	let uuid = body.uuid
	let clientId = body.clientId
	let deviceId = body.deviceId
	let mobile = body.mobile
	let country_id = body.country_id
	let sex = body.sex

	sex = Number(sex)


	body.country = config.countrys[country_id]

	if(this.session.client && this.session.client.clientId) {
		clientId = this.session.client.clientId
	}


	if(!body.country) {
		return (this.body = {code:0,err:'国家必填'})
	}

	if(!clientId || clientId === 'undefined' || clientId === 'null') {
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
		return (this.body = {code:0,err:'client not found'})
	}

	let starRole = client.starRole
	let toDate = starRole.to
	let timeNow = new Date()
	timeNow = timeNow.getTime()

	if(!starRole.role || (timeNow - toDate) > 0) {
		return (this.body = {
			code: 0,
			err: '没有使用权限'
		})
	}

	let oldStar = yield StarTest.findOne({clientId: clientId, uuid: uuid}).exec()
	if(mobile) {
		let mobileStar = yield StarTest.findOne({clientId: clientId, mobile: mobile}).exec()
		if(mobileStar) {
			oldStar = mobileStar
		}
	}

	if(deviceId) {

		let shareUrl = config.reportStarUrl + '?uuid=' + uuid + '&clientId=' + clientId

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

    try {
        yield facepp.gm(this.request.body.files.file.path)
    } catch(catchErr) {
        console.log('catchErr', catchErr)
    }
    let stardata = yield facepp.detect({
	  	file: this.request.body.files.file
	  })

		if(!stardata) {
			return (this.body = {code:0,err:'皮肤测试异常'})
		}

		let _skin = facepp.findBigestFace(stardata.faces)

		if(!_skin) {
			return (this.body = {code:0,err:'人脸识别失败'})
		}

		// adaptive old skin old Api
		_skin.attribute=_skin.attributes
	  _skin.attribute.smiling=_skin.attribute.smile
	  _skin.face_id = _skin.face_token

	  let skin = yield facepp.skincloudtest({
	  	file: this.request.body.files.file
	  })

	  let faceSetToken

		if(country_id === '1') {
			if(sex === 0) {
				faceSetToken = config.faceSetChinaWomen
			}
			if(sex === 1) {
				faceSetToken = config.faceSetChinaMan
			}
		}

		if(country_id === '2') {
			if(sex === 0) {
				faceSetToken = config.faceSetHanguoWomen
			}
			if(sex === 1) {
				faceSetToken = config.faceSetHanguoMan
			}
		}

		if(!faceSetToken) {
			return (this.body = {
				code: 0,
				err: 'faceSetToken not found'
			})
		}

	  let looks = yield facepp.cloudtest(_skin)

	  let search = yield facepp.searchFaceset(_skin.face_token, faceSetToken)

	  if(!search.results || !search.results[0] || !search.results[0].confidence || !search.results[0].face_token) {
	  	return (this.body = {code:0,err:'face 查找失败'})
	  }

	  let confidence = search.results[0].confidence

	  let face_token = search.results[0].face_token

	  let starData = yield Star.findOne({face_token: face_token}).exec()

	  if(!starData && search.results[1].confidence) {
	  	search.results[1].confidence
	  	starData = yield Star.findOne({face_token: search.results[1].face_token}).exec()
	  }

	  if(!starData) {
	  	return (this.body = {
	  		code: 0,
	  		err: '没有找到和他相像的明星'
	  	})
	  }

	  if (oldStar) {
	  	if (this.request.body.files && this.request.body.files.file && this.request.body.files.file.path) {
        this.request.body.files.file.path = this.request.body.files.file.path.split('public/')[1]
      }

		  oldStar.search.confidence = confidence
		  oldStar.search.face_token = face_token
		  oldStar.skinTest = skin
		  oldStar.faceTest = looks
		  oldStar.image_path = this.request.body.files.file.path
		  oldStar.sex = sex
		  oldStar.country = body.country
		  oldStar.country_id = body.country_id
		  oldStar.starInfo = starData
		  oldStar.originType = 'AR'
		  oldStar.testTimes = oldStar.testTimes + 1

		  if(mobile) {
		  	oldStar.mobile = mobile
		  }

	  	yield oldStar.save()

		  return (this.body = {
	  		code: 1,
	  		uuid: oldStar.uuid,
	  		clientId: clientId,
	  		image_path: oldStar.image_path,
	  		shareUrl: oldStar.shareUrl,
	  		confidence: confidence,
	  		face: looks,
	  		skin: skin,
	  		country: body.country,
	  		sex: sex,
	  		starData: starData
	  	})

	  } else {

	  	if (this.request.body.files && this.request.body.files.file && this.request.body.files.file.path) {
        this.request.body.files.file.path = this.request.body.files.file.path.split('public/')[1]
      }

	  	const starSave = new StarTest({
				skinTest: skin,
			  faceTest: looks, 
			  image_path: this.request.body.files.file.path,
			  sex: sex,
			  country: body.country,
			  country_id: body.country_id,
			  starInfo: starData,
			  originType: 'AR',
			  uuid: uuid,
			  shareUrl: shareUrl,
			  clientId: clientId,
			  search: {
			  	confidence: confidence,
			  	face_token: face_token
			  }
			})

			if(mobile) {
		  	starSave.mobile = mobile
		  }

			yield starSave.save()

			return (this.body = {
	  		code: 1,
	  		uuid: uuid,
	  		clientId: clientId,
	  		image_path: this.request.body.files.file.path,
	  		shareUrl: shareUrl,
	  		confidence: confidence,
	  		face: looks,
	  		skin: skin,
	  		country: body.country,
	  		sex: sex,
	  		starData: starData
	  	})
	  }
	}else {

    try {
        yield facepp.gm(this.request.body.files.file.path)
    } catch(catchErr) {
        console.log('catchErr', catchErr)
    }
    let stardata = yield facepp.detect({
	  	file: this.request.body.files.file
	  })

		if(!stardata) {
			return (this.body = {code:0,err:'皮肤测试异常'})
		}

		let _skin = facepp.findBigestFace(stardata.faces)

		// adaptive old skin old Api
		_skin.attribute=_skin.attributes
	  _skin.attribute.smiling=_skin.attribute.smile
	  _skin.face_id = _skin.face_token

	  let skin = yield facepp.skincloudtest({
	  	file: this.request.body.files.file
	  })

	  if(!_skin) {
			return (this.body = {code:0,err:'人脸识别失败'})
		}

	  let looks = yield facepp.cloudtest(_skin)

	  let faceSetToken

		if(country_id === '1') {
			if(sex === 0) {
				faceSetToken = config.faceSetChinaWomen
			}
			if(sex === 1) {
				faceSetToken = config.faceSetChinaMan
			}
		}

		if(country_id === '2') {
			if(sex === 0) {
				faceSetToken = config.faceSetHanguoWomen
			}
			if(sex === 1) {
				faceSetToken = config.faceSetHanguoMan
			}
		}

		console.log('faceSetToken', faceSetToken)

		if(!faceSetToken) {
			return (this.body = {
				code: 0,
				err: 'faceSetToken not found'
			})
		}

	  let search = yield facepp.searchFaceset(_skin.face_token, faceSetToken)

	  if(!search.results || !search.results[0] || !search.results[0].confidence || !search.results[0].face_token) {
	  	return (this.body = {code:0,err:'face 查找失败'})
	  }

	  let confidence = search.results[0].confidence

	  let face_token = search.results[0].face_token

	  let starData = yield Star.findOne({face_token: face_token}).exec()

	  if(!starData && search.results[1].confidence) {
	  	search.results[1].confidence
	  	starData = yield Star.findOne({face_token: search.results[1].face_token}).exec()
	  }

	  if(!starData) {
	  	return (this.body = {
	  		code: 0,
	  		err: '没有找到和他相像的明星'
	  	})
	  }

	  if (oldStar) {
	  	if (this.request.body.files && this.request.body.files.file && this.request.body.files.file.path) {
        this.request.body.files.file.path = this.request.body.files.file.path.split('public/')[1]
      }


		  oldStar.search.confidence = confidence
		  oldStar.search.face_token = face_token
		  oldStar.skinTest = skin
		  oldStar.faceTest = looks
		  oldStar.image_path = this.request.body.files.file.path
		  oldStar.sex = sex
		  oldStar.country = body.country
		  oldStar.country_id = body.country_id
		  oldStar.starInfo = starData
		  oldStar.originType = 'MO'
		  oldStar.testTimes = oldStar.testTimes + 1

		  if(mobile) {
		  	oldStar.mobile = mobile
		  }

	  	yield oldStar.save()

		  return (this.body = {
	  		code: 1,
	  		uuid: oldStar.uuid,
	  		clientId: clientId,
	  		image_path: oldStar.image_path,
	  		shareUrl: oldStar.shareUrl,
	  		confidence: confidence,
	  		face: looks,
	  		skin: skin,
	  		country: body.country,
	  		sex: sex,
	  		starData: starData
	  	})

	  } else {

	  	if (this.request.body.files && this.request.body.files.file && this.request.body.files.file.path) {
        this.request.body.files.file.path = this.request.body.files.file.path.split('public/')[1]
      }

	  	let shareUrl = config.reportStarUrl + '?uuid=' + uuid + '&clientId=' + clientId
	  	const starSave = new StarTest({
				skinTest: skin,
			  faceTest: looks,
			  image_path: this.request.body.files.file.path,
			  sex: sex,
			  country: body.country,
			  country_id: body.country_id,
			  starInfo: starData,
			  originType: 'MO',
			  uuid: uuid,
			  shareUrl: shareUrl,
			  clientId: clientId,
			  search: {
			  	confidence: confidence,
			  	face_token: face_token
			  }
			})

			if(mobile) {
		  	starSave.mobile = mobile
		  }

			yield starSave.save()

			return (this.body = {
	  		code: 1,
	  		uuid: uuid,
	  		clientId: clientId,
	  		clientId: clientId,
	  		image_path: this.request.body.files.file.path,
	  		confidence: confidence,
	  		face: looks,
	  		skin: skin,
	  		country: body.country,
	  		sex: sex,
	  		starData: starData
	  	})
	  }
  }
}






