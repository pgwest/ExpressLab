var fs = require('fs');
var http = require('http');
var url = require('url');
var readline = require('readline');

var ROOT_DIR = "nodeHtml";

http.createServer(function (req, res) {
  var urlObj = url.parse(req.url, true, false);
  // If this is our comments REST service
    console.log("opening " + ROOT_DIR+urlObj.pathname);
    console.log(urlObj);
  if(urlObj.pathname.indexOf("comment") !=-1) {
    console.log("comment route");
    if(req.method === "POST") {
      console.log("POST comment route");
        // First read the form data
    var jsonData = "";
    req.on('data', function (chunk) {
      jsonData += chunk;
    });
    req.on('end', function () {
      var reqObj = JSON.parse(jsonData);
      console.log(reqObj);
      console.log("Name: "+reqObj.Name);
      console.log("Comment: "+reqObj.Comment);
        
            // Now put it into the database
    var MongoClient = require('mongodb').MongoClient;
    MongoClient.connect("mongodb://localhost/weather", function(err, db) {
      if(err) throw err;
      db.collection('comments').insert(reqObj,function(err, records) {
        console.log("Record added as "+records[0]._id);
      });
        res.writeHead(200);
        res.end("");

    });
    });



    }
    else if (req.method === "GET"){
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
  }
  // var urlObj = url.parse(req.url, true, false);
  //   console.log("opening " + ROOT_DIR+urlObj.pathname);
  //   console.log(urlObj);
    else if(urlObj.pathname == "/getcity") {
        console.log("In Rest service");
//        res.writeHead(200);
        var myReg = new RegExp("^" + urlObj.query["q"]);
        var cities = [];
        var jsonResult = [];
        fs.readFile('nodeHtml/cities.dat.txt', function(err,data){
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
   else {
   // Normal static file
    fs.readFile(ROOT_DIR + urlObj.pathname, function (err,data) {
      if (err) {
        res.writeHead(404);
        res.end(JSON.stringify(err));
        return;
      }
      res.writeHead(200);
      res.end(data);
    });
  }
    

}).listen(3000);






