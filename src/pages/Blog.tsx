import { useBlogPosts, useFeaturedPost } from '../hooks';
import BlogCard from '../components/BlogCard';
import { PageHeader, LoadingSpinner, ErrorMessage } from '../components/UI';

const Blog = () => {
  const { post: featured }         = useFeaturedPost();
  const { posts, loading, error }  = useBlogPosts(12);

  // Posts non-featured
  const otherPosts = posts.filter(p => !p.featured);

  return (
    <div style={{ background: 'var(--cream)', minHeight: '100vh', fontFamily: 'var(--font)' }}>
      <PageHeader
        label="Stories & Insights"
        title="The ILT"
        highlight="Journal"
        imageUrl="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1400&q=80"
      />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 48px' }}>
        {loading ? (
          <LoadingSpinner message="Loading articles" />
        ) : error ? (
          <ErrorMessage message={error} />
        ) : (
          <>
            {/* Featured post + latest two */}
            {(featured || posts.length > 0) && (
              <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 32, marginBottom: 52 }}>
                <BlogCard post={featured || posts[0]} featured />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  {(featured ? posts.slice(0, 2) : posts.slice(1, 3)).map(post => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>
              </div>
            )}

            {/* Remaining posts */}
            {otherPosts.length > 2 && (
              <>
                <div style={{ height: 1, background: 'rgba(201,168,76,0.2)', marginBottom: 48 }}/>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: 32
                }}>
                  {otherPosts.slice(2).map(post => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>
              </>
            )}

            {posts.length === 0 && (
              <div style={{ textAlign: 'center', padding: '80px 0', color: '#aaa' }}>
                <div style={{ fontSize: 13, letterSpacing: 3, textTransform: 'uppercase' }}>
                  No articles published yet
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Blog;
