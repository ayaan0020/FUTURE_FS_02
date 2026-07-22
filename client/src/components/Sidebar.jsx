import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  ExternalLink, 
  LogOut, 
  Sun, 
  Moon, 
  Sparkles,
  Kanban
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ activeTab, setActiveTab, mobileOpen, setMobileOpen }) {
  const { user, logout, theme, toggleTheme } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'leads', label: 'Lead Pipeline', icon: Users },
    { id: 'kanban', label: 'Kanban Board', icon: Kanban },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'public-demo', label: 'Website Form Demo', icon: ExternalLink, highlight: true }
  ];

  return (
    <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
      {/* Brand Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', padding: '0 0.5rem' }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: 'var(--accent-gradient)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          boxShadow: 'var(--shadow-glow)'
        }}>
          <Sparkles size={22} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '800', lineHeight: 1 }}>LeadFlow</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '500' }}>Mini CRM System</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1 }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (setMobileOpen) setMobileOpen(false);
              }}
              className={`btn ${isActive ? 'btn-primary' : 'btn-secondary'}`}
              style={{
                justifyContent: 'flex-start',
                width: '100%',
                padding: '0.75rem 1rem',
                fontSize: '0.9rem',
                borderRadius: 'var(--radius-sm)',
                border: item.highlight && !isActive ? '1px dashed var(--accent-primary)' : undefined,
                background: isActive ? undefined : 'transparent'
              }}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer Controls & User Profile */}
      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <button 
          onClick={toggleTheme}
          className="btn btn-secondary"
          style={{ width: '100%', justifyContent: 'space-between', padding: '0.6rem 0.9rem' }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
            {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
            {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Toggle</span>
        </button>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.75rem',
          background: 'var(--bg-input)',
          borderRadius: 'var(--radius-sm)'
        }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: '600', fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.name || 'Admin'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.email || 'admin@crm.com'}
            </div>
          </div>
          <button 
            onClick={logout}
            title="Log Out"
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.2rem' }}
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
}
