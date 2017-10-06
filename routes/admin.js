//mongoose import
var mongoose = require('mongoose');
var express = require('express');
var bodyParser = require('body-parser');
// File System
var fs = require("fs");
var multer = require("multer");
var storage =  multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname);
  }
});
var upload = multer({storage: storage});

var adminRouter = express.Router();
var ServiceModel = require('../models/serviceModel.js');

adminRouter.use(bodyParser.urlencoded({extended: true}));
adminRouter.use(bodyParser.json());

// images mongo
var url = 'mongodb://localhost:27017/images';
mongoose.connect(url);
mongoose.connect(url, { useMongoClient: true });
var conn = mongoose.connection;

var gfs;

var Grid = require("gridfs-stream");
var mongodriver = mongoose.mongo;

conn.once("open", function() {
  console.log('Connected to images DB');
  gfs = Grid(conn.db, mongodriver);

  // admin/
  adminRouter.route('/')
  	.get(function(req,res) {
      ServiceModel.find({'_id' : 'landscapeContent'}, function(err, doc) {
  			if(err) throw err;
  			 console.log(doc[0].serviceSubList);
  			 res.render('upload', {
  				 data:doc,
  				 subList:doc[0].serviceSubList
  			 });
  		})
  });

adminRouter.route('/images/:name')
  .get(function(req,res) {
    var idesignCol = [];
    var imageCol = [];

    //images collection
    gfs = Grid(conn.db, mongodriver);
    console.log(req.params.name);
    gfs.files.find({
        filename: req.params.name
    }).toArray((err, files) => {

        if (files.length === 0) {
            return res.status(400).send({
                message: 'File not found'
            });
        }
        let data = [];
        let readstream = gfs.createReadStream({
            filename: files[0].filename
        });

        readstream.on('data', (chunk) => {
            data.push(chunk);
        });

        readstream.on('end', () => {
            data = Buffer.concat(data);
            imageCol = 'data:image/png;base64,' + Buffer(data).toString('base64');
            // idesign collection
            ServiceModel.find({'_id' : 'landscapeContent'}, function(err, result) {
              if(err) throw err;
                idesignCol = result;
                console.log('idesign: ' + idesignCol );
            })

            res.render('upload', {
              data:[idesignCol],
              subList:[idesignCol.serviceSubList],
              img:[imageCol]
            })
        });

        readstream.on('error', (err) => {
            console.log('An error occurred!', err);
            throw err;
        });
    });

});

  adminRouter.route('/landscapeMainImage')
    .post(upload.single("landscapeMainImage"), function(req, res, next) {
      //create a gridfs-stream into which we pipe multer's temporary file saved in uploads. After which we delete multer's temp file.
    //console.log(req.file);
    // try to remove file if exists
    gfs.remove({ filename: 'landscapeMainImage' });
    var writestream = gfs.createWriteStream({
      filename: 'landscapeMainImage',
      mode: 'w',
    });
    //
    // //pipe multer's temp file /uploads/filename into the stream we created above. On end deletes the temporary file.
    fs.createReadStream("./uploads/" + req.file.filename)
      .on("end", function() {
        fs.unlink("./uploads/"+ req.file.filename, function(err) {
          res.redirect("/admin")
        })
      })
      .on("err", function() {
        res.send("Error uploading image")
      })
      .pipe(writestream);
  });

  adminRouter.route('/landscapeImages')
    .post(upload.any(), function(req, res, next) {

    let filesCount = req.files.length;
    console.log('length: ' + filesCount);
    req.files.map(function (file) {
     console.log(file);
      let writestream = gfs.createWriteStream({
        filename: 'landscapeImage',
        metadata: 'landscapeImage'
      });

      fs.createReadStream('./uploads/' + file.filename)
        .on("end", function () {
          fs.unlink('./uploads/' + file.filename,
            function (err) {
              if (err) {
                console.log("Error: " + err);
              }
              if (--filesCount == 0) {
                next();
              }
            }
          )
        }).pipe(writestream);

        return writestream;
    });

    res.render('/admin');

  });

  // upload content
  adminRouter.route('/upload')
   .post(function(req, res) {
     console.log(req.params.content);
     ServiceModel.findByIdAndUpdate(req.params.content, {
         $set: req.body
     }, {
         new: true
     }, function (err, content) {
         if (err) throw err;
         res.redirect('/admin');
     });
   });

  // get image
  adminRouter.route('/img/:filename')
  .get(function(req, res) {
      var readstream = gfs.createReadStream({filename: req.params.filename});
      readstream.on("error", function(err){
        res.send("No image found with that title");
      });
      //console.log(res);
      readstream.pipe(res);
  });


  // get content
  adminRouter.get('/content', (req, res) => {
      gfs.files.find({
          filename: req.params.imgname
      }).toArray((err, files) => {

          if (files.length === 0) {
              return res.status(400).send({
                  message: 'File not found'
              });
          }
          let data = [];
          let readstream = gfs.createReadStream({
              filename: files[0].filename
          });

          readstream.on('data', (chunk) => {
              data.push(chunk);
          });

          readstream.on('end', () => {
              data = Buffer.concat(data);
              let img = 'data:image/png;base64,' + Buffer(data).toString('base64');
              ServiceModel.find({'_id' : 'landscapeContent'}, function(err, doc) {
          			if(err) throw err;
          			 console.log(doc[0].serviceSubList);
          			 res.render('upload', {
                   img: img,
          				 data:doc,
          				 subList:doc[0].serviceSubList
          			 });
          		})
              //res.render('upload', {img});
          });

          readstream.on('error', (err) => {
              console.log('An error occurred!', err);
              throw err;
          });
      });
  });

});

module.exports = adminRouter;
