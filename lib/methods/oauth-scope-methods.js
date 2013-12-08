(function() {
  var OauthScopeMethods, PageResult, Scope, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  _ = require('underscore-ext');

  Scope = require('../scope').Scope;

  PageResult = require('simple-paginator').PageResult;

  /*
  Provides methods to interact with the scope store.
  */


  module.exports = OauthScopeMethods = (function() {
    /*
    A hash of scopes.
    */

    OauthScopeMethods.prototype.loadedScopes = {};

    /*
    Initializes a new instance of the @see ScopeMethods class.
    @param {Object} models A collection of models to be used within the auth framework.
    @description
    The config object looks like this:
    ...
    scopes: [...]
    ...
    */


    function OauthScopeMethods(models, config) {
      var scope, scopeDefinition, _i, _len, _ref;
      this.models = models;
      this.getScope = __bind(this.getScope, this);
      this.allScopeNamesAsArray = __bind(this.allScopeNamesAsArray, this);
      this.get = __bind(this.get, this);
      this.all = __bind(this.all, this);
      if (config && config.scopes) {
        _ref = config.scopes;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          scopeDefinition = _ref[_i];
          scope = new Scope(scopeDefinition);
          if (scope.isValid()) {
            this.loadedScopes[scope.name] = scope;
          } else {
            console.log("Invalid scope in config - skipped - " + (JSON.stringify(scopeDefinition)));
          }
        }
      }
    }

    OauthScopeMethods.prototype.all = function(offset, count, options, cb) {
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
      return cb(null, new PageResult(this.loadedScopes || [], _.keys(this.loadedScopes).length, offset, count));
    };

    OauthScopeMethods.prototype.get = function(name, options, cb) {
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
      return cb(null, this.loadedScopes[name]);
    };

    /*
    Returns an array of all scope names
    @sync
    */


    OauthScopeMethods.prototype.allScopeNamesAsArray = function() {
      return _.pluck(_.values(this.loadedScopes), "name");
    };

    OauthScopeMethods.prototype.getScope = function(scope) {
      return this.loadedScopes[scope];
    };

    return OauthScopeMethods;

  })();

}).call(this);

/*
//@ sourceMappingURL=oauth-scope-methods.js.map
*/