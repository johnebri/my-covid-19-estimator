// const covid19 = require('./estimator.js');
const covidEstimator = require('./estimator.js');
const xml = require('xml');

module.exports = {
  async fetch(req, res) {
    try {
      const responseData = await covidEstimator(req.body);
      return res.status(200).json({
        data: responseData.data,
        impact: responseData.impact,
        severeImpact: responseData.severeImpact
      });
    } catch (error) {
      return res.status(400).json({
        message: 'An error has occurred'
      });
    }
  },
  async fetchxml(req, res) {
    try {
      const responseData = await covidEstimator(req.body);
      const output = res.status(200).json({
        data: responseData.data,
        impact: responseData.impact,
        severeImpact: responseData.severeImpact
      });
      // res.set('Content-Type', 'text/xml');
      res.type('application/xml');
      res.send(xml(output));
      
    } catch (error) {
      return res.status(400).json({
        message: 'An error has occurred'
      });
    }
  }
};
