import barChart from './bar-chart';
import { mapObjIndexed, omit, values, sortBy, pipe, prop, reverse } from 'ramda';
import annualDeaths from './data/annual-deaths-by-cause-2020.json';

function selectCausesOfDeathChart() {
  const selectCausesChart = barChart();
  const getColor = (k) => {
    const colorMap = {
      symptoms_signs_and_abnormal: '#91a36e',
      septicemia: '#787c3c',
      other_diseases_of_respiratory: '#853c69',
      nephritis_nephrotic_syndrome: '#234747',
      natural_cause: '#000000',
      motor_vehicle_accidents: '#c7c7c7',
      malignant_neoplasms: '#4f7da3',
      intentional_self_harm_suicide: '#574fa3',
      influenza_and_pneumonia: '#fdba3a',
      drug_overdose: '#e78d38',
      diseases_of_heart: '#e74e38',
      diabetes_mellitus: '#7c5a3c',
      covid_19_underlying_cause: '#1b5037',
      covid_19_multiple_cause_of: '#a9c774',
      chronic_lower_respiratory: '#7c3c3c',
      cerebrovascular_diseases: '#e138e7',
      assault_homicide: '#884fa3',
      alzheimer_disease: '#e7388f',
      all_cause: '#ffffff',
      accidents_unintentional: '#4fa3a3'
    };

    return colorMap[k];
  };
  const getLabel = (k) => {
    const labelMap = {
      symptoms_signs_and_abnormal:
        'Abnormal Findings',
      septicemia: 'Septicemia',
      other_diseases_of_respiratory: 'Other Respiratory',
      nephritis_nephrotic_syndrome: 'Nephritis Nephrotic Syndrome',
      natural_cause: 'Natural Cause',
      motor_vehicle_accidents: 'Motor Vehicle Accidents',
      malignant_neoplasms: 'Malignant Neoplasms',
      intentional_self_harm_suicide: 'Suicide',
      influenza_and_pneumonia: 'Influenze and Pneumonia',
      drug_overdose: 'Drug Overdose',
      diseases_of_heart: 'Diseases of Heart',
      diabetes_mellitus: 'Diabetes Mellitus',
      covid_19_underlying_cause: 'COVID 19 Underlying Cause',
      covid_19_multiple_cause_of: 'COVID 19 Multiple Cause of',
      chronic_lower_respiratory: 'Chronic Lower Respiratory',
      cerebrovascular_diseases: 'Cerebrovascular Diseases',
      assault_homicide: 'Homicide',
      alzheimer_disease: 'Alzheimer Disease',
      all_cause: 'All Causes',
      accidents_unintentional: 'Accidents Unintentional'
    };

    return labelMap[k];
  };

  selectCausesChart.init({
    sel: '#select-causes-death',
    newMargin: {
      top: 0,
      right: 0,
      bottom: 185,
      left: 71
    }
  });

  const getChartData = pipe(
    omit(['all_cause']),
    (x) =>
      mapObjIndexed(
        (val, key) => ({
          Deaths: val,
          Cause: getLabel(key),
          color: getColor(key)
        }),
        x
      ),
    values,
    x => sortBy(prop('Deaths'), x),
    reverse
  );

  selectCausesChart.update({
    newData: getChartData(annualDeaths),
    yKey: 'Deaths',
    xKey: 'Cause',
    rectColorFunction: (d) => d.color
  });
}

export default selectCausesOfDeathChart;
