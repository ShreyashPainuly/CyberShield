import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/scan');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f9fafb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 16px 40px'
    }}>
      {/* Background glow */}
      <div style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px', height: '600px',
        background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0
      }} />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 1 }}
      >
        <div className="cs-card" style={{ padding: '32px' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: '48px', height: '48px',
              marginBottom: '16px'
            }}>
              <img src="/logo.png" alt="CyberShield" style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
            </div>
            <h1 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>Welcome Back</h1>
            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Sign in to your CyberShield account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
                Email address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#9ca3af' }} />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="cs-input"
                  placeholder="you@example.com"
                  id="login-email"
                />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#9ca3af' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="cs-input"
                  style={{ paddingRight: '40px' }}
                  placeholder="••••••••"
                  id="login-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: '2px',
                    display: 'flex'
                  }}
                >
                  {showPassword ? <EyeOff style={{ width: '16px', height: '16px' }} /> : <Eye style={{ width: '16px', height: '16px' }} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="cs-btn" id="login-button">
              {loading ? (
                <><Loader2 style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} /> Signing in...</>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0' }}>
            <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase' }}>or</span>
            <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
          </div>

          <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#6b7280' }}>
            Don&apos;t have an account?{' '}
            <Link to="/register" style={{ color: '#059669', fontWeight: 600 }}>Create one</Link>
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '20px', color: '#9ca3af' }}>
          <Lock style={{ width: '12px', height: '12px' }} />
          <span style={{ fontSize: '0.75rem' }}>Secured with end-to-end encryption</span>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
