-- TravelExplorer Database Schema for Supabase
-- Run this in your Supabase SQL Editor to set up the database

-- Enable Row Level Security
ALTER DEFAULT PRIVILEGES REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;

-- Create custom types
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'refunded');
CREATE TYPE difficulty_level AS ENUM ('Easy', 'Moderate', 'Challenging');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  date_of_birth DATE,
  nationality TEXT,
  emergency_contact JSONB, -- { name, phone, relationship }
  preferences JSONB DEFAULT '{
    "dietaryRestrictions": [],
    "accessibilityNeeds": [],
    "preferredActivities": []
  }'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Destinations table
CREATE TABLE public.destinations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  country TEXT NOT NULL,
  continent TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  rating DECIMAL(3,2) DEFAULT 0,
  duration INTEGER NOT NULL, -- in days
  highlights TEXT[] DEFAULT '{}',
  itinerary JSONB DEFAULT '[]'::jsonb,
  included TEXT[] DEFAULT '{}',
  excluded TEXT[] DEFAULT '{}',
  difficulty difficulty_level DEFAULT 'Easy',
  max_group_size INTEGER DEFAULT 20,
  languages TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Bookings table
CREATE TABLE public.bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  destination_id UUID REFERENCES public.destinations(id) ON DELETE CASCADE NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  number_of_travelers INTEGER NOT NULL DEFAULT 1,
  total_price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status booking_status DEFAULT 'pending',
  payment_status payment_status DEFAULT 'pending',
  special_requests TEXT,
  contact_info JSONB NOT NULL, -- { name, email, phone }
  traveler_details JSONB DEFAULT '[]'::jsonb,
  stripe_payment_intent_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Reviews table
CREATE TABLE public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  destination_id UUID REFERENCES public.destinations(id) ON DELETE CASCADE NOT NULL,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT NOT NULL,
  comment TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  helpful INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, booking_id)
);

-- Categories table (for destination categorization)
CREATE TABLE public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Destination categories junction table
CREATE TABLE public.destination_categories (
  destination_id UUID REFERENCES public.destinations(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  PRIMARY KEY (destination_id, category_id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.destination_categories ENABLE ROW LEVEL SECURITY;

-- Create policies for Row Level Security

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Destinations policies (public read, admin write)
CREATE POLICY "Anyone can view active destinations" ON public.destinations
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage destinations" ON public.destinations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Bookings policies
CREATE POLICY "Users can view their own bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookings" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings" ON public.bookings
  FOR UPDATE USING (auth.uid() = user_id);

-- Reviews policies
CREATE POLICY "Anyone can view reviews" ON public.reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can create reviews for their bookings" ON public.reviews
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.bookings
      WHERE bookings.id = booking_id
      AND bookings.user_id = auth.uid()
      AND bookings.status = 'completed'
    )
  );

CREATE POLICY "Users can update their own reviews" ON public.reviews
  FOR UPDATE USING (auth.uid() = user_id);

-- Categories policies (public read, admin write)
CREATE POLICY "Anyone can view categories" ON public.categories
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage categories" ON public.categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Destination categories policies (public read, admin write)
CREATE POLICY "Anyone can view destination categories" ON public.destination_categories
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage destination categories" ON public.destination_categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_destinations_country ON public.destinations(country);
CREATE INDEX idx_destinations_continent ON public.destinations(continent);
CREATE INDEX idx_destinations_price ON public.destinations(price);
CREATE INDEX idx_destinations_rating ON public.destinations(rating);
CREATE INDEX idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX idx_bookings_destination_id ON public.bookings(destination_id);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_reviews_destination_id ON public.reviews(destination_id);
CREATE INDEX idx_reviews_rating ON public.reviews(rating);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER handle_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_destinations
  BEFORE UPDATE ON public.destinations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_bookings
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Insert sample categories
INSERT INTO public.categories (name, description, icon) VALUES
  ('Adventure', 'Thrilling outdoor activities and expeditions', 'mountain'),
  ('Cultural', 'Historical sites and cultural experiences', 'landmark'),
  ('Relaxation', 'Peaceful getaways and wellness retreats', 'spa'),
  ('Wildlife', 'Safari and wildlife viewing experiences', 'binoculars'),
  ('Beach', 'Coastal destinations and island getaways', 'umbrella-beach'),
  ('City', 'Urban exploration and metropolitan experiences', 'city'),
  ('Nature', 'Natural wonders and scenic landscapes', 'tree'),
  ('Food & Wine', 'Culinary experiences and wine tasting', 'wine-glass');

-- Insert sample destinations
INSERT INTO public.destinations (
  name, description, location, country, continent, images, price, rating, duration,
  highlights, included, excluded, difficulty, max_group_size, languages
) VALUES
  (
    'Santorini Sunset Experience',
    'Experience the stunning sunsets and white-washed buildings of this iconic Greek island. Stay in luxury cave hotels and enjoy authentic Mediterranean cuisine.',
    'Santorini', 'Greece', 'Europe',
    ARRAY['/images/santorini-1.jpg', '/images/santorini-2.jpg'],
    1299.00, 4.9, 7,
    ARRAY['Sunset watching from Oia', 'Wine tasting in local vineyards', 'Private yacht cruise', 'Traditional Greek cooking class'],
    ARRAY['7 nights accommodation', 'Daily breakfast', 'Airport transfers', 'Guided tours', 'Welcome dinner'],
    ARRAY['International flights', 'Travel insurance', 'Personal expenses', 'Optional excursions'],
    'Easy', 16, ARRAY['English', 'Greek']
  ),
  (
    'Tokyo Cultural Immersion',
    'Dive into the vibrant culture, technology, and cuisine of Japan''s bustling capital. Experience traditional temples alongside cutting-edge innovation.',
    'Tokyo', 'Japan', 'Asia',
    ARRAY['/images/tokyo-1.jpg', '/images/tokyo-2.jpg'],
    1899.00, 4.8, 10,
    ARRAY['Visit Senso-ji Temple', 'Explore Shibuya Crossing', 'Tea ceremony experience', 'Sushi making workshop'],
    ARRAY['9 nights accommodation', 'Daily breakfast', 'JR Pass for transportation', 'Professional guide', 'Cultural activities'],
    ARRAY['International flights', 'Meals not specified', 'Personal expenses', 'Optional shopping'],
    'Easy', 12, ARRAY['English', 'Japanese']
  ),
  (
    'Machu Picchu Adventure',
    'Explore the ancient Incan citadel nestled high in the Andes Mountains. Trek the Inca Trail and discover one of the world''s most mysterious archaeological sites.',
    'Cusco Region', 'Peru', 'South America',
    ARRAY['/images/machu-picchu-1.jpg', '/images/machu-picchu-2.jpg'],
    1599.00, 4.7, 8,
    ARRAY['Inca Trail trek', 'Machu Picchu exploration', 'Sacred Valley visit', 'Traditional Andean villages'],
    ARRAY['7 nights accommodation', 'All meals during trek', 'Professional guides', 'Entrance fees', 'Porter service'],
    ARRAY['International flights', 'Travel insurance', 'Personal expenses', 'Tips for guides'],
    'Moderate', 8, ARRAY['English', 'Spanish', 'Quechua']
  );

-- Insert sample destination categories
INSERT INTO public.destination_categories (destination_id, category_id)
SELECT d.id, c.id
FROM public.destinations d
CROSS JOIN public.categories c
WHERE (d.name = 'Santorini Sunset Experience' AND c.name IN ('Beach', 'Cultural', 'Relaxation'))
   OR (d.name = 'Tokyo Cultural Immersion' AND c.name IN ('City', 'Cultural', 'Food & Wine'))
   OR (d.name = 'Machu Picchu Adventure' AND c.name IN ('Adventure', 'Nature', 'Cultural'));

-- Create function to update destination ratings
CREATE OR REPLACE FUNCTION public.update_destination_rating(dest_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.destinations
  SET rating = (
    SELECT COALESCE(AVG(rating), 0)
    FROM public.reviews
    WHERE destination_id = dest_id
  )
  WHERE id = dest_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name)
  VALUES (new.id, new.raw_user_meta_data->>'first_name', new.raw_user_meta_data->>'last_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
