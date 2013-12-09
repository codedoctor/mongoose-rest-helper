/*
Smart helper functions.
*/


(function() {
  var ObjectId, PageResult, isObjectId, mongoose, _,
    _this = this;

  _ = require('underscore');

  mongoose = require("mongoose");

  ObjectId = mongoose.Types.ObjectId;

  isObjectId = require('mongodb-objectid-helper').isObjectId;

  PageResult = require('simple-paginator').PageResult;

  module.exports = {
    /*
    Query for a paged result against a collection.
    */

    all: function(model, settings, options, cb) {
      var baseQuery, defaultCount, defaultSelect, defaultSort, k, v;
      if (settings == null) {
        settings = {};
      }
      if (options == null) {
        options = {};
      }
      if (cb == null) {
        cb = function() {};
      }
      if (!model) {
        return cb(new Error("model parameter is required."));
      }
      baseQuery = settings.baseQuery || {};
      defaultSort = settings.defaultSort || null;
      defaultSelect = settings.defaultSelect || null;
      defaultCount = settings.defaultCount || 20;
      if (_.isFunction(options)) {
        cb = options;
        options = {};
      }
      options.where || (options.where = {});
      options.select || (options.select = defaultSelect);
      for (k in baseQuery) {
        v = baseQuery[k];
        options.where[k] = v;
      }
      return model.count(options.where, function(err, totalCount) {
        var query;
        if (err) {
          return cb(err);
        }
        query = model.find(options.where);
        if (options.select && options.select.length > 0) {
          query.select(options.select);
        }
        options.offset || (options.offset = 0);
        options.count || (options.count = defaultCount);
        query.setOptions({
          skip: options.offset,
          limit: options.count
        });
        query.sort(options.sort || defaultSort);
        return query.exec(function(err, items) {
          if (err) {
            return cb(err);
          }
          return cb(null, new PageResult(items || [], totalCount, options.offset, options.count));
        });
      });
    },
    /*
    Returns a single object through the id
    */

    getById: function(model, id, settings, options, cb) {
      var defaultSelect, query;
      if (settings == null) {
        settings = {};
      }
      if (options == null) {
        options = {};
      }
      if (cb == null) {
        cb = function() {};
      }
      if (!model) {
        return cb(new Error("model parameter is required."));
      }
      if (!id) {
        return cb(new Error("id parameter is required."));
      }
      defaultSelect = settings.defaultSelect || null;
      if (_.isFunction(options)) {
        cb = options;
        options = {};
      }
      options.select || (options.select = defaultSelect);
      id = new ObjectId(id.toString());
      query = model.findOne({
        _id: id
      });
      if (options.select && options.select.length > 0) {
        query = query.select(options.select);
      }
      return query.exec(cb);
    },
    /*
    Returns a single object base on query
    */

    getOne: function(model, settings, options, cb) {
      var baseQuery, defaultSelect, k, query, v;
      if (settings == null) {
        settings = {};
      }
      if (options == null) {
        options = {};
      }
      if (cb == null) {
        cb = function() {};
      }
      if (!model) {
        return cb(new Error("model parameter is required."));
      }
      defaultSelect = settings.defaultSelect || null;
      baseQuery = settings.baseQuery || {};
      if (_.isFunction(options)) {
        cb = options;
        options = {};
      }
      options.where || (options.where = {});
      options.select || (options.select = defaultSelect);
      for (k in baseQuery) {
        v = baseQuery[k];
        options.where[k] = v;
      }
      query = model.findOne(options.where);
      if (options.select && options.select.length > 0) {
        query = query.select(options.select);
      }
      return query.exec(cb);
    },
    /*
    Converts a value to an object id. Safety precaution for queries.
    */

    asObjectId: function(id) {
      if (!id) {
        return null;
      }
      return new ObjectId(id.toString());
    },
    /*
    Checks if a value is an object id.
    */

    isObjectId: function(val) {
      return isObjectId(val);
    }
  };

}).call(this);

/*
//@ sourceMappingURL=index.js.map
*/