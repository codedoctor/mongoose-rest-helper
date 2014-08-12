[![Build Status](https://travis-ci.org/codedoctor/mongoose-rest-helper.svg?branch=master)](https://travis-ci.org/codedoctor/mongoose-rest-helper)
[![Coverage Status](https://img.shields.io/coveralls/codedoctor/mongoose-rest-helper.svg)](https://coveralls.io/r/codedoctor/mongoose-rest-helper)
[![NPM Version](http://img.shields.io/npm/v/mongoose-rest-helper.svg)](https://www.npmjs.org/package//mongoose-rest-helper)
[![Dependency Status](https://gemnasium.com/codedoctor/mongoose-rest-helper.svg)](https://gemnasium.com/codedoctor/mongoose-rest-helper)
[![NPM Downloads](http://img.shields.io/npm/dm/mongoose-rest-helper.svg)](https://www.npmjs.org/package/mongoose-rest-helper)
[![Issues](http://img.shields.io/github/issues/codedoctor/mongoose-rest-helper.svg)](https://github.com/codedoctor/mongoose-rest-helper/issues)
[![API Documentation](http://img.shields.io/badge/API-Documentation-ff69b4.svg)](http://coffeedoc.info/github/codedoctor/mongoose-rest-helper)

## mongoose-rest-helper

Provides some convenience functions that can bridge mongoose and your REST endpoints. Nothing special really.

How to get started:

npm install mongoose-rest-helper

## Usage

The following illustrates a typical use case where we map CRUD functions
to the mongoose-rest-helper. This is verbose, you could easily create this
for all your models. 

```coffeescript

mongooseRestHelper = require 'mongoose-rest-helper'

module.exports = class RoleMethods
  UPDATE_EXCLUDEFIELDS = ['_id']

  constructor:(@model) ->
```
Return all objects (with pagination, and scoping through accountId)
```coffeescript
  all: (accountId,options = {},cb = ->) =>
    return cb new Error "accountId parameter is required." unless accountId

    settings = 
        baseQuery:
          accountId : mongooseRestHelper.asObjectId accountId
        defaultSort: 'name'
        defaultSelect: null
        defaultCount: 1000
    mongooseRestHelper.all @model,settings,options, cb

```
Get an entity for it's id
```coffeescript
  get: (id,options = {}, cb = ->) =>
    return cb new Error "id parameter is required." unless id
    mongooseRestHelper.getById @model,id,null,options, cb

```
Destroy an entity
```coffeescript
  destroy: (id, options = {}, cb = ->) =>
    return cb new Error "id parameter is required." unless id
    settings = {}
    mongooseRestHelper.destroy @model,id, settings,{}, cb

```
Create an entity
```coffeescript
  create:(accountId,objs = {}, options = {}, cb = ->) =>
    return cb new Error "accountId parameter is required." unless accountId
    settings = {}
    objs.accountId = mongooseRestHelper.asObjectId accountId
    mongooseRestHelper.create @model,settings,objs,options,cb

```
Update an entity
```coffeescript
  patch: (id, obj = {}, options = {}, cb = ->) =>
    settings =
      exclude : UPDATE_EXCLUDEFIELDS
    mongooseRestHelper.patch @model,id, settings, obj, options, cb
```

## Stuff

* npm install
* grunt watch
* grunt deploy


## Contributing to mongoose-rest-helper
 
* Check out the latest master to make sure the feature hasn't been implemented or the bug hasn't been fixed yet
* Check out the issue tracker to make sure someone already hasn't requested it and/or contributed it
* Fork the project
* Start a feature/bugfix branch
* Commit and push until you are happy with your contribution
* Make sure to add tests for it. This is important so I don't break it in a future version unintentionally.
* Please try not to mess with the package.json, version, or history. If you want to have your own version, or is otherwise necessary, that is fine, but please isolate to its own commit so I can cherry-pick around it.

## Copyright

Copyright (c) 2013-2014 Martin Wawrusch See LICENSE for
further details.


