var express = require('express');
var https = require('https');
var http = require('http');
var fs = require('fs');
var url = require('url');
var app = express();
var bodyParser = require('body-parser');

var options = {
    host: '127.0.0.1',
    key: fs.readFileSync('ssl/server.key'),
    cert: fs.readFileSync('ssl/server.crt')
};
  http.createServer(app).listen(80);
  https.createServer(options, app).listen(443);
  app.get('/', function (req, res) {
    res.send("Get Index");
  });
  app.use('/', express.static('./html', {maxAge: 60*60*1000}));
  app.get('/getcity', function (req, res) {
    console.log("In getcity route");
    // res.json([{city:"Price"},{city:"Provo"}]);
    var ROOT_DIR = "html";
    var urlObj = url.parse(req.url, true, false);
    console.log("opening " + ROOT_DIR+urlObj.pathname);
    console.log(urlObj);
        if(urlObj.pathname == "/getcity") {
        console.log("In Rest service");
//        res.writeHead(200);
        var myReg = new RegExp("^" + urlObj.query["q"]);
        var cities = [];
        var jsonResult = [];
        fs.readFile('html/cities.dat.txt', function(err,data){
           if(err){
            res.writeHead(400);
               res.end(JSON.stringify(err));
               console.log("400 error");
               return;
           }
            cities = data.toString().split("\n");
            for(var i=0; i<cities.length; i++){
                var result = cities[i].search(myReg);
                if(result != -1){
                    jsonResult.push({city:cities[i]});   
                }
                console.log(cities[i]);   
            }
            res.writeHead(200);
            res.end(JSON.stringify(jsonResult));
            
//            res.end(JSON.stringify(cities));

        });
    }
    else{
        fs.readFile(ROOT_DIR + urlObj.pathname, function (err,data) {
        console.log("ROOT DIr + urlobj.path = " + ROOT_DIR + urlObj.pathname);
        if (err) {
          res.writeHead(404);
          res.end(JSON.stringify(err));
          return;
        }
        res.writeHead(200);
        res.end(data);
            
          });
    }
  });
    app.use(bodyParser());
    app.get('/comment', function (req, res) {
        var ROOT_DIR = "html";      
        var urlObj = url.parse(req.url, true, false);
        console.log("opening " + ROOT_DIR+urlObj.pathname);
        console.log("In comment route");
        if(urlObj.pathname.indexOf("comment") !=-1) {
        console.log("comment route");
      
               console.log("In GET"); 
    // Read all of the database entries and return them in a JSON array
          var MongoClient = require('mongodb').MongoClient;
          MongoClient.connect("mongodb://localhost/weather", function(err, db) {
            if(err) throw err;
            db.collection("comments", function(err, comments){
              if(err) throw err;
              comments.find(function(err, items){
                items.toArray(function(err, itemArr){
                  console.log("Document Array: ");
                  console.log(itemArr);
                res.writeHead(200);
                res.end(JSON.stringify(itemArr));
                });
              });
            });
          });   

      }
      });


  app.post('/comment', function (req, res) {
    console.log("In POST comment route");
    console.log(req.body);
    var ROOT_DIR = "html";
    var urlObj = url.parse(req.url, true, false);
    console.log("opening " + ROOT_DIR+urlObj.pathname);
      console.log("POST comment route");
        // First read the form data
    var jsonData = "";
    // req.on('data', function (chunk) {
    //   jsonData += chunk;
    //   console.log("json data added");
    // });
    // req.on('end', function () {
      // var reqObj = JSON.parse(jsonData);
      // var reqObj = JSON.parse(req.body);
      var reqObj = {};
      reqObj.Name = req.body.Name;
      reqObj.Comment = req.body.Comment;
      console.log(reqObj);
      console.log("Name: "+reqObj.Name);
      console.log("Comment: "+reqObj.Comment);
        
            // Now put it into the database
    var MongoClient = require('mongodb').MongoClient;
    MongoClient.connect("mongodb://localhost/weather", function(err, db) {
      if(err) throw err;
      db.collection('comments').insert(reqObj,function(err, records) {
        // console.log("Record added as "+records[0]._id);
      });
        res.writeHead(200);
        res.end("");

    });
    // });



    // res.status(200);
    // res.end();
  });

