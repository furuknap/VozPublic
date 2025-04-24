import React, { useState, useEffect } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, ChartPieIcon, Share2, Loader2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { toast } from 'sonner';

interface Survey {
  id: string;
  title: string;
  description: string;
  created_at: string;
  response_count: number;
}

const Dashboard = () => {
  const { user, session, loading } = useAuth();
  const { t } = useLanguage();
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Debug log for Dashboard 
  useEffect(() => {
    console.log('[Dashboard] Component rendered - Auth state:', 
      user ? `Logged in as ${user.email}` : 'Not logged in', 
      'Loading:', loading);
  }, [user, loading]);

  // Check authentication and redirect if needed
  useEffect(() => {
    // Only redirect after auth loading is complete
    if (!loading) {
      if (!user) {
        console.log('[Dashboard] No authenticated user, redirecting to login');
        navigate('/login', { replace: true });
      } else {
        console.log('[Dashboard] User authenticated:', user.email);
      }
    }
  }, [user, loading, navigate]);

  // Fetch surveys
  useEffect(() => {
    const fetchSurveys = async () => {
      if (!user) {
        console.log('[Dashboard] No user, skipping survey fetch');
        setIsLoading(false);
        return;
      }

      console.log('[Dashboard] Fetching surveys for user:', user.id);
      
      try {
        // Get surveys
        const { data, error } = await supabase
          .from('surveys')
          .select('id, title, description, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('[Dashboard] Error fetching surveys:', error);
          toast.error('Failed to load your surveys');
          throw error;
        }

        console.log('[Dashboard] Surveys fetched:', data?.length || 0);

        // For each survey, get response count
        const surveysWithCounts = await Promise.all(
          (data || []).map(async (survey) => {
            const { count, error: countError } = await supabase
              .from('responses')
              .select('id', { count: 'exact', head: true })
              .eq('survey_id', survey.id);

            if (countError) throw countError;

            return {
              ...survey,
              response_count: count || 0,
            };
          })
        );

        setSurveys(surveysWithCounts);
      } catch (error) {
        console.error('[Dashboard] Error in survey data processing:', error);
        toast.error('There was a problem loading your surveys');
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch if we have a user and loading is complete
    if (user && !loading) {
      fetchSurveys();
    } else if (!loading) {
      setIsLoading(false);
    }
  }, [user, loading]);

  // Show loading state while auth is loading or data is loading
  if (loading || isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 text-brand animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading your dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // If not logged in, component will redirect in useEffect
  if (!user) {
    return null;
  }

  // Display dashboard content
  return (
    <Layout>
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t('dashboard.title')}</h1>
        <Link to="/create-survey">
          <Button className="bg-brand hover:bg-brand-dark">
            <Plus className="mr-2 h-4 w-4" />
            {t('dashboard.createSurvey')}
          </Button>
        </Link>
      </div>

      {surveys.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <ChartPieIcon className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-medium mb-2">{t('dashboard.noSurveys')}</h2>
          <p className="text-muted-foreground mb-6">
            You haven't created any surveys yet. Create your first survey to get started.
          </p>
          <Link to="/create-survey">
            <Button className="mt-4 bg-brand hover:bg-brand-dark">
              {t('dashboard.createSurvey')}
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {surveys.map((survey) => (
            <Card key={survey.id} className="overflow-hidden">
              <CardHeader className="bg-accent pb-2">
                <CardTitle className="truncate">{survey.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {new Date(survey.created_at).toLocaleDateString()}
                </p>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground line-clamp-3 h-12">
                  {survey.description || "No description provided."}
                </p>
                <div className="mt-4 text-sm font-medium">
                  {t('dashboard.responsesCount')}: {survey.response_count}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t p-4 bg-muted/20">
                <Link to={`/report/${survey.id}`}>
                  <Button variant="outline" size="sm">
                    <ChartPieIcon className="mr-2 h-4 w-4" />
                    {t('dashboard.surveyResults')}
                  </Button>
                </Link>
                <Link to={`/share/${survey.id}`}>
                  <Button variant="outline" size="sm">
                    <Share2 className="mr-2 h-4 w-4" />
                    {t('dashboard.shareSurvey')}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default Dashboard;
