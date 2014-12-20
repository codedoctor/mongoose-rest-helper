
/*
Smart helper functions
 */

(function() {
  var Hoek, ObjectId, PageResult, asObjectId, i18n, isObjectId, mongoose, _;

  _ = require('underscore');

  asObjectId = require('./as-objectid');

  Hoek = require('hoek');

  mongoose = require("mongoose");

  ObjectId = mongoose.Types.ObjectId;

  isObjectId = require('mongodb-objectid-helper').isObjectId;

  i18n = require('./i18n');

  PageResult = require('./page-result');

  module.exports = {

    /*
    Query against a collection, returns a paginated result.
    @param model [Object] a mongoose model. Required.
    @param settings [Object] settings to specify the nature of the query.
    @param options [Object] consumer overrides for your settings. See below for an explanation of this.
    @param cb [Function,null] callback invoked after completion.
    @example
    This example implements a convenience function that adds a tenant _id to all queries.
    See how options are passed to this method, and settings are used to configure it.
    ```coffeescript
    myClient = 
      all:(_tenantId,options = {}, cb = ->) =>
        return cb new Error "_tenantId parameter is required." unless _tenantId
    
        settings = 
            baseQuery:
              _tenantId : mongooseRestHelper.asObjectId _tenantId
            defaultSort: 'name'
            defaultSelect: null
            defaultCount: 20
    
        mongooseRestHelper.all @models.OauthApp,settings,options, cb
    
    ```
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
      Hoek.assert(model, i18n.assertModuleRequired);
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
        if (_.isString(options.select) && options.select.length > 0) {
          query.select(options.select);
        } else if (_.isObject(options.select) && _.keys(options.select).length > 0) {
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
      Hoek.assert(model, i18n.assertModuleRequired);
      Hoek.assert(id, i18n.assertIdRequired);
      defaultSelect = settings.defaultSelect || null;
      if (_.isFunction(options)) {
        cb = options;
        options = {};
      }
      options.select || (options.select = defaultSelect);
      query = model.findOne({
        _id: asObjectId(id)
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
      Hoek.assert(model, i18n.assertModuleRequired);
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
      Hoek.assert(model, i18n.assertModuleRequired);
      Hoek.assert(id, i18n.assertIdRequired);
      return model.findOne({
        _id: asObjectId(id)
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
      Hoek.assert(model, i18n.assertModuleRequired);
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

    /*
    Performs a selective update of fields present. 
    @param settings[StringArray] exclude array of field names that are always ignored when updating this
     */
    patch: function(model, id, settings, obj, options, cb) {
      var fieldName, _i, _len, _ref;
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
      Hoek.assert(model, i18n.assertModuleRequired);
      Hoek.assert(id, i18n.assertIdRequired);
      _ref = settings.exclude || [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        fieldName = _ref[_i];
        delete obj[fieldName];
      }
      if (_.isFunction(options)) {
        cb = options;
        options = {};
      }
      return model.findByIdAndUpdate({
        _id: asObjectId(id)
      }, {
        $set: obj
      }, cb);
    },

    /*
    Converts a value to an object id. Safety precaution for queries.
    @param id [String|ObjectId|null] takes an input string and converts it to a mongoose object if. Crashes if not a valid object id or null.
     */
    asObjectId: function(id) {
      return asObjectId(id);
    },

    /*
    Checks if a value is an object id.
    @param val [Object] value that is or is not an objectid.
     */
    isObjectId: function(val) {
      return isObjectId(val);
    }
  };

}).call(this);

//# sourceMappingURL=index.js.map
