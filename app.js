'use strict';
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
let http = require('http');
http = http.Server(app);

let MultiParser = require('./utility/multiparser');
app.use(MultiParser());
app.use(express.json({limit: '50mb', extended: true}));
app.use(cors());

app.get('/404',function(req, res){
    return res.send("Unauthorized Request!");
});
app.get('/error',function(req, res){
    return res.send("Unauthorized Request!");
});

let apiRoute = require('./routes/api');
app.use(apiRoute);

process.on('uncaughtException', function (err) {
    console.log("uncaughtException: ", err);
});

process.on("unhandledRejection", function(err){
    console.log("uncaughtException: ", err);
});

process.setMaxListeners(0);
let port = process.env.PORT;
http.listen(port, function () {
    console.log('tdcx server started! on '+port);
});