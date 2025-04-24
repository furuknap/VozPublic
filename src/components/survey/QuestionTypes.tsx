
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Question } from '@/types/survey';

interface QuestionProps {
  question: Question;
  onResponseChange: (questionId: string, value: any) => void;
  response?: any;
}

export const YesNoQuestion: React.FC<QuestionProps> = ({ question, onResponseChange, response }) => (
  <div key={question.id}>
    <Label className="block text-sm font-medium text-gray-700">
      {question.question_text} {question.required && <span className="text-red-500">*</span>}
    </Label>
    <RadioGroup 
      defaultValue={response || ''} 
      className="mt-2" 
      onValueChange={(value) => onResponseChange(question.id, value)}
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="yes" id={`${question.id}-yes`} />
        <Label htmlFor={`${question.id}-yes`}>Yes</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="no" id={`${question.id}-no`} />
        <Label htmlFor={`${question.id}-no`}>No</Label>
      </div>
    </RadioGroup>
  </div>
);

export const MultipleChoiceQuestion: React.FC<QuestionProps> = ({ question, onResponseChange, response }) => (
  <div key={question.id}>
    <Label className="block text-sm font-medium text-gray-700">
      {question.question_text} {question.required && <span className="text-red-500">*</span>}
    </Label>
    <RadioGroup 
      defaultValue={response || ''} 
      className="mt-2" 
      onValueChange={(value) => onResponseChange(question.id, value)}
    >
      {Array.isArray(question.options) && question.options.map((option: string) => (
        <div key={option} className="flex items-center space-x-2">
          <RadioGroupItem value={option} id={`${question.id}-${option}`} />
          <Label htmlFor={`${question.id}-${option}`}>{option}</Label>
        </div>
      ))}
    </RadioGroup>
  </div>
);

export const RatingQuestion: React.FC<QuestionProps> = ({ question, onResponseChange, response }) => (
  <div key={question.id}>
    <Label htmlFor={question.id} className="block text-sm font-medium text-gray-700">
      {question.question_text} {question.required && <span className="text-red-500">*</span>}
    </Label>
    <div className="mt-2">
      <Slider
        defaultValue={[response || 1]}
        min={1}
        max={5}
        step={1}
        onValueChange={(value) => onResponseChange(question.id, value[0])}
      />
      <div className="flex justify-between text-xs mt-1">
        <span>1</span>
        <span>2</span>
        <span>3</span>
        <span>4</span>
        <span>5</span>
      </div>
      <p className="text-sm text-center mt-2">
        Selected: {response || 1}
      </p>
    </div>
  </div>
);
