//var phantom = require('phantom');
require('events').EventEmitter.prototype._maxListeners = 100;
var WebSocketServer = require('ws').Server;
//var Nightmare = require('nightmare');
//var cheerio = require('cheerio');
//var Xray = require('x-ray');
var express = require('express');

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/test';
//var request = require('request');
//var cfenv = require('cfenv');
//options = {webPreferences:{webSecurity:true}};
//phantom.create({parameters: options}, function() {});

var findRestaurants = function(db, callback) {
   var cursor =db.collection('candidates').find( );
   cursor.each(function(err, doc) {
      assert.equal(err, null);
      if (doc != null) {
         console.log(doc);
      } else {
         callback();
      }
   });
};


var db;

MongoClient.connect(url, function(err, database) {
    db = database;
});

function findData (candidate){
    console.log('yayayya');
    console.log(candidate);
    var elems;
        db.collection('candidates').find({'name':{$regex:candidate, $options:'i'}}).toArray(function(err, items) {
    //return JSON.stringify(items);
            console.log(items);
            elems = items;
  })
    console.log(elems);
    return elems;
};


//MongoClient.connect(url, function(err, db) {
//  assert.equal(null, err);
//  findRestaurants(db, function() {
//      db.close();
//  });
//});

//var x = Xray();
var app = express();
//var appEnv = cfenv.getAppEnv();



//app.use(express.static(__dirname + '/public'));

//app.listen(9980, '0.0.0.0', function() {
//  console.log("server starting on ");
//});

var express = require('express');
var app = express();

app.use(express.static('public'));

app.get('/index.html', function (req, res) {
   res.sendFile( __dirname + "/" + "index.html" );
})

app.get('/process_get', function (req, res) {
    //console.log(req.query.q);
    candidate = req.query.q;
   // Prepare output in JSON format
   //response = [{'value':'Alan Garcia', 'uuid':9882899}, {'value':'Pedro Pablo Kuczinski', 'uuid':7278782}]
   //console.log(response);
   //res.send(JSON.stringify(response));
   // console.log(candidate);
   // items = findData(candidate);
   // console.log(items);
   // res.send(items);
  db.collection('candidates').find({'name':{$regex:candidate, $options:'i'}}).toArray(function(err, items) {
    res.send(JSON.stringify(items));
  })
})

app.get("/search", function(req, res) {
  db.collection('candidates').find().toArray(function(err, items) {
    res.send(items);
  })
});

var server = app.listen(9980, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})

//var port = (process.env.VCAP_APP_PORT || 9981);

wss = new WebSocketServer({port: '9981'});


//wss.on('connection', function(ws) {});

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
      console.log('received: %s', message);
      if (message != 'Hola') {

      items = {type: 'party', data: 'Peru Posible'}
  }else {
          items = {}
      }
      ws.send(JSON.stringify(items));
  });

//  ws.send('something');
});