mongoose = require 'mongoose'
Schema = mongoose.Schema
passgen = require 'passgen'

module.exports = OauthClientSchema = new mongoose.Schema
    accountId:
      type: mongoose.Schema.ObjectId
      require: true
      index : true
    clientId:
      type: String
      unique: true
      sparse: true
      default: () -> passgen.create(20)
    secret:
      type: String
      default: () -> passgen.create(40)
    createdAt:
      type: Date
      default:() -> new Date()
    revokedAt:
      type: Date
      default:() -> null
  , strict : true

OauthClientSchema.index({ accountId: 1,name: 1 },{ unique: true, sparse: false} );

OauthClientSchema.methods.toRest = (baseUrl, actor) ->
  res =
    url : "#{baseUrl}/#{@_id}"
    id : @_id
    clientId : @clientId
    secret : @secret
    createdAt : @createdAt
    revokedAt : @revokedAt
  res
