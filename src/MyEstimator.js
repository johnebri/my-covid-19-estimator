// const xml = require('xml');
const covidEstimator = require('./estimator.js');

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
      return res.status(200).json({
        data: responseData.data,
        impact: responseData.impact,
        severeImpact: responseData.severeImpact
      });
      // res.set('Content-Type', 'text/xml');
      // .type('application/xml');
      // res.send(xml(output));
    } catch (error) {
      return res.status(400).json({
        message: 'An error has occurred'
      });
    }
  }
};
