-- Pathwaiz Career Clarity - Database Schema
-- This file defines the initial database schema for the Pathwaiz platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  role TEXT CHECK (role IN ('mentee', 'mentor', 'admin')),
  bio TEXT,
  location TEXT,
  timezone TEXT,
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true
);

-- Mentors table (extends profiles)
CREATE TABLE IF NOT EXISTS mentors (
  id UUID REFERENCES profiles(id) PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  job_title TEXT,
  company TEXT,
  industry TEXT,
  years_experience INTEGER,
  hourly_rate DECIMAL(10, 2),
  expertise TEXT[],
  education TEXT,
  linkedin_url TEXT,
  website_url TEXT,
  average_rating DECIMAL(3, 2),
  total_reviews INTEGER DEFAULT 0,
  total_sessions INTEGER DEFAULT 0
);

-- Mentees table (extends profiles)
CREATE TABLE IF NOT EXISTS mentees (
  id UUID REFERENCES profiles(id) PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  career_goals TEXT,
  interests TEXT[],
  current_role TEXT,
  education TEXT,
  preferred_industries TEXT[]
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  is_active BOOLEAN DEFAULT true
);

-- Mentor categories (many-to-many)
CREATE TABLE IF NOT EXISTS mentor_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mentor_id UUID REFERENCES mentors(id) NOT NULL,
  category_id UUID REFERENCES categories(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(mentor_id, category_id)
);

-- Availability table
CREATE TABLE IF NOT EXISTS availability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mentor_id UUID REFERENCES mentors(id) NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_recurring BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  CONSTRAINT valid_time_range CHECK (start_time < end_time)
);

-- Availability exceptions (for specific dates)
CREATE TABLE IF NOT EXISTS availability_exceptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mentor_id UUID REFERENCES mentors(id) NOT NULL,
  exception_date DATE NOT NULL,
  is_available BOOLEAN DEFAULT false,
  start_time TIME,
  end_time TIME,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  CONSTRAINT valid_time_range CHECK (start_time < end_time OR (start_time IS NULL AND end_time IS NULL))
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mentor_id UUID REFERENCES mentors(id) NOT NULL,
  mentee_id UUID REFERENCES mentees(id) NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  duration INTEGER NOT NULL, -- in minutes
  status TEXT CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed', 'no-show')) NOT NULL,
  cancellation_reason TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  CONSTRAINT valid_booking_time CHECK (start_time < end_time)
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD' NOT NULL,
  status TEXT CHECK (status IN ('pending', 'completed', 'failed', 'refunded')) NOT NULL,
  stripe_payment_intent_id TEXT, -- Placeholder for Stripe integration
  platform_fee DECIMAL(10, 2) NOT NULL,
  mentor_payout DECIMAL(10, 2) NOT NULL,
  payment_method TEXT,
  receipt_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID REFERENCES profiles(id) NOT NULL,
  recipient_id UUID REFERENCES profiles(id) NOT NULL,
  booking_id UUID REFERENCES bookings(id),
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Conversations table (for grouping messages)
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mentor_id UUID REFERENCES mentors(id) NOT NULL,
  mentee_id UUID REFERENCES mentees(id) NOT NULL,
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(mentor_id, mentee_id)
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id) NOT NULL,
  mentor_id UUID REFERENCES mentors(id) NOT NULL,
  mentee_id UUID REFERENCES mentees(id) NOT NULL,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5) NOT NULL,
  content TEXT,
  is_public BOOLEAN DEFAULT true,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(booking_id)
);

-- Video sessions table (placeholder for video integration)
CREATE TABLE IF NOT EXISTS video_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id) NOT NULL,
  room_id TEXT NOT NULL,
  room_name TEXT NOT NULL,
  status TEXT CHECK (status IN ('pending', 'active', 'completed', 'failed')) NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  duration INTEGER, -- in seconds
  recording_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(booking_id)
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  related_id UUID, -- Generic reference to related entity
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to all tables with updated_at
CREATE TRIGGER set_timestamp_profiles
BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_mentors
BEFORE UPDATE ON mentors
FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_mentees
BEFORE UPDATE ON mentees
FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_availability
BEFORE UPDATE ON availability
FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_availability_exceptions
BEFORE UPDATE ON availability_exceptions
FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_bookings
BEFORE UPDATE ON bookings
FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_payments
BEFORE UPDATE ON payments
FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_messages
BEFORE UPDATE ON messages
FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_conversations
BEFORE UPDATE ON conversations
FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_reviews
BEFORE UPDATE ON reviews
FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_video_sessions
BEFORE UPDATE ON video_sessions
FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

-- Create Row Level Security (RLS) policies
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentors ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentees ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentor_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_exceptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create policies (simplified for placeholder implementation)
-- Profiles: Users can read all profiles but only update their own
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Mentors: Public read, own update
CREATE POLICY "Mentors are viewable by everyone" ON mentors FOR SELECT USING (true);
CREATE POLICY "Mentors can update own profile" ON mentors FOR UPDATE USING (auth.uid() = id);

-- Mentees: Public read, own update
CREATE POLICY "Mentees are viewable by everyone" ON mentees FOR SELECT USING (true);
CREATE POLICY "Mentees can update own profile" ON mentees FOR UPDATE USING (auth.uid() = id);

-- Categories: Public read
CREATE POLICY "Categories are viewable by everyone" ON categories FOR SELECT USING (true);

-- Mentor Categories: Public read
CREATE POLICY "Mentor categories are viewable by everyone" ON mentor_categories FOR SELECT USING (true);

-- Availability: Public read, mentor update
CREATE POLICY "Availability is viewable by everyone" ON availability FOR SELECT USING (true);
CREATE POLICY "Mentors can update own availability" ON availability FOR UPDATE USING (auth.uid() = mentor_id);
CREATE POLICY "Mentors can insert own availability" ON availability FOR INSERT WITH CHECK (auth.uid() = mentor_id);
CREATE POLICY "Mentors can delete own availability" ON availability FOR DELETE USING (auth.uid() = mentor_id);

-- Availability Exceptions: Public read, mentor update
CREATE POLICY "Availability exceptions are viewable by everyone" ON availability_exceptions FOR SELECT USING (true);
CREATE POLICY "Mentors can update own exceptions" ON availability_exceptions FOR UPDATE USING (auth.uid() = mentor_id);
CREATE POLICY "Mentors can insert own exceptions" ON availability_exceptions FOR INSERT WITH CHECK (auth.uid() = mentor_id);
CREATE POLICY "Mentors can delete own exceptions" ON availability_exceptions FOR DELETE USING (auth.uid() = mentor_id);

-- Bookings: Participants can read, mentee can create
CREATE POLICY "Users can view bookings they participate in" ON bookings 
FOR SELECT USING (auth.uid() = mentor_id OR auth.uid() = mentee_id);
CREATE POLICY "Mentees can create bookings" ON bookings FOR INSERT WITH CHECK (auth.uid() = mentee_id);
CREATE POLICY "Participants can update bookings" ON bookings 
FOR UPDATE USING (auth.uid() = mentor_id OR auth.uid() = mentee_id);

-- Payments: Participants can read
CREATE POLICY "Users can view payments for their bookings" ON payments 
FOR SELECT USING (EXISTS (
  SELECT 1 FROM bookings 
  WHERE bookings.id = payments.booking_id 
  AND (bookings.mentor_id = auth.uid() OR bookings.mentee_id = auth.uid())
));

-- Messages: Participants can read and create
CREATE POLICY "Users can view messages they sent or received" ON messages 
FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = recipient_id);
CREATE POLICY "Users can send messages" ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users can update messages they sent" ON messages FOR UPDATE USING (auth.uid() = sender_id);

-- Conversations: Participants can read
CREATE POLICY "Users can view conversations they participate in" ON conversations 
FOR SELECT USING (auth.uid() = mentor_id OR auth.uid() = mentee_id);

-- Reviews: Public read, mentee create
CREATE POLICY "Reviews are viewable by everyone" ON reviews FOR SELECT USING (true);
CREATE POLICY "Mentees can create reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = mentee_id);
CREATE POLICY "Mentees can update own reviews" ON reviews FOR UPDATE USING (auth.uid() = mentee_id);

-- Video Sessions: Participants can read
CREATE POLICY "Users can view video sessions they participate in" ON video_sessions 
FOR SELECT USING (EXISTS (
  SELECT 1 FROM bookings 
  WHERE bookings.id = video_sessions.booking_id 
  AND (bookings.mentor_id = auth.uid() OR bookings.mentee_id = auth.uid())
));

-- Notifications: Own read
CREATE POLICY "Users can view own notifications" ON notifications 
FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications 
FOR UPDATE USING (auth.uid() = user_id);

-- Insert sample data for categories
INSERT INTO categories (name, description, icon, is_active)
VALUES 
('Software Development', 'Programming, software engineering, and technical roles', 'code', true),
('Design', 'UX/UI design, graphic design, and creative roles', 'palette', true),
('Marketing', 'Digital marketing, content creation, and brand strategy', 'trending-up', true),
('Business', 'Management, entrepreneurship, and business strategy', 'briefcase', true),
('Finance', 'Financial planning, accounting, and investment', 'dollar-sign', true),
('Healthcare', 'Medical, wellness, and healthcare professions', 'activity', true),
('Education', 'Teaching, training, and educational roles', 'book', true),
('Freelancing', 'Independent work and freelance careers', 'user', true)
ON CONFLICT (name) DO NOTHING;

-- Note: This is a placeholder schema. In a production environment, additional
-- indexes, constraints, and optimizations would be applied based on query patterns.
