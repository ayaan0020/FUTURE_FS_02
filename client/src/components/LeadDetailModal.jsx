import React, { useState, useEffect } from 'react';
import { X, Mail, Phone, Building, Calendar, DollarSign, MessageSquare, Send, PhoneCall, Video, Tag, Activity } from 'lucide-react';
import { api } from '../services/api';

export default function LeadDetailModal({ leadId, onClose, onLeadUpdated }) {
  const [lead, setLead] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noteContent, setNoteContent] = useState('');
  const [noteType, setNoteType] = useState('note');
  const [submittingNote, setSubmittingNote] = useState(false);

  useEffect(() => {
    async function fetchLeadDetails() {
      if (!leadId) return;
      try {
        setLoading(true);
        const data = await api.leads.getById(leadId);
        setLead(data.lead);
        setNotes(data.notes);
      } catch (err) {
        console.error('Error loading lead detail:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchLeadDetails();
  }, [leadId]);

  const handleStatusChange = async (newStatus) => {
    try {
      const res = await api.leads.updateStatus(leadId, newStatus);
      setLead(res.lead);
      // Refresh notes list to include status change log
      const data = await api.leads.getById(leadId);
      setNotes(data.notes);
      if (onLeadUpdated) onLeadUpdated();
    } catch (err) {
      alert('Failed to update lead status: ' + err.message);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteContent.trim()) return;

    try {
      setSubmittingNote(true);
      const res = await api.leads.addNote(leadId, { content: noteContent, type: noteType });
      setNotes(prev => [res.note, ...prev]);
      setNoteContent('');
      if (onLeadUpdated) onLeadUpdated();
    } catch (err) {
      alert('Failed to add note: ' + err.message);
    } finally {
      setSubmittingNote(false);
    }
  };

  if (!leadId) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div className="glass-card animate-fade-in" style={{
        width: '100%',
        maxWidth: '750px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        background: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-lg)'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-primary)'
        }}>
          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Lead Overview & Timeline
            </span>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              {loading ? 'Loading lead details...' : lead?.name}
            </h2>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.4rem' }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Modal Body */}
        {loading || !lead ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading lead profile and activity history...
          </div>
        ) : (
          <div style={{ display: 'flex', flex: 1, overflowY: 'auto' }}>
            {/* Left Column: Details & Status */}
            <div style={{ width: '45%', padding: '1.5rem', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* Status Selector */}
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
                  Pipeline Stage / Status
                </label>
                <select
                  value={lead.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className={`select-field badge-${lead.status}`}
                  style={{ fontWeight: '600', cursor: 'pointer' }}
                >
                  <option value="new">New Lead</option>
                  <option value="contacted">Contacted</option>
                  <option value="in_progress">In Progress</option>
                  <option value="converted">Converted Client</option>
                  <option value="lost">Lost</option>
                </select>
              </div>

              {/* Contact Information */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem' }}>
                  <Mail size={16} color="var(--accent-primary)" />
                  <a href={`mailto:${lead.email}`} style={{ color: 'var(--text-primary)', textDecoration: 'none' }}>{lead.email}</a>
                </div>

                {lead.phone && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem' }}>
                    <Phone size={16} color="var(--accent-primary)" />
                    <a href={`tel:${lead.phone}`} style={{ color: 'var(--text-primary)', textDecoration: 'none' }}>{lead.phone}</a>
                  </div>
                )}

                {lead.company && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem' }}>
                    <Building size={16} color="var(--accent-primary)" />
                    <span>{lead.company}</span>
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem' }}>
                  <Tag size={16} color="var(--accent-primary)" />
                  <span>Source: <strong>{lead.source}</strong></span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem' }}>
                  <DollarSign size={16} color="var(--status-converted)" />
                  <span>Est. Value: <strong>${(lead.estimated_value || 0).toLocaleString()}</strong></span>
                </div>
              </div>

              {/* Message from Contact Form */}
              {lead.message && (
                <div style={{
                  background: 'var(--bg-primary)',
                  padding: '1rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)'
                }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.3rem', fontWeight: '600' }}>Initial Message</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>
                    "{lead.message}"
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Follow-up Timeline & Note Input */}
            <div style={{ flex: 1, padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Activity size={18} color="var(--accent-primary)" />
                Follow-up Activity Timeline
              </h3>

              {/* Add Note Form */}
              <form onSubmit={handleAddNote} style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setNoteType('note')}
                    className={`btn btn-sm ${noteType === 'note' ? 'btn-primary' : 'btn-secondary'}`}
                  >
                    <MessageSquare size={14} /> Note
                  </button>
                  <button
                    type="button"
                    onClick={() => setNoteType('call')}
                    className={`btn btn-sm ${noteType === 'call' ? 'btn-primary' : 'btn-secondary'}`}
                  >
                    <PhoneCall size={14} /> Call
                  </button>
                  <button
                    type="button"
                    onClick={() => setNoteType('email')}
                    className={`btn btn-sm ${noteType === 'email' ? 'btn-primary' : 'btn-secondary'}`}
                  >
                    <Mail size={14} /> Email
                  </button>
                  <button
                    type="button"
                    onClick={() => setNoteType('meeting')}
                    className={`btn btn-sm ${noteType === 'meeting' ? 'btn-primary' : 'btn-secondary'}`}
                  >
                    <Video size={14} /> Meeting
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <textarea
                    rows={2}
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    placeholder={`Log ${noteType} or follow-up note...`}
                    className="textarea-field"
                    style={{ resize: 'none' }}
                  />
                  <button 
                    type="submit" 
                    disabled={submittingNote || !noteContent.trim()}
                    className="btn btn-primary"
                    style={{ alignSelf: 'flex-end', padding: '0.6rem 1rem' }}
                  >
                    <Send size={16} />
                  </button>
                </div>
              </form>

              {/* Notes Timeline Feed */}
              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingRight: '0.25rem' }}>
                {notes.length === 0 ? (
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem' }}>
                    No activity logged yet. Add a note above.
                  </div>
                ) : (
                  notes.map((note) => (
                    <div 
                      key={note.id} 
                      style={{
                        background: 'var(--bg-primary)',
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-color)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.78rem' }}>
                        <span style={{ fontWeight: '600', color: 'var(--accent-primary)' }}>
                          {note.author} ({note.type.toUpperCase()})
                        </span>
                        <span style={{ color: 'var(--text-muted)' }}>
                          {new Date(note.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                        {note.content}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
