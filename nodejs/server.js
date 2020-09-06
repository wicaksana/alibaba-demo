var express = require('express');
var app = express();
const path = require('path');
const router = express.Router();
const os = require('os');
const MongoClient = require('mongodb').MongoClient


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//MongoClient.connect('mongodb://localhost:27017/access_log', { useUnifiedTopology: true })
MongoClient.connect('mongodb://root:{PASSWORD}@dds-d9jaa51b4469ff841.mongodb.ap-southeast-5.rds.aliyuncs.com:3717,dds-d9jaa51b4469ff842.mongodb.ap-southeast-5.rds.aliyuncs.com:3717/admin?replicaSet=mgset-1100638995', { useUnifiedTopology: true })
    .then(client => {
        const db = client.db('access-log');
        const access = db.collection('access');

        app.get('/', function (request, response) {
            access.insertOne({source_ip: request.headers['x-forwarded-for'], time: new Date().toLocaleString("en", {timeZoneName: "short", timeZone: 'Asia/Jakarta'})})
                .then(res => console.log(res.ops))
                .catch(err => console.log(err));

            db.collection('access').find().sort({_id:-1}).limit(10).toArray()
                .then(res => response.render('layout', { 'server_hostname': os.hostname(), 'logs': res }))
                .catch(err => console.log(err));
        })
            
        var server = app.listen(8081, function () {
            var host = server.address().address
            var port = server.address().port
            
            console.log("Example app listening at http://%s:%s", host, port)
        })
    });
