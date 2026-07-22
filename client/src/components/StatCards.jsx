import React from 'react';
import { Users, UserPlus, PhoneCall, CheckCircle2, TrendingUp, DollarSign } from 'lucide-react';

export default function StatCards({ summary }) {
  if (!summary) return null;

  const cards = [
    {
      title: 'Total Leads',
      value: summary.totalLeads,
      icon: Users,
      color: '#6366f1',
      bg: 'rgba(99, 102, 241, 0.15)'
    },
    {
      title: 'New Leads',
      value: summary.newLeads,
      icon: UserPlus,
      color: '#8b5cf6',
      bg: 'rgba(139, 92, 246, 0.15)'
    },
    {
      title: 'Active Pipeline',
      value: summary.contactedLeads + summary.inProgressLeads,
      icon: PhoneCall,
      color: '#3b82f6',
      bg: 'rgba(59, 130, 246, 0.15)'
    },
    {
      title: 'Converted Clients',
      value: summary.convertedLeads,
      icon: CheckCircle2,
      color: '#10b981',
      bg: 'rgba(16, 185, 129, 0.15)'
    },
    {
      title: 'Conversion Rate',
      value: `${summary.conversionRate}%`,
      icon: TrendingUp,
      color: '#d946ef',
      bg: 'rgba(217, 70, 239, 0.15)'
    },
    {
      title: 'Won Pipeline Value',
      value: `$${summary.wonPipelineValue.toLocaleString()}`,
      icon: DollarSign,
      color: '#f59e0b',
      bg: 'rgba(245, 158, 11, 0.15)'
    }
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1rem',
      marginBottom: '2rem'
    }}>
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div key={idx} className="glass-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
                {card.title}
              </span>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: card.bg,
                color: card.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Icon size={18} />
              </div>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
              {card.value}
            </div>
          </div>
        );
      })}
    </div>
  );
}
