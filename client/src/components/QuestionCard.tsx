import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Save } from 'lucide-react';
import type { Question } from '@shared/schema';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer: number | null;
  onAnswerChange: (answerIndex: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
  isLastQuestion: boolean;
  onSubmit: () => void;
}

export default function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onAnswerChange,
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext,
  isLastQuestion,
  onSubmit,
}: QuestionCardProps) {
  return (
    <Card className="shadow-lg">
      <CardContent className="p-8">
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            {question.questionText}
          </h2>
        </div>

        <div className="space-y-4 mb-8">
          {question.options.map((option, index) => (
            <label
              key={index}
              className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedAnswer === index
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                name="answer"
                value={index}
                checked={selectedAnswer === index}
                onChange={() => onAnswerChange(index)}
                className="mr-4 text-primary focus:ring-primary"
              />
              <span className="text-gray-900">{option}</span>
            </label>
          ))}
        </div>

        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={!canGoPrevious}
            className="flex items-center"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="text-sm text-gray-600 flex items-center">
            <Save className="h-4 w-4 mr-1" />
            Auto-saved
          </div>

          {isLastQuestion ? (
            <Button
              onClick={onSubmit}
              className="bg-secondary hover:bg-secondary/90 flex items-center"
            >
              Submit Exam
            </Button>
          ) : (
            <Button
              onClick={onNext}
              disabled={!canGoNext}
              className="flex items-center"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
