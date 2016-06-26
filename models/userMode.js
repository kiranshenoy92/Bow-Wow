var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
	secure :{
		username : String,
		password : String,
		mobile : String,
		created_at: {type: Date, default: Date.now}
	},
	personal :{
		fname : String,
		sname : String,
		gender: String,
		aboutYou : String,
	}
});
userSchema.pre('save', function (next) {
  // capitalize
  this.personal.fname = this.personal.fname.charAt(0).toUpperCase() + this.personal.fname.slice(1);
  this.personal.sname = this.personal.sname.charAt(0).toUpperCase() + this.personal.sname.slice(1);
  next();
});

module.exports = mongoose.model('User',userSchema);