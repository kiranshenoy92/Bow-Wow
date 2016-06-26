var mongoose = require('mongoose');

var postSchema = mongoose.Schema({
	created_by: String,		//should be changed to ObjectId, ref "User"
	created_at: {type: Date, default: Date.now},
	text: String
});

module.exports = mongoose.model('Post',postSchema);