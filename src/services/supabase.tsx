import { createClient } from '@supabase/supabase-js';

const supabaseUrl  = import.meta.env.VITE_APP_SUPABASE_URL;
const supabaseAnon = import.meta.env.VITE_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnon) {
  console.error('❌ Variables Supabase manquantes dans .env');
}

// Clé ANON uniquement — RLS protège les données
const supabase = createClient(supabaseUrl, supabaseAnon);

// ================================
// DESTINATIONS
// ================================

export const getDestinations = async (category = null) => {
  let query = supabase
    .from('destinations')
    .select('id, name, slug, category, description, price, rating, reviews_count, image_url, tags, inclusions, featured')
    .eq('active', true)
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false });

  if (category && category !== 'All') {
    query = query.eq('category', category);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const getDestinationBySlug = async (slug) => {
  const { data, error } = await supabase
    .from('destinations')
    .select('*')
    .eq('slug', slug)
    .eq('active', true)
    .single();
  if (error) throw error;
  return data;
};

export const getDestinationById = async (id) => {
  const { data, error } = await supabase
    .from('destinations')
    .select('*')
    .eq('id', id)
    .eq('active', true)
    .single();
  if (error) throw error;
  return data;
};

export const getFeaturedDestinations = async (limit = 3) => {
  const { data, error } = await supabase
    .from('destinations')
    .select('id, name, slug, category, price, rating, reviews_count, image_url, tags')
    .eq('active', true)
    .eq('featured', true)
    .limit(limit);
  if (error) throw error;
  return data;
};

export const getDestinationCategories = async () => {
  const { data, error } = await supabase
    .from('destinations')
    .select('category')
    .eq('active', true);
  if (error) throw error;
  return ['All', ...new Set(data.map(d => d.category))];
};

// ================================
// REVIEWS
// ================================

export const getReviewsByDestination = async (destinationId) => {
  const { data, error } = await supabase
    .from('reviews')
    .select('id, client_name, rating, comment, created_at')
    .eq('destination_id', destinationId)
    .eq('approved', true)
    .order('created_at', { ascending: false })
    .limit(10);
  if (error) throw error;
  return data;
};

export const submitReview = async ({ destinationId, reservationId, name, email, rating, comment }) => {
  const { data, error } = await supabase
    .from('reviews')
    .insert([{
      destination_id:  destinationId,
      reservation_id:  reservationId || null,
      client_name:     name,
      client_email:    email,
      rating,
      comment,
      approved: false
    }])
    .select()
    .single();
  if (error) throw error;
  return data;
};

// ================================
// BLOG POSTS
// ================================

export const getBlogPosts = async (limit = 10) => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, category, image_url, read_time, featured, published_at')
    .eq('published', true)
    .order('published_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
};

export const getFeaturedBlogPost = async () => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .eq('featured', true)
    .single();
  if (error) return null;
  return data;
};

export const getBlogPostBySlug = async (slug) => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();
  if (error) throw error;
  return data;
};

export default supabase;
