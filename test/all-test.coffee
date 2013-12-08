_ = require 'underscore'
should = require 'should'
helper = require './support/helper'
index = require '../lib/index'

describe 'all-test', ->
  before (cb) ->
    helper.start null, cb

  after (cb) ->
    helper.stop cb

  describe 'when invoking all with all default settings', ->
    it 'should return a dataset', (cb) ->
      index.all helper.testModel,{},null,null,20,{}, (err,pageResult) ->
        console.log JSON.stringify pageResult
        should.exist pageResult
        cb err
