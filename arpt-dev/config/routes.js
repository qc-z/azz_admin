'use strict'

const User = require('../app/controllers/users')
const Client = require('../app/controllers/clients')
const StarTest = require('../app/controllers/star-test')
const FaceTest = require('../app/controllers/face-test')
const SkinTest = require('../app/controllers/skin-test')
const Sysmember = require('../app/controllers/sys-members')
const Beautyroject = require('../app/controllers/beautyProject')
const Operation = require('../app/controllers/operation')
const Star = require('../app/controllers/star')
const Weixin = require('../app/controllers/weixin')
const Pengai = require('../app/controllers/pengai')

module.exports = function(router, passport) {

	// user
	router.get('/sendVerifyCode', User.sendVerify)
	router.post('/userSignupPhone', User.signupPhone)
	router.post('/userVerifyMobile', User.userVerifyMobile)
	router.get('/test', User.index)
	router.get('/azz', User.azz)
	router.post('/', User.indexPost)
	//user(ljx)
    router.post('/getTestList', User.getTestDataList)
    router.get('/userGetInfo', User.getUserInfo)
    router.get('/getStarToken', User.getStarToken)
    router.get('/getSkinToken', User.getSkinToken)
    router.get('/getFaceToken', User.getFaceToken)
    router.get('/getAdvertisementToken', User.getAdvertisementToken)
    router.get('/getStarsToken', User.getStarsToken) // 获取明星图片库 oss token
    router.get('/getSts', User.getSts) // 获取明星图片库 oss sts

	// Client
	router.post('/clientSignupInter', Client.signupPhone)
	router.post('/editInfo', Client.editInfo)
	router.get('/getRecommend', Client.getRecommend)
	router.get('/getRecommendArr', Client.getRecommendArr)
	router.get('/creatChat', Client.creatChat)
	router.get('/clientGetInfo', Client.getInfo)
	router.post('/clientImg', Client.uploadImg)

	router.get('/exportExel', Client.exportExel)



	//CLient(ljx)
    router.post('/clientLogin', Client.Login)
    router.post('/clientUpdatePassword', Client.updatePassword)
    router.post('/clientSignOut', Client.signOut)
    router.post('/clientGetBackPassword', Client.getBackPassword)
    router.get('/clientDeleteTestData', Client.deleteTestData)
    router.get('/clientGetCountData', Client.getCountData)

    router.post('/addAdvertisement', Client.addAdvertisement)
    router.post('/addArad', Client.addArad)
    router.get('/getAdvertisementList', Client.getAdvertisementList)
    router.get('/getAdar', Client.getAdar)
    router.get('/deleteAdvertisement', Client.deleteAdvertisement)
    router.get('/deleteAdar', Client.deleteAdar)
    router.post('/editAdvertisement', Client.editAdvertisement)
    router.post('/editAdar', Client.editAdar)
    router.get('/getAdvertisementInfo', Client.getAdvertisementInfo)
    router.get('/getAd', Client.getAd)
    router.post('/setOptTool', Client.setOptTool)
    router.post('/addFourPic', Client.addFourPic)
    router.get('/getFourPic', Client.getFourPic)
    router.get('/deleteFourPic', Client.deleteFourPic)
    




	//project
    router.post('/addProject', Beautyroject.addProject)
    router.get('/deleteProject', Beautyroject.deleteProject)
    router.get('/getProjectList', Beautyroject.getProjectList)

  // operation
  router.post('/addOperation', Operation.add)
  router.post('/editOperation', Operation.edit)
  router.get('/getOperation', Operation.info)
  router.post('/delOperation', Operation.del)


	// sys member
    router.get('/getClientInfo', Sysmember.getClientInfo)
    router.post('/getClientList', Sysmember.getClientList)
	router.post('/setSkinRole', Sysmember.setSkinRole)
	router.post('/setFaceRole', Sysmember.setFaceRole)
    router.post('/setStarRole', Sysmember.setStarRole)
    router.post('/sysSignupPhone', Sysmember.signupPhone)
    router.post('/sysLogin', Sysmember.Login)
	router.post('/sysSignOut', Sysmember.signOut)




	//sys（ljx）
    router.get('/setGetClientList', Sysmember.getClientList)
    router.get('/setGetClientInfo', Sysmember.getClientInfo)

	// face test
	// router.post('/getFace', upload.single('file'), FaceTest.getFace)
	router.get('/lookTest', FaceTest.getTest)
	router.post('/lookTest', FaceTest.lookTest)
	router.post('/lookTestUrl', FaceTest.lookTestUrl) // 颜值图片 URL 测试
	router.post('/getFace', FaceTest.getFace)


	// router.post('/getSkin', upload.single('file'), FaceTest.getFace)
	router.get('/skinTest', SkinTest.getTest)
	router.post('/skinTest', SkinTest.skinTest)
	router.post('/skinTestUrl', SkinTest.skinTestUrl) // 图片url 皮肤测试

	// router.post('/getStar', upload.single('file'), FaceTest.getFace)
	router.get('/getStars', StarTest.getStars) // 爬虫 明星数据
	router.post('/starTest', StarTest.starTest) // 明星面对面测试
	router.post('/starTestUrl', StarTest.starTestUrl) // 明星面对面图片url 测试
	router.get('/starTest', StarTest.getStarTest) // 获取明星面对面测试
	router.get('/starInputTest', StarTest.starInputTest) //把 颜值 皮肤测试数据 放进 明星表
	router.get('/addFaceToFaceSet', StarTest.addFaceToFaceSet) // 把 明星 放进 faceset
	router.get('/starDetect', StarTest.starDetect) // 把 明星 detect，存进数据库
	router.post('/pcStarTest', StarTest.pcStarTest) // pc 明星面对面 
	router.post('/pcVerifyMobile', User.pcVerifyMobile) // pc 明星面对面的手机验证
	// weixin
	router.post('/weixin/share', Weixin.share)
	// router.get('/weixin/pay', Weixin.pay)
	// 微信报名
	router.post('/weixin/h5/signup', User.wxSignup)
	router.post('/wxSignupConfirm', User.wxSignupConfirm)
	router.post('/wxSignupList', User.wxSignupList)

	// 微信优惠卷
	router.post('/weixin/h5/coupon', User.wxCoupon)
	router.post('/wxCouponConfirm', User.wxCouponConfirm)
	router.post('/wxCouponList', User.wxCouponList)
	router.get('/auth/wxcoupon', passport.authenticate('wxcoupon', { successRedirect: '/h5/coupon/index.html',
            failureRedirect: '/h5/coupon/index.html' }))

	router.get('/auth/wxcoupon/callback', passport.authenticate('wxcoupon', {
	  failureRedirect: '/h5/coupon/index.html'
	}), User.wxcbCounpon)

	// 微信红包
	router.post('/wxRedList', User.wxRedList)
	router.get('/wxRedStat', User.wxRedStat)
	router.get('/wxRedDetail', User.wxRedDetail)

	// h5 后台登录
	router.post('/h5login', User.H5Login)

	//star(ljx)
    router.post('/creatFaceSet', Star.creatFaceSet)
    router.get('/delFaceSet', Star.delFaceSet)
    router.get('/faceSetList', Star.faceSetList)
    router.get('/faceCountryList', Star.faceCountryList)

    router.post('/addFaceToFaceSet', Star.addFaceToFaceSet)
    router.post('/editFaceToFaceSet', Star.editFaceToFaceSet)
    router.get('/delFaceToFaceSet', Star.delFaceToFaceSet)
    router.get('/FaceToFaceSetList', Star.FaceToFaceSetList)

    router.post('/starRegister', Star.register)
    router.post('/starLogin', Star.Login)
    router.get('/starSignOut', Star.signOut)

    // 确认是否授权
    router.post('/redConfirm', User.wxcbRedConfirm)

	router.get('/auth/wechat', passport.authenticate('loginByWeixinClient', { successRedirect: '/h5/apply/index.html',
            failureRedirect: '/h5/apply/index.html' }))

	router.get('/auth/wechat/callback', passport.authenticate('loginByWeixinClient', {
	  failureRedirect: '/h5/apply/index.html'
	}), User.wxcb)


	router.get('/auth/wechatRed', User.RedSession ,passport.authenticate('weixinRed', { successRedirect: '/face/report.html',
            failureRedirect: '/face/report.html' }))

	router.get('/auth/wechatRed/callback', passport.authenticate('weixinRed', {
	  failureRedirect: '/face/report.html'
	}), User.wxcbRed)

	// 泰安红包活动
	router.get('/auth/taianRed', User.taianSession ,passport.authenticate('taianRed', { successRedirect: '/s11/index.html',
            failureRedirect: '/s11/index.html' }))

	router.get('/auth/taian/callback', passport.authenticate('taianRed', {
	  failureRedirect: '/s11/index.html'
	}), User.taiancb)

  router.get('/taian/loginStatus', User.taianStatus)
  router.get('/tananRankin', User.tananRankin)
  router.get('/taianStat', User.taianStat)
  router.post('/taian/share', Weixin.taianShare)
  router.post('/taianList', User.taianList)
  router.get('/taianPayTest', User.taianPayTest)


	// 鹏爱红包活动
	router.get('/auth/pengaiRed', Pengai.pengaiSession ,passport.authenticate('pengaiRed', { successRedirect: '/pengai/index.html',
            failureRedirect: '/pengai/index.html' }))

	router.get('/auth/pengai/callback', passport.authenticate('pengaiRed', {
	  failureRedirect: '/pengai/index.html'
	}), Pengai.pengaicb)

  router.get('/pengai/loginStatus', Pengai.pengaiStatus)
  router.get('/pengaiRankin', Pengai.pengaiRankin)
  router.get('/pengaiStat', Pengai.pengaiStat)
  router.post('/pengai/share', Pengai.share)
  router.post('/pengaiList', Pengai.pengaiList)
  router.get('/pengaiPayTest', Pengai.pengaiPayTest)

}



