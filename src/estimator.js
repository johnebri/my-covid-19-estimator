const covid19ImpactEstimator = (data) => {
  const impact = {};
  const severeImpact = {};

  const {
    region, periodType, timeToElaspe, reportedCases, totalHospitalBeds
  } = data;
  const { 
    avgDailyIncomeInUSD, avgDailyIncomePopulation 
  } = region;

  const input = data;
  // convert timeToElaspe to days
  let days = 0;
  switch (periodType) {
  case 'weeks':
    days = input.timeToElaspe * 7;
    break;
  case 'months':
    days = input.timeToElaspe * 30;
    break;
  default:
    days = input.timeToElaspe;
    break;
  }

  // get factor
  let factor = 0;
  switch (periodType) {
  case 'weeks':
    factor = Math.truc((timeToElaspe * 7) / 3);
    break;
  case 'months':
    factor = Math.truc((timeToElaspe * 30) / 3);
    break;
  default:
    factor = Math.trunc(timeToElaspe / 3);
    break;
  }

  // challenge 1
  impact.currentlyInfected = reportedCases * 10;
  severeImpact.currentlyInfected = reportedCases * 50;
  impact.infectionsByRequestedTime = impact.currentlyInfected * (2 ** factor);
  severeImpact.infectionsByRequestedTime = severeImpact.currentlyInfected * (2 ** factor);

  // challenge 2
  const estimatedBeds = 0.35 * totalHospitalBeds;
  impact.severeCasesByRequestedTime = 0.15 * impact.infectionsByRequestedTime;
  severeImpact.severeCasesByRequestedTime = 0.15 * severeImpact.infectionsByRequestedTime;
  impact.hospitalBedsByRequestedTime = estimatedBeds - impact.severeCasesByRequestedTime;
  severeImpact.hospitalBedsByRequestedTime = estimatedBeds - severeImpact.severeCasesByRequestedTime;

  // challenge 3
  impact.casesForICUByRequestedTime = 0.05 * impact.infectionsByRequestedTime;
  severeImpact.casesForICUByRequestedTime = 0.05 * severeImpact.infectionsByRequestedTime;
  impact.casesForVentilatorsByRequestedTime = 0.02 * impact.infectionsByRequestedTime;
  severeImpact.casesForVentilatorsByRequestedTime = 0.02*severeImpact.infectionsByRequestedTime;

  const incomeEstimate = avgDailyIncomePopulation * avgDailyIncomeInUSD * days;
  impact.dollarsInFlight = impact.infectionsByRequestedTime * incomeEstimate;
  severeImpact.dollarsInFlight = severeImpact.infectionsByRequestedTime * incomeEstimate;

  return {
    data: input,
    impact,
    severeImpact
  };
};
export default covid19ImpactEstimator;
