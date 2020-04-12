const { toXML } = require('jstoxml');
const fs = require('fs');
const covidEstimator = require('./estimator.js');
const logs = require('./logs.json');

module.exports = {
  async fetch(req, res) {
    try {
      const startTime = new Date().getTime();
      const responseData = await covidEstimator(req.body);
      const timeTaken = (new Date().getTime() - startTime);
      // push new json
      const newData = {
        method: req.method,
        url: req.url,
        statusCode: '200',
        executionTime: timeTaken
      };
      logs.push(newData);
      fs.writeFileSync('./src/logs.json', JSON.stringify(logs));
      return res.status(200).json({
        data: responseData.data,
        impact: responseData.impact,
        severeImpact: responseData.severeImpact
      });
    } catch (error) {
      return res.status(500).json({
        message: 'An error has occurred'
      });
    }
  },
  async fetchxml(req, res) {
    try {
      const startTime = new Date().getTime();
      const responseData = await covidEstimator(req.body);
      const timeTaken = (new Date().getTime() - startTime);
      // push new json
      const newData = {
        method: req.method,
        url: req.url,
        statusCode: '200',
        executionTime: timeTaken
      };
      logs.push(newData);
      fs.writeFileSync('./src/logs.json', JSON.stringify(logs));
      res.set('Content-Type', 'text/xml');
      const xmldata = toXML({
        data: responseData.data,
        impact: responseData.impact,
        severeImpact: responseData.severeImpact
      });
      return res.send(xmldata);
    } catch (error) {
      return res.status(500).json({
        message: 'An error has occurred'
      });
    }
  },
  async logs(req, res) {
    let logsOutput = '';
    for (let x = 1; x < logs.length; x+=1) {
      logsOutput += logs[x].method + '\t\t' + logs[x].url + '\t\t' + logs[x].statusCode + '\t\t' + logs[x].executionTime + 'ms\n';
    }
    try {
      res.set('Content-Type', 'text/html');
      return res.send(logsOutput);
    } catch (error) {
      return res.status(500).json({
        message: 'An error has occurred'
      });
    }
  }
};
