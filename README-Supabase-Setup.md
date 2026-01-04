# TravelExplorer - Supabase Database Setup

## 🚀 Database Setup Instructions

### Step 1: Access Supabase Dashboard
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sign in to your account
3. Select your project: `fqapjpwqsoxaybrexrtd`

### Step 2: Run SQL Setup
1. In your Supabase dashboard, go to **SQL Editor**
2. Copy and paste the contents of `supabase-setup.sql` into the SQL Editor
3. Click **Run** to execute the database setup

### Step 3: Verify Setup
After running the SQL, you should see:
- ✅ Tables created: `profiles`, `destinations`, `bookings`, `reviews`, `categories`, `destination_categories`
- ✅ Row Level Security policies applied
- ✅ Sample data inserted (3 destinations, 8 categories)
- ✅ Indexes created for performance

## 📊 Database Schema Overview

### Core Tables:
- **profiles** - User profiles (extends Supabase auth)
- **destinations** - Travel destinations with details
- **bookings** - User bookings and reservations
- **reviews** - User reviews and ratings
- **categories** - Destination categories (Adventure, Cultural, etc.)

### Key Features:
- 🔒 **Row Level Security** - Users can only access their own data
- 🔑 **Authentication Integration** - Automatic profile creation on signup
- ⭐ **Rating System** - Automatic rating calculation from reviews
- 📝 **Audit Trail** - Created/updated timestamps on all records

## 🔧 Manual Setup (Alternative)

If the SQL file doesn't work, you can create tables manually in the Supabase dashboard:

### 1. Create Tables

**profiles table:**
```sql
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  date_of_birth DATE,
  nationality TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
```

**destinations table:**
```sql
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
  duration INTEGER NOT NULL,
  highlights TEXT[] DEFAULT '{}',
  included TEXT[] DEFAULT '{}',
  excluded TEXT[] DEFAULT '{}',
  difficulty TEXT DEFAULT 'Easy',
  max_group_size INTEGER DEFAULT 20,
  languages TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
```

**bookings table:**
```sql
CREATE TABLE public.bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  destination_id UUID REFERENCES public.destinations(id) ON DELETE CASCADE NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  number_of_travelers INTEGER NOT NULL DEFAULT 1,
  total_price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'pending',
  payment_status TEXT DEFAULT 'pending',
  special_requests TEXT,
  contact_info JSONB NOT NULL,
  traveler_details JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
```

### 2. Enable Row Level Security
For each table, go to **Authentication > Policies** and create policies:

**For profiles table:**
- SELECT: `auth.uid() = id`
- UPDATE: `auth.uid() = id`
- INSERT: `auth.uid() = id`

**For destinations table:**
- SELECT: `is_active = true` (public read)
- ALL: Admin only (for management)

**For bookings table:**
- SELECT: `auth.uid() = user_id`
- INSERT: `auth.uid() = user_id`
- UPDATE: `auth.uid() = user_id`

### 3. Add Sample Data
Use the Table Editor to add sample destinations and categories.

## 🎯 Next Steps After Setup

Once your database is set up:

1. **Test the connection** - Your website should now connect to Supabase
2. **Create authentication pages** - Login/register forms
3. **Build booking system** - Complete booking flow
4. **Add admin panel** - Content management interface

## 🔗 Useful Links

- [Supabase Dashboard](https://supabase.com/dashboard)
- [Supabase Docs](https://supabase.com/docs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

## 🆘 Troubleshooting

If you encounter issues:
1. Check the Supabase dashboard for error messages
2. Verify your environment variables in `.env.local`
3. Check browser console for client-side errors
4. Check server logs for API errors

Need help? Check the Supabase documentation or reach out for support!
