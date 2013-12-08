###
Smart helper functions.
###
_ = require 'underscore'
mongoose = require "mongoose"
ObjectId = mongoose.Types.ObjectId
{isObjectId} = require 'mongodb-objectid-helper'
PageResult = require('simple-paginator').PageResult

module.exports =

  ###
  Query for a paged result against a collection.
  ###
  all:(model,baseQuery = {},defaultSort = null,defaultSelect = null,defaultCount = 20,options = {}, cb = ->) =>
    return cb new Error "model parameter is required." unless model

    if _.isFunction(options)
      cb = options 
      options = {}

    options.where ||= {}
    options.select ||= defaultSelect

    for k, v of baseQuery
      options.where.k = v

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
  Converts a value to an object id. Safety precaution for queries.
  ###
  asObjectId: (id) ->
    return null unless id
    new ObjectId id.toString()

  ###
  Checks if a value is an object id.
  ###
  isObjectId: (val) ->
    isObjectId(val)

