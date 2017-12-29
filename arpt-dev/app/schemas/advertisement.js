'use strict'

var mongoose = require('mongoose')
// var bcrypt = require('bcryptjs')
// var SALT_WORK_FACTOR = 10
var Schema = mongoose.Schema


/**
 * StarMember Schema
 */
var Advertisement = new Schema({
  imgUrl: String,
  adUrl: String,
  toolType:String,
  editionType:String,
  clientId:String,
  adName:String,
  meta: {
    createdAt: {
      type: Date,
      default: Date.now()
    },
    updatedAt: {
      type: Date,
      default: Date.now()
    }
  }
})


Advertisement.pre('save', function(next) {
  if (this.isNew) {
    if (!this.meta.createdAt) {
      this.meta.createdAt = this.meta.updatedAt = Date.now()
    }
  }
  else {
    this.meta.updatedAt = Date.now()
  }
  next()
})

module.exports = Advertisement

