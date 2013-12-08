(function() {
  var UserIdentitySchema, mongoose, _;

  mongoose = require('mongoose');

  _ = require('underscore');

  module.exports = UserIdentitySchema = new mongoose.Schema({
    provider: {
      type: String
    },
    key: {
      type: String
    },
    v1: {
      type: String
    },
    v2: {
      type: String
    },
    providerType: {
      type: String,
      "default": "oauth"
    },
    profileImage: {
      type: String,
      "default": ''
    },
    username: {
      type: String,
      "default": ''
    },
    displayName: {
      type: String,
      "default": ''
    }
  });

  UserIdentitySchema.methods.toRest = function(baseUrl, actor) {
    var res;
    res = {
      url: "" + baseUrl + "/" + this._id,
      id: this._id,
      provider: this.provider,
      key: this.key,
      v1: this.v1,
      v2: this.v2,
      providerType: this.providerType,
      username: this.username,
      displayName: this.displayName,
      profileImage: this.profileImage
    };
    return res;
  };

}).call(this);

/*
//@ sourceMappingURL=user-identity-schema.js.map
*/