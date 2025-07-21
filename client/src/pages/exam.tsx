import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import ExamTimer from '@/components/ExamTimer';
import QuestionCard from '@/components/QuestionCard';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import type { Subject, Question, ExamAttempt } from '@shared/schema';
import { X, AlertTriangle, Loader2 } from 'lucide-react';

// Sample questions - in production, these would be in Firestore
const sampleQuestions: Record<string, Question[]> = {
  'web-development': [
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
  ],
  'ai': [
    {
      questionText: "What does AI stand for?",
      options: ["Artificial Intelligence", "Automated Intelligence", "Advanced Intelligence", "Algorithmic Intelligence"],
      correctAnswer: 0
    },
  ],
  'data-science': [
    {
      questionText: "What is the most commonly used programming language in data science?",
      options: ["Java", "Python", "C++", "JavaScript"],
      correctAnswer: 1
    },
  ],
};

export default function Exam() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { subjectId } = useParams<{ subjectId: string }>();
  
  const [subject, setSubject] = useState<Subject | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [showExitModal, setShowExitModal] = useState(false);
  const [startTime] = useState(Date.now());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (subjectId && user) {
      loadExam();
    }
  }, [subjectId, user]);

  const loadExam = async () => {
    if (!subjectId || !user || !db) return;

    try {
      // Try to load from Firestore first
      const subjectDoc = await getDoc(doc(db, 'subjects', subjectId));
      
      if (subjectDoc.exists()) {
        const subjectData = subjectDoc.data() as Subject;
        setSubject(subjectData);
        setQuestions(subjectData.questions);
        setAnswers(new Array(subjectData.questions.length).fill(null));
      } else {
        // Fallback to sample data
        const subjectNames: Record<string, string> = {
          'web-development': 'Web Development',
          'ai': 'Artificial Intelligence',
          'data-science': 'Data Science',
        };

        const examQuestions = sampleQuestions[subjectId] || [];
        const mockSubject: Subject = {
          id: subjectId,
          name: subjectNames[subjectId] || 'Unknown Subject',
          duration: 30,
          totalQuestions: examQuestions.length,
          questions: examQuestions,
        };

        setSubject(mockSubject);
        setQuestions(examQuestions);
        setAnswers(new Array(examQuestions.length).fill(null));
      }
    } catch (error) {
      console.error('Error loading exam:', error);
      setLocation('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    answers.forEach((answer, index) => {
      if (answer === questions[index].correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const handleSubmit = async () => {
    if (!user || !subject || !db) return;

    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    const correctAnswers = calculateScore();
    const percentage = Math.round((correctAnswers / questions.length) * 100);

    try {
      // Create exam attempt record
      const attemptId = `attempt_${user.id}_${subject.id}_${Date.now()}`;
      const examAttempt: ExamAttempt = {
        id: attemptId,
        userId: user.id,
        subjectId: subject.id,
        subjectName: subject.name,
        answers: answers.map(a => a ?? -1), // Replace null with -1 for unanswered
        score: correctAnswers,
        percentage,
        timeTaken,
        completedAt: new Date(),
      };

      await setDoc(doc(db, 'examAttempts', attemptId), {
        ...examAttempt,
        completedAt: examAttempt.completedAt.toISOString(),
      });

      // Update user scores
      const userScoreRef = doc(db, 'userScores', user.id);
      const scoreField = subject.id === 'web-development' ? 'webDevelopment' :
                        subject.id === 'ai' ? 'ai' : 'dataScience';

      await updateDoc(userScoreRef, {
        [`scores.${scoreField}`]: percentage,
        lastUpdated: new Date().toISOString(),
      });

      setLocation(`/results/${attemptId}`);
    } catch (error) {
      console.error('Error submitting exam:', error);
    }
  };

  const handleTimeUp = () => {
    handleSubmit();
  };

  const handleExit = () => {
    setShowExitModal(false);
    handleSubmit();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!subject || !questions.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">Exam Not Found</h2>
            <Button onClick={() => setLocation('/dashboard')}>
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Exam Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{subject.name} Exam</h1>
              <p className="text-sm text-gray-600">
                Question {currentQuestion + 1} of {questions.length}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <ExamTimer
                duration={subject.duration}
                onTimeUp={handleTimeUp}
                isActive={true}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowExitModal(true)}
                className="text-red-600 hover:text-red-700"
              >
                <X className="h-4 w-4 mr-1" />
                Exit Exam
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Question Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <QuestionCard
          question={questions[currentQuestion]}
          questionNumber={currentQuestion + 1}
          totalQuestions={questions.length}
          selectedAnswer={answers[currentQuestion]}
          onAnswerChange={handleAnswerChange}
          onPrevious={handlePrevious}
          onNext={handleNext}
          canGoPrevious={currentQuestion > 0}
          canGoNext={currentQuestion < questions.length - 1}
          isLastQuestion={currentQuestion === questions.length - 1}
          onSubmit={handleSubmit}
        />
      </div>

      {/* Exit Confirmation Modal */}
      {showExitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-md mx-4">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Exit Exam?</h3>
                <p className="text-gray-600">
                  Are you sure you want to exit? Your progress will be saved and the exam will be submitted.
                </p>
              </div>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowExitModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-red-600 hover:bg-red-700"
                  onClick={handleExit}
                >
                  Exit & Submit
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
