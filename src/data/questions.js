// 1. Cognitive Alignment Test
export const cognitiveAlignmentTest = {
  id: "cognitive-alignment",
  title: "Cognitive Alignment Test",
  goal: "Compare how two people process and interpret information.",
  axes: [
    { id: "speed", label: "Processing Speed", low: "Deliberate", high: "Rapid" },
    { id: "abstract", label: "Abstractness", low: "Concrete", high: "Abstract" },
    { id: "pattern", label: "Pattern-Seeking", low: "Detail-Oriented", high: "Big Picture" },
    { id: "communication", label: "Communication", low: "Internal Processor", high: "External Talker" }
  ],
  questions: [
    // 10 self-description
    { text: "I prefer to think things through before acting.", axis: "speed", direction: "low" },
    { text: "I often make decisions quickly.", axis: "speed", direction: "high" },
    { text: "I focus on practical, real-world details.", axis: "abstract", direction: "low" },
    { text: "I enjoy discussing abstract theories.", axis: "abstract", direction: "high" },
    { text: "I notice small details others miss.", axis: "pattern", direction: "low" },
    { text: "I see connections between unrelated ideas.", axis: "pattern", direction: "high" },
    { text: "I process my thoughts internally.", axis: "communication", direction: "low" },
    { text: "I talk things out to clarify my thinking.", axis: "communication", direction: "high" },
    { text: "I prefer step-by-step instructions.", axis: "pattern", direction: "low" },
    { text: "I like to improvise and adapt.", axis: "pattern", direction: "high" },
    // 10 preference
    { text: "I value careful planning over quick action.", axis: "speed", direction: "low" },
    { text: "I prefer to act first and adjust later.", axis: "speed", direction: "high" },
    { text: "I enjoy hands-on activities.", axis: "abstract", direction: "low" },
    { text: "I enjoy brainstorming possibilities.", axis: "abstract", direction: "high" },
    { text: "I like to double-check details.", axis: "pattern", direction: "low" },
    { text: "I look for patterns in data.", axis: "pattern", direction: "high" },
    { text: "I keep my thoughts to myself.", axis: "communication", direction: "low" },
    { text: "I share my ideas openly.", axis: "communication", direction: "high" },
    { text: "I prefer clear instructions.", axis: "pattern", direction: "low" },
    { text: "I like open-ended challenges.", axis: "pattern", direction: "high" }
  ],
  scoring: {
    scale: [1, 5], // 1-5 Likert
    // Each axis is scored by averaging relevant questions (reverse if direction is 'low')
    compute(scores) {
      const axisTotals = {};
      const axisCounts = {};
      this.axes.forEach(a => { axisTotals[a.id] = 0; axisCounts[a.id] = 0; });
      scores.forEach(({ axis, direction, value }) => {
        const v = direction === "high" ? value : (6 - value);
        axisTotals[axis] += v;
        axisCounts[axis] += 1;
      });
      const result = {};
      this.axes.forEach(a => {
        result[a.id] = axisCounts[a.id] ? axisTotals[a.id] / axisCounts[a.id] : 0;
      });
      return result;
    }
  },
  resultTypes: [
    // Example: "Conceptual Synthesizer", "Practical Planner", etc.
    // You can map axis profiles to named types in UI.
  ],
  compatibility: {
    // Harmony: high compatibility if axes are close
    // Complementarity: high if some axes are opposite
    compute(profileA, profileB) {
      let harmony = 0, complement = 0;
      this.axes.forEach(a => {
        const diff = Math.abs(profileA[a.id] - profileB[a.id]);
        harmony += (5 - diff); // closer = better
        complement += diff;    // more difference = more complement
      });
      return {
        harmony: harmony / this.axes.length,
        complement: complement / this.axes.length
      };
    }
  }
};

// 2. Life Values Sync Test
export const lifeValuesSyncTest = {
  id: "life-values-sync",
  title: "Life Values Sync Test",
  goal: "Test core life philosophy alignment.",
  axes: [
    { id: "stability", label: "Stability vs. Change" },
    { id: "community", label: "Community vs. Autonomy" },
    { id: "practicality", label: "Practicality vs. Idealism" },
    { id: "control", label: "Control vs. Flow" },
    { id: "finance", label: "Financial Security vs. Experience Seeking" }
  ],
  questions: [
    // For each axis, two questions: importance (priority), and self-position
    // Example for stability:
    { text: "How important is stability in your life?", axis: "stability", type: "priority" },
    { text: "How much do you actually live with stability?", axis: "stability", type: "self" },
    // Repeat for all axes...
    { text: "How important is community to you?", axis: "community", type: "priority" },
    { text: "How much do you prioritize community over autonomy?", axis: "community", type: "self" },
    { text: "How important is practicality in your decisions?", axis: "practicality", type: "priority" },
    { text: "How practical are you in daily life?", axis: "practicality", type: "self" },
    { text: "How important is being in control?", axis: "control", type: "priority" },
    { text: "How much do you go with the flow vs. control outcomes?", axis: "control", type: "self" },
    { text: "How important is financial security to you?", axis: "finance", type: "priority" },
    { text: "How much do you prioritize financial security over experiences?", axis: "finance", type: "self" },
    // Add more axes/questions as needed (expand to 24 for full test)
  ],
  scoring: {
    scale: [1, 5],
    compute(scores) {
      // For each axis, get both priority and self
      const result = {};
      this.axes.forEach(a => {
        const prio = scores.find(q => q.axis === a.id && q.type === "priority");
        const self = scores.find(q => q.axis === a.id && q.type === "self");
        result[a.id] = {
          priority: prio ? prio.value : 0,
          self: self ? self.value : 0
        };
      });
      return result;
    }
  },
  resultTypes: [
    // Show where person lives according to values, and where there is friction
  ],
  compatibility: {
    // Compare both priority and self-position per axis
    compute(profileA, profileB) {
      let priorityMatch = 0, selfMatch = 0, count = 0;
      Object.keys(profileA).forEach(axis => {
        const a = profileA[axis], b = profileB[axis];
        if (a && b) {
          priorityMatch += 5 - Math.abs(a.priority - b.priority);
          selfMatch += 5 - Math.abs(a.self - b.self);
          count++;
        }
      });
      return {
        priority: priorityMatch / count,
        self: selfMatch / count
      };
    }
  }
};

// 3. Conflict Style Match
export const conflictStyleMatchTest = {
  id: "conflict-style-match",
  title: "Conflict Style Match",
  goal: "Predict how two people behave during disagreements.",
  axes: [
    { id: "directness", label: "Directness", low: "Avoidant", high: "Confrontational" },
    { id: "processing", label: "Processing Time", low: "Needs Time", high: "Fast" },
    { id: "closure", label: "Closure Need", low: "Can leave unresolved", high: "Must resolve" },
    { id: "emotion", label: "Emotional Tone", low: "Calm", high: "Reactive" }
  ],
  questions: [
    { text: "When upset, I tend to avoid the issue.", axis: "directness", direction: "low" },
    { text: "I address problems head-on.", axis: "directness", direction: "high" },
    { text: "I need time to process before discussing conflict.", axis: "processing", direction: "low" },
    { text: "I want to resolve issues immediately.", axis: "processing", direction: "high" },
    { text: "I can move on without closure.", axis: "closure", direction: "low" },
    { text: "I need to resolve disagreements before moving on.", axis: "closure", direction: "high" },
    { text: "I stay calm during arguments.", axis: "emotion", direction: "low" },
    { text: "I get emotional during conflict.", axis: "emotion", direction: "high" },
    { text: "I prefer to wait until emotions settle before discussing issues.", axis: "processing", direction: "low" },
    { text: "I talk through problems as soon as they arise.", axis: "directness", direction: "high" },
    { text: "I'm comfortable with unresolved tensions.", axis: "closure", direction: "low" },
    { text: "I find it hard to focus on other things when there's an unresolved conflict.", axis: "closure", direction: "high" },
    { text: "During disagreements, I maintain a logical approach.", axis: "emotion", direction: "low" },
    { text: "I express my emotions freely during conflict.", axis: "emotion", direction: "high" },
    { text: "I prefer to change the subject when conversations get tense.", axis: "directness", direction: "low" },
    { text: "I believe conflicts should be addressed immediately.", axis: "processing", direction: "high" }
  ],
  scoring: {
    scale: [1, 5],
    compute(scores) {
      const axisTotals = {};
      const axisCounts = {};
      this.axes.forEach(a => { axisTotals[a.id] = 0; axisCounts[a.id] = 0; });
      scores.forEach(({ axis, direction, value }) => {
        const v = direction === "high" ? value : (6 - value);
        axisTotals[axis] += v;
        axisCounts[axis] += 1;
      });
      const result = {};
      this.axes.forEach(a => {
        result[a.id] = axisCounts[a.id] ? axisTotals[a.id] / axisCounts[a.id] : 0;
      });
      return result;
    }
  },
  resultTypes: [
    { 
      name: "Silent Stewer", 
      profile: {directness: "low", processing: "low", closure: "high", emotion: "low"},
      description: "You tend to avoid direct confrontation but internally process conflict deeply. You need resolution but take time to get there."
    },
    { 
      name: "Firestarter", 
      profile: {directness: "high", processing: "high", closure: "high", emotion: "high"},
      description: "You address issues immediately and expressively. You want quick resolution and aren't afraid to show emotion."
    },
    { 
      name: "Rational Solver", 
      profile: {directness: "high", processing: "high", closure: "high", emotion: "low"},
      description: "You tackle problems head-on with a calm, logical approach. You seek efficient resolution without emotional escalation."
    },
    { 
      name: "Gentle Mediator", 
      profile: {directness: "low", processing: "low", closure: "high", emotion: "low"},
      description: "You carefully approach conflict with empathy, taking time to ensure everyone feels heard before seeking resolution."
    },
    { 
      name: "Process Feeler", 
      profile: {directness: "low", processing: "low", closure: "low", emotion: "high"},
      description: "You experience conflict emotionally and need time to process. You're comfortable letting some issues remain unresolved."
    }
  ],
  compatibility: {
    // Red flags: both high avoidant or both high reactive
    // Optimal: one de-escalator + one resolver
    compute(profileA, profileB) {
      const redFlags = [];
      let complementScore = 0;
      
      // Check for red flag combinations
      if (profileA.directness < 2 && profileB.directness < 2) {
        redFlags.push("Both tend to avoid addressing issues directly");
      }
      
      if (profileA.emotion > 4 && profileB.emotion > 4) {
        redFlags.push("Both may become highly emotional during conflict");
      }
      
      if (profileA.closure > 4 && profileB.closure < 2) {
        redFlags.push("One needs immediate closure while the other is comfortable with unresolved issues");
      }
      
      // Calculate complementary dynamics
      // Ideal: Directness balances, one calm + one processor, both with moderate-high closure
      if ((profileA.directness > 3 && profileB.directness > 2) || 
          (profileA.directness < 3 && profileB.directness > 3)) {
        complementScore += 1; // At least one person is somewhat direct
      }
      
      if ((profileA.emotion < 3 && profileB.processing > 3) || 
          (profileB.emotion < 3 && profileA.processing > 3)) {
        complementScore += 1; // One stays calm while the other processes actively
      }
      
      if (profileA.closure > 2 && profileB.closure > 2) {
        complementScore += 1; // Both care about resolution
      }
      
      return { 
        redFlags,
        complementScore,
        compatibility: complementScore * (100/3) - (redFlags.length * 20)
      };
    }
  }
};

// 4. Understanding Me Test
export const understandingMeTest = {
  id: "understanding-me",
  title: "Understanding Me Test",
  goal: "Check how well another person understands your inner world.",
  structure: "Custom: Author answers, Guesser guesses",
  questions: [
    // These are user-generated, e.g.:
    // { text: "What would I prioritize in a crisis?" }
  ],
  scoring: {
    // Each matching answer = +1, close = partial
    compute(authorAnswers, guesserAnswers) {
      let total = authorAnswers.length;
      let correct = 0;
      authorAnswers.forEach((ans, i) => {
        if (ans === guesserAnswers[i]) correct++;
        // Optionally, partial credit for close answers
      });
      return { percent: total ? (correct / total) * 100 : 0 };
    }
  },
  resultTypes: [
    // % Accuracy, mismatches, reflection
  ],
  compatibility: {
    // Not predictive, just shared understanding
  }
};

// 5. Romantic Compatibility Builder
export const romanticCompatibilityBuilder = {
  id: "romantic-compatibility",
  title: "Romantic Compatibility Builder",
  goal: "Let users define their own ideal partner traits and compare with others.",
  traits: [
    "Humor", "Stability", "Empathy", "Ambition", "Spontaneity", "Openness", "Affection", "Independence", "Communication", "Creativity"
  ],
  structure: [
    // Step 1: User sets ideal levels (0-100)
    // Step 2: User rates self on same traits (0-100)
  ],
  scoring: {
    // Match score = how close their self-ratings are to your ideals, and vice versa
    compute(yourIdeals, theirSelf, theirIdeals, yourSelf) {
      // Asymmetric: yourIdeals vs theirSelf, theirIdeals vs yourSelf
      let sum = 0, count = 0;
      Object.keys(yourIdeals).forEach(trait => {
        sum += 100 - Math.abs(yourIdeals[trait] - theirSelf[trait]);
        count++;
      });
      Object.keys(theirIdeals).forEach(trait => {
        sum += 100 - Math.abs(theirIdeals[trait] - yourSelf[trait]);
        count++;
      });
      return count ? sum / count : 0;
    }
  },
  resultTypes: [
    // Heatmap of match %, top matches, etc.
  ],
  compatibility: {
    // Mutual match score
  }
};

// For backward compatibility with existing imports
export const cognitiveTest = cognitiveAlignmentTest;

// Export collection of all tests
export const allTests = [
  cognitiveAlignmentTest,
  lifeValuesSyncTest,
  conflictStyleMatchTest,
  understandingMeTest,
  romanticCompatibilityBuilder
];

// Default export for simpler imports
export default {
  cognitiveAlignmentTest,
  lifeValuesSyncTest,
  conflictStyleMatchTest,
  understandingMeTest,
  romanticCompatibilityBuilder
};