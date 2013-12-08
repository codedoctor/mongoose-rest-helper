_ = require 'underscore'
should = require 'should'
helper = require './support/helper'

describe 'all-test', ->
  before (cb) ->
    helper.start null, cb

  after (cb) ->
    helper.stop cb

  describe 'when invoking all with all default settings', ->
    it 'should return a dataset', (cb) ->
      cb null
