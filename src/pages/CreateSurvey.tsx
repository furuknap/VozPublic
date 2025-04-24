
import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, Loader2, Save } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import Layout from '@/components/layout/Layout';

// Map our frontend types to database types
type QuestionType = 'yesNo' | 'multipleChoice' | 'rating';
type DBQuestionType = 'yes_no' | 'multiple_choice' | 'rating';

// Map frontend question type to database question type
const mapQuestionType = (type: QuestionType): DBQuestionType => {
  switch (type) {
    case 'yesNo': return 'yes_no';
    case 'multipleChoice': return 'multiple_choice';
    case 'rating': return 'rating';
    default: return 'yes_no';
  }
};

interface Question {
  id: string;
  text: string;
  type: QuestionType;
  required: boolean;
  options: string[]; // For multiple choice
}

const CreateSurvey = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);

  // Generate unique ID for questions
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  // Add a new question
  const addQuestion = () => {
    const newQuestion: Question = {
      id: generateId(),
      text: '',
      type: 'yesNo',
      required: true,
      options: ['', ''],
    };
    setQuestions([...questions, newQuestion]);
  };

  // Update question
  const updateQuestion = (id: string, field: keyof Question, value: any) => {
    setQuestions(
      questions.map((q) =>
        q.id === id
          ? { ...q, [field]: value }
          : q
      )
    );
  };

  // Update option for multiple choice
  const updateOption = (questionId: string, index: number, value: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((opt, i) => (i === index ? value : opt)),
            }
          : q
      )
    );
  };

  // Add option for multiple choice
  const addOption = (questionId: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? { ...q, options: [...q.options, ''] }
          : q
      )
    );
  };

  // Remove option for multiple choice
  const removeOption = (questionId: string, index: number) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.filter((_, i) => i !== index),
            }
          : q
      )
    );
  };

  // Delete question
  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  // Save survey
  const saveSurvey = async () => {
    if (!title) {
      toast.error('Please enter a survey title');
      return;
    }

    if (questions.length === 0) {
      toast.error('Please add at least one question');
      return;
    }

    // Validate questions
    for (const q of questions) {
      if (!q.text) {
        toast.error('All questions must have text');
        return;
      }
      if (q.type === 'multipleChoice' && q.options.some(opt => !opt)) {
        toast.error('All multiple choice options must have text');
        return;
      }
    }

    setLoading(true);

    try {
      // Insert survey
      const { data: survey, error: surveyError } = await supabase
        .from('surveys')
        .insert({
          title,
          description,
          user_id: user!.id,
        })
        .select('id')
        .single();

      if (surveyError) throw surveyError;

      // Insert questions
      // Map our frontend question format to the database schema
      const questionsToInsert = questions.map((q, index) => ({
        survey_id: survey.id,
        question_text: q.text,
        question_type: mapQuestionType(q.type),
        order_number: index + 1,
        options: q.type === 'multipleChoice' ? q.options : null,
      }));

      const { error: questionsError } = await supabase
        .from('questions')
        .insert(questionsToInsert);

      if (questionsError) throw questionsError;

      toast.success('Survey created successfully');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving survey:', error);
      toast.error('Failed to create survey. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <Layout>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t('survey.create')}</h1>
      </div>

      <div className="grid gap-8">
        {/* Survey Details */}
        <Card>
          <CardHeader>
            <CardTitle>Survey Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">{t('survey.title')}</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter survey title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">{t('survey.description')}</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter survey description (optional)"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Questions */}
        {questions.map((question, index) => (
          <Card key={question.id}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">Question {index + 1}</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteQuestion(question.id)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`question-text-${question.id}`}>{t('survey.questionText')}</Label>
                <Input
                  id={`question-text-${question.id}`}
                  value={question.text}
                  onChange={(e) => updateQuestion(question.id, 'text', e.target.value)}
                  placeholder="Enter question text"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`question-type-${question.id}`}>{t('survey.questionType')}</Label>
                <Select
                  value={question.type}
                  onValueChange={(value) => updateQuestion(question.id, 'type', value as QuestionType)}
                >
                  <SelectTrigger id={`question-type-${question.id}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yesNo">{t('survey.questionTypes.yesNo')}</SelectItem>
                    <SelectItem value="multipleChoice">{t('survey.questionTypes.multipleChoice')}</SelectItem>
                    <SelectItem value="rating">{t('survey.questionTypes.rating')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {question.type === 'multipleChoice' && (
                <div className="space-y-2">
                  <Label>{t('survey.options')}</Label>
                  {question.options.map((option, optIndex) => (
                    <div key={optIndex} className="flex items-center gap-2">
                      <Input
                        value={option}
                        onChange={(e) => updateOption(question.id, optIndex, e.target.value)}
                        placeholder={`Option ${optIndex + 1}`}
                      />
                      {question.options.length > 2 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeOption(question.id, optIndex)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addOption(question.id)}
                    className="mt-2"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {t('survey.addOption')}
                  </Button>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Switch
                  id={`required-${question.id}`}
                  checked={question.required}
                  onCheckedChange={(checked) => updateQuestion(question.id, 'required', checked)}
                />
                <Label htmlFor={`required-${question.id}`}>{t('survey.required')}</Label>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Add Question Button */}
        <Button variant="outline" onClick={addQuestion} className="flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          {t('survey.addQuestion')}
        </Button>

        {/* Save Survey Button */}
        <Button
          onClick={saveSurvey}
          className="bg-brand hover:bg-brand-dark mt-4"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {t('common.loading')}
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              {t('survey.save')}
            </>
          )}
        </Button>
      </div>
    </Layout>
  );
};

export default CreateSurvey;
