
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

export const ThankYouMessage = () => {
  const navigate = useNavigate();
  
  return (
    <Card className="max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Thank You!</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center mb-6">
          Your response has been submitted successfully.
        </p>
        <div className="flex justify-center">
          <Button onClick={() => navigate('/')}>
            Return Home
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
