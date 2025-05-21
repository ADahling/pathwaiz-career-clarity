
-- Notifications table for user notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  related_id UUID, -- Generic reference to related entity
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Only allow users to see their own notifications
CREATE POLICY "Users can view own notifications"
ON public.notifications
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Only allow users to update their own notifications
CREATE POLICY "Users can update own notifications" 
ON public.notifications
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

-- Video sessions table for video calls
CREATE TABLE IF NOT EXISTS public.video_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id),
  room_id TEXT NOT NULL,
  room_name TEXT NOT NULL,
  status TEXT CHECK (status IN ('pending', 'active', 'completed', 'failed')) NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  duration INTEGER, -- in seconds
  recording_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on video_sessions
ALTER TABLE public.video_sessions ENABLE ROW LEVEL SECURITY;

-- Allow mentors and mentees to access their video sessions
CREATE POLICY "Users can view video sessions they participate in"
ON public.video_sessions
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM bookings 
    WHERE bookings.id = video_sessions.booking_id 
    AND (bookings.mentor_id = auth.uid() OR bookings.mentee_id = auth.uid())
  )
);

-- Create a trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to video_sessions
CREATE TRIGGER set_timestamp_video_sessions
BEFORE UPDATE ON video_sessions
FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
