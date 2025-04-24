
import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/context/LanguageContext';
import { Navigate, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';

const Register = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Since we're only using Google authentication, redirect to login page
    navigate('/login');
  }, [navigate]);

  // Redirect if user is already logged in
  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <Layout>
      <div className="flex justify-center items-center py-12">
        {/* This content won't be shown as we're redirecting to login */}
        <p>{t('auth.redirectingToLogin')}</p>
      </div>
    </Layout>
  );
};

export default Register;
