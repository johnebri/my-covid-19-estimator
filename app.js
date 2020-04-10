// var http = require('http');
const express = require('express');

const Estimator = require('./src/MyEstimator');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    
});

const port = process.env.PORT || 3000;

app.listen(port);
console.log('app running on port', port);

app.post('/api/v1/on-covid-19', Estimator.fetch);
app.post('/api/v1/on-covid-19/json', Estimator.fetch);
app.post('/api/v1/on-covid-19/xml', Estimator.fetchxml);

module.exports = app;

// //create a server object:
// http.createServer(function (req, res) {
// res.writeHead(200, {'Content-Type': 'text/html'}); // http header

//     var url = req.url;
//     if(url === '/about') {
//         res.write('<h1>About us page</h1>');
//         res.end();
//     } else if(url === '/contact') {
//         res.write('<h1>Contact us page</h1>');
//         res.end();
//     } else {
//         res.write('<h1>Hello, Welcome to My Covid19 Estimator API<h1>'); //write a response
//         res.end(); //end the response
//     }
// }).listen(3000, function(){
// console.log("server start at port 3000"); //the server object listens on port 3000
// });