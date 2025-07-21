// Script to seed Firebase with sample exam data
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBK8zkDOT2G27AhyhJ9--418GSgfBtDUZo",
  authDomain: "gncipl-week-2-a8c06.firebaseapp.com",
  projectId: "gncipl-week-2-a8c06",
  storageBucket: "gncipl-week-2-a8c06.firebasestorage.app",
  messagingSenderId: "1082103193809",
  appId: "1:1082103193809:web:b31b250d0b463e0911e5f0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Sample exam data
const examData = {
  subjects: {
    'web-development': {
      id: 'web-development',
      name: 'Web Development',
      duration: 30,
      totalQuestions: 10,
      questions: [
        {
          questionText: "What is the correct way to declare a variable in JavaScript?",
          options: ["var myVariable = 'Hello';", "let myVariable = 'Hello';", "const myVariable = 'Hello';", "All of the above"],
          correctAnswer: 3
        },
        {
          questionText: "Which CSS property is used for text color?",
          options: ["font-color", "text-color", "color", "foreground-color"],
          correctAnswer: 2
        },
        {
          questionText: "What does HTML stand for?",
          options: ["Hyper Text Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlink and Text Markup Language"],
          correctAnswer: 0
        },
        {
          questionText: "Which method is used to add an element to the end of an array in JavaScript?",
          options: ["append()", "push()", "add()", "insert()"],
          correctAnswer: 1
        },
        {
          questionText: "What is the correct syntax for linking an external CSS file?",
          options: ["<css>style.css</css>", "<link rel='stylesheet' href='style.css'>", "<style src='style.css'>", "<css href='style.css'>"],
          correctAnswer: 1
        },
        {
          questionText: "Which HTML tag is used for the largest heading?",
          options: ["<heading>", "<h6>", "<h1>", "<header>"],
          correctAnswer: 2
        },
        {
          questionText: "What is the purpose of the 'alt' attribute in an img tag?",
          options: ["To specify image alignment", "To provide alternative text", "To set image size", "To add image effects"],
          correctAnswer: 1
        },
        {
          questionText: "Which CSS property is used to change the background color?",
          options: ["bgcolor", "background-color", "color", "background"],
          correctAnswer: 1
        },
        {
          questionText: "What does CSS stand for?",
          options: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style Sheets", "Colorful Style Sheets"],
          correctAnswer: 1
        },
        {
          questionText: "Which JavaScript function is used to select an element by its ID?",
          options: ["getElementById()", "getElement()", "selectById()", "findElement()"],
          correctAnswer: 0
        }
      ]
    },
    'ai': {
      id: 'ai',
      name: 'Artificial Intelligence',
      duration: 40,
      totalQuestions: 10,
      questions: [
        {
          questionText: "What does AI stand for?",
          options: ["Artificial Intelligence", "Automated Intelligence", "Advanced Intelligence", "Algorithmic Intelligence"],
          correctAnswer: 0
        },
        {
          questionText: "Which of the following is a machine learning algorithm?",
          options: ["HTML", "CSS", "Neural Networks", "JavaScript"],
          correctAnswer: 2
        },
        {
          questionText: "What is supervised learning?",
          options: ["Learning without labeled data", "Learning with labeled data", "Learning by trial and error", "Learning through games"],
          correctAnswer: 1
        },
        {
          questionText: "Which company developed ChatGPT?",
          options: ["Google", "Microsoft", "OpenAI", "Meta"],
          correctAnswer: 2
        },
        {
          questionText: "What is a neural network inspired by?",
          options: ["Computer circuits", "Human brain", "Mathematical equations", "Physical networks"],
          correctAnswer: 1
        },
        {
          questionText: "What is deep learning?",
          options: ["Learning very difficult concepts", "Machine learning with neural networks having many layers", "Learning for a long time", "Learning underwater"],
          correctAnswer: 1
        },
        {
          questionText: "Which programming language is most commonly used in AI?",
          options: ["Java", "C++", "Python", "JavaScript"],
          correctAnswer: 2
        },
        {
          questionText: "What is natural language processing (NLP)?",
          options: ["Processing natural foods", "AI's ability to understand human language", "Processing nature sounds", "Natural computing processes"],
          correctAnswer: 1
        },
        {
          questionText: "What is computer vision?",
          options: ["Computer's ability to see colors", "AI's ability to interpret visual information", "Computer screen technology", "Vision correction for computers"],
          correctAnswer: 1
        },
        {
          questionText: "What is the Turing Test?",
          options: ["A test for computer speed", "A test for AI's ability to exhibit human-like intelligence", "A test for programming skills", "A test for computer memory"],
          correctAnswer: 1
        }
      ]
    },
    'data-science': {
      id: 'data-science',
      name: 'Data Science',
      duration: 45,
      totalQuestions: 10,
      questions: [
        {
          questionText: "What is the most commonly used programming language in data science?",
          options: ["Java", "Python", "C++", "JavaScript"],
          correctAnswer: 1
        },
        {
          questionText: "Which library is most popular for data manipulation in Python?",
          options: ["NumPy", "Pandas", "Matplotlib", "Scikit-learn"],
          correctAnswer: 1
        },
        {
          questionText: "What does SQL stand for?",
          options: ["Structured Query Language", "Simple Query Language", "Standard Query Language", "Sequential Query Language"],
          correctAnswer: 0
        },
        {
          questionText: "Which visualization library is commonly used in Python?",
          options: ["Pandas", "NumPy", "Matplotlib", "Requests"],
          correctAnswer: 2
        },
        {
          questionText: "What is a DataFrame in pandas?",
          options: ["A type of chart", "A 2D labeled data structure", "A machine learning model", "A database"],
          correctAnswer: 1
        },
        {
          questionText: "Which statistical measure represents the middle value in a dataset?",
          options: ["Mean", "Mode", "Median", "Range"],
          correctAnswer: 2
        },
        {
          questionText: "What is the purpose of data cleaning?",
          options: ["To delete all data", "To remove errors and inconsistencies", "To compress data", "To encrypt data"],
          correctAnswer: 1
        },
        {
          questionText: "Which algorithm is used for classification problems?",
          options: ["Linear Regression", "K-Means", "Decision Tree", "PCA"],
          correctAnswer: 2
        },
        {
          questionText: "What is overfitting in machine learning?",
          options: ["Model performs well on training data but poorly on new data", "Model performs poorly on all data", "Model is too simple", "Model has too few parameters"],
          correctAnswer: 0
        },
        {
          questionText: "Which tool is commonly used for big data processing?",
          options: ["Excel", "Hadoop", "Notepad", "PowerPoint"],
          correctAnswer: 1
        }
      ]
    }
  }
};

async function seedFirebase() {
  try {
    console.log('Seeding Firebase with exam data...');
    
    // Add subjects to Firestore
    for (const [subjectId, subjectData] of Object.entries(examData.subjects)) {
      await setDoc(doc(db, 'subjects', subjectId), subjectData);
      console.log(`Added subject: ${subjectData.name}`);
    }
    
    console.log('Firebase seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding Firebase:', error);
    process.exit(1);
  }
}

seedFirebase();