class StorageService {
  constructor() {
    this.storageKey = 'cognitiveTestResults';
  }
  
  saveResults(results) {
    try {
      const resultsData = JSON.stringify({
        testName: 'Cognitive Alignment Test',
        timestamp: new Date().toISOString(),
        results: results
      });
      
      localStorage.setItem(this.storageKey, resultsData);
      return true;
    } catch (error) {
      console.error('Error saving results:', error);
      return false;
    }
  }
  
  getResults() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error retrieving results:', error);
      return null;
    }
  }
  
  clearResults() {
    try {
      localStorage.removeItem(this.storageKey);
      return true;
    } catch (error) {
      console.error('Error clearing results:', error);
      return false;
    }
  }
}

export default StorageService;
