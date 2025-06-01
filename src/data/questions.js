export const cognitiveTest = {
    title: "Cognitive Alignment Test",
    description: "Discover how your mind processes information and makes decisions.",
    dimensions: [
        {
            id: "processing",
            name: "Processing Style",
            low: "Deep Thinker",
            high: "Fast Processor",
            description: {
                low: "You prefer to think deeply about topics, considering multiple angles before drawing conclusions. You may take longer to respond, but your insights are typically thorough and well-considered.",
                mid: "You balance thoughtful consideration with timely responses. You adapt your thinking speed based on the situation's complexity.",
                high: "You process information quickly and reach conclusions rapidly. You excel in fast-paced environments where quick thinking is valuable."
            }
        },
        {
            id: "abstraction",
            name: "Abstraction Level",
            low: "Concrete Thinker",
            high: "Abstract Thinker",
            description: {
                low: "You focus on tangible facts and real-world examples. You prefer information that's practical and directly applicable to your experiences.",
                mid: "You appreciate both concrete examples and theoretical concepts. You can switch between practical applications and bigger picture thinking.",
                high: "You naturally think in concepts, theories, and possibilities. You enjoy exploring ideas that may not have immediate practical applications."
            }
        },
        {
            id: "pattern",
            name: "Information Focus",
            low: "Detail Tracker",
            high: "Pattern Seeker",
            description: {
                low: "You have a sharp eye for details and can spot inconsistencies others might miss. You build understanding by carefully examining specific elements.",
                mid: "You appreciate both details and patterns. You can zoom in on specifics when needed and zoom out to see broader connections.",
                high: "You naturally recognize patterns and connections between seemingly unrelated information. You often see the 'big picture' before others do."
            }
        },
        {
            id: "communication",
            name: "Communication Style",
            low: "Reflective Communicator",
            high: "Expressive Communicator",
            description: {
                low: "You prefer to observe and process before speaking. Your communications are typically well-thought-out and deliberate.",
                mid: "You balance listening and expressing. You know when to share thoughts immediately and when to reflect first.",
                high: "You process ideas by talking them through. You communicate freely and expressively, sharing thoughts as they form."
            }
        }
    ],
    questions: [
        {
            text: "I need time to think before responding to complex questions.",
            dimension: "processing",
            direction: "low"
        },
        {
            text: "I can quickly come up with solutions in time-pressured situations.",
            dimension: "processing",
            direction: "high"
        },
        {
            text: "I prefer to take my time and analyze all aspects of a problem.",
            dimension: "processing",
            direction: "low"
        },
        {
            text: "I make decisions swiftly and confidently.",
            dimension: "processing",
            direction: "high"
        },
        {
            text: "I enjoy thinking about theoretical concepts with no immediate practical use.",
            dimension: "abstraction",
            direction: "high"
        },
        {
            text: "I prefer discussions about concrete things rather than abstract ideas.",
            dimension: "abstraction",
            direction: "low"
        },
        {
            text: "I often use metaphors and analogies to explain my thoughts.",
            dimension: "abstraction",
            direction: "high"
        },
        {
            text: "I find real-world examples more helpful than theoretical explanations.",
            dimension: "abstraction",
            direction: "low"
        },
        {
            text: "I easily notice patterns and connections between different situations.",
            dimension: "pattern",
            direction: "high"
        },
        {
            text: "I pay close attention to specific details that others might miss.",
            dimension: "pattern",
            direction: "low"
        },
        {
            text: "I tend to see the big picture before noticing the details.",
            dimension: "pattern",
            direction: "high"
        },
        {
            text: "I build understanding by carefully examining each component piece by piece.",
            dimension: "pattern",
            direction: "low"
        },
        {
            text: "I process my thoughts by talking them through out loud.",
            dimension: "communication",
            direction: "high"
        },
        {
            text: "I prefer to fully form my thoughts before sharing them.",
            dimension: "communication",
            direction: "low"
        },
        {
            text: "In conversations, I tend to speak up quickly with my ideas.",
            dimension: "communication",
            direction: "high"
        },
        {
            text: "I'm often told I'm a good listener.",
            dimension: "communication",
            direction: "low"
        }
    ],
    compatibility: {
        processing: {
            similar: "You both process information at a similar pace. This creates a comfortable rhythm in your interactions - neither person feels rushed or held back.",
            complementary: "Your different processing speeds can create a balanced dynamic where one person brings careful consideration and the other provides timely solutions.",
            challenging: "Your significantly different processing speeds may cause friction. The faster processor might feel impatient, while the deeper thinker may feel pressured."
        },
        abstraction: {
            similar: "You share a similar thinking level, making your conversations naturally engaging as you both enjoy the same level of concrete examples or theoretical exploration.",
            complementary: "Your different thinking styles can enrich discussions, with one person bringing practical insights and the other expanding possibilities.",
            challenging: "Your different abstraction levels might create communication gaps. The abstract thinker may seem impractical, while the concrete thinker may seem too limited."
        },
        pattern: {
            similar: "You both approach information with similar focus, either appreciating detailed analysis or big-picture connections.",
            complementary: "Together, you create a comprehensive view. The detail-oriented person catches what might be missed, while the pattern-seeker identifies broader implications.",
            challenging: "You might get frustrated with each other's focus. The detail tracker may think the pattern-seeker misses important specifics, while the pattern-seeker finds the detail focus too narrow."
        },
        communication: {
            similar: "You share a natural communication rhythm that feels comfortable for both of you.",
            complementary: "Your different styles create a balanced conversation dynamic - the reflective person ensures thoughtful consideration while the expressive person keeps ideas flowing.",
            challenging: "Your communication styles may clash. The reflective communicator might seem withdrawn, while the expressive communicator might seem overwhelming."
        }
    }
};