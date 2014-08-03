_ = require 'underscore'
should = require 'should'
helper = require './support/helper'
index = require '../lib/index'

id = null

describe 'destroy', ->
  before (cb) ->
    helper.start null, (err) ->
      return cb err if err

      helper.testModel.findOne {}, (err,item) ->
        return cb err if err
        id = item._id
        cb null

  after (cb) ->
    helper.stop cb

  describe 'when invoking destroy with a default query', ->
    it 'should delete the object', (cb) ->
      settings = {}

      index.destroy helper.testModel,id, settings,{}, (err,item) ->
        console.log JSON.stringify item
        should.exist item
        cb err

