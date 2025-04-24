
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import Layout from '@/components/layout/Layout';
import { ThankYouMessage } from '@/components/survey/SurveyResponse';
import { SurveyForm } from '@/components/survey/SurveyForm';
import type { SurveyDetails, Question } from '@/types/survey';

const RespondToSurvey = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [survey, setSurvey] = useState<SurveyDetails | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [responses, setResponses] = useState<{ [questionId: string]: any }>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Check if the URL has a submitted parameter
  const urlParams = new URLSearchParams(window.location.search);
  const isSubmitted = urlParams.get('submitted') === 'true';

  const fetchSurvey = async () => {
    if (!id) return;

    try {
      console.log("Fetching survey with ID:", id);
      const { data: surveyData, error: surveyError } = await supabase
        .from('surveys')
        .select('id, title, description, user_id')
        .eq('id', id)
        .single();

      if (surveyError) throw surveyError;
      console.log("Survey data retrieved:", surveyData);
      setSurvey(surveyData);

      const { data: questionsData, error: questionsError } = await supabase
        .from('questions')
        .select('id, question_text, question_type, options, order_number, required')
        .eq('survey_id', id)
        .order('order_number', { ascending: true });

      if (questionsError) throw questionsError;
      console.log("Questions retrieved:", questionsData.length);
      
      const processedQuestions = questionsData.map(q => ({
        ...q,
        required: q.required ?? false
      }));

      setQuestions(processedQuestions);
    } catch (error) {
      console.error('Error fetching survey:', error);
      setError('Error loading survey details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSurvey();
  }, [id]);

  const handleInputChange = (questionId: string, value: any) => {
    setResponses(prevResponses => ({
      ...prevResponses,
      [questionId]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!survey || !id) return;
    
    setSubmitting(true);

    try {
      // Validate required questions
      for (const question of questions) {
        if (question.required && !responses[question.id]) {
          toast.error(`Please answer all required questions.`);
          setSubmitting(false);
          return;
        }
      }

      console.log("Submitting survey response...");
      
      // Insert the response with anonymous access
      const { data: responseData, error: responseError } = await supabase
        .from('responses')
        .insert([{ survey_id: id }])
        .select('id')
        .single();

      if (responseError) {
        console.error('Error creating response:', responseError);
        toast.error('Error submitting survey. Please try again.');
        setSubmitting(false);
        return;
      }

      console.log("Response created successfully:", responseData);

      // Create answer records for each question response
      const answers = Object.entries(responses).map(([questionId, value]) => ({
        response_id: responseData.id,
        question_id: questionId,
        answer_value: String(value)
      }));

      console.log("Submitting answers:", answers);

      // Insert all answers
      const { error: answersError } = await supabase
        .from('answers')
        .insert(answers);

      if (answersError) {
        console.error('Error inserting answers:', answersError);
        toast.error('Error submitting answers. Please try again.');
        setSubmitting(false);
        return;
      }

      console.log("Survey completed successfully!");
      
      // Success path
      toast.success('Survey submitted successfully!');
      setSubmitted(true);
      
      // Use replace instead of navigate to prevent back button issues
      navigate(`/respond/${id}?submitted=true`, { replace: true });
      
    } catch (error: any) {
      console.error('Error submitting survey:', error);
      toast.error('Error submitting survey');
      setSubmitting(false);
    }
  };

  if (!id) {
    return <div>No survey ID provided.</div>;
  }

  if (isSubmitted || submitted) {
    return (
      <Layout>
        <ThankYouMessage />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Respond to Survey</h1>
      </div>

      {loading ? (
        <div className="p-4 flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
          <span className="ml-3">Loading survey...</span>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
          {error}
        </div>
      ) : survey ? (
        <SurveyForm
          title={survey.title}
          description={survey.description}
          questions={questions}
          responses={responses}
          onResponseChange={handleInputChange}
          onSubmit={handleSubmit}
          submitting={submitting}
        />
      ) : (
        <div className="p-4 bg-amber-50 border border-amber-200 text-amber-600 rounded-lg">
          Survey not found.
        </div>
      )}
    </Layout>
  );
};

export default RespondToSurvey;
