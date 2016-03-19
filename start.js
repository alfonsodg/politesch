require('events').EventEmitter.prototype._maxListeners = 100;
var WebSocketServer = require('ws').Server;
var express = require('express');
var request = require("request")
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;


var url = 'mongodb://localhost:27017/politesch';
var db;
var app = express();


MongoClient.connect(url, function (err, database) {
    db = database;
});


app.use(express.static('public'));

app.get('/index.html', function (req, res) {
    res.sendFile(__dirname + "/" + "index.html");
})

app.get('/process_get', function (req, res) {
    //console.log(req.query.q);
    candidate = req.query.q;
    //console.log(candidate);
    db.collection('candidatos').find({
        'nombre_completo': {
            $regex: candidate,
            $options: 'i'
        }
    }).toArray(function (err, items) {
        res.send(JSON.stringify(items));
    })
})

app.get("/search", function (req, res) {
    db.collection('egresos').find().toArray(function (err, docs) {
        console.log("Returned #" + docs.length + " documents");
    });
});

var server = app.listen(9980, function () {

    var host = server.address().address
    var port = server.address().port

    console.log("Politesch Server at http://%s:%s", host, port)

})


wss = new WebSocketServer({port: '9981'});





wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
        data = JSON.parse(message);

        function external_query(target) {

            //console.log('-----');
            elems = target.split(' ');
            full_name = elems[0] + ' ' + elems[elems.length-2]
            var url = 'http://machinalix.com:8080/search?terms='+full_name+'&start_time=2016-03-12%2000:00:00&end_time=2016-03-19%2023:59:05'
            //console.log(url);
            request({
                url: url,
                json: true
            }, function (error, response, body) {

                if (!error && response.statusCode === 200) {
                    ndata = {type: 'menciones', data: body.results}
                    ws.send(JSON.stringify(ndata));
                    console.log(ndata);
                    //console.log(body) // Print the json response
                }
            });
        };

        if (data.type == 'candidato') {
            db.listCollections().toArray(function (err, cols) {
                cols.forEach(function (elem) {
                    collection_name = elem.name
                    //console.log(collection_name);
                    db.collection(collection_name).find({
                        'nombre_completo': {
                            $regex: data.name,
                            $options: 'i'
                        }
                    }, {
                        _id: 0, nombres: 0, apellidos: 0,
                        cargo_autoridad: 0, nombre_completo: 0,
                        organizacion_politica: 0
                    }).toArray(function (err, docs) {
                        //console.log(elem.name);
                        ndata = {type: elem.name, data: docs}

                        //console.log(ndata);
                        ws.send(JSON.stringify(ndata));
                    });
                })
            });
            //console.log('aaaa');
            //console.log(data.name);
            external_query(data.name);
            //console.log(ext);
        };
    });
});