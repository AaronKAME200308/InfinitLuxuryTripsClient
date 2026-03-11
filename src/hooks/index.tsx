import { useState, useEffect, useCallback } from "react"
import {
  getDestinations,
  getDestinationById,
  getDestinationBySlug,
  getFeaturedDestinations,
  getDestinationCategories,
  getReviewsByDestination,
  getBlogPosts,
  getFeaturedBlogPost
} from "../services/supabase"


// ================================
// TYPES
// ================================

type FetchState<T> = {
  data: T
  loading: boolean
  error: string | null
}

// ================================
// useDestinations
// ================================

export const useDestinations = (category?: string | null) => {
  const [state, setState] = useState<FetchState<any[]>>({
    data: [],
    loading: true,
    error: null
  })

  useEffect(() => {
    let mounted = true

    const fetchData = async () => {
      try {
        const data = await getDestinations(category)

        if (mounted) {
          setState({
            data,
            loading: false,
            error: null
          })
        }
      } catch (err: any) {
        if (mounted) {
          setState({
            data: [],
            loading: false,
            error: err.message
          })
        }
      }
    }

    fetchData()

    return () => {
      mounted = false
    }
  }, [category])

  return {
    destinations: state.data,
    loading: state.loading,
    error: state.error
  }
}

// ================================
// useFeaturedDestinations
// ================================

export const useFeaturedDestinations = (limit = 3) => {
  const [state, setState] = useState<FetchState<any[]>>({
    data: [],
    loading: true,
    error: null
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getFeaturedDestinations(limit)

        setState({
          data,
          loading: false,
          error: null
        })
      } catch (err: any) {
        setState({
          data: [],
          loading: false,
          error: err.message
        })
      }
    }

    fetchData()
  }, [limit])

  return {
    destinations: state.data,
    loading: state.loading,
    error: state.error
  }
}

// ================================
// useDestination
// ================================

export const useDestination = (
  slugOrId: string ,
  bySlug = true
) => {
  const [state, setState] = useState<FetchState<any | null>>({
    data: null,
    loading: true,
    error: null
  })

  useEffect(() => {
    if (!slugOrId) return

    const fetchData = async () => {
      try {
        const data = bySlug
          ? await getDestinationBySlug(slugOrId)
          : await getDestinationById(slugOrId)

        setState({
          data,
          loading: false,
          error: null
        })
      } catch (err: any) {
        setState({
          data: null,
          loading: false,
          error: err.message
        })
      }
    }

    fetchData()
  }, [slugOrId, bySlug])

  return {
    destination: state.data,
    loading: state.loading,
    error: state.error
  }
}

// ================================
// useCategories
// ================================

export const useCategories = () => {
  const [categories, setCategories] = useState<string[]>(["All"])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDestinationCategories()
        setCategories(data)
      } catch (err) {
        console.error("Categories error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { categories, loading }
}

// ================================
// useReviews
// ================================

export const useReviews = (destinationId?: string) => {
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!destinationId) return

    const fetchData = async () => {
      try {
        const data = await getReviewsByDestination(destinationId)
        setReviews(data)
      } catch (err) {
        console.error("Reviews error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [destinationId])

  return { reviews, loading }
}

// ================================
// useBlogPosts
// ================================

export const useBlogPosts = (limit = 10) => {
  const [state, setState] = useState<FetchState<any[]>>({
    data: [],
    loading: true,
    error: null
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getBlogPosts(limit)

        setState({
          data,
          loading: false,
          error: null
        })
      } catch (err: any) {
        setState({
          data: [],
          loading: false,
          error: err.message
        })
      }
    }

    fetchData()
  }, [limit])

  return {
    posts: state.data,
    loading: state.loading,
    error: state.error
  }
}

// ================================
// useFeaturedPost
// ================================

export const useFeaturedPost = () => {
  const [post, setPost] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getFeaturedBlogPost()
        setPost(data)
      } catch (err) {
        console.error("Featured post error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { post, loading }
}

// ================================
// useReservation
// ================================

export const useReservation = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<any>(null)

  const submitReservation = useCallback(async (formData: any) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/reservations`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Reservation failed")
      }

      setResult(data)

      return data
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { submitReservation, loading, error, result }
}