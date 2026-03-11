import { useState, useEffect, useCallback } from 'react';
import {
  getDestinations,
  getDestinationById,
  getDestinationBySlug,
  getFeaturedDestinations,
  getDestinationCategories,
  getReviewsByDestination,
  getBlogPosts,
  getFeaturedBlogPost
} from '../services/supabase';

// ================================
// useDestinations — liste avec filtre catégorie
// ================================
export const useDestinations = (category = null) => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getDestinations(category);
        setDestinations(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [category]);

  return { destinations, loading, error };
};

// ================================
// useFeaturedDestinations
// ================================
export const useFeaturedDestinations = (limit = 3) => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const data = await getFeaturedDestinations(limit);
        setDestinations(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [limit]);

  return { destinations, loading, error };
};

// ================================
// useDestination — détail par slug ou id
// ================================
export const useDestination = (slugOrId, bySlug = true) => {
  const [destination, setDestination] = useState(null);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);

  useEffect(() => {
    if (!slugOrId) return;
    const fetch = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = bySlug
          ? await getDestinationBySlug(slugOrId)
          : await getDestinationById(slugOrId);
        setDestination(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [slugOrId, bySlug]);

  return { destination, loading, error };
};

// ================================
// useCategories
// ================================
export const useCategories = () => {
  const [categories, setCategories] = useState(['All']);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getDestinationCategories();
        setCategories(data);
      } catch (err) {
        console.error('Categories error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return { categories, loading };
};

// ================================
// useReviews
// ================================
export const useReviews = (destinationId) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!destinationId) return;
    const fetch = async () => {
      try {
        const data = await getReviewsByDestination(destinationId);
        setReviews(data);
      } catch (err) {
        console.error('Reviews error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [destinationId]);

  return { reviews, loading };
};

// ================================
// useBlogPosts
// ================================
export const useBlogPosts = (limit = 10) => {
  const [posts, setPosts]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const data = await getBlogPosts(limit);
        setPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [limit]);

  return { posts, loading, error };
};

// ================================
// useFeaturedPost
// ================================
export const useFeaturedPost = () => {
  const [post, setPost]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getFeaturedBlogPost();
        setPost(data);
      } catch (err) {
        console.error('Featured post error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return { post, loading };
};

// ================================
// useReservation — gère la soumission
// ================================
export const useReservation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [result, setResult]   = useState(null);

  const submitReservation = useCallback(async (formData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Reservation failed');
      setResult(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { submitReservation, loading, error, result };
};
