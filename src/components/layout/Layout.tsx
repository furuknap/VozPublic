
import React from 'react';
import Header from './Header';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/context/LanguageContext';
import { Loader2 } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { loading } = useAuth();
  const { t } = useLanguage();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 text-brand animate-spin mb-4" />
          <p className="text-muted-foreground">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-grow container py-8 px-4 md:px-8">{children}</main>
      <footer className="py-6 border-t">
        <div className="container mx-auto px-4 md:px-8 text-center text-muted-foreground text-sm">
          &copy; {new Date().getFullYear()} Voz Feedback Hub
        </div>
      </footer>
    </div>
  );
};

export default Layout;
