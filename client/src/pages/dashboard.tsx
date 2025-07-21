import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import SubjectCard from '@/components/SubjectCard';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import type { Subject, UserScore, ExamAttempt } from '@shared/schema';
import { Loader2 } from 'lucide-react';

const defaultSubjects: Subject[] = [
  {
    id: 'web-development',
    name: 'Web Development',
    duration: 30,
    totalQuestions: 20,
    questions: [], // Will be loaded from Firestore
  },
  {
    id: 'ai',
    name: 'Artificial Intelligence',
    duration: 40,
    totalQuestions: 25,
    questions: [], // Will be loaded from Firestore
  },
  {
    id: 'data-science',
    name: 'Data Science',
    duration: 45,
    totalQuestions: 30,
    questions: [], // Will be loaded from Firestore
  },
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [userScore, setUserScore] = useState<UserScore | null>(null);
  const [examHistory, setExamHistory] = useState<ExamAttempt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    if (!user || !db) return;

    try {
      console.log('Loading dashboard data for user:', user.id);
      
      // Load user data including scores from users collection
      const userDoc = await getDoc(doc(db, 'users', user.id));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log('User data loaded:', userData);
        
        // Create UserScore object from user data
        if (userData.scores) {
          setUserScore({
            id: user.id,
            userId: user.id,
            name: user.name,
            email: user.email,
            contactNo: user.contactNo,
            scores: userData.scores,
            lastUpdated: userData.lastUpdated ? new Date(userData.lastUpdated) : new Date(),
          } as UserScore);
        }
      }

      // Load exam history
      const historyQuery = query(
        collection(db, 'examAttempts'),
        where('userId', '==', user.id)
      );
      
      const historySnapshot = await getDocs(historyQuery);
      const history: ExamAttempt[] = historySnapshot.docs.map(doc => ({
        ...doc.data(),
        completedAt: new Date(doc.data().completedAt),
      })) as ExamAttempt[];
      
      console.log('Exam history loaded:', history.length, 'attempts');
      setExamHistory(history);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartExam = (subjectId: string) => {
    setLocation(`/exam/${subjectId}`);
  };

  const handleLogout = () => {
    logout();
    setLocation('/login');
  };

  const getTotalExams = () => {
    if (!userScore) return 0;
    let count = 0;
    if (userScore.scores.webDevelopment !== null) count++;
    if (userScore.scores.ai !== null) count++;
    if (userScore.scores.dataScience !== null) count++;
    return count;
  };

  const getStatusBadge = (percentage: number) => {
    if (percentage >= 90) return { text: 'Excellent', class: 'bg-green-100 text-green-800' };
    if (percentage >= 80) return { text: 'Very Good', class: 'bg-blue-100 text-blue-800' };
    if (percentage >= 70) return { text: 'Good', class: 'bg-yellow-100 text-yellow-800' };
    return { text: 'Needs Improvement', class: 'bg-red-100 text-red-800' };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-primary rounded mr-3 flex items-center justify-center">
                <span className="text-white font-bold text-sm">EP</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">ExamPortal</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <Card className="shadow-lg mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name}</h1>
                <p className="text-gray-600 mt-1">{user?.email}</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Total Exams Taken</div>
                <div className="text-3xl font-bold text-primary">{getTotalExams()}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subject Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {defaultSubjects.map((subject) => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              userScore={userScore}
              onStartExam={handleStartExam}
            />
          ))}
        </div>

        {/* Score History */}
        {examHistory.length > 0 && (
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Exam History</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Subject</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Score</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {examHistory.map((attempt) => {
                      const status = getStatusBadge(attempt.percentage);
                      return (
                        <tr key={attempt.id} className="border-b border-gray-100">
                          <td className="py-3 px-4 text-gray-900">{attempt.subjectName}</td>
                          <td className="py-3 px-4 text-gray-600">
                            {attempt.completedAt.toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-secondary font-medium">{attempt.percentage}%</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.class}`}>
                              {status.text}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
