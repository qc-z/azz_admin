'use strict'

const User = require('../app/controllers/users')
const Client = require('../app/controllers/clients')
const StarTest = require('../app/controllers/star-test')
const FaceTest = require('../app/controllers/face-test')
const Sysmember = require('../app/controllers/sys-members')
const Beautyroject = require('../app/controllers/beautyProject')
const Operation = require('../app/controllers/operation')
const Star = require('../app/controllers/star')

module.exports = function(router, passport) {

	// user
	router.get('/sendVerifyCode', User.sendVerify)
	router.post('/pcVerifyMobile', User.pcVerifyMobile)
	router.get('/test', User.index)
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
	router.post('/lookTestUrl', FaceTest.lookTestUrl) // 颜值图片 URL 测试


	// router.post('/getStar', upload.single('file'), FaceTest.getFace)
	router.post('/starTestUrl', StarTest.starTestUrl) // 明星面对面图片url 测试
	router.get('/starTest', StarTest.getStarTest) // 获取明星面对面测试
	router.post('/pcVerifyMobile', User.pcVerifyMobile) // pc 明星面对面的手机验证

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


}



