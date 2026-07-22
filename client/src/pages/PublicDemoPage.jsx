import React, { useState } from 'react';
import { Send, CheckCircle2, Sparkles, Globe, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';

export default function PublicDemoPage({ onLeadSubmitted }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    source: 'Website Contact Form Demo',
    estimated_value: 12000,
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      alert('Please provide your name and email address.');
      return;
    }

    try {
      setLoading(true);
      await api.public.submitContact(formData);
      setSubmitted(true);
      if (onLeadSubmitted) onLeadSubmitted();
    } catch (err) {
      alert('Failed to submit contact form: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      source: 'Website Contact Form Demo',
      estimated_value: 12000,
      message: ''
    });
    setSubmitted(false);
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem', background: 'var(--bg-card)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <Globe size={22} color="var(--accent-primary)" />
          <h2 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Live Website Lead Capture Simulator</h2>
        </div>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          This page simulates an external client-facing landing page or contact form. Submitting this form calls the public backend endpoint 
          <code style={{ background: 'var(--bg-input)', padding: '0.15rem 0.4rem', borderRadius: '4px', margin: '0 0.3rem', color: 'var(--accent-primary)' }}>POST /api/public/contact</code> 
          and instantly ingests a new lead into your CRM dashboard!
        </p>
      </div>

      {/* Simulated Website Contact Card */}
      <div className="glass-card" style={{ padding: '2.5rem', background: 'var(--bg-secondary)' }}>
        {submitted ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'var(--status-converted-bg)',
              color: 'var(--status-converted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto'
            }}>
              <CheckCircle2 size={32} />
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '0.5rem' }}>
              Lead Successfully Submitted!
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', maxWidth: '500px', margin: '0 auto 1.5rem auto' }}>
              Your inquiry has been stored in the CRM database under status <strong>"NEW"</strong>. Switch to the <strong>"Lead Pipeline"</strong> tab in the sidebar to view, manage, and follow up on this lead.
            </p>
            <button onClick={handleReset} className="btn btn-primary">
              Submit Another Test Lead
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--accent-primary)', fontWeight: '700', letterSpacing: '0.05em' }}>
                CLIENT CONTACT FORM
              </span>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '700' }}>Get in Touch for a Custom Proposal</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '500', display: 'block', marginBottom: '0.4rem' }}>
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Miller"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '500', display: 'block', marginBottom: '0.4rem' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="jordan@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '500', display: 'block', marginBottom: '0.4rem' }}>
                  Phone Number
                </label>
                <input
                  type="text"
                  placeholder="+1 (555) 123-4567"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '500', display: 'block', marginBottom: '0.4rem' }}>
                  Company Name
                </label>
                <input
                  type="text"
                  placeholder="Acme Innovations"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: '500', display: 'block', marginBottom: '0.4rem' }}>
                Estimated Project Budget ($)
              </label>
              <input
                type="number"
                placeholder="15000"
                value={formData.estimated_value}
                onChange={(e) => setFormData({ ...formData, estimated_value: parseFloat(e.target.value) || 0 })}
                className="input-field"
              />
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: '500', display: 'block', marginBottom: '0.4rem' }}>
                Project Description / Message
              </label>
              <textarea
                rows={4}
                placeholder="Tell us about your goals, timeline, and deliverables..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="textarea-field"
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                <ShieldCheck size={16} color="var(--status-converted)" />
                Direct API Connection Active
              </div>

              <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
                {loading ? 'Submitting...' : 'Send Request'}
                <Send size={16} />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
