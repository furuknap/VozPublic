
import { Database } from '@/integrations/supabase/types';
import type { Json } from '@/integrations/supabase/types';

export interface Question {
  id: string;
  question_text: string;
  question_type: Database['public']['Enums']['question_type'];
  options: Json | null;
  order_number: number;
  required?: boolean;
}

export interface SurveyDetails {
  id: string;
  title: string;
  description: string | null;
  user_id: string;
}
