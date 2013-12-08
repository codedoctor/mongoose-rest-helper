_ = require 'underscore-ext'
PageResult = require('simple-paginator').PageResult
errors = require 'some-errors'

mongoose = require "mongoose"
ObjectId = mongoose.Types.ObjectId


module.exports = class RoleMethods
  CREATE_FIELDS = ['_id','name','description','isInternal']
  UPDATE_FIELDS = ['name','description','isInternal']

  constructor:(@models) ->

  all: (accountId,options = {},cb = ->) =>
    if _.isFunction(options)
      cb = options 
      options = {}

    accountId = new ObjectId accountId.toString()

    @models.Role.count {accountId : accountId}, (err, totalCount) =>
      return cb err if err

      options.offset or= 0
      options.count or= 1000

      query = @models.Role.find({accountId : accountId})
      query.sort('name')
      query.select options.select if options.select && options.select.length > 0

      query.setOptions { skip: options.offset, limit: options.count}
      query.exec (err, items) =>
        return cb err if err
        cb null, new PageResult(items || [], totalCount, options.offset, options.count)


  ###
  Create a new processDefinition
  ###
  create:(accountId,objs = {}, options = {}, cb = ->) =>
    if _.isFunction(options)
      cb = options 
      options = {}

    objs.accountId = new ObjectId accountId.toString()

    model = new @models.Role(objs)
    model.save (err) =>
      return cb err if err
      cb null, model,true

  ###
  Retrieve a single processDefinition-item through it's id
  ###
  get: (roleId,options = {}, cb = ->) =>
    if _.isFunction(options)
      cb = options 
      options = {}

    @models.Role.findOne _id : roleId, (err,item) =>
      return cb err if err
      cb null, item

  patch: (roleId, obj = {}, options={}, cb = ->) =>
    if _.isFunction(options)
      cb = options 
      options = {}

    @models.Role.findOne _id : roleId, (err,item) =>
      return cb err if err
      return cb new errors.NotFound("#{roleId}") unless item

      _.extendFiltered item, UPDATE_FIELDS, obj
      item.save (err) =>
        return cb err if err
        cb null, item

  destroy: (roleId, options = {}, cb = ->) =>
    if _.isFunction(options)
      cb = options 
      options = {}

    @models.Role.findOne _id : roleId, (err,item) =>
      return cb err if err
      return cb null unless item

      item.remove (err) =>
        return cb err if err
        cb null

