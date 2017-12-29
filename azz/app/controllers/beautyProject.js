'use strict'

const mongoose = require('mongoose')
const BeautyProject = mongoose.model('BeautyProject')
// const _ = require('lodash')
const Msg = require('../libs/msg')
/**
 * @api {post} /addProject   添加项目
 * @apiName beautyProject
 * @apiGroup beautyProject
 * @apiPermission anyBody
 *
 * @apiDescription beautyProject  add project.
 *
 * @apiParam {String} projectType   The projectType.
 * @apiParam {String} projectName   The projectName.
 * @apiParam {String} projectPrice  The projectPrice.
 * @apiParam {String} clientId      The clientId.
 *
 * @apiExample Example usage:
 * http://test.legle.cc/addProject
 *
 * @apiSuccess {Number}   code   1.
 * @apiSuccess {String}   err 'ok'.
 *
 * @apiError code 0.
 * @apiError err   err message.
 *
 */
exports.addProject = function *(next) {

    //projectType 1:美唇     2:瘦鼻    3:瘦脸     4:太阳穴       5:纹眉    6:丰下巴    7:丰额   8:苹果肌     9:隆鼻
    //typeName    1:meichun 2:shoubi 3:shoulian 4:taiyangxue 5:wenmei 6:fengxiaba 7:fenge 8:pingguoji 9:longbi
    let projectType = this.request.body.projectType
    let projectName = this.request.body.projectName
    let projectPrice = this.request.body.projectPrice
    let typeName = this.request.body.typeName
    let clientId =  this.session.client.clientId

    const newData = {
        projectType: projectType,
        projectName: projectName,
        projectPrice: projectPrice,
        typeName:typeName,
        clientId:clientId
    }


    const savedProject = new BeautyProject(newData)
    yield savedProject.save()
    this.body = {
        code: 1,
        err: Msg.USER.ADD_SUCCESS
    }
}

/**
 * @api {get} /deleteProject   删除项目
 * @apiName deleteProject
 * @apiGroup beautyProject
 * @apiPermission anyBody
 *
 * @apiDescription beautyProject  delete project.
 *
 * @apiParam {String} projectID   The projectID.
 *
 * @apiExample Example usage:
 * http://test.legle.cc/addProject
 *
 * @apiSuccess {Number}   code   1.
 * @apiSuccess {String}   err 'ok'.
 *
 * @apiError code 0.
 * @apiError err   err message.
 *
 */
exports.deleteProject = function *(next) {
     let projectID = this.request.query.projectId
     if(projectID) {
         yield BeautyProject.remove({_id:projectID}).exec()
     }else{
         return(this.body = {
             code: 1,
             err: Msg.USER.DELETE_LOSE
         })
     }
     this.body = {
         code: 1,
         err: Msg.USER.DELETE_SUCCESS
     }
}


/**
 * @api {get} /getProjectList   获取项目列表
 * @apiName getProjectList
 * @apiGroup beautyProject
 * @apiPermission anyBody
 *
 * @apiDescription beautyProject  delete project.
 *
 * @apiParam {String} projectId  The projectID.
 *
 * @apiExample Example usage:
 * http://test.legle.cc/addProject
 *
 * @apiSuccess {Number}   code   1.
 * @apiSuccess {String}   err 'ok'.
 *
 * @apiError code 0.
 * @apiError err   err message.
 *
 */
exports.getProjectList = function *(next) {
    let clientId =  this.session.client.clientId
    //1:美唇 2:瘦鼻 3:瘦脸 4:太阳穴 5:纹眉 6:丰下巴 7:丰额 8:苹果机 9:隆鼻
    let results = yield [
        yield BeautyProject.find({clientId: clientId,projectType: '1'}).exec(),
        yield BeautyProject.find({clientId: clientId,projectType: '2'}).exec(),
        yield BeautyProject.find({clientId: clientId,projectType: '3'}).exec(),
        yield BeautyProject.find({clientId: clientId,projectType: '4'}).exec(),
        yield BeautyProject.find({clientId: clientId,projectType: '5'}).exec(),
        yield BeautyProject.find({clientId: clientId,projectType: '6'}).exec(),
        yield BeautyProject.find({clientId: clientId,projectType: '7'}).exec(),
        yield BeautyProject.find({clientId: clientId,projectType: '8'}).exec(),
        yield BeautyProject.find({clientId: clientId,projectType: '9'}).exec(),
    ]
    this.body = {
        code: 1,
        err: Msg.USER.FIND_SUCCESS,
        results:results
    }
}
