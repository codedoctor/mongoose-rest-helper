(function() {
  var OauthAppMethods, PageResult, errors, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  _ = require('underscore-ext');

  errors = require('some-errors');

  PageResult = require('simple-paginator').PageResult;

  module.exports = OauthAppMethods = (function() {
    var APP_CREATE_FIELDS, KEY_LENGTH, SECRET_LENGTH;

    KEY_LENGTH = 20;

    SECRET_LENGTH = 40;

    APP_CREATE_FIELDS = ['name', 'websiteUrl', 'imageUrl', 'notes', 'tosAcceptanceDate', 'scope', 'description', 'acceptTermsOfService', 'isPublished', 'organizationName', 'organizationUrl'];

    function OauthAppMethods(models, scopeMethods) {
      this.models = models;
      this.scopeMethods = scopeMethods;
      this.patch = __bind(this.patch, this);
      this.resetAppKeys = __bind(this.resetAppKeys, this);
      this.destroy = __bind(this.destroy, this);
      this.get = __bind(this.get, this);
      this.getAppsForUser = __bind(this.getAppsForUser, this);
      this.all = __bind(this.all, this);
      this.create = __bind(this.create, this);
      if (!this.models) {
        throw new Error("models parameter is required");
      }
      if (!this.scopeMethods) {
        throw new Error("scopeMethods parameter is required");
      }
    }

    /*
    Create a new oauth client.
    */


    OauthAppMethods.prototype.create = function(accountId, objs, options, cb) {
      var data, model, oAuthClient, optionalClientId, optionalSecret,
        _this = this;
      if (objs == null) {
        objs = {};
      }
      if (options == null) {
        options = {};
      }
      if (cb == null) {
        cb = function() {};
      }
      if (!accountId) {
        return cb(new Error("accountId parameter is required."));
      }
      if (!objs.createdByUserId) {
        return cb(new Error("objs.createdByUserId parameter is required."));
      }
      if (_.isFunction(options)) {
        cb = options;
        options = {};
      }
      objs.accountId = new ObjectId(accountId.toString());
      optionalClientId = objs.clientId;
      optionalSecret = objs.secret;
      data = {};
      /*
      @TODO Make this safe, but invert it.
      */

      _.extendFiltered(data, APP_CREATE_FIELDS, objs);
      data.createdByUserId = objs.createdByUserId;
      data.scopes = this.scopeMethods.allScopeNamesAsArray();
      model = new this.models.OauthApp(data);
      if (objs.callbackUrl) {
        model.redirectUrls.push(new this.models.OauthRedirectUri({
          uri: objs.callbackUrl
        }));
      }
      oAuthClient = new this.models.OauthClient();
      if (optionalClientId) {
        oAuthClient.clientId = optionalClientId;
      }
      if (optionalSecret) {
        oAuthClient.secret = optionalSecret;
      }
      model.clients.push(oAuthClient);
      return model.save(function(err) {
        if (err) {
          return cb(err);
        }
        return cb(null, model);
      });
    };

    /*
    Retrieves all oauth apps for a specific accountId
    */


    OauthAppMethods.prototype.all = function(accountId, options, cb) {
      var _this = this;
      if (options == null) {
        options = {};
      }
      if (cb == null) {
        cb = function() {};
      }
      if (!accountId) {
        return cb(new Error("accountId parameter is required."));
      }
      if (_.isFunction(options)) {
        cb = options;
        options = {};
      }
      options.where || (options.where = {});
      options.where.accountId = new ObjectId(accountId.toString());
      return this.models.OauthApp.count(options.where, function(err, totalCount) {
        var query;
        if (err) {
          return cb(err);
        }
        query = _this.models.OauthApp.find(options.where);
        if (options.select && options.select.length > 0) {
          query.select(options.select);
        }
        options.offset || (options.offset = 0);
        options.count || (options.count = 20);
        query.setOptions({
          skip: options.offset,
          limit: options.count
        });
        query.sort(options.sort || 'name');
        return query.exec(function(err, items) {
          if (err) {
            return cb(err);
          }
          return cb(null, new PageResult(items || [], totalCount, options.offset, options.count));
        });
      });
    };

    /*
    Retrieves apps for a specific user, within the accountId scope.
    */


    OauthAppMethods.prototype.getAppsForUser = function(accountId, owningUserId, options, cb) {
      if (options == null) {
        options = {};
      }
      if (cb == null) {
        cb = function() {};
      }
      if (!accountId) {
        return cb(new Error("accountId parameter is required."));
      }
      if (!owningUserId) {
        return cb(new Error("owningUserId parameter is required."));
      }
      if (_.isFunction(options)) {
        cb = options;
        options = {};
      }
      options.where || (options.where = {});
      options.where.createdByUserId = new ObjectId(owningUserId.toString());
      return this.getAll(accountId, options, cb);
    };

    /*
    returns a specific oauth app.
    */


    OauthAppMethods.prototype.get = function(oauthAppId, options, cb) {
      var _this = this;
      if (options == null) {
        options = {};
      }
      if (cb == null) {
        cb = function() {};
      }
      if (!oauthAppId) {
        return cb(new Error("oauthAppId parameter is required."));
      }
      if (_.isFunction(options)) {
        cb = options;
        options = {};
      }
      oauthAppId = new ObjectId(oauthAppId.toString());
      return this.models.OauthApp.findOne({
        _id: oauthAppId
      }, function(err, item) {
        if (err) {
          return cb(err);
        }
        return cb(null, item);
      });
    };

    /*
    Completely destroys an app.
    */


    OauthAppMethods.prototype.destroy = function(oauthAppId, options, cb) {
      var _this = this;
      if (options == null) {
        options = {};
      }
      if (cb == null) {
        cb = function() {};
      }
      if (!oauthAppId) {
        return cb(new Error("oauthAppId parameter is required."));
      }
      if (_.isFunction(options)) {
        cb = options;
        options = {};
      }
      oauthAppId = new ObjectId(oauthAppId.toString());
      return this.models.OauthApp.remove({
        _id: oauthAppId
      }, function(err) {
        if (err) {
          return cb(err);
        }
        return cb(null);
      });
    };

    /*
    Reset the app keys for an app.
    */


    OauthAppMethods.prototype.resetAppKeys = function(oauthAppId, options, cb) {
      var _this = this;
      if (options == null) {
        options = {};
      }
      if (cb == null) {
        cb = function() {};
      }
      if (!oauthAppId) {
        return cb(new Error("oauthAppId parameter is required."));
      }
      if (_.isFunction(options)) {
        cb = options;
        options = {};
      }
      oauthAppId = new ObjectId(oauthAppId.toString());
      return this.models.OauthApp.findOne({
        _id: oauthAppId
      }, function(err, item) {
        if (err) {
          return cb(err);
        }
        item.clients[0].clientId = passgen.create(KEY_LENGTH);
        item.clients[0].secret = passgen.create(SECRET_LENGTH);
        return item.save(function(err) {
          if (err) {
            return cb(err);
          }
          return cb(null, item);
        });
      });
    };

    /*
    Update an app.
    */


    OauthAppMethods.prototype.patch = function(oauthAppId, data, options, cb) {
      var _this = this;
      if (data == null) {
        data = {};
      }
      if (options == null) {
        options = {};
      }
      if (cb == null) {
        cb = function() {};
      }
      if (!oauthAppId) {
        return cb(new Error("oauthAppId parameter is required."));
      }
      if (_.isFunction(options)) {
        cb = options;
        options = {};
      }
      oauthAppId = new ObjectId(oauthAppId.toString());
      return this.models.OauthApp.findOne({
        _id: oauthAppId
      }, function(err, item) {
        if (err) {
          return cb(err);
        }
        _.extend(item, data);
        return item.save(function(err) {
          if (err) {
            return cb(err);
          }
          return cb(null, item);
        });
      });
    };

    return OauthAppMethods;

  })();

}).call(this);

/*
//@ sourceMappingURL=oauth-app-methods.js.map
*/