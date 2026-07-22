import React, { useState, useEffect } from 'react';
import { BarChart3, PieChart, Activity, Award, TrendingUp, DollarSign, RefreshCw } from 'lucide-react';
import { api } from '../services/api';

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await api.analytics.getSummary();
      setData(res);
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading CRM Analytics & Performance Metrics...
      </div>
    );
  }

  if (!data) return null;

  const { summary, statusBreakdown, sourceBreakdown, recentActivities } = data;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: '800' }}>Sales & Lead Analytics</h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            Real-time pipeline metrics, lead acquisition sources, and conversion trends.
          </p>
        </div>
        <button onClick={fetchAnalytics} className="btn btn-secondary btn-sm">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Conversion Banner */}
      <div className="glass-card" style={{
        padding: '1.75rem',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(217, 70, 239, 0.15) 100%)',
        border: '1px solid var(--border-highlight)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div>
          <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--accent-primary)', textTransform: 'uppercase' }}>
            PERFORMANCE HIGHLIGHT
          </span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', margin: '0.2rem 0' }}>
            {summary.conversionRate}% Conversion Rate
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            {summary.convertedLeads} out of {summary.totalLeads} website leads successfully converted into paying clients.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '2rem' }}>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Total Pipeline Value</div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-primary)' }}>
              ${summary.totalPipelineValue.toLocaleString()}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Won Revenue</div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--status-converted)' }}>
              ${summary.wonPipelineValue.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Grid Charts / Breakdowns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        
        {/* Status Pipeline Breakdown */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BarChart3 size={18} color="var(--accent-primary)" />
            Lead Status Distribution
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            {[
              { label: 'New Uncontacted', key: 'new', color: 'var(--status-new)' },
              { label: 'Contacted', key: 'contacted', color: 'var(--status-contacted)' },
              { label: 'In Progress / Proposal', key: 'in_progress', color: 'var(--status-in_progress)' },
              { label: 'Converted Client', key: 'converted', color: 'var(--status-converted)' },
              { label: 'Lost Lead', key: 'lost', color: 'var(--status-lost)' }
            ].map(item => {
              const count = statusBreakdown[item.key] || 0;
              const percentage = summary.totalLeads > 0 ? ((count / summary.totalLeads) * 100).toFixed(0) : 0;
              return (
                <div key={item.key}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                    <span>{item.label}</span>
                    <span style={{ fontWeight: '600' }}>{count} ({percentage}%)</span>
                  </div>
                  <div style={{ height: '8px', background: 'var(--bg-input)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${percentage}%`, height: '100%', background: item.color, transition: 'width 0.4s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Acquisition Source Breakdown */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <PieChart size={18} color="var(--accent-primary)" />
            Leads by Acquisition Channel
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {sourceBreakdown.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No source data recorded.</div>
            ) : (
              sourceBreakdown.map((src, i) => {
                const percent = summary.totalLeads > 0 ? ((src.count / summary.totalLeads) * 100).toFixed(0) : 0;
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)' }}>
                    <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{src.source}</span>
                    <span style={{
                      background: 'var(--bg-input)',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      fontWeight: '700',
                      color: 'var(--accent-primary)'
                    }}>
                      {src.count} leads ({percent}%)
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Activity Stream */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity size={18} color="var(--accent-primary)" />
          Recent Lead Activity Stream
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {recentActivities.map((act) => (
            <div key={act.id} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.75rem 1rem',
              background: 'var(--bg-primary)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem'
            }}>
              <div>
                <span style={{ fontWeight: '600', color: 'var(--text-primary)', marginRight: '0.5rem' }}>
                  {act.lead_name} {act.lead_company ? `(${act.lead_company})` : ''}:
                </span>
                <span style={{ color: 'var(--text-secondary)' }}>{act.content}</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {new Date(act.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
