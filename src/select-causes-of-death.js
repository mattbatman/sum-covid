import * as d3 from './d3-roll';
import lineChart from './line-chart';
import monthlyDeathsBySelectCauseData from './data/monthly-deaths-by-cause-20-21-raw.json';

function selectCausesOfDeathChart() {
  const selectCausesChart = lineChart();
  const data = monthlyDeathsBySelectCauseData.filter((d) => {
    if (d.year === '2021' && d.month === '9') {
      return false;
    }

    return true;
  });

  selectCausesChart.init({
    sel: '#select-causes-death'
  });

  /*
    * "natural_cause"
    * "septicemia"
    * "malignant_neoplasms"
    * "diabetes_mellitus"
    * "alzheimer_disease",
    * "influenza_and_pneumonia",
    * "chronic_lower_respiratory"
    * "other_diseases_of_respiratory",
    * "nephritis_nephrotic_syndrome",
    * "symptoms_signs_and_abnormal",
    * "diseases_of_heart"
    * "cerebrovascular_diseases",
    * "accidents_unintentional",
    * "motor_vehicle_accidents"
    * "intentional_self_harm_suicide",
    * "assault_homicide",
    * "drug_overdose",
    * "covid_19_multiple_cause_of"
    * "covid_19_underlying_cause"
  */

  const convertToNumber = (s) => (Number(s) ? Number(s) : 0);

  const multiLineData = {
    y: 'Monthly Deaths',
    series: [
      {
        name: 'Natural Cause',
        color: '#000000',
        values: data.map(({ natural_cause }) => convertToNumber(natural_cause))
      },
      {
        name: 'COVID 19 Multiple Cause of',
        color: '#a9c774',
        values: data.map(({ covid_19_multiple_cause_of }) =>
          convertToNumber(covid_19_multiple_cause_of)
        )
      },
      {
        name: 'COVID 19 Underlying Cause',
        color: '#1b5037',
        values: data.map(({ covid_19_underlying_cause }) =>
          convertToNumber(covid_19_underlying_cause)
        )
      },
      {
        name: 'Diseases of Heart',
        color: '#e74e38',
        values: data.map(({ diseases_of_heart }) =>
          convertToNumber(diseases_of_heart)
        )
      },
      {
        name: 'Diabetes Mellitus',
        color: '#7c5a3c',
        values: data.map(({ diabetes_mellitus }) =>
          convertToNumber(diabetes_mellitus)
        )
      },
      {
        name: 'Motor Vehical Accidents',
        color: '#d8dbdd',
        values: data.map(({ motor_vehicle_accidents }) =>
          convertToNumber(motor_vehicle_accidents)
        )
      },
      {
        name: 'Septicemia',
        color: '#787c3c',
        values: data.map(({ septicemia }) => convertToNumber(septicemia))
      },
      {
        name: 'Malignant Neoplasms',
        color: '#4f7da3',
        values: data.map(({ malignant_neoplasms }) =>
          convertToNumber(malignant_neoplasms)
        )
      },
      {
        name: 'Alzheimer Disease',
        color: '#e7388f',
        values: data.map(({ alzheimer_disease }) =>
          convertToNumber(alzheimer_disease)
        )
      },
      {
        name: 'Intentional Self Harm Suicide',
        color: '#574fa3',
        values: data.map(({ intentional_self_harm_suicide }) =>
          convertToNumber(intentional_self_harm_suicide)
        )
      },
      {
        name: 'Assault Homicide',
        color: '#884fa3',
        values: data.map(({ assault_homicide }) =>
          convertToNumber(assault_homicide)
        )
      },
      {
        name: 'Drug Overdose',
        color: '#e78d38',
        values: data.map(({ drug_overdose }) => convertToNumber(drug_overdose))
      },
      {
        name: 'Accidents Unintentional',
        color: '#4fa3a3',
        values: data.map(({ accidents_unintentional }) =>
          convertToNumber(accidents_unintentional)
        )
      },
      {
        name: 'Chronic Lower Respiratory',
        color: '#7c3c3c',
        values: data.map(({ chronic_lower_respiratory }) =>
          convertToNumber(chronic_lower_respiratory)
        )
      },
            {
        name: 'Other Diseases of Respiratory',
        color: '#853c69',
        values: data.map(({ other_diseases_of_respiratory }) =>
          convertToNumber(other_diseases_of_respiratory)
        )
      },
      {
        name: 'Influenza and Pneumonia',
        color: '#fdba3a',
        values: data.map(({ influenza_and_pneumonia }) =>
          convertToNumber(influenza_and_pneumonia)
        )
      },
      {
        name: 'Cerebrovascular Diseases',
        color: '#e138e7',
        values: data.map(({ cerebrovascular_diseases }) =>
          convertToNumber(cerebrovascular_diseases)
        )
      },
      {
        name: 'Nephritis Nephrotic Syndrome',
        color: '#234747',
        values: data.map(({ nephritis_nephrotic_syndrome }) =>
          convertToNumber(nephritis_nephrotic_syndrome)
        )
      },
      {
        name: 'Symptoms, signs and abnormal clinical and laboratory findings, not elsewhere classified',
        color: '#91a36e',
        values: data.map(({ symptoms_signs_and_abnormal }) =>
          convertToNumber(symptoms_signs_and_abnormal)
        )
      }
    ],
    dates: data.map(({ end_date }) => new Date(end_date))
  };

  selectCausesChart.update({
    newData: multiLineData,
    yKey: 'Monthly Deaths',
    xKey: 'Month Ending'
  });

  selectCausesChart.createLegend({
    legendSelector: '#select-causes-death-legend'
  });
}

export default selectCausesOfDeathChart;
