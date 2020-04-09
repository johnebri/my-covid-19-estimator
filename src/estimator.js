const impact = {};
const severeImpact = {};

const covid19ImpactEstimator = (data) => {
    const input = data;
    // convert timeToElaspe to days
    let days = 0;
    switch (input.periodType) {
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
    switch(input.periodType) {
    case 'weeks':
        factor = Math.truc((input.timeToElaspe * 7) / 3);
        break;
    case 'months':
        factor = Math.truc((input.timeToElaspe * 30) / 3);
        break;
    default:
        factor = Math.trunc(input.timeToElaspe / 3);
        break;
    }

    // challenge 1
    impact.currentlyInfected = input.reportedCases * 10;
    severeImpact.currentlyInfected = input.reportedCases * 50;
    impact.infectionsByRequestedTime = impact.currentlyInfected * (2 ** factor);
    severeImpact.infectionsByRequestedTime = severeImpact.currentlyInfected * (2 ** factor);

    // challenge 2
    const estimatedBeds = 0.35 * input.totalHospitalBeds;
    impact.severeCasesByRequestedTime = 0.15 * impact.infectionsByRequestedTime;
    severeImpact.severeCasesByRequestedTime = 0.15 * severeImpact.infectionsByRequestedTime;
    impact.hospitalBedsByRequestedTime = estimatedBeds - impact.severeCasesByRequestedTime;
    severeImpact.hospitalBedsByRequestedTime = estimatedBeds - severeImpact.severeCasesByRequestedTime;

    // challenge 3
    impact.casesForICUByRequestedTime = 0.05 * impact.infectionsByRequestedTime;
    severeImpact.casesForICUByRequestedTime = 0.05 * severeImpact.infectionsByRequestedTime;
    impact.casesForVentilatorsByRequestedTime = 0.02 * impact.infectionsByRequestedTime;
    severeImpact.casesForVentilatorsByRequestedTime = 0.02 * severeImpact.infectionsByRequestedTime;
    impact.dollarsInFlight = (impact.infectionsByRequestedTime * input.region.avgDailyIncomePopulation) * input.region.avgDailyIncomeInUSD * days;
    severeImpact.dollarsInFlight = (severeImpact.infectionsByRequestedTime * input.region.avgDailyIncomePopulation) * input.region.avgDailyIncomeInUSD * days;

    return {
        data: input,
        impact,
        severeImpact
    };
};

export default covid19ImpactEstimator;