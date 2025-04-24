
import { Translations } from '@/types/translations';

export const englishTranslations: Translations = {
  common: {
    appName: 'Voz Feedback Hub',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    email: 'Email',
    password: 'Password',
    submit: 'Submit',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    loading: 'Loading...',
    getStarted: 'Get Started Free',
    learnMore: 'Learn More',
    features: 'How It Works',
    whyChoose: 'Why Choose Voz?',
    startCollecting: 'Start Collecting Feedback Today'
  },
  auth: {
    loginTitle: 'Welcome Back',
    registerTitle: 'Create Account',
    loginButton: 'Sign In',
    registerButton: 'Sign Up',
    forgotPassword: 'Forgot Password?',
    authError: 'Authentication Error',
    emailRequired: 'Email is required',
    passwordRequired: 'Password is required',
    continueWithGoogle: 'Continue with Google',
    signInDescription: 'Sign in with your Google account to continue'
  },
  dashboard: {
    title: 'Your Surveys',
    createSurvey: 'Create New Survey',
    noSurveys: 'No surveys found. Create your first one!',
    surveyResults: 'View Results',
    shareSurvey: 'Share',
    responsesCount: 'Responses',
    noSurveysDescription: "You haven't created any surveys yet. Create your first survey to get started.",
    createdAt: 'Created at',
    noDescription: 'No description provided.'
  },
  survey: {
    create: 'Create Survey',
    title: 'Survey Title',
    description: 'Description',
    addQuestion: 'Add Question',
    questionType: 'Question Type',
    questionText: 'Question Text',
    options: 'Options',
    addOption: 'Add Option',
    required: 'Required',
    preview: 'Preview',
    save: 'Save Survey',
    questionTypes: {
      yesNo: 'Yes/No',
      multipleChoice: 'Multiple Choice',
      rating: 'Rating (1-5)',
    },
    surveyDetails: 'Survey Details',
    enterTitle: 'Enter survey title',
    enterDescription: 'Enter survey description (optional)',
    questionNumber: 'Question',
    enterQuestionText: 'Enter question text',
    option: 'Option',
    saving: 'Saving...'
  },
  response: {
    thankYou: 'Thank you for your feedback!',
    submit: 'Submit Feedback',
    required: 'This field is required',
    yes: 'Yes',
    no: 'No',
    ratingLabel: 'Rating',
  },
  report: {
    title: 'Survey Results',
    exportPNG: 'Export Charts as PNG',
    exportCSV: 'Export Data as CSV',
    responsesCount: 'Total Responses',
    averageRating: 'Average Rating',
    noData: 'No responses yet',
  },
  features: {
    title: 'Easy Survey Creation',
    shareTitle: 'Share With Anyone',
    analyticsTitle: 'Insightful Analytics',
    description: 'Create professional surveys with multiple question types in minutes.',
    shareDescription: 'Generate unique links and QR codes to share your surveys with your audience.',
    analyticsDescription: 'Get real-time results and analyze responses with beautiful charts and reports.'
  },
  benefits: {
    unlimited: 'Create unlimited surveys with our user-friendly interface',
    questionTypes: 'Choose from multiple question types including Yes/No, Multiple Choice, and Rating scales',
    sharing: 'Share surveys via custom links and QR codes',
    realTime: 'Get real-time responses and analytics',
    export: 'Export your data in multiple formats',
    multilingual: 'Multilingual support with English and Spanish interfaces'
  }
};

