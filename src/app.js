const responseTime = require('response-time');
const express = require('express');
const { toXML } = require('jstoxml');
const fs = require('fs');
const cors = require('cors');
const covidEstimator = require('./estimator.js');
const logs = require('./logs.json');

const app = express();
app.use(express.json());
app.use(cors());
app.use(responseTime());
app.get('/', (req, res) => {
  res.writeHead(200, { 'Content-type': 'text/html' });
  res.write(`
    <div style="width: 100%; text-align: center;">
      <h1>Welcome to My Covid19 Estimator API</h1>
      <a href="https://documenter.getpostman.com/view/9082520/SzezdCCT" style="padding: 15px; background: #419144; color: white; text-decoration: none; border-radius: 3px;">
        View Documentation
      </a>
    </div>
  `);
  res.end();
});
const port = process.env.PORT || 3000;
app.listen(port);
const writeToLog = (newData) => {
  logs.push(newData);
  fs.writeFileSync('./src/logs.json', JSON.stringify(logs));
};
const baseUrl = '/api/v1/on-covid-19';
app.post(`${baseUrl}`, async (req, res) => {
  const responseData = await covidEstimator(req.body);
  res.status(200).set('Content-Type', 'application/json').send(responseData);
  const exeTime = parseInt(res.getHeader('X-Response-Time'), 10);
  const exeTimeStr = exeTime.toString();
  const newData = {
    method: req.method,
    url: req.url,
    statusCode: res.statusCode,
    executionTime: `${exeTimeStr}ms`
  };
  writeToLog(newData);
});
app.post(`${baseUrl}/json`, async (req, res) => {
  const responseData = await covidEstimator(req.body);
  res.status(200).set('Content-Type', 'application/json').send(responseData);
  const exeTime = parseInt(res.getHeader('X-Response-Time'), 10);
  const exeTimeStr = exeTime.toString();
  const newData = {
    method: req.method,
    url: req.url,
    statusCode: res.statusCode,
    executionTime: `${exeTimeStr}ms`
  };
  writeToLog(newData);
});
app.post(`${baseUrl}/xml`, async (req, res) => {
  const responseData = await covidEstimator(req.body);
  const xmlData = toXML(responseData);
  res.status(200).set('Content-Type', 'application/xml').send(xmlData);
  const exeTime = parseInt(res.getHeader('X-Response-Time'), 10);
  const exeTimeStr = exeTime.toString();
  const newData = {
    method: req.method,
    url: req.url,
    statusCode: res.statusCode,
    executionTime: `${exeTimeStr}ms`
  };
  writeToLog(newData);
});
app.get(`${baseUrl}/logs`, async (req, res) => {
  let logsOutput = '';
  for (let x = 1; x < logs.length; x += 1) {
    logsOutput += `${logs[x].method} \t ${logs[x].url} \t\t ${logs[x].statusCode} \t ${logs[x].executionTime}\n`;
  }
  res.status(200).set('Content-Type', 'text/plain').send(logsOutput);
});

module.exports = app;
