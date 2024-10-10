import React from 'react';
import { useRecoilValue } from 'recoil';
import { categorizedTotalsState } from '../recoil/recoilState';
import { Card, CardBody, CardTitle, CardSubtitle } from 'reactstrap';
import Chart from 'react-apexcharts';
import '../../assets/scss/pokechart.scss'; 

const PokeChart = () => {
  const categorizedTotals = useRecoilValue(categorizedTotalsState);

  // Calculate the series and total value
  const series = Object.values(categorizedTotals).map((value) => parseFloat(value));
  const totalValue = series.reduce((a, b) => a + b, 0);

  // Generate a key based on categorizedTotals to force re-render
  const chartKey = Object.entries(categorizedTotals)
    .map(([key, value]) => `${key}-${value}`)
    .join('_');

  const options = {
    chart: {
      background: 'transparent',
      toolbar: { show: false },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: { enabled: true, delay: 150 },
      },
    },
    labels: Object.keys(categorizedTotals),
    colors: [
      '#2de7e0', 
      '#b71515', 
      '#ffc107', 
      '#28a745', 
      '#573c9c', 
    ],
    legend: {
      show: true,
      position: 'bottom',
      fontSize: '14px',
      labels: { colors: ['var(--body-color)'] },
      markers: { width: 10, height: 10, radius: 5 },
      itemMargin: { horizontal: 10, vertical: 5 },
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => val.toLocaleString(),
      dropShadow: {
        enabled: false,
      },
      style: {
        fontSize: '14px',
        fontWeight: '600',
        colors: ['var(--body-color)'],
      },
      background: {
        enabled: false,
      },
    },
    tooltip: {
      theme: 'dark',
      y: { formatter: (val) => val.toLocaleString() },
      style: { fontSize: '14px' },
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['#fff'],
    },
    plotOptions: {
      pie: {
        expandOnClick: true,
        donut: {
          size: '70%',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '18px',
              fontWeight: 'bold',
              color: 'var(--body-color)',
            },
            value: {
              show: true,
              fontSize: '22px',
              fontWeight: 'bold',
              color: 'var(--body-color)',
              formatter: (val) => {
                return parseFloat(val).toLocaleString();
              },
            },
            total: {
              show: true,
              label: 'Total',
              color: 'var(--body-color)',
              fontSize: '18px',
              fontWeight: 'bold',
              formatter: () => {
                return totalValue.toLocaleString();
              },
            },
          },
        },
      },
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            height: 300,
          },
          legend: {
            position: 'bottom',
            fontSize: '12px',
          },
          dataLabels: {
            style: {
              fontSize: '12px',
            },
          },
          plotOptions: {
            pie: {
              donut: {
                labels: {
                  name: {
                    fontSize: '14px',
                  },
                  value: {
                    fontSize: '16px',
                  },
                  total: {
                    fontSize: '14px',
                  },
                },
              },
            },
          },
        },
      },
    ],
  };

  return (
    <Card className="pokechart-card shadow-lg p-3 mb-5 rounded">
      <CardBody>
        <CardTitle tag="h3" className="mb-3 text-center">
          Box Value Summary
        </CardTitle>
        <CardSubtitle className="text-muted text-center mb-4">
          Detailed breakdown of Pokémon categories
        </CardSubtitle>
        <div className="chart-container">
          <Chart
            key={chartKey}
            options={options}
            series={series}
            type="donut"
            height={380}
          />
        </div>
      </CardBody>
    </Card>
  );
};

export default PokeChart;
