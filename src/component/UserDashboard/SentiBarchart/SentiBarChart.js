import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import "../../../Styles/SentiBarChart/SentiBarchart.css"
import { CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

import Chart from 'chart.js/auto';
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


function SentiBarchart({ graphdata, lastTableAttmpt }) {
  const BarChartData = graphdata || {};
  const [selectedOption, setSelectedOption] = useState('');
  const comingAcrossAsData = BarChartData?.competency_score || {};

  function convertData(data) {
    const dataArray = [];

    for (const [competency, scores] of Object.entries(data)) {
      const scoreArray = scores.split(',').map(score => parseInt(score.trim(), 10));
      const lastThreeValues = scoreArray.slice(-3);

      dataArray.push({
        name: competency,
        lastThreeValues: lastThreeValues
      });
    }
    return dataArray;
  }

  const chartData = convertData(comingAcrossAsData);

  const data = {
    labels: chartData.map(item => item.name),
    datasets: [
      {
        label: 'First Value',
        backgroundColor: 'rgba(254, 101, 195, 0.5)',
        borderColor: '#FE65C3',
        borderWidth: 1,
        data: chartData.map(item => item.lastThreeValues[1])
      },
      {
        label: 'Second Value',
        backgroundColor: 'rgba(253, 216, 53, 0.5)',
        borderColor: '#FDD835',
        borderWidth: 1,
        data: chartData.map(item => item.lastThreeValues[0])
      },
      {
        label: 'Last Value',
        backgroundColor: 'linear-gradient(90deg, rgba(81, 111, 254, 1) 0%, rgba(254, 101, 195, 1) 100%)',
        borderColor: '#516FFE',
        borderWidth: 1,
        data: chartData.map(item => item.lastThreeValues[2])
      }
    ]
  };

  const options = {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    },
    legend: {
      display: false
    }
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const selectedCompetencyData = chartData.find(item => item.name === selectedOption);

  return (
    <div className='setniBar-main-container'>
    <p className='setniBar-title-dropdown-title'>Choose a Competency from the drop down list below to see your scores in the last 3 attempts.</p>

      <select className="setniBar-dropdown-custom" value={selectedOption} onChange={handleOptionChange}>
        <option value="">Select an option</option>
        {chartData.map(item => (
          <option key={item.name} value={item.name}>{item.name}</option>
        ))}
      </select>

      <div className="graph-container">
        <Bar
          data={{
            labels: ['First Value', 'Second Value', 'Last Value'],
            datasets: [{
              label: selectedOption,
              backgroundColor: ['#FE65C3', '#FDD835', '#516FFE'],
              data: selectedCompetencyData ? selectedCompetencyData.lastThreeValues : [0, 0, 0]
            }]
          }}
          options={options}
        />
      </div>

      {selectedCompetencyData && (
  <div className="graph-container-table">
    <table className='senti-cloud-table'>
      <thead>
        <tr>
          <th>Competency</th>
          <th>Last Three Values</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{selectedOption}</td>
          <td>{selectedCompetencyData.lastThreeValues.join(', ')}</td>
        </tr>
      </tbody>
    </table>
  </div>
)}



<p className='setniBar-title-dropdown-title'>Your Percentile Scores</p>
<p className='setniBar-title-dropdown-content'>
Suborg Percentile shows where you stand compared to others in your organisation<br />
Global Percentile shows where you stand compared to all people who are responding to scenarios on that particular competency
</p>
      <div className="graph-container-table">
        <table className='senti-cloud-table'>
          <thead>
            <tr>
              <th>Competency</th>
              <th>Suborg percentile</th>
              <th>Global percentile</th>
            </tr>
          </thead>
          <tbody>
            {lastTableAttmpt && chartData.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>
                  {lastTableAttmpt.suborg_result[item.name]?.percentile !== undefined &&
                    lastTableAttmpt.suborg_result[item.name]?.percentile !== null ?
                    (Number.isInteger(lastTableAttmpt.suborg_result[item.name]?.percentile) ?
                      lastTableAttmpt.suborg_result[item.name]?.percentile :
                      lastTableAttmpt.suborg_result[item.name]?.percentile.toFixed(2))
                    : ''
                  }
                </td>
                <td>{lastTableAttmpt.global_result[item.name]?.percentile !== undefined &&
                  lastTableAttmpt.global_result[item.name]?.percentile !== null ?
                  (Number.isInteger(lastTableAttmpt.global_result[item.name]?.percentile) ?
                    lastTableAttmpt.global_result[item.name]?.percentile :
                    lastTableAttmpt.global_result[item.name]?.percentile.toFixed(2))
                  : ''
                }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SentiBarchart;








