###
Smart helper functions
###

_ = require 'underscore'
asObjectId = require './as-objectid'
Hoek = require 'hoek'
mongoose = require "mongoose"
ObjectId = mongoose.Types.ObjectId
{isObjectId} = require 'mongodb-objectid-helper'

i18n = require './i18n'
PageResult = require './page-result'

module.exports =
  ###
  Query against a collection, returns a paginated result.
  @param model [Object] a mongoose model. Required.
  @param settings [Object] settings to specify the nature of the query.
  @param options [Object] consumer overrides for your settings. See below for an explanation of this.
  @param cb [Function,null] callback invoked after completion.
  @example
  This example implements a convenience function that adds a tenant _id to all queries.
  See how options are passed to this method, and settings are used to configure it.
  ```coffeescript
  myClient = 
    all:(_tenantId,options = {}, cb = ->) =>
      return cb new Error "_tenantId parameter is required." unless _tenantId

      settings = 
          baseQuery:
            _tenantId : mongooseRestHelper.asObjectId _tenantId
          defaultSort: 'name'
          defaultSelect: null
          defaultCount: 20

      mongooseRestHelper.all @models.OauthApp,settings,options, cb

  ```
  ###
  all:(model,settings = {},options = {}, cb = ->) ->
    Hoek.assert model,i18n.assertModuleRequired

    baseQuery = settings.baseQuery || {}
    defaultSort = settings.defaultSort || null
    defaultSelect = settings.defaultSelect || null
    defaultCount = settings.defaultCount || 20

    if _.isFunction(options)
      cb = options 
      options = {}

    options.where ||= {}
    options.select ||= defaultSelect

    for k, v of baseQuery
      options.where[k] = v

    model.count options.where,(err, totalCount) ->
      return cb err if err

      query = model.find options.where

      if _.isString(options.select) and options.select.length > 0
        query.select options.select 
      else if _.isObject(options.select) and _.keys(options.select).length > 0
        query.select options.select 

      options.offset ||= 0
      options.count ||= defaultCount
      query.setOptions { skip: options.offset, limit: options.count}
      query.sort options.sort || defaultSort
      query.exec (err, items) ->
        return cb err if err
        cb null, new PageResult(items || [], totalCount, options.offset, options.count)


  ###
  Returns a single object through the id
  ###
  getById: (model, id,settings = {}, options = {}, cb = ->) ->
    Hoek.assert model,i18n.assertModuleRequired
    Hoek.assert id,i18n.assertIdRequired

    defaultSelect = settings.defaultSelect || null

    if _.isFunction(options)
      cb = options 
      options = {}

    options.select ||= defaultSelect

    query = model.findOne _id : asObjectId(id)
    query = query.select(options.select) if options.select && options.select.length > 0
    query.exec cb

  ###
  Returns a single object base on query
  ###
  getOne: (model,settings = {}, options = {}, cb = ->) ->
    Hoek.assert model,i18n.assertModuleRequired

    defaultSelect = settings.defaultSelect || null
    baseQuery = settings.baseQuery || {}


    if _.isFunction(options)
      cb = options 
      options = {}

    options.where ||= {}
    options.select ||= defaultSelect

    for k, v of baseQuery
      options.where[k] = v

    query = model.findOne options.where
    query = query.select(options.select) if options.select && options.select.length > 0
    query.exec cb

  ###
  Completely removes an element.
  @TODO We can add a fast mode later that does not query the item first.
  ###
  destroy: (model,id, settings = {}, options = {}, cb = ->) ->
    Hoek.assert model,i18n.assertModuleRequired
    Hoek.assert id,i18n.assertIdRequired

    model.findOne _id : asObjectId(id), (err, item) ->
      return cb err if err
      return cb null unless item

      item.remove (err) ->
        return cb err if err
        cb null, item

  ###
  Creates a new object in the  db
  ###
  create: (model,settings = {},objs = {},options = {},cb = ->) ->
    Hoek.assert model,i18n.assertModuleRequired

    if _.isFunction(options)
      cb = options 
      options = {}

    m = new model objs
    m.save (err) ->
      return cb err if err
      cb null, m,true

  ###
  Performs a selective update of fields present. 
  @param settings[StringArray] exclude array of field names that are always ignored when updating this 
  ###
  patch: (model,id, settings = {}, obj = {}, options = {}, cb = ->) ->
    Hoek.assert model,i18n.assertModuleRequired
    Hoek.assert id,i18n.assertIdRequired

    delete obj[fieldName] for fieldName in settings.exclude || []

    if _.isFunction(options)
      cb = options 
      options = {}

    model.findByIdAndUpdate { _id: asObjectId(id) }, { $set: obj}, cb

  ###
  Converts a value to an object id. Safety precaution for queries.
  @param id [String|ObjectId|null] takes an input string and converts it to a mongoose object if. Crashes if not a valid object id or null.
  ###
  asObjectId: (id) -> 
    asObjectId id

  ###
  Checks if a value is an object id.
  @param val [Object] value that is or is not an objectid.
  ###
  isObjectId: (val) ->
    isObjectId val

