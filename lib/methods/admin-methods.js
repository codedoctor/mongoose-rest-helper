(function() {
  var AdminMethods, ObjectId, bcrypt, errors, mongoose, passgen, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  _ = require('underscore-ext');

  errors = require('some-errors');

  mongoose = require("mongoose");

  ObjectId = mongoose.Types.ObjectId;

  bcrypt = require('bcryptjs');

  passgen = require('passgen');

  /*
  Provides methods to interact with scotties.
  */


  module.exports = AdminMethods = (function() {
    /*
    Initializes a new instance of the @see ScottyMethods class.
    @param {Object} models A collection of models that can be used.
    */

    function AdminMethods(models, users, oauthApps, oauthAuth) {
      this.models = models;
      this.users = users;
      this.oauthApps = oauthApps;
      this.oauthAuth = oauthAuth;
      this.setup = __bind(this.setup, this);
      if (!this.models) {
        throw new Error("models parameter is required");
      }
      if (!this.users) {
        throw new Error("users parameter is required");
      }
      if (!this.oauthApps) {
        throw new Error("oauthApps parameter is required");
      }
      if (!this.oauthAuth) {
        throw new Error("oauthAuth parameter is required");
      }
    }

    AdminMethods.prototype.setup = function(accountId, appName, username, email, password, clientId, secret, cb) {
      var adminUser,
        _this = this;
      if (clientId == null) {
        clientId = null;
      }
      if (secret == null) {
        secret = null;
      }
      if (cb == null) {
        cb = function() {};
      }
      adminUser = {
        accountId: accountId,
        username: username,
        password: password,
        email: email
      };
      return this.users.create(adminUser, function(err, user) {
        var appData;
        if (err) {
          return cb(err);
        }
        appData = {
          accountId: accountId,
          name: appName,
          clientId: clientId,
          secret: secret
        };
        return _this.oauthApps.create(appData, user.toActor(), function(err, app) {
          if (err) {
            return cb(err);
          }
          clientId = app.clients[0].clientId;
          if (!clientId) {
            return cb(new Error("Failed to create app client"));
          }
          return _this.oauthAuth.createOrReuseTokenForUserId(user._id, clientId, null, null, null, function(err, token) {
            if (err) {
              return cb(err);
            }
            if (!token) {
              return cb(new errors.NotFound(req.url));
            }
            token = {
              accessToken: token.accessToken,
              refreshToken: token.refreshToken
            };
            return cb(null, app, user, token);
          });
        });
      });
    };

    return AdminMethods;

  })();

}).call(this);

/*
//@ sourceMappingURL=admin-methods.js.map
*/