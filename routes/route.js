
module.exports = function(router,passport){

	router.get('/success', function(req, res){
        res.send({state: 'success', user: req.user ? req.user : null});
    });

    //sends failure login state back to angular
    router.get('/fail', function(req, res){
        res.send({state: 'failure', user: null, message: "Invalid username or password"});
    });

	router.get('/',function(req,res){
		res.render('index.ejs');
	});
	
	router.post('/signup',passport.authenticate('local-signup',{	
		successRedirect : '/success',
		failureRedirect : '/fail',
	}));
	
	router.post('/login',passport.authenticate('local-login',{
		successRedirect : '/success',
		failureRedirect : '/fail'
	}));
	
	router.get('/logout',isLog,function(req,res){
		req.logout();
		console.log("user logged out")
		res.redirect('/')
	});

	function isLog(req,res,next){
		if(req.isAuthenticated())
			return next();
		else
			
			res.redirect('/login')

	}
};