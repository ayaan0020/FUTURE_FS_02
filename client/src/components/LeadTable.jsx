import React from 'react';
import { Eye, Trash2, MessageSquare, DollarSign, Calendar } from 'lucide-react';

export default function LeadTable({ leads, onSelectLead, onStatusChange, onDeleteLead }) {
  if (!leads || leads.length === 0) {
    return (
      <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        <p style={{ fontSize: '1.1rem', fontWeight: '500', marginBottom: '0.5rem' }}>No leads found</p>
        <p style={{ fontSize: '0.85rem' }}>Try adjusting your search query or filters, or add a new lead.</p>
      </div>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount || 0);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="glass-card" style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.1)' }}>
            <th style={{ padding: '1rem' }}>Lead / Company</th>
            <th style={{ padding: '1rem' }}>Source</th>
            <th style={{ padding: '1rem' }}>Status</th>
            <th style={{ padding: '1rem' }}>Value</th>
            <th style={{ padding: '1rem' }}>Date Added</th>
            <th style={{ padding: '1rem' }}>Follow-ups</th>
            <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr 
              key={lead.id} 
              style={{ borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.15s ease' }}
              className="table-row-hover"
            >
              {/* Name & Company */}
              <td style={{ padding: '1rem' }}>
                <div 
                  onClick={() => onSelectLead(lead.id)}
                  style={{ fontWeight: '600', color: 'var(--text-primary)', cursor: 'pointer' }}
                >
                  {lead.name}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {lead.company ? `${lead.company} • ` : ''}{lead.email}
                </div>
              </td>

              {/* Source */}
              <td style={{ padding: '1rem' }}>
                <span style={{
                  fontSize: '0.78rem',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '12px',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-secondary)'
                }}>
                  {lead.source}
                </span>
              </td>

              {/* Status Select Badge */}
              <td style={{ padding: '1rem' }}>
                <select
                  value={lead.status}
                  onChange={(e) => onStatusChange(lead.id, e.target.value)}
                  className={`badge badge-${lead.status}`}
                  style={{
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    cursor: 'pointer',
                    outline: 'none',
                    paddingRight: '0.5rem'
                  }}
                >
                  <option value="new" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>New</option>
                  <option value="contacted" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>Contacted</option>
                  <option value="in_progress" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>In Progress</option>
                  <option value="converted" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>Converted</option>
                  <option value="lost" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>Lost</option>
                </select>
              </td>

              {/* Estimated Value */}
              <td style={{ padding: '1rem', fontWeight: '600', color: lead.estimated_value > 0 ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                {formatCurrency(lead.estimated_value)}
              </td>

              {/* Date */}
              <td style={{ padding: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {formatDate(lead.created_at)}
              </td>

              {/* Follow-up Notes Count */}
              <td style={{ padding: '1rem' }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)'
                }}>
                  <MessageSquare size={14} />
                  {lead.notes_count || 0}
                </span>
              </td>

              {/* Actions */}
              <td style={{ padding: '1rem', textAlign: 'right' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
                  <button
                    onClick={() => onSelectLead(lead.id)}
                    className="btn btn-secondary btn-sm"
                    title="View details & activity timeline"
                  >
                    <Eye size={15} />
                    <span>View</span>
                  </button>

                  <button
                    onClick={() => onDeleteLead(lead.id)}
                    className="btn btn-danger btn-sm"
                    title="Delete lead"
                    style={{ padding: '0.4rem' }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
