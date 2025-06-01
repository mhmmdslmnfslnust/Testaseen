import { cognitiveTest } from '../data/questions.js';
import { createRadarChart } from '../utils/charts.js';
import '../styles/components/results.css';

class ResultsScreen {
  constructor(app) {
    this.app = app;
  }
  
  render(container) {
    const currentTest = this.app.state.currentTest;
    
    const resultsScreen = document.createElement('div');
    resultsScreen.classList.add('screen', 'results-screen');
    
    resultsScreen.innerHTML = `
      <h2>Your ${currentTest.title} Results</h2>
      
      <div class="results-container">
        ${currentTest.axes ? `
          <div class="chart-container">
            <canvas id="results-chart"></canvas>
          </div>
        ` : ''}
        
        <div class="results-interpretation">
          <h3>Your Profile</h3>
          <div id="primary-style"></div>
          <div id="dimension-descriptions"></div>
        </div>
      </div>
      
      <div class="action-buttons">
        <button id="save-results" class="primary-btn">Save My Results</button>
        ${currentTest.compatibility ? `
          <button id="compare-results" class="secondary-btn">Compare With Someone</button>
        ` : ''}
        <button id="retake-test" class="secondary-btn">Retake Test</button>
        <button id="choose-different" class="secondary-btn">Choose Different Test</button>
      </div>
    `;
    
    container.appendChild(resultsScreen);
    
    // Render appropriate results based on test type
    if (currentTest.axes) {
      this.renderChart();
    }
    
    this.renderTextResults();
    
    // Add event listeners
    document.getElementById('save-results').addEventListener('click', () => {
      this.handleSaveResults();
    });
    
    if (currentTest.compatibility) {
      document.getElementById('compare-results').addEventListener('click', () => {
        this.app.generateComparisonData();
        this.app.navigateTo('comparison');
      });
    }
    
    document.getElementById('retake-test').addEventListener('click', () => {
      this.app.startTest();
    });
    
    document.getElementById('choose-different').addEventListener('click', () => {
      this.app.navigateTo('testSelection');
    });
  }
  
  renderChart() {
    const currentTest = this.app.state.currentTest;
    const results = this.app.state.results;
    
    if (!currentTest.axes) return;
    
    // Build chart data based on test type
    let labels, data;
    
    if (currentTest.id === "life-values-sync") {
      // For life values test, we show both priority and actual values
      labels = currentTest.axes.map(dim => dim.label);
      const priorityData = currentTest.axes.map(dim => results[dim.id].priority * 20); // Scale to 0-100
      const selfData = currentTest.axes.map(dim => results[dim.id].self * 20); // Scale to 0-100
      
      createRadarChart('results-chart', labels, [
        {
          label: 'Your Values (Priority)',
          data: priorityData,
          backgroundColor: 'rgba(74, 111, 165, 0.2)',
          borderColor: 'rgba(74, 111, 165, 1)'
        },
        {
          label: 'Your Practice (Actual)',
          data: selfData,
          backgroundColor: 'rgba(77, 204, 189, 0.2)', 
          borderColor: 'rgba(77, 204, 189, 1)'
        }
      ]);
      
    } else {
      // For cognitive and conflict tests
      labels = currentTest.axes.map(dim => dim.label);
      data = currentTest.axes.map(dim => {
        const score = results[dim.id];
        return score * 20; // Scale 1-5 to 0-100 for the chart
      });
      
      createRadarChart('results-chart', labels, [
        {
          label: 'Your Profile',
          data: data,
          backgroundColor: 'rgba(74, 111, 165, 0.2)',
          borderColor: 'rgba(74, 111, 165, 1)'
        }
      ]);
    }
  }
  
  renderTextResults() {
    const currentTest = this.app.state.currentTest;
    const results = this.app.state.results;
    
    // Use different rendering based on test type
    if (currentTest.id === "cognitive-alignment") {
      this.renderCognitiveResults(currentTest, results);
    } else if (currentTest.id === "conflict-style-match") {
      this.renderConflictResults(currentTest, results);
    } else if (currentTest.id === "life-values-sync") {
      this.renderLifeValuesResults(currentTest, results);
    } else {
      this.renderGenericResults(currentTest, results);
    }
  }
  
  renderCognitiveResults(test, results) {
    // Determine primary style
    let primaryText = "Your cognitive style is characterized by ";
    const traits = [];
    
    test.axes.forEach(dim => {
      const score = results[dim.id];
      
      if (score < 2.5) {
        traits.push(`being a ${dim.low.toLowerCase()}`);
      } else if (score > 3.5) {
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
    
    test.axes.forEach(dim => {
      const score = results[dim.id];
      let description;
      
      if (score < 2.5) {
        description = `As a ${dim.low}, you tend to ${this.getCognitiveDescription(dim.id, 'low')}`;
      } else if (score > 3.5) {
        description = `As a ${dim.high}, you tend to ${this.getCognitiveDescription(dim.id, 'high')}`;
      } else {
        description = `You balance between ${dim.low.toLowerCase()} and ${dim.high.toLowerCase()} approaches, ${this.getCognitiveDescription(dim.id, 'mid')}`;
      }
      
      const dimensionEl = document.createElement('div');
      dimensionEl.classList.add('dimension-result');
      dimensionEl.innerHTML = `
        <h4>${dim.label}: ${score.toFixed(1)}/5</h4>
        <p>${description}</p>
      `;
      
      descriptionsContainer.appendChild(dimensionEl);
    });
  }
  
  renderConflictResults(test, results) {
    // Find the conflict style that best matches this profile
    let bestMatch = null;
    let bestMatchScore = -1;
    
    // Simple matching algorithm to find the closest resultType
    test.resultTypes.forEach(type => {
      let matchScore = 0;
      
      // Count matches on each axis
      Object.keys(type.profile).forEach(axisId => {
        const profileDirection = type.profile[axisId];
        const userScore = results[axisId];
        
        if ((profileDirection === "high" && userScore > 3.5) || 
            (profileDirection === "low" && userScore < 2.5)) {
          matchScore++;
        }
      });
      
      if (matchScore > bestMatchScore) {
        bestMatchScore = matchScore;
        bestMatch = type;
      }
    });
    
    // Display the matched conflict style
    const primaryStyle = document.getElementById('primary-style');
    if (bestMatch) {
      primaryStyle.innerHTML = `
        <h3 class="conflict-style-title">${bestMatch.name}</h3>
        <p>${bestMatch.description}</p>
      `;
    } else {
      primaryStyle.textContent = "Your conflict style combines multiple approaches.";
    }
    
    // Create dimension descriptions
    const descriptionsContainer = document.getElementById('dimension-descriptions');
    descriptionsContainer.innerHTML = '<h4>Your Conflict Handling Profile:</h4>';
    
    test.axes.forEach(dim => {
      const score = results[dim.id];
      let description;
      
      if (score < 2.5) {
        description = `You tend to be more ${dim.low.toLowerCase()} during conflicts.`;
      } else if (score > 3.5) {
        description = `You tend to be more ${dim.high.toLowerCase()} during conflicts.`;
      } else {
        description = `You balance between ${dim.low.toLowerCase()} and ${dim.high.toLowerCase()} approaches.`;
      }
      
      const dimensionEl = document.createElement('div');
      dimensionEl.classList.add('dimension-result');
      dimensionEl.innerHTML = `
        <h4>${dim.label}: ${score.toFixed(1)}/5</h4>
        <p>${description}</p>
      `;
      
      descriptionsContainer.appendChild(dimensionEl);
    });
  }
  
  renderLifeValuesResults(test, results) {
    const primaryStyle = document.getElementById('primary-style');
    primaryStyle.innerHTML = `<p>This test shows where your values align with your actions.</p>`;
    
    // Create dimension descriptions
    const descriptionsContainer = document.getElementById('dimension-descriptions');
    descriptionsContainer.innerHTML = '<h4>Your Value-Action Profile:</h4>';
    
    test.axes.forEach(dim => {
      const valueScore = results[dim.id].priority;
      const actionScore = results[dim.id].self;
      const difference = Math.abs(valueScore - actionScore);
      
      let description;
      if (difference < 0.5) {
        description = `<strong>Alignment:</strong> Your values and actions are well aligned in this area.`;
      } else if (difference < 1.5) {
        description = `<strong>Slight gap:</strong> There's a small difference between how important this is to you and how you live.`;
      } else {
        description = `<strong>Value-action gap:</strong> There's a significant difference between your stated values and your actions.`;
      }
      
      const dimensionEl = document.createElement('div');
      dimensionEl.classList.add('dimension-result');
      dimensionEl.innerHTML = `
        <h4>${dim.label}</h4>
        <div class="value-scores">
          <div>Priority: ${valueScore.toFixed(1)}/5</div>
          <div>Practice: ${actionScore.toFixed(1)}/5</div>
        </div>
        <p>${description}</p>
      `;
      
      descriptionsContainer.appendChild(dimensionEl);
    });
  }
  
  renderGenericResults(test, results) {
    // Generic handler for other test types
    const primaryStyle = document.getElementById('primary-style');
    primaryStyle.textContent = `Your results for ${test.title} have been calculated.`;
    
    // Just dump the results as JSON for now
    const descriptionsContainer = document.getElementById('dimension-descriptions');
    descriptionsContainer.innerHTML = `
      <pre>${JSON.stringify(results, null, 2)}</pre>
    `;
  }
  
  getCognitiveDescription(dimId, level) {
    // Descriptions for cognitive dimensions
    const descriptions = {
      speed: {
        low: "take your time to carefully consider decisions before acting.",
        mid: "adapting your pace based on the situation's needs.",
        high: "make quick decisions and process information rapidly."
      },
      abstract: {
        low: "focus on concrete, practical information and real-world applications.",
        mid: "appreciating both theoretical concepts and practical applications.",
        high: "think in terms of concepts, theories and abstract possibilities."
      },
      pattern: {
        low: "notice specific details and focus on precision.",
        mid: "seeing both details and broader patterns as needed.",
        high: "recognize overarching patterns and connections between ideas."
      },
      communication: {
        low: "process thoughts internally before sharing them.",
        mid: "balancing reflection with active discussion.",
        high: "process thoughts by talking them through with others."
      }
    };
    
    return descriptions[dimId]?.[level] || "";
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
