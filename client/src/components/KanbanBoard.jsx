import React from 'react';
import { ChevronRight, ChevronLeft, MessageSquare, DollarSign, Phone, Mail } from 'lucide-react';

const STAGES = [
  { id: 'new', label: 'New Leads', color: 'var(--status-new)', bg: 'var(--status-new-bg)' },
  { id: 'contacted', label: 'Contacted', color: 'var(--status-contacted)', bg: 'var(--status-contacted-bg)' },
  { id: 'in_progress', label: 'In Progress', color: 'var(--status-in_progress)', bg: 'var(--status-in_progress-bg)' },
  { id: 'converted', label: 'Converted Client', color: 'var(--status-converted)', bg: 'var(--status-converted-bg)' },
  { id: 'lost', label: 'Lost', color: 'var(--status-lost)', bg: 'var(--status-lost-bg)' }
];

export default function KanbanBoard({ leads, onSelectLead, onStatusChange }) {
  const getStageNext = (current) => {
    const idx = STAGES.findIndex(s => s.id === current);
    return idx < STAGES.length - 1 ? STAGES[idx + 1].id : null;
  };

  const getStagePrev = (current) => {
    const idx = STAGES.findIndex(s => s.id === current);
    return idx > 0 ? STAGES[idx - 1].id : null;
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '1rem',
      alignItems: 'start',
      overflowX: 'auto',
      paddingBottom: '1rem'
    }}>
      {STAGES.map((stage) => {
        const stageLeads = leads.filter(l => l.status === stage.id);
        const stageTotalValue = stageLeads.reduce((acc, curr) => acc + (curr.estimated_value || 0), 0);

        return (
          <div key={stage.id} className="glass-card" style={{ padding: '1rem', minHeight: '500px', display: 'flex', flexDirection: 'column' }}>
            {/* Column Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: '0.75rem',
              marginBottom: '1rem',
              borderBottom: '2px solid ' + stage.color
            }}>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                  {stage.label}
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  ${stageTotalValue.toLocaleString()} pipeline
                </span>
              </div>
              <span style={{
                background: stage.bg,
                color: stage.color,
                fontSize: '0.8rem',
                fontWeight: '700',
                padding: '0.2rem 0.5rem',
                borderRadius: '12px'
              }}>
                {stageLeads.length}
              </span>
            </div>

            {/* Cards Container */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
              {stageLeads.length === 0 ? (
                <div style={{
                  padding: '2rem 1rem',
                  textAlign: 'center',
                  color: 'var(--text-muted)',
                  fontSize: '0.8rem',
                  border: '1px dashed var(--border-color)',
                  borderRadius: 'var(--radius-sm)'
                }}>
                  No leads in this stage
                </div>
              ) : (
                stageLeads.map((lead) => {
                  const nextStage = getStageNext(lead.status);
                  const prevStage = getStagePrev(lead.status);

                  return (
                    <div 
                      key={lead.id} 
                      style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '0.9rem',
                        boxShadow: 'var(--shadow-sm)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                        transition: 'transform 0.15s ease, border-color 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div 
                          onClick={() => onSelectLead(lead.id)} 
                          style={{ cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-primary)' }}
                        >
                          {lead.name}
                        </div>
                        {lead.estimated_value > 0 && (
                          <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--status-converted)' }}>
                            ${lead.estimated_value.toLocaleString()}
                          </span>
                        )}
                      </div>

                      {lead.company && (
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {lead.company}
                        </div>
                      )}

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        <span style={{ background: 'var(--bg-input)', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>
                          {lead.source}
                        </span>
                      </div>

                      {/* Card Footer controls */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: '0.5rem',
                        paddingTop: '0.5rem',
                        borderTop: '1px solid var(--border-color)'
                      }}>
                        <button 
                          onClick={() => onSelectLead(lead.id)}
                          style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontSize: '0.78rem', fontWeight: '600', cursor: 'pointer' }}
                        >
                          View Details
                        </button>

                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                          {prevStage && (
                            <button
                              onClick={() => onStatusChange(lead.id, prevStage)}
                              title={`Move back to ${prevStage}`}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '0.2rem 0.4rem' }}
                            >
                              <ChevronLeft size={14} />
                            </button>
                          )}
                          {nextStage && (
                            <button
                              onClick={() => onStatusChange(lead.id, nextStage)}
                              title={`Advance to ${nextStage}`}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '0.2rem 0.4rem' }}
                            >
                              <ChevronRight size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
