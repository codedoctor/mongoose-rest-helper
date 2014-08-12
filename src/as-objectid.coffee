mongoose = require "mongoose"
ObjectId = mongoose.Types.ObjectId

###
Converts a value to an object id. Safety precaution for queries.
###
module.exports = asObjectId = (id) ->
  return null unless id
  new ObjectId id.toString()

