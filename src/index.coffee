###
Smart helper functions.
###

_ = require 'underscore'
asObjectId = require './as-objectId'
mongoose = require "mongoose"
ObjectId = mongoose.Types.ObjectId
{isObjectId} = require 'mongodb-objectid-helper'
PageResult = require './page-result'
Hoek = require 'hoek'
i18n = require './i18n'

module.exports =
  ###
  Query for a paged result against a collection.
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
      query.select options.select if options.select and options.select.length > 0
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

