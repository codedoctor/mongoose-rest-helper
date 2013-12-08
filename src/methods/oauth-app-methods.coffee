_ = require 'underscore-ext'
errors = require 'some-errors'
PageResult = require('simple-paginator').PageResult

module.exports = class OauthAppMethods
  KEY_LENGTH = 20
  SECRET_LENGTH = 40
  APP_CREATE_FIELDS =  ['name', 'websiteUrl', 'imageUrl', 'notes', 'tosAcceptanceDate', 'scope', 'description', 'acceptTermsOfService', 'isPublished', 'organizationName', 'organizationUrl']

  constructor:(@models, @scopeMethods) ->
    throw new Error("models parameter is required") unless @models
    throw new Error("scopeMethods parameter is required") unless @scopeMethods

  ###
  Create a new oauth client.
  ###
  create:(accountId,objs = {},options={}, cb = ->) =>
    return cb new Error "accountId parameter is required." unless accountId
    return cb new Error "objs.createdByUserId parameter is required." unless objs.createdByUserId

    if _.isFunction(options)
      cb = options 
      options = {}

    objs.accountId = new ObjectId accountId.toString()

    optionalClientId = objs.clientId
    optionalSecret = objs.secret

    data = {}
    ###
    @TODO Make this safe, but invert it.
    ###
    _.extendFiltered data, APP_CREATE_FIELDS, objs
    data.createdByUserId = objs.createdByUserId

    data.scopes = @scopeMethods.allScopeNamesAsArray()
    model = new @models.OauthApp(data)

    if objs.callbackUrl
      model.redirectUrls.push new @models.OauthRedirectUri(uri: objs.callbackUrl)

    oAuthClient = new @models.OauthClient()
    oAuthClient.clientId = optionalClientId if optionalClientId
    oAuthClient.secret = optionalSecret if optionalSecret

    model.clients.push oAuthClient
    model.save (err) =>
      return cb err if err
      cb null, model


  ###
  Retrieves all oauth apps for a specific accountId
  ###
  all:(accountId,options = {}, cb = ->) =>
    return cb new Error "accountId parameter is required." unless accountId

    if _.isFunction(options)
      cb = options 
      options = {}

    options.where ||= {}
    options.where.accountId = new ObjectId accountId.toString()

    @models.OauthApp.count options.where,(err, totalCount) =>
      return cb err if err

      query = @models.OauthApp.find options.where
      query.select options.select if options.select and options.select.length > 0
      options.offset ||= 0
      options.count ||= 20
      query.setOptions { skip: options.offset, limit: options.count}
      query.sort options.sort || 'name'
      query.exec (err, items) =>
        return cb err if err
        cb null, new PageResult(items || [], totalCount, options.offset, options.count)


  ###
  Retrieves apps for a specific user, within the accountId scope.
  ###
  getAppsForUser:(accountId,owningUserId, options = {}, cb = ->) =>
    return cb new Error "accountId parameter is required." unless accountId
    return cb new Error "owningUserId parameter is required." unless owningUserId

    if _.isFunction(options)
      cb = options 
      options = {}

    options.where ||= {}
    options.where.createdByUserId = new ObjectId owningUserId.toString()

    @getAll accountId,options,cb

  ###
  returns a specific oauth app.
  ###
  get: (oauthAppId,options={}, cb = ->) =>
    return cb new Error "oauthAppId parameter is required." unless oauthAppId

    if _.isFunction(options)
      cb = options 
      options = {}
    oauthAppId = new ObjectId oauthAppId.toString()
    @models.OauthApp.findOne _id : oauthAppId, (err, item) =>
      return cb err if err
      cb null, item

  ###
  Completely destroys an app.
  ###
  destroy: (oauthAppId,options = {}, cb = ->) =>
    return cb new Error "oauthAppId parameter is required." unless oauthAppId

    if _.isFunction(options)
      cb = options 
      options = {}

    oauthAppId = new ObjectId oauthAppId.toString()
    @models.OauthApp.remove _id : oauthAppId, (err) =>
      return cb err if err
      cb null

  ###
  Reset the app keys for an app.
  ###
  resetAppKeys: (oauthAppId,options = {}, cb = ->) =>
    return cb new Error "oauthAppId parameter is required." unless oauthAppId

    if _.isFunction(options)
      cb = options 
      options = {}


    oauthAppId = new ObjectId oauthAppId.toString()
    @models.OauthApp.findOne _id : oauthAppId, (err, item) =>
      return cb err if err

      item.clients[0].clientId = passgen.create(KEY_LENGTH)
      item.clients[0].secret = passgen.create(SECRET_LENGTH)

      item.save (err) =>
        return cb err if err
        cb null, item

  ###
  Update an app.
  ###
  patch: (oauthAppId, data = {},options = {}, cb = ->) =>
    return cb new Error "oauthAppId parameter is required." unless oauthAppId

    if _.isFunction(options)
      cb = options 
      options = {}

    oauthAppId = new ObjectId oauthAppId.toString()
    @models.OauthApp.findOne _id : oauthAppId, (err, item) =>
      return cb err if err

      _.extend item, data

      item.save (err) =>
        return cb err if err
        cb null, item

