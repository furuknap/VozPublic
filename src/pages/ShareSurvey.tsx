
import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { QrCode, Copy, Link as LinkIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Layout from '@/components/layout/Layout';
import { QRCodeCanvas } from 'qrcode.react';

interface SurveyDetails {
  id: string;
  title: string;
  description: string | null;
  user_id: string;
}

const ShareSurvey = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { t } = useLanguage();
  
  const [survey, setSurvey] = useState<SurveyDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const surveyUrl = `${window.location.origin}/respond/${id}`;

  useEffect(() => {
    const fetchSurvey = async () => {
      if (!id || !user) return;

      try {
        const { data, error } = await supabase
          .from('surveys')
          .select('id, title, description, user_id')
          .eq('id', id)
          .single();

        if (error) throw error;

        if (data.user_id !== user.id) {
          setError("You don't have permission to access this survey");
          return;
        }

        setSurvey(data);
      } catch (error) {
        console.error('Error fetching survey:', error);
        setError('Error loading survey details');
      } finally {
        setLoading(false);
      }
    };

    fetchSurvey();
  }, [id, user]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(surveyUrl);
    toast.success('Survey link copied to clipboard');
  };

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Share Survey</h1>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 text-brand animate-spin" />
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
          {error}
        </div>
      ) : survey ? (
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Survey Details</CardTitle>
            </CardHeader>
            <CardContent>
              <h2 className="text-xl font-semibold mb-2">{survey.title}</h2>
              <p className="text-muted-foreground mb-6">
                {survey.description || "No description provided."}
              </p>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <LinkIcon className="h-5 w-5 mr-2" />
                  Share Link
                </CardTitle>
                <CardDescription>Share this link with people to collect feedback</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center space-x-2">
                <Input value={surveyUrl} readOnly className="flex-1" />
                <Button onClick={copyToClipboard} variant="outline" size="icon">
                  <Copy className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <QrCode className="h-5 w-5 mr-2" />
                  QR Code
                </CardTitle>
                <CardDescription>Scan this code to open the survey</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center py-6">
                <div className="bg-white p-4 rounded-md">
                  <QRCodeCanvas value={surveyUrl} size={200} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : null}
    </Layout>
  );
};

export default ShareSurvey;
