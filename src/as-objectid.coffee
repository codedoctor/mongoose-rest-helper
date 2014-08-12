mongoose = require "mongoose"
ObjectId = mongoose.Types.ObjectId

###
Converts a value to an object id. Safety precaution for queries.
@param id [String|ObjectId|null] takes an input string and converts it to a mongoose object if. Crashes if not a valid object id or null.
###
module.exports = (id) ->
  return null unless id
  new ObjectId id.toString()

