import IntroScreen from './components/IntroScreen.js';
import TestSelectionScreen from './components/TestSelectionScreen.js';
import QuizScreen from './components/QuizScreen.js';
import ResultsScreen from './components/ResultsScreen.js';
import ComparisonScreen from './components/ComparisonScreen.js';
import { createFooter } from './components/Footer.js';
import { allTests } from './data/questions.js';
import StorageService from './services/StorageService.js';

class App {
  constructor() {
    this.currentScreen = null;
    this.appElement = document.getElementById('app');
    this.state = {
      currentTest: null,
      currentQuestionIndex: 0,
      answers: [],
      results: null,
      comparisonData: null
    };
    
    // Initialize components
    this.components = {
      intro: new IntroScreen(this),
      testSelection: new TestSelectionScreen(this),
      quiz: new QuizScreen(this),
      results: new ResultsScreen(this),
      comparison: new ComparisonScreen(this)
    };
    
    // Initialize services
    this.services = {
      storage: new StorageService()
    };
    
    // Bind methods to maintain context
    this.navigateTo = this.navigateTo.bind(this);
    this.selectTest = this.selectTest.bind(this);
    this.handleAnswer = this.handleAnswer.bind(this);
    this.calculateResults = this.calculateResults.bind(this);
    this.generateComparisonData = this.generateComparisonData.bind(this);
  }
  
  initialize() {
    // Clear app content
    this.appElement.innerHTML = '';
    
    // Create header
    const header = document.createElement('header');
    header.classList.add('app-header');
    header.innerHTML = `
      <h1>Sonnet 3.7 Compatibility Tests</h1>
      <p class="disclaimer">For self-reflection and exploration only. Not a professional psychological tool.</p>
    `;
    this.appElement.appendChild(header);
    
    // Create main content container
    const main = document.createElement('main');
    main.classList.add('main-container');
    this.appElement.appendChild(main);
    
    // Add footer
    this.appElement.appendChild(createFooter());
    
    // Navigate to intro screen
    this.navigateTo('testSelection');
  }
  
  navigateTo(screenName) {
    // Clear main content
    const main = document.querySelector('.main-container');
    main.innerHTML = '';
    
    // Update current screen
    this.currentScreen = screenName;
    
    // Render the requested component
    const component = this.components[screenName];
    if (!component) {
      console.error(`Screen "${screenName}" not found!`);
      return;
    }
    
    component.render(main);
  }
  
  selectTest(testId) {
    // Find the selected test by ID
    const selectedTest = allTests.find(test => test.id === testId);
    
    if (!selectedTest) {
      console.error(`Test with ID "${testId}" not found!`);
      return;
    }
    
    // Set the current test
    this.state.currentTest = selectedTest;
    
    // Start the test
    this.startTest();
  }
  
  startTest() {
    this.state.currentQuestionIndex = 0;
    this.state.answers = [];
    this.state.results = null;
    this.navigateTo('quiz');
  }
  
  handleAnswer(value) {
    const currentTest = this.state.currentTest;
    const question = currentTest.questions[this.state.currentQuestionIndex];
    
    // Store the answer
    this.state.answers.push({
      questionIndex: this.state.currentQuestionIndex,
      axis: question.axis,
      direction: question.direction,
      type: question.type, // For tests like Life Values Sync that need type
      value: value
    });
    
    // Move to next question or show results
    this.state.currentQuestionIndex++;
    
    if (this.state.currentQuestionIndex < currentTest.questions.length) {
      // Update the quiz screen
      this.components.quiz.updateQuestion();
    } else {
      // Calculate and show results
      this.calculateResults();
      this.navigateTo('results');
    }
  }
  
  calculateResults() {
    const currentTest = this.state.currentTest;
    
    // Use the test's scoring function
    this.state.results = currentTest.scoring.compute.call(currentTest, this.state.answers);
  }
  
  saveResults() {
    const currentTest = this.state.currentTest;
    
    return this.services.storage.saveResults({
      test: currentTest.id,
      title: currentTest.title,
      timestamp: new Date().toISOString(),
      results: this.state.results
    });
  }
  
  generateComparisonData() {
    const currentTest = this.state.currentTest;
    const results = this.state.results;
    const otherPersonResults = {};
    
    if (currentTest.id === "cognitive-alignment" || currentTest.id === "conflict-style-match") {
      // For cognitive and conflict tests
      currentTest.axes.forEach(dim => {
        // Generate a score that's somewhat different but not totally random
        const currentScore = results[dim.id];
        const variance = Math.random() * 2 - 1; // -1 to +1 variance
        
        // Limit to 1-5 range (same as our scale)
        let newScore = currentScore + variance;
        if (newScore < 1) newScore = 1;
        if (newScore > 5) newScore = 5;
        
        otherPersonResults[dim.id] = newScore;
      });
    } else if (currentTest.id === "life-values-sync") {
      // For life values test which has priority and self scores
      Object.keys(results).forEach(axisId => {
        otherPersonResults[axisId] = {
          priority: Math.min(5, Math.max(1, results[axisId].priority + (Math.random() * 2 - 1))),
          self: Math.min(5, Math.max(1, results[axisId].self + (Math.random() * 2 - 1)))
        };
      });
    } else {
      // Generic handler for other test types
      console.log("Generating comparison data for test:", currentTest.id);
      // Create mock comparison data based on test structure
    }
    
    this.state.comparisonData = otherPersonResults;
    return otherPersonResults;
  }
}

export default App;
