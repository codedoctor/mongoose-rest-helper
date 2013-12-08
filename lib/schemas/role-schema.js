(function() {
  var RoleSchema, mongoose;

  mongoose = require('mongoose');

  module.exports = RoleSchema = new mongoose.Schema({
    accountId: {
      type: mongoose.Schema.ObjectId,
      require: true,
      index: true
    },
    name: {
      type: String,
      unique: true
    },
    description: {
      type: String
    },
    isInternal: {
      type: Boolean,
      "default": false
    }
  });

  RoleSchema.index({
    accountId: 1,
    name: 1
  }, {
    unique: true,
    sparse: false
  });

}).call(this);

/*
//@ sourceMappingURL=role-schema.js.map
*/