(function() {
  var OauthClientSchema, Schema, mongoose, passgen;

  mongoose = require('mongoose');

  Schema = mongoose.Schema;

  passgen = require('passgen');

  module.exports = OauthClientSchema = new mongoose.Schema({
    accountId: {
      type: mongoose.Schema.ObjectId,
      require: true,
      index: true
    },
    clientId: {
      type: String,
      unique: true,
      sparse: true,
      "default": function() {
        return passgen.create(20);
      }
    },
    secret: {
      type: String,
      "default": function() {
        return passgen.create(40);
      }
    },
    createdAt: {
      type: Date,
      "default": function() {
        return new Date();
      }
    },
    revokedAt: {
      type: Date,
      "default": function() {
        return null;
      }
    }
  }, {
    strict: true
  });

  OauthClientSchema.index({
    accountId: 1,
    name: 1
  }, {
    unique: true,
    sparse: false
  });

  OauthClientSchema.methods.toRest = function(baseUrl, actor) {
    var res;
    res = {
      url: "" + baseUrl + "/" + this._id,
      id: this._id,
      clientId: this.clientId,
      secret: this.secret,
      createdAt: this.createdAt,
      revokedAt: this.revokedAt
    };
    return res;
  };

}).call(this);

/*
//@ sourceMappingURL=oauth-client-schema.js.map
*/