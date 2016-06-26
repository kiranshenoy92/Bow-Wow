var mongoose = require('mongoose');
var Post = require('../models/postModel');
module.exports = function(app){
	
	function isAuthenticated (req, res, next) {
	if(req.method === "GET"){
		return next();
	}
	if (req.isAuthenticated()){
		return next();
	}
	console.log("auth")
	return res.redirect('/login');
};

//Register the authentication middleware
	app.use('/posts', isAuthenticated);


	app.get('/posts',function(req,res){
		Post.find(function(err,posts){
			if(err){
				return res.send(500,err);
			}
			return res.send(200,posts);
		})
	});

	app.post('/posts',function(req,res){
		var newPost = new Post();
		newPost.text = req.body.text;
		newPost.created_by = req.body.created_by;
		newPost.save(function(err,post){
			if(err){
				return  res.send(500,err);
			}
			return res.json(newPost);
		})
	});

	app.get('/post/:id',function(req,res){
		Post.findById(req.params.id, function(err,post){
			if(err){
				res.send(err);
			}
			res.json(post)
		})
	});
	app.put('/post/:id',function(req,res){
		Post.findById(req.params.id, function(err,post){
			if(err){
				res.send(err);
			}
			post.created_by = req.body.created_by;
			post.text = req.body.text;
			post.save(function(err){
				if(err){
					res.send(err)
				}
				res.json(post);

			})
		})
	});
	app.delete('/post/:id',function(req,res){
		Post.remove({_id:req.params.id},function(err){
			if(err){
				res.send(err)
			}
			res.json("deeted : (")
		})

	});
	


}