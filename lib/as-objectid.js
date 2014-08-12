(function() {
  var ObjectId, asObjectId, mongoose;

  mongoose = require("mongoose");

  ObjectId = mongoose.Types.ObjectId;


  /*
  Converts a value to an object id. Safety precaution for queries.
   */

  module.exports = asObjectId = function(id) {
    if (!id) {
      return null;
    }
    return new ObjectId(id.toString());
  };

}).call(this);

//# sourceMappingURL=as-objectid.js.map
