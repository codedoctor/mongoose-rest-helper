_ = require 'underscore-ext'
errors = require 'some-errors'

PageResult = require('simple-paginator').PageResult

mongoose = require "mongoose"
ObjectId = mongoose.Types.ObjectId
bcrypt = require 'bcryptjs'

{isObjectId} = require 'mongodb-objectid-helper'

###
Provides methods to interact with scotties.
###
module.exports = class EntityMethods
  ###
  Initializes a new instance of the @see ScottyMethods class.
  @param {Object} models A collection of models that can be used.
  ###
  constructor:(@models) ->
    throw new Error "models parameter is required" unless @models

  ###
  Looks up a user or organization by id. Users are first.
  ###
  get: (id,options = {}, cb = ->) =>
    if _.isFunction(options)
      cb = options 
      options = {}

    id = new ObjectId id.toString()
    @models.User.findOne _id: id , (err, item) =>
      return cb err if err
      return cb null, item if item
      @models.Organization.findOne _id: id , (err, item) =>
        return cb err if err
        cb null, item


  getByName: (accountId,name,options = {}, cb = ->) =>
    if _.isFunction(options)
      cb = options 
      options = {}

    accountId = new ObjectId accountId.toString()
    @models.User.findOne {accountId : accountId, username: name} , (err, item) =>
      return cb err if err
      return cb null, item if item
      @models.Organization.findOne name: name , (err, item) =>
        return cb err if err
        cb null, item

  getByNameOrId: (accountId,nameOrId, options = {},cb = ->) =>
    if _.isFunction(options)
      cb = options 
      options = {}

    accountId = new ObjectId accountId.toString()

    if isObjectId(nameOrId)
      @get nameOrId, cb
    else
      @getByName accountId,nameOrId, cb

