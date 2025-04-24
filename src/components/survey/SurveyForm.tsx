
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { YesNoQuestion, MultipleChoiceQuestion, RatingQuestion } from './QuestionTypes';
import { Question } from '@/types/survey';

interface SurveyFormProps {
  title: string;
  description?: string | null;
  questions: Question[];
  responses: { [key: string]: any };
  onResponseChange: (questionId: string, value: any) => void;
  onSubmit: () => void;
  submitting: boolean;
}

export const SurveyForm: React.FC<SurveyFormProps> = ({
  title,
  description,
  questions,
  responses,
  onResponseChange,
  onSubmit,
  submitting,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-6">
          {description || "No description provided."}
        </p>

        <form className="space-y-4" onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}>
          {questions.map((question) => {
            switch (question.question_type) {
              case 'yes_no':
                return (
                  <YesNoQuestion
                    key={question.id}
                    question={question}
                    onResponseChange={onResponseChange}
                    response={responses[question.id]}
                  />
                );
              case 'multiple_choice':
                return (
                  <MultipleChoiceQuestion
                    key={question.id}
                    question={question}
                    onResponseChange={onResponseChange}
                    response={responses[question.id]}
                  />
                );
              case 'rating':
                return (
                  <RatingQuestion
                    key={question.id}
                    question={question}
                    onResponseChange={onResponseChange}
                    response={responses[question.id]}
                  />
                );
              default:
                return null;
            }
          })}

          <Button 
            type="submit" 
            className="mt-4"
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
