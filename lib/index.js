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
    Completely removes an element.
    @TODO We can add a fast mode later that does not query the item first.
    */

    destroy: function(model, id, settings, options, cb) {
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
      id = new ObjectId(id.toString());
      return model.findOne({
        _id: id
      }, function(err, item) {
        if (err) {
          return cb(err);
        }
        if (!item) {
          return cb(null);
        }
        return item.remove(function(err) {
          if (err) {
            return cb(err);
          }
          return cb(null, item);
        });
      });
    },
    /*
    Creates a new object in the  db
    */

    create: function(model, settings, objs, options, cb) {
      var m;
      if (settings == null) {
        settings = {};
      }
      if (objs == null) {
        objs = {};
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
      if (_.isFunction(options)) {
        cb = options;
        options = {};
      }
      m = new model(objs);
      return m.save(function(err) {
        if (err) {
          return cb(err);
        }
        return cb(null, m, true);
      });
    },
    patch: function(model, id, settings, obj, options, cb) {
      if (settings == null) {
        settings = {};
      }
      if (obj == null) {
        obj = {};
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
      if (_.isFunction(options)) {
        cb = options;
        options = {};
      }
      id = new ObjectId(id.toString());
      return model.findByIdAndUpdate({
        _id: id
      }, {
        $set: obj
      }, cb);
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