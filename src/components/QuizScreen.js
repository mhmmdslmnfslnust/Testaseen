import '../styles/components/quiz.css';

class QuizScreen {
  constructor(app) {
    this.app = app;
  }
  
  render(container) {
    this.container = container;
    const currentTest = this.app.state.currentTest;
    
    const quizScreen = document.createElement('div');
    quizScreen.classList.add('screen', 'quiz-screen');
    
    quizScreen.innerHTML = `
      <div class="quiz-header">
        <h2>${currentTest.title}</h2>
        <div class="progress-container">
          <div id="progress-bar" class="progress-bar"></div>
        </div>
      </div>
      
      <h3 id="question-text" class="question-text"></h3>
      
      <div class="options-container">
        <div class="scale-labels">
          <span>Strongly Disagree</span>
          <span>Strongly Agree</span>
        </div>
        
        <div class="scale-options">
          ${[1, 2, 3, 4, 5].map(value => `
            <button class="option-btn" data-value="${value}">${value}</button>
          `).join('')}
        </div>
      </div>
    `;
    
    container.appendChild(quizScreen);
    
    // Add event listeners
    const optionButtons = document.querySelectorAll('.option-btn');
    optionButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const value = parseInt(e.target.dataset.value);
        this.selectAnswer(value);
      });
    });
    
    // Load first question
    this.updateQuestion();
  }
  
  updateQuestion() {
    const currentTest = this.app.state.currentTest;
    const question = currentTest.questions[this.app.state.currentQuestionIndex];
    const questionText = document.getElementById('question-text');
    const progressBar = document.getElementById('progress-bar');
    
    // Update text
    questionText.textContent = question.text;
    
    // Update progress bar
    const progress = (this.app.state.currentQuestionIndex / currentTest.questions.length) * 100;
    progressBar.style.width = `${progress}%`;
    
    // Reset button selection
    document.querySelectorAll('.option-btn').forEach(button => {
      button.classList.remove('selected');
    });
  }
  
  selectAnswer(value) {
    // Highlight selected button
    const selectedButton = document.querySelector(`.option-btn[data-value="${value}"]`);
    document.querySelectorAll('.option-btn').forEach(btn => btn.classList.remove('selected'));
    selectedButton.classList.add('selected');
    
    // Pass the answer to the app after a brief delay
    setTimeout(() => {
      this.app.handleAnswer(value);
    }, 300);
  }
}

export default QuizScreen;
