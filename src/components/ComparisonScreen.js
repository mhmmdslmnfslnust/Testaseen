import { cognitiveTest } from '../data/questions.js';
import { createRadarChart } from '../utils/charts.js';
import '../styles/components/comparison.css';

class ComparisonScreen {
  constructor(app) {
    this.app = app;
  }
  
  render(container) {
    const comparisonScreen = document.createElement('div');
    comparisonScreen.classList.add('screen', 'comparison-screen');
    
    comparisonScreen.innerHTML = `
      <h2>Compatibility Comparison</h2>
      
      <div class="comparison-container">
        <div class="chart-container">
          <canvas id="comparison-chart"></canvas>
        </div>
        
        <div class="compatibility-score">
          <h3>Overall Compatibility</h3>
          <div id="compatibility-percentage"></div>
          <div id="compatibility-interpretation"></div>
        </div>
      </div>
      
      <button id="back-to-results" class="secondary-btn">Back to My Results</button>
    `;
    
    container.appendChild(comparisonScreen);
    
    // Create chart and display compatibility
    this.renderComparisonChart();
    this.calculateCompatibility();
    
    // Add event listeners
    document.getElementById('back-to-results').addEventListener('click', () => {
      this.app.navigateTo('results');
    });
  }
  
  renderComparisonChart() {
    const yourResults = this.app.state.results;
    const theirResults = this.app.state.comparisonData;
    
    const labels = cognitiveTest.dimensions.map(dim => dim.name);
    const yourData = cognitiveTest.dimensions.map(dim => yourResults[dim.id].score);
    const theirData = cognitiveTest.dimensions.map(dim => theirResults[dim.id].score);
    
    // Create chart
    createRadarChart('comparison-chart', labels, [
      {
        label: 'Your Profile',
        data: yourData,
        backgroundColor: 'rgba(74, 111, 165, 0.2)',
        borderColor: 'rgba(74, 111, 165, 1)'
      },
      {
        label: 'Their Profile',
        data: theirData,
        backgroundColor: 'rgba(77, 204, 189, 0.2)',
        borderColor: 'rgba(77, 204, 189, 1)'
      }
    ]);
  }
  
  calculateCompatibility() {
    const yourResults = this.app.state.results;
    const theirResults = this.app.state.comparisonData;
    let overallCompatibility = 0;
    let compatibilityText = '';
    
    cognitiveTest.dimensions.forEach(dim => {
      const yourScore = yourResults[dim.id].score;
      const theirScore = theirResults[dim.id].score;
      const difference = Math.abs(yourScore - theirScore);
      
      // Calculate similarity percentage (100 = identical, 0 = opposite)
      const similarity = 100 - difference;
      
      // Add to overall compatibility
      overallCompatibility += similarity;
      
      // Generate compatibility text for this dimension
      let compatType;
      if (difference < 20) {
        compatType = 'similar';
      } else if (difference < 50) {
        compatType = 'complementary';
      } else {
        compatType = 'challenging';
      }
      
      // Add to interpretation
      compatibilityText += `<div class="compatibility-dimension">
        <h4>${dim.name}:</h4>
        <p>${cognitiveTest.compatibility[dim.id][compatType]}</p>
      </div>`;
    });
    
    // Average the compatibility
    overallCompatibility = Math.round(overallCompatibility / cognitiveTest.dimensions.length);
    
    // Display results
    document.getElementById('compatibility-percentage').textContent = `${overallCompatibility}%`;
    document.getElementById('compatibility-interpretation').innerHTML = compatibilityText;
  }
}

export default ComparisonScreen;
