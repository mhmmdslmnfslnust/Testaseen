import { allTests } from '../data/questions.js';
import '../styles/components/test-selection.css';

class TestSelectionScreen {
  constructor(app) {
    this.app = app;
  }
  
  render(container) {
    const selectionScreen = document.createElement('div');
    selectionScreen.classList.add('screen', 'test-selection-screen');
    
    selectionScreen.innerHTML = `
      <h2>Choose a Compatibility Test</h2>
      <p class="test-intro">Our tests provide insight into different aspects of compatibility. Select one to begin:</p>
      
      <div class="tests-container">
        ${allTests.map(test => `
          <div class="test-card" data-test-id="${test.id}">
            <div class="test-card-header">
              <h3>${test.title}</h3>
            </div>
            <div class="test-card-body">
              <p>${test.goal}</p>
              ${test.axes ? `
                <div class="test-dimensions">
                  <h4>Measures:</h4>
                  <ul>
                    ${test.axes.map(axis => `<li>${axis.label}</li>`).join('')}
                  </ul>
                </div>
              ` : ''}
            </div>
            <div class="test-card-footer">
              <button class="start-test-btn primary-btn" data-test-id="${test.id}">Start Test</button>
            </div>
          </div>
        `).join('')}
      </div>
      
      <div class="disclaimer-box">
        <p>All tests are for personal insight and entertainment only. 
        Not meant to provide professional psychological assessment or advice.</p>
      </div>
    `;
    
    container.appendChild(selectionScreen);
    
    // Add event listeners to test cards
    const startButtons = selectionScreen.querySelectorAll('.start-test-btn');
    startButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const testId = e.target.dataset.testId;
        this.app.selectTest(testId);
      });
    });
    
    // Make the entire card clickable
    const testCards = selectionScreen.querySelectorAll('.test-card');
    testCards.forEach(card => {
      card.addEventListener('click', (e) => {
        if (!e.target.classList.contains('start-test-btn')) {
          const testId = card.dataset.testId;
          this.app.selectTest(testId);
        }
      });
    });
  }
}

export default TestSelectionScreen;
