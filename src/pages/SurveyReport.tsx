
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader2, Download, FileDown } from 'lucide-react';
import { toast } from 'sonner';
import Layout from '@/components/layout/Layout';
import { Database } from '@/integrations/supabase/types';
import { Json } from '@/integrations/supabase/types';

interface SurveyDetails {
  id: string;
  title: string;
  description: string | null;
  user_id: string;
}

interface Question {
  id: string;
  question_text: string;
  question_type: Database['public']['Enums']['question_type'];
  options: Json | null;
  order_number: number;
}

interface Answer {
  id: string;
  question_id: string;
  answer_value: string;
  response_id: string;
}

interface Response {
  id: string;
  created_at: string;
  answers: Answer[];
}

interface QuestionResult {
  question: Question;
  data: any[];
}

const SurveyReport = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { t } = useLanguage();
  
  const [survey, setSurvey] = useState<SurveyDetails | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [responses, setResponses] = useState<Response[]>([]);
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const chartRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const fetchSurveyData = async () => {
      if (!id || !user) return;

      try {
        // Get survey details
        const { data: surveyData, error: surveyError } = await supabase
          .from('surveys')
          .select('id, title, description, user_id')
          .eq('id', id)
          .single();

        if (surveyError) throw surveyError;

        // Check if user owns the survey
        if (surveyData.user_id !== user.id) {
          setError("You don't have permission to access this survey");
          setLoading(false);
          return;
        }

        // Get survey questions
        const { data: questionData, error: questionError } = await supabase
          .from('questions')
          .select('id, question_text, question_type, options, order_number')
          .eq('survey_id', id)
          .order('order_number', { ascending: true });

        if (questionError) throw questionError;

        // Get survey responses
        const { data: responseData, error: responseError } = await supabase
          .from('responses')
          .select('id, created_at')
          .eq('survey_id', id);

        if (responseError) throw responseError;

        // Get answers for each response
        const responsesWithAnswers = await Promise.all(
          (responseData || []).map(async (response) => {
            const { data: answerData, error: answerError } = await supabase
              .from('answers')
              .select('id, question_id, answer_value')
              .eq('response_id', response.id);

            if (answerError) throw answerError;

            // Add the response_id to each answer to match the Answer interface
            const answersWithResponseId = (answerData || []).map(answer => ({
              ...answer,
              response_id: response.id
            }));

            return {
              ...response,
              answers: answersWithResponseId,
            };
          })
        );

        setSurvey(surveyData);
        setQuestions(questionData || []);
        setResponses(responsesWithAnswers);

        // Process the results
        if (questionData) {
          processResults(questionData, responsesWithAnswers);
        }
      } catch (error) {
        console.error('Error fetching survey data:', error);
        setError('Error loading survey data');
      } finally {
        setLoading(false);
      }
    };

    fetchSurveyData();
  }, [id, user]);

  const processResults = (questions: Question[], responses: Response[]) => {
    const questionResults: QuestionResult[] = questions.map((question) => {
      // Get all answers for this question
      const answers = responses
        .flatMap(response => 
          response.answers.filter(answer => answer.question_id === question.id)
        )
        .map(answer => answer.answer_value);

      let data: any[] = [];

      switch (question.question_type) {
        case 'yes_no':
          const yesCount = answers.filter(answer => answer === 'yes').length;
          const noCount = answers.filter(answer => answer === 'no').length;
          data = [
            { name: 'Yes', value: yesCount },
            { name: 'No', value: noCount },
          ];
          break;
          
        case 'multiple_choice':
          if (Array.isArray(question.options)) {
            data = (question.options as string[]).map(option => ({
              name: option,
              value: answers.filter(answer => answer === option).length,
            }));
          }
          break;
          
        case 'rating':
          const ratingCounts = [0, 0, 0, 0, 0]; // Index 0-4 for ratings 1-5
          answers.forEach(answer => {
            const rating = parseInt(answer);
            if (rating >= 1 && rating <= 5) {
              ratingCounts[rating - 1]++;
            }
          });
          
          data = [1, 2, 3, 4, 5].map((rating, index) => ({
            name: rating.toString(),
            value: ratingCounts[index],
          }));
          break;
      }

      return { question, data };
    });

    setResults(questionResults);
  };

  const exportChart = (index: number) => {
    if (!chartRefs.current[index]) return;

    const svgElement = chartRefs.current[index]?.querySelector('svg');
    if (!svgElement) return;

    // Convert SVG to image
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      if (!ctx) return;
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngData = canvas.toDataURL('image/png');
      
      // Create download link
      const downloadLink = document.createElement('a');
      downloadLink.href = pngData;
      downloadLink.download = `question-${index + 1}-chart.png`;
      downloadLink.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const exportCSV = () => {
    if (!questions.length || !responses.length) return;

    // Create CSV header row
    const headers = ['Response ID', 'Timestamp', ...questions.map(q => q.question_text)];
    
    // Create CSV data rows
    const rows = responses.map(response => {
      const row = [
        response.id,
        new Date(response.created_at).toLocaleString(),
      ];
      
      // Add answers for each question
      questions.forEach(question => {
        const answer = response.answers.find(a => a.question_id === question.id);
        row.push(answer ? answer.answer_value : '');
      });
      
      return row;
    });
    
    // Combine header and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = `survey-${id}-responses.csv`;
    downloadLink.click();
    URL.revokeObjectURL(url);
    
    toast.success('CSV file downloaded');
  };

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <Layout>
      <div className="mb-6 flex justify-between items-center flex-wrap gap-4">
        <h1 className="text-3xl font-bold">{t('report.title')}</h1>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={exportCSV}
            disabled={loading || responses.length === 0}
          >
            <FileDown className="mr-2 h-4 w-4" />
            {t('report.exportCSV')}
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 text-brand animate-spin" />
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
          {error}
        </div>
      ) : (
        <>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{survey?.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-muted-foreground mb-4">
                  {survey?.description || "No description provided."}
                </p>
                <div className="bg-muted p-4 rounded-md inline-block">
                  <p className="font-medium">
                    {t('report.responsesCount')}: {responses.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {responses.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-xl font-medium text-muted-foreground">
                {t('report.noData')}
              </h2>
            </div>
          ) : (
            <Tabs defaultValue="charts" className="space-y-8">
              <TabsList>
                <TabsTrigger value="charts">Charts</TabsTrigger>
                <TabsTrigger value="summary">Summary</TabsTrigger>
              </TabsList>
              
              <TabsContent value="charts" className="space-y-8">
                {results.map((result, index) => (
                  <Card key={result.question.id}>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-lg">
                        {index + 1}. {result.question.question_text}
                      </CardTitle>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => exportChart(index)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div 
                        ref={el => chartRefs.current[index] = el} 
                        className="w-full h-64"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={result.data}
                            margin={{
                              top: 20,
                              right: 30,
                              left: 20,
                              bottom: 50,
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                              dataKey="name" 
                              angle={-45} 
                              textAnchor="end"
                              height={60}
                            />
                            <YAxis 
                              allowDecimals={false} 
                              domain={[0, 'auto']} 
                            />
                            <Tooltip />
                            <Bar 
                              dataKey="value" 
                              fill="#8B5CF6" 
                              name="Responses" 
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      
                      {result.question.question_type === 'rating' && (
                        <div className="mt-4 text-right">
                          <p className="text-sm font-medium">
                            {t('report.averageRating')}: {' '}
                            {result.data.reduce((acc, item) => {
                              return acc + (Number(item.name) * item.value);
                            }, 0) / result.data.reduce((acc, item) => acc + item.value, 0) || 0}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
              
              <TabsContent value="summary">
                <Card>
                  <CardHeader>
                    <CardTitle>Response Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr>
                          <th className="border p-2 text-left">Question</th>
                          <th className="border p-2 text-left">Summary</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.map((result) => (
                          <tr key={result.question.id}>
                            <td className="border p-2">{result.question.question_text}</td>
                            <td className="border p-2">
                              {result.question.question_type === 'rating' ? (
                                <span>
                                  Average: {result.data.reduce((acc, item) => {
                                    return acc + (Number(item.name) * item.value);
                                  }, 0) / result.data.reduce((acc, item) => acc + item.value, 0) || 0}
                                </span>
                              ) : (
                                <ul className="list-disc list-inside">
                                  {result.data.map((item, i) => (
                                    <li key={i}>
                                      {item.name}: {item.value} responses
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </>
      )}
    </Layout>
  );
};

export default SurveyReport;
