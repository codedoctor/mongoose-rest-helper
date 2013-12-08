(function() {
  var ObjectId, OrganizationMethods, PageResult, bcrypt, errors, isObjectId, mongoose, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  _ = require('underscore-ext');

  errors = require('some-errors');

  PageResult = require('simple-paginator').PageResult;

  mongoose = require("mongoose");

  ObjectId = mongoose.Types.ObjectId;

  bcrypt = require('bcryptjs');

  isObjectId = require('mongodb-objectid-helper').isObjectId;

  /*
  Provides methods to interact with scotties.
  */


  module.exports = OrganizationMethods = (function() {
    var CREATE_FIELDS, UPDATE_FIELDS;

    CREATE_FIELDS = ['name'];

    UPDATE_FIELDS = ['name', 'description', 'tags'];

    /*
    Initializes a new instance of the @see ScottyMethods class.
    @param {Object} models A collection of models that can be used.
    */


    function OrganizationMethods(models) {
      this.models = models;
      this.getByNameOrId = __bind(this.getByNameOrId, this);
      this.getByName = __bind(this.getByName, this);
      this.get = __bind(this.get, this);
      this.all = __bind(this.all, this);
      if (!this.models) {
        throw new Error("models parameter is required");
      }
    }

    OrganizationMethods.prototype.all = function(offset, count, options, cb) {
      var _this = this;
      if (offset == null) {
        offset = 0;
      }
      if (count == null) {
        count = 25;
      }
      if (options == null) {
        options = {};
      }
      if (cb == null) {
        cb = function() {};
      }
      if (_.isFunction(options)) {
        cb = options;
        options = {};
      }
      return this.models.Organization.count(function(err, totalCount) {
        if (err) {
          return cb(err);
        }
        return _this.models.Organization.find({}, null, {
          skip: offset,
          limit: count
        }, function(err, items) {
          if (err) {
            return cb(err);
          }
          return cb(null, new PageResult(items || [], totalCount, offset, count));
        });
      });
    };

    /*
    Looks up a user by id.
    */


    OrganizationMethods.prototype.get = function(id, options, cb) {
      var _this = this;
      if (options == null) {
        options = {};
      }
      if (cb == null) {
        cb = function() {};
      }
      if (_.isFunction(options)) {
        cb = options;
        options = {};
      }
      id = new ObjectId(id.toString());
      return this.models.Organization.findOne({
        _id: id
      }, function(err, item) {
        if (err) {
          return cb(err);
        }
        return cb(null, item);
      });
    };

    OrganizationMethods.prototype.getByName = function(accountId, name, options, cb) {
      var _this = this;
      if (options == null) {
        options = {};
      }
      if (cb == null) {
        cb = function() {};
      }
      if (_.isFunction(options)) {
        cb = options;
        options = {};
      }
      return this.models.Organization.findOne({
        name: name
      }, function(err, item) {
        if (err) {
          return cb(err);
        }
        return cb(null, item);
      });
    };

    OrganizationMethods.prototype.getByNameOrId = function(accountId, nameOrId, options, cb) {
      if (options == null) {
        options = {};
      }
      if (cb == null) {
        cb = function() {};
      }
      if (_.isFunction(options)) {
        cb = options;
        options = {};
      }
      if (isObjectId(nameOrId)) {
        return this.get(nameOrId, cb);
      } else {
        return this.getByName(nameOrId, cb);
      }
    };

    return OrganizationMethods;

  })();

}).call(this);

/*
//@ sourceMappingURL=organization-methods.js.map
*/