import Chart from 'chart.js/auto';

// Store chart instances for cleanup
const chartInstances = {};

export function createRadarChart(elementId, labels, datasets) {
  // Destroy existing chart if it exists
  if (chartInstances[elementId]) {
    chartInstances[elementId].destroy();
  }
  
  // Create new chart
  const ctx = document.getElementById(elementId).getContext('2d');
  
  chartInstances[elementId] = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: labels,
      datasets: datasets
    },
    options: {
      scales: {
        r: {
          min: 0,
          max: 100,
          beginAtZero: true,
          ticks: {
            display: false
          }
        }
      },
      elements: {
        line: {
          borderWidth: 3
        },
        point: {
          radius: 4,
          hitRadius: 10,
          hoverRadius: 6
        }
      },
      plugins: {
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          padding: 10,
          cornerRadius: 4
        }
      },
      responsive: true,
      maintainAspectRatio: false
    }
  });
  
  return chartInstances[elementId];
}
