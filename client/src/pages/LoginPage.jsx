import React, { useState } from 'react';
import { Sparkles, Lock, Mail, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@crm.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      setLoading(true);
      await login(email, password);
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail('admin@crm.com');
    setPassword('admin123');
    try {
      setLoading(true);
      await login('admin@crm.com', 'admin123');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      background: 'radial-gradient(circle at top left, #1e1b4b 0%, #0b0f19 60%)'
    }}>
      <div className="glass-card animate-fade-in" style={{
        width: '100%',
        maxWidth: '440px',
        padding: '2.5rem',
        background: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-xl)'
      }}>
        {/* Brand Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            background: 'var(--accent-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            margin: '0 auto 1rem auto',
            boxShadow: 'var(--shadow-glow)'
          }}>
            <Sparkles size={28} />
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: '800', marginBottom: '0.3rem' }}>LeadFlow CRM</h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Secure Admin Access Panel</p>
        </div>

        {error && (
          <div style={{
            background: 'var(--status-lost-bg)',
            border: '1px solid var(--status-lost)',
            color: 'var(--status-lost)',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.85rem',
            marginBottom: '1.25rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem', fontWeight: '500' }}>
              Admin Email
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                style={{ paddingLeft: '2.5rem' }}
              />
              <Mail size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem', fontWeight: '500' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                style={{ paddingLeft: '2.5rem' }}
              />
              <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: '0.85rem', width: '100%', fontSize: '0.95rem', marginTop: '0.5rem' }}>
            {loading ? 'Authenticating...' : 'Log In to Admin Dashboard'}
            <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ margin: '1.5rem 0', textAlign: 'center', borderTop: '1px solid var(--border-color)', position: 'relative' }}>
          <span style={{
            position: 'absolute',
            top: '-0.7rem',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--bg-secondary)',
            padding: '0 0.5rem',
            fontSize: '0.75rem',
            color: 'var(--text-muted)'
          }}>
            OR
          </span>
        </div>

        <button 
          onClick={handleDemoLogin} 
          disabled={loading} 
          className="btn btn-secondary" 
          style={{ width: '100%', padding: '0.75rem', fontSize: '0.88rem' }}
        >
          1-Click Quick Demo Login (admin@crm.com)
        </button>
      </div>
    </div>
  );
}
