qs = require 'querystring'
_ = require 'underscore'
async = require 'async'
mongoose = require 'mongoose'
mongoskin = require 'mongoskin'
ObjectId = mongoose.Types.ObjectId
cleanDatabase = require './clean-database'

index = require '../../lib/index'
SampleUsers = require './sample-users'

class Helper
  loggingEnabled: false
  accountId : '52998e1c32e5724771000009'
  database :  'mongodb://localhost/codedoctor-test'
  collections: ['oauthaccesstokens','oauthapps','oauthclients','organizations','users']

  start: (obj = {}, done = ->) =>
    _.defaults obj, 
      cleanDatabase : true

    mongoose.connect @database
    @mongo = mongoskin.db @database, safe:false
    @store = index.store()

    tasks = []

    cleanDatabase @mongo,@database,@loggingEnabled, (err) =>
      done()


  stop: (done = ->) =>
    mongoose.disconnect (err) =>
      done()

  addSampleUsers: (cb) =>
    x = new SampleUsers(@mongo)
    x.setup(cb)
    x

  log: (obj) =>
    console.log ""
    console.log "+++++++++"
    console.log JSON.stringify(obj)
    console.log "---------"


module.exports = new Helper()
