var LocalStrategy   = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');
//temporary data store
var mongoose = require('mongoose');
var User = require('./models/userMode');
module.exports = function(passport){

    // Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function(user, done) {
        console.log('serializing user:',user.secure.username);
        return done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id,function(err,user){
            done(err,user);
        })
        

    });

    passport.use('local-login', new LocalStrategy({
            passReqToCallback : true
        },
        function(req, username, password, done) {
            var criteria = (username.indexOf('@') === -1) ? {'secure.mobile' : username} : {'secure.username' : username};
            User.findOne(criteria,function(err,user){
                if(err){
                    return done(err);
                }
                if(!user){
                    return done(null,false)
                }
                if(!isValidPassword(user,password)){
                    return done(null,false);
                }
                return done(null,user);
            })
            
        }
    ));

    passport.use('local-signup', new LocalStrategy({
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {
                 User.findOne({'secure.username' : username},function(err,user){
                console.log("in")
                if(err){
                    console.log("1")
                    return done(err);
                }
                if(user){
                    console.log("2")
                    return done(null,false);
                } else {
                        User.findOne({'secure.mobile' : req.body.mobile},function(err,user){
                            if(err){
                                return done(err);
                            }
                            if(user){
                                return done(null,false);
                            }
                            else{
                                var newUser = new User();
                                newUser.secure.username = username;
                                newUser.secure.password = createHash(password);
                                newUser.secure.mobile = req.body.mobile;
                                newUser.personal.fname = req.body.firstName;
                                newUser.personal.sname = req.body.secondName;
                                newUser.personal.gender = req.body.gender;
                                newUser.personal.aboutYou = req.body.aboutYou;
                                newUser.save(function(err){
                                if(err){
                                    throw err;
                                }
                                return done(null,newUser);
                                })
                                }
                        })
                }
            })
        })
    );

    var isValidPassword = function(user, password){
        return bCrypt.compareSync(password, user.secure.password);
    };
    // Generates hash using bCrypt
    var createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    };

};
