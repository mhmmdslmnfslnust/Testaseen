import { cognitiveTest } from '../data/questions.js';
import { createRadarChart } from '../utils/charts.js';
import '../styles/components/comparison.css';

class ComparisonScreen {
  constructor(app) {
    this.app = app;
  }
  
  render(container) {
    const currentTest = this.app.state.currentTest;
    
    const comparisonScreen = document.createElement('div');
    comparisonScreen.classList.add('screen', 'comparison-screen');
    
    comparisonScreen.innerHTML = `
      <h2>${currentTest.title} - Compatibility Comparison</h2>
      
      <div class="comparison-container">
        <div class="chart-container">
          <canvas id="comparison-chart"></canvas>
        </div>
        
        <div class="compatibility-score">
          <h3>Compatibility Analysis</h3>
          <div id="compatibility-percentage"></div>
          <div id="compatibility-interpretation"></div>
        </div>
      </div>
      
      <div class="action-buttons">
        <button id="back-to-results" class="secondary-btn">Back to My Results</button>
        <button id="choose-different" class="secondary-btn">Choose Different Test</button>
      </div>
    `;
    
    container.appendChild(comparisonScreen);
    
    // Create chart and display compatibility
    this.renderComparisonChart();
    
    if (currentTest.compatibility && typeof currentTest.compatibility.compute === 'function') {
      this.calculateCompatibility();
    } else {
      document.querySelector('.compatibility-score').innerHTML = `
        <h3>Comparison Analysis</h3>
        <p>Detailed compatibility analysis is not available for this test type.</p>
      `;
    }
    
    // Add event listeners
    document.getElementById('back-to-results').addEventListener('click', () => {
      this.app.navigateTo('results');
    });
    
    document.getElementById('choose-different').addEventListener('click', () => {
      this.app.navigateTo('testSelection');
    });
  }
  
  renderComparisonChart() {
    const currentTest = this.app.state.currentTest;
    const yourResults = this.app.state.results;
    const theirResults = this.app.state.comparisonData;
    
    // Create chart based on test type
    if (currentTest.id === "life-values-sync") {
      // For life values test, we show both priority and actual values
      const labels = currentTest.axes.map(dim => dim.label);
      const yourPriorityData = currentTest.axes.map(dim => yourResults[dim.id].priority * 20);
      const yourSelfData = currentTest.axes.map(dim => yourResults[dim.id].self * 20);
      const theirPriorityData = currentTest.axes.map(dim => theirResults[dim.id].priority * 20);
      const theirSelfData = currentTest.axes.map(dim => theirResults[dim.id].self * 20);
      
      createRadarChart('comparison-chart', labels, [
        {
          label: 'Your Values',
          data: yourPriorityData,
          backgroundColor: 'rgba(74, 111, 165, 0.1)',
          borderColor: 'rgba(74, 111, 165, 1)'
        },
        {
          label: 'Your Practice',
          data: yourSelfData,
          backgroundColor: 'rgba(74, 111, 165, 0.3)',
          borderColor: 'rgba(74, 111, 165, 0.7)',
          borderDash: [5, 5]
        },
        {
          label: 'Their Values',
          data: theirPriorityData,
          backgroundColor: 'rgba(77, 204, 189, 0.1)',
          borderColor: 'rgba(77, 204, 189, 1)'
        },
        {
          label: 'Their Practice',
          data: theirSelfData,
          backgroundColor: 'rgba(77, 204, 189, 0.3)',
          borderColor: 'rgba(77, 204, 189, 0.7)',
          borderDash: [5, 5]
        }
      ]);
      
    } else {
      // For cognitive and conflict tests
      const labels = currentTest.axes.map(dim => dim.label);
      const yourData = currentTest.axes.map(dim => yourResults[dim.id] * 20);
      const theirData = currentTest.axes.map(dim => theirResults[dim.id] * 20);
      
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
  }
  
  calculateCompatibility() {
    const currentTest = this.app.state.currentTest;
    const yourResults = this.app.state.results;
    const theirResults = this.app.state.comparisonData;
    
    try {
      // Use the compatibility logic from the test
      const compatibility = currentTest.compatibility.compute.call(
        currentTest, 
        yourResults, 
        theirResults
      );
      
      // Display results based on test type
      if (currentTest.id === "cognitive-alignment") {
        this.renderCognitiveCompatibility(compatibility);
      } else if (currentTest.id === "conflict-style-match") {
        this.renderConflictCompatibility(compatibility);
      } else if (currentTest.id === "life-values-sync") {
        this.renderLifeValuesCompatibility(compatibility);
      } else {
        this.renderGenericCompatibility(compatibility);
      }
    } catch (error) {
      console.error("Error calculating compatibility:", error);
      document.getElementById('compatibility-interpretation').innerHTML = `
        <p class="error">There was an error calculating compatibility.</p>
      `;
    }
  }
  
  renderCognitiveCompatibility(compatibility) {
    const currentTest = this.app.state.currentTest;
    const yourResults = this.app.state.results;
    const theirResults = this.app.state.comparisonData;
    
    // Display harmony score
    const harmonyScore = Math.round(compatibility.harmony * 20); // Convert to percentage
    document.getElementById('compatibility-percentage').innerHTML = `
      <div class="score-display">
        <div class="score-circle">${harmonyScore}%</div>
        <div class="score-label">Harmony</div>
      </div>
    `;
    
    // Generate interpretation text
    let interpretationHTML = `
      <div class="compatibility-dimension">
        <h4>Harmony Score: ${harmonyScore}%</h4>
        <p>${this.getHarmonyDescription(harmonyScore)}</p>
      </div>
      <div class="compatibility-dimension">
        <h4>Complementary Score: ${Math.round(compatibility.complement * 20)}%</h4>
        <p>${this.getComplementDescription(Math.round(compatibility.complement * 20))}</p>
      </div>
      <h4>Dimension Analysis:</h4>
    `;
    
    // Add dimension-specific interpretations
    currentTest.axes.forEach(dim => {
      const yourScore = yourResults[dim.id];
      const theirScore = theirResults[dim.id];
      const difference = Math.abs(yourScore - theirScore);
      
      let compatType;
      if (difference < 1) {
        compatType = 'similar';
      } else if (difference < 2.5) {
        compatType = 'complementary';
      } else {
        compatType = 'challenging';
      }
      
      interpretationHTML += `<div class="compatibility-dimension">
        <h4>${dim.label}:</h4>
        <p>${this.getCognitiveCompatDescription(dim.id, compatType)}</p>
      </div>`;
    });
    
    document.getElementById('compatibility-interpretation').innerHTML = interpretationHTML;
  }
  
  renderConflictCompatibility(compatibility) {
    // Display conflict compatibility score
    const compatScore = Math.round(compatibility.compatibility);
    document.getElementById('compatibility-percentage').innerHTML = `
      <div class="score-display">
        <div class="score-circle">${compatScore}%</div>
        <div class="score-label">Compatibility</div>
      </div>
    `;
    
    let interpretationHTML = '';
    
    // Show red flags if any
    if (compatibility.redFlags && compatibility.redFlags.length > 0) {
      interpretationHTML += `
        <div class="compatibility-warning">
          <h4>Potential Challenges:</h4>
          <ul>
            ${compatibility.redFlags.map(flag => `<li>${flag}</li>`).join('')}
          </ul>
        </div>
      `;
    }
    
    // Show complementary score explanation
    interpretationHTML += `
      <div class="compatibility-dimension">
        <h4>Complementary Dynamics: ${compatibility.complementScore}/3</h4>
        <p>${this.getConflictComplementDescription(compatibility.complementScore)}</p>
      </div>
    `;
    
    document.getElementById('compatibility-interpretation').innerHTML = interpretationHTML;
  }
  
  renderLifeValuesCompatibility(compatibility) {
    // Display value compatibility scores
    const priorityScore = Math.round(compatibility.priority * 20);
    const selfScore = Math.round(compatibility.self * 20);
    
    document.getElementById('compatibility-percentage').innerHTML = `
      <div class="score-display">
        <div class="score-circle">${priorityScore}%</div>
        <div class="score-label">Value Alignment</div>
      </div>
      <div class="score-display">
        <div class="score-circle">${selfScore}%</div>
        <div class="score-label">Lifestyle Alignment</div>
      </div>
    `;
    
    let interpretationHTML = `
      <div class="compatibility-dimension">
        <h4>Value Priorities: ${priorityScore}%</h4>
        <p>${this.getValuePriorityDescription(priorityScore)}</p>
      </div>
      <div class="compatibility-dimension">
        <h4>Lived Experience: ${selfScore}%</h4>
        <p>${this.getValuePracticeDescription(selfScore)}</p>
      </div>
    `;
    
    document.getElementById('compatibility-interpretation').innerHTML = interpretationHTML;
  }
  
  renderGenericCompatibility(compatibility) {
    document.getElementById('compatibility-percentage').textContent = 'Analysis Complete';
    document.getElementById('compatibility-interpretation').innerHTML = `
      <pre>${JSON.stringify(compatibility, null, 2)}</pre>
    `;
  }
  
  // Helper methods for descriptions
  getHarmonyDescription(score) {
    if (score >= 80) {
      return "You two think very similarly. You'll likely understand each other easily and have natural rapport.";
    } else if (score >= 60) {
      return "You share enough cognitive similarities to understand each other well in most situations.";
    } else if (score >= 40) {
      return "You have moderate similarity in thinking styles, with some natural alignment and some differences.";
    } else {
      return "Your thinking styles are quite different, which may require more effort to understand each other.";
    }
  }
  
  getComplementDescription(score) {
    if (score >= 80) {
      return "Your different perspectives could create excellent complementary strengths.";
    } else if (score >= 60) {
      return "You have good complementary thinking that could lead to well-rounded outcomes.";
    } else if (score >= 40) {
      return "You have moderate complementary potential in your thinking styles.";
    } else {
      return "Your thinking styles are very similar, which may lead to blind spots but also easy agreement.";
    }
  }
  
  getCognitiveCompatDescription(dimId, type) {
    const descriptions = {
      speed: {
        similar: "You both process information at a similar pace, creating a comfortable rhythm in conversations.",
        complementary: "Your somewhat different processing speeds can be complementary - one bringing careful thought, the other bringing timely decisions.",
        challenging: "Your significantly different processing speeds may create friction, with one person feeling rushed and the other feeling held back."
      },
      abstract: {
        similar: "You both think at similar levels of abstraction, making conversations flow naturally.",
        complementary: "Your different levels of abstraction complement each other - one bringing practicality, the other bringing vision.",
        challenging: "Your very different abstraction levels may create communication gaps, with one seeming too theoretical and the other too concrete."
      },
      pattern: {
        similar: "You both focus on information in similar ways, creating mutual understanding.",
        complementary: "Your different focuses complement each other - one seeing details, the other seeing patterns.",
        challenging: "Your very different approaches to information may create blind spots without conscious effort to understand each other's perspective."
      },
      communication: {
        similar: "You share a natural communication rhythm that feels comfortable for both.",
        complementary: "Your different communication styles can balance each other well - one reflecting, one expressing.",
        challenging: "Your opposing communication styles may create tension, with the internal processor feeling overwhelmed and the external processor feeling unheard."
      }
    };
    
    return descriptions[dimId]?.[type] || "";
  }
  
  getConflictComplementDescription(score) {
    if (score === 3) {
      return "You have an excellent conflict dynamic balance. Your styles work well together for resolving disagreements.";
    } else if (score === 2) {
      return "You have a fairly good balance of conflict styles that should generally work well together.";
    } else if (score === 1) {
      return "You have some complementary conflict styles, but may need to work on communication during disagreements.";
    } else {
      return "Your conflict styles may not naturally complement each other. Conscious effort in communication will be important.";
    }
  }
  
  getValuePriorityDescription(score) {
    if (score >= 80) {
      return "You both prioritize very similar values in life. This creates a strong foundation for understanding each other.";
    } else if (score >= 60) {
      return "You share many key values, creating good alignment on life priorities.";
    } else if (score >= 40) {
      return "You have moderate alignment in your values, with some shared priorities and some differences.";
    } else {
      return "Your fundamental values differ significantly, which may lead to different life priorities.";
    }
  }
  
  getValuePracticeDescription(score) {
    if (score >= 80) {
      return "You both live your values in very similar ways, creating natural harmony in daily life.";
    } else if (score >= 60) {
      return "Your actual lifestyles and practices align well, making day-to-day compatibility likely.";
    } else if (score >= 40) {
      return "You have somewhat different approaches to living your values, which may require occasional compromise.";
    } else {
      return "Your practical approaches to life are quite different, which may create friction in shared activities and decisions.";
    }
  }
}

export default ComparisonScreen;
