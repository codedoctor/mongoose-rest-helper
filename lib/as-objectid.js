(function() {
  var ObjectId, mongoose;

  mongoose = require("mongoose");

  ObjectId = mongoose.Types.ObjectId;


  /*
  Converts a value to an object id. Safety precaution for queries.
  @param id [String|ObjectId|null] takes an input string and converts it to a mongoose object if. Crashes if not a valid object id or null.
   */

  module.exports = function(id) {
    if (!id) {
      return null;
    }
    return new ObjectId(id.toString());
  };

}).call(this);

//# sourceMappingURL=as-objectid.js.map
