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

  describe 'when invoking all with a select clause settings', ->
    it 'should return a dataset', (cb) ->
      index.all helper.testModel,{},null,"_id name",20,{}, (err,pageResult) ->
        console.log JSON.stringify pageResult
        should.exist pageResult
        cb err

  describe 'when invoking all with a sort settings', ->
    it 'should return a dataset', (cb) ->
      index.all helper.testModel,{},"-name",null,20,{}, (err,pageResult) ->
        console.log JSON.stringify pageResult
        should.exist pageResult
        cb err


  describe 'when invoking all with a default count', ->
    it 'should return a dataset', (cb) ->
      index.all helper.testModel,{},null,null,3,{}, (err,pageResult) ->
        console.log JSON.stringify pageResult
        should.exist pageResult
        cb err

  describe 'when invoking all with a query', ->
    it 'should return a dataset', (cb) ->
      # name : "Name 3"
      index.all helper.testModel,n : 3,null,null,20,{}, (err,pageResult) ->
        console.log JSON.stringify pageResult
        should.exist pageResult
        cb err
