_ = require 'underscore'
should = require 'should'
helper = require './support/helper'
index = require '../lib/index'

id = null

describe 'patch', ->
  before (cb) ->
    helper.start null, (err) ->
      return cb err if err

      helper.testModel.findOne {}, (err,item) ->
        return cb err if err
        id = item._id
        cb null

  after (cb) ->
    helper.stop cb

  describe 'when invoking patch with all default settings', ->
    it 'should return a dataset', (cb) ->
      settings = null
      newData =
        name: "xxxx"
      index.patch helper.testModel,id,settings,newData,{}, (err,item) ->
        should.exist item
        item.should.have.property 'name','xxxx'
        cb err

