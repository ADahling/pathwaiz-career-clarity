
// Additional type definitions for Supabase tables

export interface Availability {
  id: string;
  mentor_id: string;
  date: string;  // Changed from day_of_week to match the schema
  time: string;  // Added to match the schema
  available: boolean; // Added to match the schema
  created_at: string;
  updated_at?: string;
}

export interface AvailabilityException {
  id: string;
  mentor_id: string;
  date: string;
  is_available: boolean;
  start_time?: string;
  end_time?: string;
  created_at: string;
}

export interface Booking {
  id: string;
  mentor_id: string;
  mentee_id: string;
  session_type: string;
  topic: string;
  notes?: string;
  duration: number;
  price: number;
  mentor_share: number;
  platform_fee: number;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'refunded';
  created_at: string;
  updated_at?: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  read: boolean;
  created_at: string;
}

export interface Conversation {
  id: string;
  sender_id: string;
  recipient_id: string;
  last_message: string;
  unread_count: number;
  updated_at: string;
  created_at: string;
  sender?: any;
  recipient?: any;
}

export interface Review {
  id: string;
  mentor_id: string;
  mentee_id: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface VideoSession {
  id: string;
  booking_id: string;
  mentor_id: string;
  mentee_id: string;
  room_id: string;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  start_time: string;
  end_time: string;
  created_at: string;
}

export interface MenteePreference {
  id: string;
  user_id: string;
  communication_preferences: {
    style: string;
    feedback: string;
    meeting_frequency: string;
    response_time: string;
  };
  mentorship_preferences: {
    approach: string;
    guidance_level: number;
    learning_style: string;
    goal_orientation: string;
  };
  career_preferences: {
    stage: string;
    industry_interests: string[];
    skills_to_improve: string[];
    goals: string;
  };
  updated_at: string;
  created_at: string;
}
