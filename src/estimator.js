const covid19ImpactEstimator = (data) => {
  const impact = {};
  const severeImpact = {};

  const {
    region, periodType, timeToElapse, reportedCases, totalHospitalBeds
  } = data;
  const {
    avgDailyIncomeInUSD, avgDailyIncomePopulation
  } = region;

  const input = data;
  // convert timeToElapse to days
  let days = 0;
  switch (periodType) {
    case 'weeks':
      days = timeToElapse * 7;
      break;
    case 'months':
      days = timeToElapse * 30;
      break;
    default:
      days = timeToElapse;
      break;
  }

  // get factor
  let factor = 0;
  switch (periodType) {
    case 'weeks':
      factor = Math.trunc((timeToElapse * 7) / 3);
      break;
    case 'months':
      factor = Math.trunc((timeToElapse * 30) / 3);
      break;
    default:
      factor = Math.trunc(timeToElapse / 3);
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
  const IBeds = Math.trunc(estimatedBeds - impact.severeCasesByRequestedTime);
  const SBeds = Math.trunc(estimatedBeds - severeImpact.severeCasesByRequestedTime);
  impact.hospitalBedsByRequestedTime = IBeds;
  severeImpact.hospitalBedsByRequestedTime = SBeds;

  // challenge 3
  const IICU = 0.05 * impact.infectionsByRequestedTime;
  const SICU = 0.05 * severeImpact.infectionsByRequestedTime;
  impact.casesForICUByRequestedTime = IICU;
  severeImpact.casesForICUByRequestedTime = SICU;
  const ICV = Math.trunc(0.02 * impact.infectionsByRequestedTime);
  const SCV = Math.trunc(0.02 * severeImpact.infectionsByRequestedTime);
  impact.casesForVentilatorsByRequestedTime = ICV;
  severeImpact.casesForVentilatorsByRequestedTime = SCV;

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
