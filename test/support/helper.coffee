qs = require 'querystring'
_ = require 'underscore'
async = require 'async'
mongoose = require 'mongoose'
mongoskin = require 'mongoskin'
ObjectId = mongoose.Types.ObjectId
cleanDatabase = require './clean-database'

index = require '../../lib/index'

addTestData = (model,cb) ->
  x = []

  for i in [1..100]
    x.push
      name : "Name #{i}"
      n : i

  addOne = (item,cb) ->
    m = new  model item
    m.save cb

  async.forEachSeries x, addOne, cb


TestSchema = new mongoose.Schema
      name :
        type: String
      n:
        type: Number
      arrayOfStrings:
        type: [String]
        default: () -> []
      aDate :
        type: Date
        default: () -> new Date()
  , strict: true


class Helper
  loggingEnabled: false
  database :  'mongodb://localhost/codedoctor-test'
  collections: ['tests']

  start: (obj = {}, cb = ->) =>
    _.defaults obj, 
      cleanDatabase : true

    mongoose.connect @database
    @mongo = mongoskin.db @database, safe:false

    cleanDatabase @mongo,@database,@collections,@loggingEnabled, (err) =>
      @testModel = mongoose.model "Test", TestSchema
      addTestData @testModel,cb


  stop: (cb = ->) =>
    mongoose.disconnect (err) =>
      cb()

 
  log: (obj) =>
    console.log ""
    console.log "+++++++++"
    console.log JSON.stringify(obj)
    console.log "---------"


module.exports = new Helper()
