import { cognitiveTest } from '../data/questions.js';
import '../styles/components/intro.css';

class IntroScreen {
  constructor(app) {
    this.app = app;
  }
  
  render(container) {
    const introScreen = document.createElement('div');
    introScreen.classList.add('screen', 'intro-screen');
    
    introScreen.innerHTML = `
      <h2>Discover Your Cognitive Style</h2>
      <p>This test helps you understand how you process information and make decisions. Compare your results with others to find compatibility in thinking styles.</p>
      
      <div class="dimensions">
        ${cognitiveTest.dimensions.map(dim => `
          <div class="dimension">
            <h3>${dim.name}</h3>
            <p>${dim.low} vs. ${dim.high}</p>
          </div>
        `).join('')}
      </div>
      
      <button id="start-test" class="primary-btn">Start Test</button>
    `;
    
    container.appendChild(introScreen);
    
    // Add event listeners
    document.getElementById('start-test').addEventListener('click', () => {
      this.app.startTest();
    });
  }
}

export default IntroScreen;
