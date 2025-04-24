
import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage, LANGUAGES } from '@/context/LanguageContext';
import { Language } from '@/types/translations';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe, LogOut, User } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

const Header = () => {
  const { user, signOut } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  // Debug log to confirm user state
  useEffect(() => {
    console.log('Header component - User state:', user ? 'Logged in' : 'Not logged in');
  }, [user]);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
  };

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-semibold bg-gradient-to-r from-brand to-brand-light text-transparent bg-clip-text">
          {t('common.appName')}
        </Link>

        <div className="flex items-center gap-4">
          {/* Language Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-foreground">
                <Globe className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {Object.entries(LANGUAGES).map(([code, name]) => (
                <DropdownMenuItem
                  key={code}
                  onClick={() => handleLanguageChange(code as Language)}
                  className={language === code ? 'bg-accent' : ''}
                >
                  {name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <ThemeToggle />

          {user ? (
            <>
              <Link to="/dashboard">
                <Button variant="ghost" className="text-foreground">
                  <User className="h-5 w-5 mr-2" />
                  Dashboard
                </Button>
              </Link>

              <Button variant="ghost" onClick={signOut} className="text-foreground">
                <LogOut className="h-5 w-5 mr-2" />
                {t('common.logout')}
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="default" className="bg-brand hover:bg-brand-dark text-white">
                  {t('common.login')}
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
