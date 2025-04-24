
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { ChevronRight, LineChart, MessageSquare, Users, CheckCircle2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';

const Index = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: t('features.title'),
      description: t('features.description'),
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: t('features.shareTitle'),
      description: t('features.shareDescription'),
    },
    {
      icon: <LineChart className="h-6 w-6" />,
      title: t('features.analyticsTitle'),
      description: t('features.analyticsDescription'),
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-brand to-brand-light text-transparent bg-clip-text">
              {t('common.appName')}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              Collect valuable feedback from your customers with our simple, powerful survey tool.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/register">
                <Button className="text-lg py-6 px-8 bg-brand hover:bg-brand-dark shadow-md">
                  {t('common.getStarted')}
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" className="text-lg py-6 px-8">
                  {t('common.login')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">{t('common.features')}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-background p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">{t('common.whyChoose')}</h2>
            <ul className="space-y-6">
              {[
                t('benefits.unlimited'),
                t('benefits.questionTypes'),
                t('benefits.sharing'),
                t('benefits.realTime'),
                t('benefits.export'),
                t('benefits.multilingual'),
              ].map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle2 className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
            <div className="mt-12 text-center">
              <Link to="/register">
                <Button className="bg-brand hover:bg-brand-dark">
                  {t('common.startCollecting')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
