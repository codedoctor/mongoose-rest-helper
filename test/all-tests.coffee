_ = require 'underscore'
should = require 'should'
helper = require './support/helper'
index = require '../lib/index'

describe 'all-test', ->
  before (cb) ->
    helper.start null, cb

  after (cb) ->
    helper.stop cb

  describe '1 when invoking all with all default settings', ->
    it 'should return a dataset', (cb) ->
      settings = null
      index.all helper.testModel,settings,{}, (err,pageResult) ->
        console.log JSON.stringify pageResult
        should.exist pageResult
        cb err

  describe '2 when invoking all with overridden default settings', ->
    it 'should return a dataset', (cb) ->
      settings =
        baseQuery: {} 
        defaultSort: null
        defaultSelect: null
        defaultCount: 20

      index.all helper.testModel,settings,{}, (err,pageResult) ->
        console.log JSON.stringify pageResult
        should.exist pageResult
        cb err

  describe '3 when invoking all with a select clause settings', ->
    it 'should return a dataset', (cb) ->
      settings =
        baseQuery: {} 
        defaultSort: null
        defaultSelect: "_id name"
        defaultCount: 20

      index.all helper.testModel,settings,{}, (err,pageResult) ->
        console.log JSON.stringify pageResult
        should.exist pageResult
        cb err

  describe '4 when invoking all with a select in object notation clause settings', ->
    it 'should return a dataset', (cb) ->
      settings =
        baseQuery: {} 
        defaultSort: null
        defaultSelect: 
          _id : 1
          name: 1
        defaultCount: 20

      index.all helper.testModel,settings,{}, (err,pageResult) ->
        console.log JSON.stringify pageResult
        should.exist pageResult
        cb err

  describe '5 when invoking all with a sort settings', ->
    it 'should return a dataset', (cb) ->
      settings =
        baseQuery: {} 
        defaultSort: "-name"
        defaultSelect: null
        defaultCount: 20

      index.all helper.testModel,settings,{}, (err,pageResult) ->
        console.log JSON.stringify pageResult
        should.exist pageResult
        cb err


  describe '6 when invoking all with a default count', ->
    it 'should return a dataset', (cb) ->
      settings =
        baseQuery: {} 
        defaultSort: null
        defaultSelect: null
        defaultCount: 3

      index.all helper.testModel,settings, {}, (err,pageResult) ->
        console.log JSON.stringify pageResult
        should.exist pageResult
        cb err

  describe '7 when invoking all with a query', ->
    it 'should return a dataset', (cb) ->
      settings =
        baseQuery:
          n : 3
        defaultSort: null
        defaultSelect: null
        defaultCount: 20

      index.all helper.testModel,settings,{}, (err,pageResult) ->
        console.log JSON.stringify pageResult
        should.exist pageResult
        cb err
