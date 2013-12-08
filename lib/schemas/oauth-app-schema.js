(function() {
  var OauthAppSchema, OauthClientSchema, OauthRedirectUriSchema, Schema, StatsType, errors, mongoose, pluginAccessibleBy, pluginCreatedBy, pluginDeleteParanoid, pluginTagsSimple, pluginTimestamp, _;

  _ = require('underscore');

  mongoose = require('mongoose');

  Schema = mongoose.Schema;

  OauthClientSchema = require('./oauth-client-schema');

  OauthRedirectUriSchema = require('./oauth-redirect-uri-schema');

  pluginTimestamp = require("mongoose-plugins-timestamp");

  pluginCreatedBy = require("mongoose-plugins-created-by");

  pluginDeleteParanoid = require("mongoose-plugins-delete-paranoid");

  pluginTagsSimple = require("mongoose-plugins-tags-simple");

  pluginAccessibleBy = require("mongoose-plugins-accessible-by");

  errors = require('some-errors');

  StatsType = {
    tokensGranted: {
      type: Number,
      "default": 0
    },
    tokensRevoked: {
      type: Number,
      "default": 0
    }
  };

  module.exports = OauthAppSchema = new mongoose.Schema({
    accountId: {
      type: mongoose.Schema.ObjectId,
      require: true,
      index: true
    },
    name: {
      type: String
    },
    websiteUrl: {
      type: String
    },
    imageUrl: {
      type: String
    },
    callbackUrl: {
      type: String
    },
    notes: {
      type: String
    },
    scopes: {
      type: [String],
      "default": []
    },
    revoked: {
      type: Number
    },
    description: {
      type: String,
      "default": ''
    },
    acceptTermsOfService: {
      type: Boolean,
      "default": false
    },
    isPublished: {
      type: Boolean,
      "default": false
    },
    organizationName: {
      type: String
    },
    organizationUrl: {
      type: String
    },
    tosAcceptanceDate: {
      type: Date,
      "default": function() {
        return null;
      }
    },
    clients: {
      type: [OauthClientSchema],
      "default": function() {
        return [];
      }
    },
    redirectUrls: {
      type: [OauthRedirectUriSchema],
      "default": function() {
        return [];
      }
    },
    stats: {
      type: StatsType,
      "default": function() {
        return {
          tokensGranted: 0,
          tokensRevoked: 0
        };
      }
    }
  }, {
    strict: true
  });

  OauthAppSchema.plugin(pluginTimestamp.timestamps);

  OauthAppSchema.plugin(pluginCreatedBy.createdBy, {
    isRequired: false,
    v: 2,
    keepV1: false
  });

  OauthAppSchema.plugin(pluginDeleteParanoid.deleteParanoid);

  OauthAppSchema.plugin(pluginTagsSimple.tagsSimple);

  OauthAppSchema.plugin(pluginAccessibleBy.accessibleBy, {
    defaultIsPublic: false
  });

  OauthAppSchema.virtual('key').get(function() {
    return this.clients[0].clientId;
  });

  OauthAppSchema.methods.toRest = function(baseUrl, actor) {
    var res,
      _this = this;
    res = {
      url: "" + baseUrl + "/" + this._id,
      id: this._id,
      name: this.name,
      description: this.description,
      websiteUrl: this.websiteUrl,
      imageUrl: this.imageUrl,
      callbackUrl: this.callbackUrl,
      notes: this.notes,
      scopes: this.scopes,
      revoked: this.revoked,
      acceptTermsOfService: this.acceptTermsOfService,
      isPublished: this.isPublished,
      organizationName: this.organizationName,
      organizationUrl: this.organizationUrl,
      tosAcceptanceDate: this.tosAcceptanceDate,
      clients: _.map(_.filter(this.clients || [], function(x) {
        return !x.revokedAt;
      }), function(x) {
        if (x.toRest) {
          return x.toRest("" + baseUrl + "/" + _this._id + "/clients", actor);
        } else {
          return x;
        }
      }),
      redirectUrls: this.redirectUrls,
      stats: this.stats,
      tags: this.tags,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      createdBy: this.createdBy,
      accessibleBy: this.accessibleBy,
      isDeleted: this.isDeleted || false,
      deletedAt: this.deletedAt || null
    };
    return res;
  };

}).call(this);

/*
//@ sourceMappingURL=oauth-app-schema.js.map
*/