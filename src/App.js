import IntroScreen from './components/IntroScreen.js';
import QuizScreen from './components/QuizScreen.js';
import ResultsScreen from './components/ResultsScreen.js';
import ComparisonScreen from './components/ComparisonScreen.js';
import { createFooter } from './components/Footer.js';
import { cognitiveTest } from './data/questions.js';
import StorageService from './services/StorageService.js';

class App {
  constructor() {
    this.currentScreen = null;
    this.appElement = document.getElementById('app');
    this.state = {
      currentQuestionIndex: 0,
      answers: [],
      results: null,
      comparisonData: null
    };
    
    // Initialize components
    this.components = {
      intro: new IntroScreen(this),
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
      <h1>Cognitive Alignment Test</h1>
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
    this.navigateTo('intro');
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
  
  startTest() {
    this.state.currentQuestionIndex = 0;
    this.state.answers = [];
    this.state.results = null;
    this.navigateTo('quiz');
  }
  
  handleAnswer(value) {
    const question = cognitiveTest.questions[this.state.currentQuestionIndex];
    
    // Store the answer
    this.state.answers.push({
      questionIndex: this.state.currentQuestionIndex,
      dimension: question.dimension,
      direction: question.direction,
      value: value
    });
    
    // Move to next question or show results
    this.state.currentQuestionIndex++;
    
    if (this.state.currentQuestionIndex < cognitiveTest.questions.length) {
      // Update the quiz screen
      this.components.quiz.updateQuestion();
    } else {
      // Calculate and show results
      this.calculateResults();
      this.navigateTo('results');
    }
  }
  
  calculateResults() {
    // Initialize scores for each dimension
    const dimensionScores = {};
    cognitiveTest.dimensions.forEach(dim => {
      dimensionScores[dim.id] = {
        totalPoints: 0,
        questionCount: 0,
        score: 0
      };
    });
    
    // Calculate raw scores
    this.state.answers.forEach(answer => {
      const dimension = answer.dimension;
      const value = answer.direction === 'high' ? answer.value : (6 - answer.value); // Reverse score if direction is low
      
      dimensionScores[dimension].totalPoints += value;
      dimensionScores[dimension].questionCount++;
    });
    
    // Calculate normalized scores (0-100 scale)
    for (const dim in dimensionScores) {
      const avg = dimensionScores[dim].totalPoints / dimensionScores[dim].questionCount;
      dimensionScores[dim].score = ((avg - 1) / 4) * 100; // Convert 1-5 scale to 0-100
    }
    
    this.state.results = dimensionScores;
  }
  
  saveResults() {
    return this.services.storage.saveResults(this.state.results);
  }
  
  generateComparisonData() {
    const otherPersonResults = {};
    
    cognitiveTest.dimensions.forEach(dim => {
      // Generate a score that's somewhat different but not totally random
      const currentScore = this.state.results[dim.id].score;
      let variance = Math.random() * 50 - 25; // -25 to +25 variance
      
      // Limit to 0-100 range
      let newScore = currentScore + variance;
      if (newScore < 0) newScore = 0;
      if (newScore > 100) newScore = 100;
      
      otherPersonResults[dim.id] = {
        score: newScore
      };
    });
    
    this.state.comparisonData = otherPersonResults;
    return otherPersonResults;
  }
}

export default App;
