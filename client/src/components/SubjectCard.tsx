import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Code, Brain, TrendingUp, Clock } from 'lucide-react';
import type { Subject, UserScore } from '@shared/schema';

interface SubjectCardProps {
  subject: Subject;
  userScore: UserScore | null;
  onStartExam: (subjectId: string) => void;
}

const subjectIcons = {
  'web-development': Code,
  'ai': Brain,
  'data-science': TrendingUp,
};

const subjectColors = {
  'web-development': 'bg-blue-100 text-blue-600',
  'ai': 'bg-purple-100 text-purple-600',
  'data-science': 'bg-green-100 text-green-600',
};

export default function SubjectCard({ subject, userScore, onStartExam }: SubjectCardProps) {
  const IconComponent = subjectIcons[subject.id as keyof typeof subjectIcons] || Code;
  const colorClass = subjectColors[subject.id as keyof typeof subjectColors] || 'bg-gray-100 text-gray-600';
  
  const getSubjectScore = () => {
    if (!userScore) return null;
    switch (subject.id) {
      case 'web-development':
        return userScore.scores.webDevelopment;
      case 'ai':
        return userScore.scores.ai;
      case 'data-science':
        return userScore.scores.dataScience;
      default:
        return null;
    }
  };

  const score = getSubjectScore();
  const hasAttempted = score !== null;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <div className={`p-3 rounded-lg mr-4 ${colorClass}`}>
            <IconComponent className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{subject.name}</h3>
            <p className="text-sm text-gray-600">
              {subject.totalQuestions} Questions • {subject.duration} Minutes
            </p>
          </div>
        </div>

        <div className="mb-4">
          {hasAttempted ? (
            <>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Last Score</span>
                <span className="text-secondary font-medium">{score}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-secondary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${score}%` }}
                />
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Not attempted yet</p>
            </div>
          )}
        </div>

        <Button
          onClick={() => onStartExam(subject.id)}
          className={hasAttempted 
            ? "w-full bg-primary hover:bg-primary/90" 
            : "w-full bg-secondary hover:bg-secondary/90"
          }
        >
          {hasAttempted ? 'Retake Exam' : 'Take Exam'}
        </Button>
      </CardContent>
    </Card>
  );
}
