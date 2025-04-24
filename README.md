
# Survey Application

A full-stack survey application built with React, TypeScript, and Supabase. Create, share, and collect responses to surveys with support for multiple question types and anonymous responses.

## Features

- Create custom surveys with multiple question types
- Share surveys via unique URLs
- Collect anonymous responses
- View survey results and analytics
- Google Authentication support
- Responsive design with Tailwind CSS
- Real-time data with Supabase

## Prerequisites

- Node.js & npm - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- A Supabase account - [sign up here](https://supabase.com)

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <your-repo-url>

# Navigate to project directory
cd <project-directory>

# Install dependencies
npm install
```

### 2. Supabase Setup

1. Create a new Supabase project at [https://supabase.com](https://supabase.com)
2. Run the following SQL commands in your Supabase SQL editor to set up the database schema:

```sql
-- Create surveys table
CREATE TABLE public.surveys (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    title TEXT NOT NULL,
    user_id UUID NOT NULL,
    description TEXT,
    language TEXT NOT NULL DEFAULT 'en'
);

-- Create questions table
CREATE TABLE public.questions (
    question_text TEXT NOT NULL,
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    survey_id UUID NOT NULL,
    question_type TEXT NOT NULL,
    order_number INTEGER NOT NULL,
    options JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    required BOOLEAN DEFAULT false
);

-- Create responses table
CREATE TABLE public.responses (
    survey_id UUID NOT NULL,
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create answers table
CREATE TABLE public.answers (
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    response_id UUID NOT NULL,
    question_id UUID NOT NULL,
    answer_value TEXT NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;

-- Set up RLS policies for anonymous survey responses
CREATE POLICY "Enable anonymous survey responses" 
ON public.responses 
FOR ALL
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable anonymous survey answers" 
ON public.answers 
FOR ALL
USING (true)
WITH CHECK (true);
```

3. Copy your Supabase project URL and anon key from Project Settings > API

### 3. Environment Setup

Create a client for Supabase in `src/integrations/supabase/client.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "your-project-url";
const SUPABASE_ANON_KEY = "your-anon-key";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
```

### 4. Google Authentication Setup

To enable Google Authentication:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Configure OAuth consent screen
5. Create OAuth 2.0 credentials (Client ID and Secret)
6. In Supabase Dashboard:
   - Go to Authentication > Providers
   - Enable Google provider
   - Add your Google Client ID and Secret
   - Add authorized redirect URLs (your app's URL)
7. Configure your site URL in Supabase:
   - Go to Authentication > URL Configuration
   - Set your site URL and redirect URLs

For detailed Google auth setup instructions, visit [Supabase Google Auth Guide](https://supabase.com/docs/guides/auth/social-login/auth-google)

### 5. Start the Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` to see your application running.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## Project Structure

```
src/
├── components/     # Reusable components
├── context/       # React context providers
├── hooks/         # Custom React hooks
├── integrations/  # External service integrations
├── pages/         # Page components
└── types/         # TypeScript type definitions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

