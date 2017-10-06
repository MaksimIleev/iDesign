var express = require('express');
var bodyParser = require('body-parser');
var ServiceModel = require('../models/serviceModel.js');
var indexRouter = express.Router();
indexRouter.use(bodyParser.json());

/* GET home page. */
indexRouter.route('/')
	.get(function(req, res, next) {
    ServiceModel.find({'_id' : 'landscapeContent'}, function(err, doc) {
			if(err) throw err;
			 console.log(doc[0].serviceSubList);
			 res.render('index', {
				 data:doc,
				 subList:doc[0].serviceSubList
			 });
		})
});

module.exports = indexRouter;
