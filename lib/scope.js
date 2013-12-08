(function() {
  var _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  _ = require('underscore');

  exports.Scope = (function() {
    function Scope(definition) {
      if (definition == null) {
        definition = {};
      }
      this.toRest = __bind(this.toRest, this);
      this.isValid = __bind(this.isValid, this);
      _.extend(this, definition);
    }

    Scope.prototype.isValid = function() {
      return this.name && this.name.length > 0;
    };

    Scope.prototype.toRest = function(baseUrl, actor) {
      var res;
      res = {
        slug: this.name,
        name: this.name,
        description: this.description || '',
        developerDescription: this.developerDescription || '',
        roles: this.roles || []
      };
      res.url = "" + baseUrl + "/" + this.name;
      return res;
    };

    return Scope;

  })();

}).call(this);

/*
//@ sourceMappingURL=scope.js.map
*/