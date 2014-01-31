var Post = require('../models/post'),
	_    = require('underscore'),
	uuid = require('uuid'),
	fs   = require('fs');

var multipart           = require('connect-multiparty');
var multipartMiddleware = multipart();

var appController = function(app){
	console.log('appController is load');

	var isLogged = function (req,res,nest){
		if(!req.isAuthenticated()){
			res.redirect('/test');
			return;
		}
	};

	app.get('/test', function (req,res){
		Post.find().sort({ postdate : -1 })
		.exec(function (err, posts){
			var postJson = _.map(posts,function (post){
				return post.toJSON();
			});
			res.render('test',{
				posts : postJson
			});
		});
	});

	//POST SOCIAL LOG IN
	app.get('/app-social', function (req,res){

		if(!req.isAuthenticated()){
			res.render('app');
		}else{
			res.render('app-social',{
				login : true,
				user 	: req.session.passport.user.displayName,
				picture	: req.session.passport.user.photos[0].value
			});
		}
	});

	app.post('/social-post', function (req,res){
		console.log('doing request');
		console.log(req.body);

		var social = new Post({
			id : uuid.v1(),
			photo : req.body.picture-social,
			usermail : req.body.email-social,
			username : req.body.name-social,
			userage : parseInt(req.body.age-social, 10),
			usercity : req.body.city-social,
			usercountry : req.body.country-social,
			userfear : req.body.fear-social,
			useraspiration : req.body.aspiration-social,
			userregreat : req.body.regreat-social,
			socialog : 1,
			postActive : 1
		});

		social.save(function (err) {
            if (err) {
            	console.log('error');
                console.log(err);
                //res.send(500);
                return;
            }else{
            	res.redirect('/test');
            }
        });
	});

	//POST NORMAL

	app.get('/app', function (req,res){
		res.render('app');
		/*if(!req.isAuthenticated()){
			res.render('app');
		}else{
			//debugger;
			res.render('app',{
				login : true,
				user : req.session.passport.user.displayName,
				picture : req.session.passport.user.photos[0].value
			});	
		}*/
	});

	app.post('/post-far', multipartMiddleware, function (req,res){

		var post = new Post({
			id : uuid.v1(),
			usermail : req.body.email,
			username : req.body.name,
			userage : parseInt(req.body.age),
			usercity : req.body.city,
			usercountry : req.body.country,
			userfear : req.body.fear,
			useraspiration : req.body.aspiration,
			userregreat : req.body.regreat,
			socialog : 0,
			postActive : 1
		});

		
        post.save(function (err) {
            if (err) {
                console.log(err);
                res.send(500);
                return;
            }
            debugger;
            post.uploadImage(req.files.photo, function (err) {
                if (err) {
                    res.send(500);
                    return;
                }
                
            });

        });
        res.redirect('/test');
	});
};

module.exports = appController;
