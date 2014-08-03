_ = require 'underscore'
should = require 'should'
helper = require './support/helper'
index = require '../lib/index'

id = null

describe 'all-test', ->
  before (cb) ->
    helper.start null, (err) ->
      return cb err if err

      helper.testModel.findOne {}, (err,item) ->
        return cb err if err
        id = item._id
        cb null

  after (cb) ->
    helper.stop cb

  describe 'when invoking getOne with all default settings', ->
    it 'should return a dataset', (cb) ->
      settings = null
      index.getById helper.testModel,id,settings,{}, (err,item) ->
        console.log JSON.stringify item
        should.exist item
        cb err

  describe 'when invoking getOne with select', ->
    it 'should return a dataset', (cb) ->
      settings = 
        defaultSelect: 'name _id'
      index.getById helper.testModel,id,settings,{}, (err,item) ->
        console.log JSON.stringify item
        should.exist item
        cb err

