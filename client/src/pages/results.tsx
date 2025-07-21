import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import type { ExamAttempt, Subject, Question, QuestionResponse } from '@shared/schema';
import { Trophy, Home, RotateCcw, Check, X, Loader2 } from 'lucide-react';

// Sample questions for display - same as in exam.tsx
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

export default function Results() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { attemptId } = useParams<{ attemptId: string }>();
  const [showAllQuestions, setShowAllQuestions] = useState(false);
  
  const [attempt, setAttempt] = useState<ExamAttempt | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (attemptId && user) {
      loadResults();
    }
  }, [attemptId, user]);

  const loadResults = async () => {
    if (!attemptId || !user || !db) return;

    try {
      const attemptDoc = await getDoc(doc(db, 'examAttempts', attemptId));
      
      if (!attemptDoc.exists()) {
        setLocation('/dashboard');
        return;
      }

      const attemptData = attemptDoc.data();
      const examAttempt: ExamAttempt = {
        ...attemptData,
        completedAt: new Date(attemptData.completedAt),
      } as ExamAttempt;

      setAttempt(examAttempt);

      // Load questions (fallback to sample data)
      const subjectQuestions = sampleQuestions[examAttempt.subjectId] || [];
      setQuestions(subjectQuestions);
    } catch (error) {
      console.error('Error loading results:', error);
      setLocation('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusBadge = (percentage: number) => {
    if (percentage >= 90) return { text: 'Excellent', class: 'bg-green-100 text-green-800' };
    if (percentage >= 80) return { text: 'Very Good', class: 'bg-blue-100 text-blue-800' };
    if (percentage >= 70) return { text: 'Good', class: 'bg-yellow-100 text-yellow-800' };
    return { text: 'Needs Improvement', class: 'bg-red-100 text-red-800' };
  };

  const getCircularProgress = (percentage: number) => {
    const circumference = 2 * Math.PI * 54;
    const offset = circumference - (percentage / 100) * circumference;
    return offset;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!attempt) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">Results Not Found</h2>
            <Button onClick={() => setLocation('/dashboard')}>
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const status = getStatusBadge(attempt.percentage);
  const incorrectAnswers = questions.length - attempt.score;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Results Header */}
        <Card className="shadow-lg mb-8">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <Trophy className="h-16 w-16 text-orange-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Exam Completed!</h1>
              <p className="text-gray-600">{attempt.subjectName} Assessment</p>
            </div>
            
            {/* Score Circle */}
            <div className="flex justify-center mb-6">
              <div className="relative w-32 h-32">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                  <circle 
                    cx="60" 
                    cy="60" 
                    r="54" 
                    fill="none" 
                    stroke="#E5E7EB" 
                    strokeWidth="8"
                  />
                  <circle 
                    cx="60" 
                    cy="60" 
                    r="54" 
                    fill="none" 
                    stroke="#10B981" 
                    strokeWidth="8" 
                    strokeDasharray={2 * Math.PI * 54}
                    strokeDashoffset={getCircularProgress(attempt.percentage)}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{attempt.percentage}%</div>
                    <div className="text-xs text-gray-600">{attempt.score}/{questions.length}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{attempt.score}</div>
                <div className="text-sm text-gray-600">Correct</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{incorrectAnswers}</div>
                <div className="text-sm text-gray-600">Incorrect</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">{formatTime(attempt.timeTaken)}</div>
                <div className="text-sm text-gray-600">Time Taken</div>
              </div>
            </div>

            {/* Status Badge */}
            <div className="mb-6">
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${status.class}`}>
                {status.text}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => setLocation('/dashboard')}
                className="bg-primary hover:bg-primary/90"
              >
                <Home className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <Button
                onClick={() => setLocation(`/exam/${attempt.subjectId}`)}
                variant="outline"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Retake Exam
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Question Review */}
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Question Review</h2>
            
            <div className="space-y-4">
              {questions.slice(0, showAllQuestions ? questions.length : 2).map((question, index) => {
                const userAnswer = attempt.answers[index];
                const isCorrect = userAnswer === question.correctAnswer;
                const wasAnswered = userAnswer !== -1;

                return (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-700">
                        Question {index + 1}
                      </span>
                      {wasAnswered ? (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${
                          isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {isCorrect ? <Check className="h-3 w-3 mr-1" /> : <X className="h-3 w-3 mr-1" />}
                          {isCorrect ? 'Correct' : 'Incorrect'}
                        </span>
                      ) : (
                        <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                          Not Answered
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-900 mb-3">{question.questionText}</p>
                    
                    <div className="text-sm space-y-1">
                      {wasAnswered && (
                        <div className="text-gray-600">
                          Your Answer: 
                          <span className={`font-medium ml-1 ${
                            isCorrect ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {question.options[userAnswer]}
                          </span>
                        </div>
                      )}
                      <div className="text-gray-600">
                        Correct Answer: 
                        <span className="text-green-600 font-medium ml-1">
                          {question.options[question.correctAnswer]}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {questions.length > 2 && (
                <div className="text-center py-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowAllQuestions(!showAllQuestions)}
                  >
                    {showAllQuestions ? 'Show Less' : 'Show All Questions'}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
