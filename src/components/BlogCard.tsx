const BlogCard = ({ post, featured = false }) => {
  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  if (featured) {
    return (
      <div style={{
        borderRadius: 4, overflow: 'hidden', background: '#fff',
        boxShadow: '0 4px 24px rgba(0,0,0,0.07)', cursor: 'pointer',
        fontFamily: 'var(--font)',
        transition: 'transform 0.3s'
      }}
        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
      >
        <div style={{ height: 320, overflow: 'hidden' }}>
          <img src={post.image_url} alt={post.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
            onMouseEnter={e => e.target.style.transform = 'scale(1.04)'}
            onMouseLeave={e => e.target.style.transform = 'scale(1)'}
          />
        </div>
        <div style={{ padding: '32px 36px' }}>
          <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
            <span style={{ color: 'var(--gold)', fontSize: 10, letterSpacing: 3, textTransform: 'uppercase' }}>
              {post.category}
            </span>
            <span style={{ color: '#ccc' }}>·</span>
            <span style={{ color: '#aaa', fontSize: 11 }}>{post.read_time}</span>
          </div>
          <h2 style={{ fontSize: 26, fontWeight: 400, color: 'var(--dark)', margin: '0 0 12px', lineHeight: 1.3 }}>
            {post.title}
          </h2>
          <p style={{ fontSize: 15, color: '#666', lineHeight: 1.7, margin: '0 0 20px' }}>{post.excerpt}</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: '#aaa' }}>{formatDate(post.published_at)}</span>
            <span style={{
              color: 'var(--royal)', fontSize: 12, letterSpacing: 2,
              textTransform: 'uppercase', borderBottom: '1px solid var(--royal)', cursor: 'pointer'
            }}>Read More</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      borderRadius: 4, overflow: 'hidden', background: '#fff',
      boxShadow: '0 2px 16px rgba(0,0,0,0.06)', cursor: 'pointer',
      fontFamily: 'var(--font)',
      transition: 'transform 0.3s'
    }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div style={{ height: 200, overflow: 'hidden' }}>
        <img src={post.image_url} alt={post.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
      </div>
      <div style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ color: 'var(--gold)', fontSize: 10, letterSpacing: 3, textTransform: 'uppercase' }}>
            {post.category}
          </span>
          <span style={{ color: '#aaa', fontSize: 11 }}>{post.read_time}</span>
        </div>
        <h3 style={{ fontSize: 18, fontWeight: 500, color: 'var(--dark)', margin: '0 0 10px', lineHeight: 1.3 }}>
          {post.title}
        </h3>
        <p style={{ fontSize: 13, color: '#666', lineHeight: 1.6, margin: '0 0 16px' }}>{post.excerpt}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: '#aaa' }}>{formatDate(post.published_at)}</span>
          <span style={{
            color: 'var(--royal)', fontSize: 11, letterSpacing: 2,
            textTransform: 'uppercase', borderBottom: '1px solid var(--royal)', cursor: 'pointer'
          }}>Read</span>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
