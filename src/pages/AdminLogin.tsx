import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, Eye, EyeOff, AlertCircle } from 'lucide-react';
import supabase from '../services/supabase';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPwd,  setShowPwd]  = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  const handleLogin = async () => {
    if (!email || !password) { setError('Email and password are required'); return; }
    setLoading(true); setError('');
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw authError;
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError('Invalid credentials. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const field: React.CSSProperties = {
    width: '100%', padding: '12px 16px 12px 42px', borderRadius: 12, fontSize: 14,
    border: '1.5px solid var(--royal-border)', background: 'var(--bg)',
    fontFamily: 'var(--font-body)', color: 'var(--text)', boxSizing: 'border-box',
    outline: 'none', transition: 'border-color 0.2s',
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: '#0D0B28', fontFamily: 'var(--font-body)' }}>

      {/* Glow */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
        <div style={{ width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,166,35,0.07) 0%, transparent 60%)' }} />
      </div>

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="w-full max-w-sm relative">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4" style={{ width: 72, height: 72 }}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 rounded-full" style={{ border: '1.5px dashed rgba(245,166,35,0.4)' }} />
            <div className="absolute rounded-full" style={{ inset: 6, border: '1px solid rgba(245,166,35,0.6)' }} />
            <div className="absolute rounded-full" style={{ inset: 10, background: 'linear-gradient(135deg,#1A1650,#0D0B28)' }} />
            <img src="/logoilt.jpeg" alt="ILT" className="absolute object-cover rounded-full"
              style={{ inset: 10, width: 'calc(100% - 20px)', height: 'calc(100% - 20px)' }} />
          </div>
          <div className="font-bold text-white text-lg" style={{ fontFamily: 'var(--font-display)', letterSpacing: '1px' }}>
            Admin Portal
          </div>
          <div className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-display)', letterSpacing: '2px' }}>
            INFINITE LUXURY TRIPS
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl overflow-hidden"
          style={{ background: '#fff', border: '1.5px solid rgba(245,166,35,0.15)', boxShadow: '0 32px 80px rgba(0,0,0,0.4)' }}>

          {/* Header */}
          <div className="px-6 py-5" style={{ background: 'var(--royal)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}>
                <Lock size={16} color="#fff" />
              </div>
              <div>
                <div className="font-bold text-base text-white" style={{ fontFamily: 'var(--font-display)' }}>Secure Login</div>
                <div className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Restricted to administrators only</div>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Email */}
            <div className="mb-4">
              <label className="block text-xs font-bold uppercase tracking-wider mb-2"
                style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}>Email</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-3)' }} />
                <input type="email" placeholder="admin@infiniteluxurytrips.net"
                  value={email} onChange={e => { setEmail(e.target.value); setError(''); }}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  style={field} />
              </div>
            </div>

            {/* Password */}
            <div className="mb-5">
              <label className="block text-xs font-bold uppercase tracking-wider mb-2"
                style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}>Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-3)' }} />
                <input type={showPwd ? 'text' : 'password'} placeholder="••••••••"
                  value={password} onChange={e => { setPassword(e.target.value); setError(''); }}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  style={{ ...field, paddingRight: 42 }} />
                <button onClick={() => setShowPwd(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--text-3)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 rounded-xl mb-4 text-xs"
                style={{ background: 'var(--error-soft)', color: 'var(--error)', border: '1px solid #FECACA' }}>
                <AlertCircle size={13} /> {error}
              </motion.div>
            )}

            {/* Button */}
            <motion.button onClick={handleLogin} disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm"
              style={{
                background: loading ? 'rgba(48,36,112,0.6)' : 'var(--royal)',
                color: '#fff', fontFamily: 'var(--font-display)',
                border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 16px rgba(48,36,112,0.3)',
              }}
              whileHover={!loading ? { scale: 1.02 } : {}} whileTap={!loading ? { scale: 0.98 } : {}}>
              <Lock size={14} />
              {loading ? 'Signing in...' : 'Sign in'}
            </motion.button>

            <p className="text-center text-xs mt-4" style={{ color: 'var(--text-3)' }}>
              Restricted access · Infinite Luxury Trips © 2026
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;