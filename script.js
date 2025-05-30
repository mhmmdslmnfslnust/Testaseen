document.addEventListener('DOMContentLoaded', () => {
    // App state
    const state = {
        currentQuestionIndex: 0,
        answers: [],
        results: null,
        comparisonData: null
    };

    // DOM elements
    const screens = {
        intro: document.getElementById('intro-screen'),
        quiz: document.getElementById('quiz-screen'),
        results: document.getElementById('results-screen'),
        comparison: document.getElementById('comparison-screen')
    };

    const elements = {
        startButton: document.getElementById('start-test'),
        questionText: document.getElementById('question-text'),
        progressBar: document.getElementById('progress-bar'),
        optionButtons: document.querySelectorAll('.option-btn'),
        resultsChart: document.getElementById('results-chart'),
        primaryStyle: document.getElementById('primary-style'),
        dimensionDescriptions: document.getElementById('dimension-descriptions'),
        saveResults: document.getElementById('save-results'),
        compareResults: document.getElementById('compare-results'),
        retakeTest: document.getElementById('retake-test'),
        comparisonChart: document.getElementById('comparison-chart'),
        compatibilityPercentage: document.getElementById('compatibility-percentage'),
        compatibilityInterpretation: document.getElementById('compatibility-interpretation'),
        backToResults: document.getElementById('back-to-results')
    };

    // Initialize event listeners
    function initEventListeners() {
        elements.startButton.addEventListener('click', startTest);
        
        elements.optionButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                selectAnswer(parseInt(e.target.dataset.value));
            });
        });
        
        elements.saveResults.addEventListener('click', saveResults);
        elements.compareResults.addEventListener('click', showComparisonScreen);
        elements.retakeTest.addEventListener('click', resetTest);
        elements.backToResults.addEventListener('click', () => {
            showScreen('results');
        });
    }

    // Test functions
    function startTest() {
        state.currentQuestionIndex = 0;
        state.answers = [];
        showScreen('quiz');
        loadQuestion();
    }

    function loadQuestion() {
        const question = cognitiveTest.questions[state.currentQuestionIndex];
        elements.questionText.textContent = question.text;
        
        // Update progress bar
        const progress = (state.currentQuestionIndex / cognitiveTest.questions.length) * 100;
        elements.progressBar.style.width = `${progress}%`;
        
        // Reset button selection
        elements.optionButtons.forEach(button => {
            button.classList.remove('selected');
        });
    }

    function selectAnswer(value) {
        // Store the answer
        const question = cognitiveTest.questions[state.currentQuestionIndex];
        state.answers.push({
            questionIndex: state.currentQuestionIndex,
            dimension: question.dimension,
            direction: question.direction,
            value: value
        });
        
        // Highlight selected button briefly
        const selectedButton = document.querySelector(`.option-btn[data-value="${value}"]`);
        selectedButton.classList.add('selected');
        
        // Move to next question after brief delay
        setTimeout(() => {
            state.currentQuestionIndex++;
            
            if (state.currentQuestionIndex < cognitiveTest.questions.length) {
                loadQuestion();
            } else {
                calculateResults();
                showResults();
            }
        }, 300);
    }

    function calculateResults() {
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
        state.answers.forEach(answer => {
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
        
        state.results = dimensionScores;
    }

    function showResults() {
        showScreen('results');
        renderResultsChart();
        renderTextResults();
    }

    function renderResultsChart() {
        // Destroy existing chart if it exists
        if (window.resultsChart) {
            window.resultsChart.destroy();
        }
        
        const labels = cognitiveTest.dimensions.map(dim => dim.name);
        const scores = cognitiveTest.dimensions.map(dim => state.results[dim.id].score);
        
        // Create radar chart
        const ctx = elements.resultsChart.getContext('2d');
        window.resultsChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Your Profile',
                    data: scores,
                    backgroundColor: 'rgba(74, 111, 165, 0.2)',
                    borderColor: 'rgba(74, 111, 165, 1)',
                    pointBackgroundColor: 'rgba(74, 111, 165, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(74, 111, 165, 1)'
                }]
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
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const dimension = cognitiveTest.dimensions[context.dataIndex];
                                const score = context.raw;
                                
                                if (score < 33) {
                                    return `${dimension.low} (${Math.round(score)}%)`;
                                } else if (score > 66) {
                                    return `${dimension.high} (${Math.round(score)}%)`;
                                } else {
                                    return `Balanced (${Math.round(score)}%)`;
                                }
                            }
                        }
                    }
                }
            }
        });
    }

    function renderTextResults() {
        // Determine primary style
        let primaryText = "Your cognitive style is characterized by ";
        const traits = [];
        
        cognitiveTest.dimensions.forEach(dim => {
            const score = state.results[dim.id].score;
            
            if (score < 33) {
                traits.push(`${dim.low.toLowerCase()}`);
            } else if (score > 66) {
                traits.push(`${dim.high.toLowerCase()}`);
            }
        });
        
        if (traits.length > 0) {
            primaryText += traits.join(", ") + ".";
        } else {
            primaryText += "a balanced approach across multiple cognitive dimensions.";
        }
        
        elements.primaryStyle.textContent = primaryText;
        
        // Create dimension descriptions
        elements.dimensionDescriptions.innerHTML = '';
        cognitiveTest.dimensions.forEach(dim => {
            const score = state.results[dim.id].score;
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
            
            elements.dimensionDescriptions.appendChild(dimensionEl);
        });
    }

    function saveResults() {
        const resultsData = JSON.stringify({
            testName: cognitiveTest.title,
            timestamp: new Date().toISOString(),
            results: state.results
        });
        
        // Save to localStorage
        localStorage.setItem('cognitiveTestResults', resultsData);
        
        // Provide feedback to user
        const saveBtn = elements.saveResults;
        const originalText = saveBtn.textContent;
        saveBtn.textContent = "Results Saved!";
        saveBtn.disabled = true;
        
        setTimeout(() => {
            saveBtn.textContent = originalText;
            saveBtn.disabled = false;
        }, 2000);
    }

    function showComparisonScreen() {
        // For demo purposes, generate random comparison data
        // In a real app, you'd get this from another user or database
        generateMockComparisonData();
        showScreen('comparison');
        renderComparisonChart();
        calculateCompatibility();
    }

    function generateMockComparisonData() {
        const otherPersonResults = {};
        
        cognitiveTest.dimensions.forEach(dim => {
            // Generate a score that's somewhat different but not totally random
            const currentScore = state.results[dim.id].score;
            let variance = Math.random() * 50 - 25; // -25 to +25 variance
            
            // Limit to 0-100 range
            let newScore = currentScore + variance;
            if (newScore < 0) newScore = 0;
            if (newScore > 100) newScore = 100;
            
            otherPersonResults[dim.id] = {
                score: newScore
            };
        });
        
        state.comparisonData = otherPersonResults;
    }

    function renderComparisonChart() {
        // Destroy existing chart if it exists
        if (window.comparisonChart) {
            window.comparisonChart.destroy();
        }
        
        const labels = cognitiveTest.dimensions.map(dim => dim.name);
        const yourScores = cognitiveTest.dimensions.map(dim => state.results[dim.id].score);
        const theirScores = cognitiveTest.dimensions.map(dim => state.comparisonData[dim.id].score);
        
        // Create radar chart
        const ctx = elements.comparisonChart.getContext('2d');
        window.comparisonChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Your Profile',
                        data: yourScores,
                        backgroundColor: 'rgba(74, 111, 165, 0.2)',
                        borderColor: 'rgba(74, 111, 165, 1)',
                        pointBackgroundColor: 'rgba(74, 111, 165, 1)',
                        pointBorderColor: '#fff'
                    },
                    {
                        label: 'Their Profile',
                        data: theirScores,
                        backgroundColor: 'rgba(77, 204, 189, 0.2)',
                        borderColor: 'rgba(77, 204, 189, 1)',
                        pointBackgroundColor: 'rgba(77, 204, 189, 1)',
                        pointBorderColor: '#fff'
                    }
                ]
            },
            options: {
                scales: {
                    r: {
                        min: 0,
                        max: 100,
                        beginAtZero: true
                    }
                }
            }
        });
    }

    function calculateCompatibility() {
        // Calculate overall compatibility based on dimension differences
        let overallCompatibility = 0;
        let compatibilityText = '';
        
        cognitiveTest.dimensions.forEach(dim => {
            const yourScore = state.results[dim.id].score;
            const theirScore = state.comparisonData[dim.id].score;
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
            compatibilityText += `<h4>${dim.name}:</h4>
                <p>${cognitiveTest.compatibility[dim.id][compatType]}</p>`;
        });
        
        // Average the compatibility
        overallCompatibility = Math.round(overallCompatibility / cognitiveTest.dimensions.length);
        
        // Display results
        elements.compatibilityPercentage.textContent = `${overallCompatibility}%`;
        elements.compatibilityInterpretation.innerHTML = compatibilityText;
    }

    function resetTest() {
        state.currentQuestionIndex = 0;
        state.answers = [];
        state.results = null;
        showScreen('intro');
    }

    // Helper for switching screens
    function showScreen(screenName) {
        for (const name in screens) {
            screens[name].classList.add('hidden');
        }
        screens[screenName].classList.remove('hidden');
    }

    // Initialize app
    initEventListeners();
});
