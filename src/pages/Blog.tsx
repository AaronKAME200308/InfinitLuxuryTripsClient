import { useBlogPosts, useFeaturedPost } from '../hooks';
import { useReveal } from '../hooks/useAnimations';
import BlogCard from '../components/BlogCard';
import { PageHeader, LoadingSpinner, ErrorMessage, SectionLabel } from '../components/UI';

const Blog = () => {
  const { post: featured }        = useFeaturedPost();
  const { posts, loading, error } = useBlogPosts(12);
  const gridRef = useReveal({ threshold: 0.05 });
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
        {loading ? <LoadingSpinner message="Loading articles" /> :
         error   ? <ErrorMessage message={error} /> : (
          <>
            {/* Featured + 2 récents */}
            {posts.length > 0 && (
              <div style={{
                display: 'grid', gridTemplateColumns: '1.6fr 1fr',
                gap: 32, marginBottom: 64,
                animation: 'fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s both'
              }}>
                <BlogCard post={featured || posts[0]} featured index={0} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  {(featured ? posts.slice(0, 2) : posts.slice(1, 3)).map((post, i) => (
                    <BlogCard key={post.id} post={post} index={i + 1} />
                  ))}
                </div>
              </div>
            )}

            {/* Ornement séparateur */}
            {otherPosts.length > 2 && (
              <>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 20, marginBottom: 48,
                  animation: 'fadeIn 0.6s ease 0.3s both'
                }}>
                  <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.3))' }}/>
                  <div style={{ color: 'var(--gold)', fontSize: 10, letterSpacing: 5, textTransform: 'uppercase' }}>
                    More Stories
                  </div>
                  <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left, transparent, rgba(201,168,76,0.3))' }}/>
                </div>

                <div ref={gridRef} className="reveal" style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: 32
                }}>
                  {otherPosts.slice(2).map((post, i) => (
                    <BlogCard key={post.id} post={post} index={i} />
                  ))}
                </div>
              </>
            )}

            {posts.length === 0 && (
              <div style={{ textAlign: 'center', padding: '80px 0' }}>
                <div style={{ color: 'var(--gold)', fontSize: 36, marginBottom: 16 }}>◇</div>
                <div style={{ color: '#aaa', fontSize: 13, letterSpacing: 3, textTransform: 'uppercase' }}>
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
