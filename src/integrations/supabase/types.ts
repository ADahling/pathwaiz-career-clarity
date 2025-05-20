// Pathwaiz Career Clarity - Supabase Types
// This file defines TypeScript types for the database schema

export type Profile = {
  id: string;
  created_at: string;
  updated_at: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  role: 'mentee' | 'mentor' | 'admin' | null;
  bio: string | null;
  location: string | null;
  timezone: string | null;
  is_verified: boolean;
  is_active: boolean;
};

export type Mentor = {
  id: string;
  created_at: string;
  updated_at: string;
  job_title: string | null;
  company: string | null;
  industry: string | null;
  years_experience: number | null;
  hourly_rate: number | null;
  expertise: string[] | null;
  education: string | null;
  linkedin_url: string | null;
  website_url: string | null;
  average_rating: number | null;
  total_reviews: number;
  total_sessions: number;
};

export type Mentee = {
  id: string;
  created_at: string;
  updated_at: string;
  career_goals: string | null;
  interests: string[] | null;
  current_role: string | null;
  education: string | null;
  preferred_industries: string[] | null;
};

export type Category = {
  id: string;
  created_at: string;
  name: string;
  description: string | null;
  icon: string | null;
  is_active: boolean;
};

export type MentorCategory = {
  id: string;
  mentor_id: string;
  category_id: string;
  created_at: string;
};

export type Availability = {
  id: string;
  mentor_id: string;
  day_of_week: number; // 0-6, Sunday to Saturday
  start_time: string; // HH:MM:SS
  end_time: string; // HH:MM:SS
  is_recurring: boolean;
  created_at: string;
  updated_at: string;
};

export type AvailabilityException = {
  id: string;
  mentor_id: string;
  exception_date: string; // YYYY-MM-DD
  is_available: boolean;
  start_time: string | null; // HH:MM:SS
  end_time: string | null; // HH:MM:SS
  created_at: string;
  updated_at: string;
};

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no-show';

export type Booking = {
  id: string;
  mentor_id: string;
  mentee_id: string;
  start_time: string;
  end_time: string;
  duration: number; // in minutes
  status: BookingStatus;
  cancellation_reason: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export type Payment = {
  id: string;
  booking_id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  stripe_payment_intent_id: string | null; // Placeholder for Stripe integration
  platform_fee: number;
  mentor_payout: number;
  payment_method: string | null;
  receipt_url: string | null;
  created_at: string;
  updated_at: string;
};

export type Message = {
  id: string;
  sender_id: string;
  recipient_id: string;
  booking_id: string | null;
  content: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
};

export type Conversation = {
  id: string;
  mentor_id: string;
  mentee_id: string;
  last_message_at: string;
  created_at: string;
  updated_at: string;
};

export type Review = {
  id: string;
  booking_id: string;
  mentor_id: string;
  mentee_id: string;
  rating: number; // 1-5
  content: string | null;
  is_public: boolean;
  helpful_count: number;
  created_at: string;
  updated_at: string;
};

export type VideoSessionStatus = 'pending' | 'active' | 'completed' | 'failed';

export type VideoSession = {
  id: string;
  booking_id: string;
  room_id: string;
  room_name: string;
  status: VideoSessionStatus;
  start_time: string | null;
  end_time: string | null;
  duration: number | null; // in seconds
  recording_url: string | null;
  created_at: string;
  updated_at: string;
};

export type NotificationType = 
  | 'booking_created' 
  | 'booking_confirmed' 
  | 'booking_cancelled' 
  | 'payment_completed' 
  | 'message_received' 
  | 'session_reminder' 
  | 'review_received';

export type Notification = {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  content: string;
  is_read: boolean;
  related_id: string | null;
  created_at: string;
};

// Combined user type with profile and role-specific data
export type UserWithProfile = Profile & {
  mentor?: Mentor;
  mentee?: Mentee;
};

// Extended mentor type with categories
export type MentorWithDetails = Mentor & {
  profile: Profile;
  categories: Category[];
  availability?: Availability[];
};

// Extended booking type with related entities
export type BookingWithDetails = Booking & {
  mentor: MentorWithDetails;
  mentee: Profile & { mentee: Mentee };
  payment?: Payment;
  video_session?: VideoSession;
};

// Database definitions
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'created_at' | 'updated_at'>>;
      };
      mentors: {
        Row: Mentor;
        Insert: Omit<Mentor, 'created_at' | 'updated_at' | 'average_rating' | 'total_reviews' | 'total_sessions'>;
        Update: Partial<Omit<Mentor, 'created_at' | 'updated_at' | 'average_rating' | 'total_reviews' | 'total_sessions'>>;
      };
      mentees: {
        Row: Mentee;
        Insert: Omit<Mentee, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Mentee, 'created_at' | 'updated_at'>>;
      };
      categories: {
        Row: Category;
        Insert: Omit<Category, 'created_at'>;
        Update: Partial<Omit<Category, 'created_at'>>;
      };
      mentor_categories: {
        Row: MentorCategory;
        Insert: Omit<MentorCategory, 'id' | 'created_at'>;
        Update: Partial<Omit<MentorCategory, 'id' | 'created_at'>>;
      };
      availability: {
        Row: Availability;
        Insert: Omit<Availability, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Availability, 'id' | 'created_at' | 'updated_at'>>;
      };
      availability_exceptions: {
        Row: AvailabilityException;
        Insert: Omit<AvailabilityException, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<AvailabilityException, 'id' | 'created_at' | 'updated_at'>>;
      };
      bookings: {
        Row: Booking;
        Insert: Omit<Booking, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Booking, 'id' | 'created_at' | 'updated_at'>>;
      };
      payments: {
        Row: Payment;
        Insert: Omit<Payment, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Payment, 'id' | 'created_at' | 'updated_at'>>;
      };
      messages: {
        Row: Message;
        Insert: Omit<Message, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Message, 'id' | 'created_at' | 'updated_at'>>;
      };
      conversations: {
        Row: Conversation;
        Insert: Omit<Conversation, 'id' | 'created_at' | 'updated_at' | 'last_message_at'>;
        Update: Partial<Omit<Conversation, 'id' | 'created_at' | 'updated_at'>>;
      };
      reviews: {
        Row: Review;
        Insert: Omit<Review, 'id' | 'created_at' | 'updated_at' | 'helpful_count'>;
        Update: Partial<Omit<Review, 'id' | 'created_at' | 'updated_at'>>;
      };
      video_sessions: {
        Row: VideoSession;
        Insert: Omit<VideoSession, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<VideoSession, 'id' | 'created_at' | 'updated_at'>>;
      };
      notifications: {
        Row: Notification;
        Insert: Omit<Notification, 'id' | 'created_at'>;
        Update: Partial<Omit<Notification, 'id' | 'created_at'>>;
      };
    };
  };
}
