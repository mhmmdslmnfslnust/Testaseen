import { cognitiveTest } from '../data/questions.js';
import { createRadarChart } from '../utils/charts.js';
import '../styles/components/results.css';

class ResultsScreen {
  constructor(app) {
    this.app = app;
  }
  
  render(container) {
    const resultsScreen = document.createElement('div');
    resultsScreen.classList.add('screen', 'results-screen');
    
    resultsScreen.innerHTML = `
      <h2>Your Cognitive Profile</h2>
      
      <div class="results-container">
        <div class="chart-container">
          <canvas id="results-chart"></canvas>
        </div>
        
        <div class="results-interpretation">
          <h3>Your Thinking Style</h3>
          <div id="primary-style"></div>
          <div id="dimension-descriptions"></div>
        </div>
      </div>
      
      <div class="action-buttons">
        <button id="save-results" class="primary-btn">Save My Results</button>
        <button id="compare-results" class="secondary-btn">Compare With Someone</button>
        <button id="retake-test" class="secondary-btn">Take Test Again</button>
      </div>
    `;
    
    container.appendChild(resultsScreen);
    
    // Create chart and populate results
    this.renderChart();
    this.renderTextResults();
    
    // Add event listeners
    document.getElementById('save-results').addEventListener('click', () => {
      this.handleSaveResults();
    });
    
    document.getElementById('compare-results').addEventListener('click', () => {
      this.app.generateComparisonData();
      this.app.navigateTo('comparison');
    });
    
    document.getElementById('retake-test').addEventListener('click', () => {
      this.app.startTest();
    });
  }
  
  renderChart() {
    // Get results data
    const results = this.app.state.results;
    const labels = cognitiveTest.dimensions.map(dim => dim.name);
    const data = cognitiveTest.dimensions.map(dim => results[dim.id].score);
    
    // Create chart
    createRadarChart('results-chart', labels, [
      {
        label: 'Your Profile',
        data: data,
        backgroundColor: 'rgba(74, 111, 165, 0.2)',
        borderColor: 'rgba(74, 111, 165, 1)'
      }
    ]);
  }
  
  renderTextResults() {
    const results = this.app.state.results;
    
    // Determine primary style
    let primaryText = "Your cognitive style is characterized by ";
    const traits = [];
    
    cognitiveTest.dimensions.forEach(dim => {
      const score = results[dim.id].score;
      
      if (score < 33) {
        traits.push(`being a ${dim.low.toLowerCase()}`);
      } else if (score > 66) {
        traits.push(`being a ${dim.high.toLowerCase()}`);
      }
    });
    
    if (traits.length > 0) {
      primaryText += traits.join(", ") + ".";
    } else {
      primaryText += "a balanced approach across multiple cognitive dimensions.";
    }
    
    document.getElementById('primary-style').textContent = primaryText;
    
    // Create dimension descriptions
    const descriptionsContainer = document.getElementById('dimension-descriptions');
    descriptionsContainer.innerHTML = '';
    
    cognitiveTest.dimensions.forEach(dim => {
      const score = results[dim.id].score;
      let description;
      
      if (score < 33) {
        description = dim.description.low;
      } else if (score > 66) {
        description = dim.description.high;
      } else {
        description = dim.description.mid;
      }
      
      const dimensionEl = document.createElement('div');
      dimensionEl.classList.add('dimension-result');
      dimensionEl.innerHTML = `
        <h4>${dim.name}</h4>
        <p>${description}</p>
      `;
      
      descriptionsContainer.appendChild(dimensionEl);
    });
  }
  
  handleSaveResults() {
    const saveSuccess = this.app.saveResults();
    const saveBtn = document.getElementById('save-results');
    const originalText = saveBtn.textContent;
    
    saveBtn.textContent = saveSuccess ? "Results Saved!" : "Save Failed";
    saveBtn.disabled = true;
    
    setTimeout(() => {
      saveBtn.textContent = originalText;
      saveBtn.disabled = false;
    }, 2000);
  }
}

export default ResultsScreen;
