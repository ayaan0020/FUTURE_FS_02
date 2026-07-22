import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import Sidebar from './components/Sidebar';
import StatCards from './components/StatCards';
import LeadTable from './components/LeadTable';
import KanbanBoard from './components/KanbanBoard';
import LeadDetailModal from './components/LeadDetailModal';
import NewLeadModal from './components/NewLeadModal';
import AnalyticsPage from './pages/AnalyticsPage';
import PublicDemoPage from './pages/PublicDemoPage';
import { api } from './services/api';
import { Search, Plus, Filter, Menu, Sparkles, RefreshCw } from 'lucide-react';

export default function App() {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);

  // CRM State
  const [leads, setLeads] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');

  // Modal States
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [isNewLeadOpen, setIsNewLeadOpen] = useState(false);

  const fetchCRMData = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const [leadsRes, analyticsRes] = await Promise.all([
        api.leads.getAll({ q: searchQuery, status: statusFilter, source: sourceFilter }),
        api.analytics.getSummary()
      ]);
      setLeads(leadsRes.leads);
      setSummary(analyticsRes.summary);
    } catch (err) {
      console.error('Failed to load CRM data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCRMData();
  }, [user, searchQuery, statusFilter, sourceFilter]);

  const handleStatusChange = async (leadId, newStatus) => {
    try {
      await api.leads.updateStatus(leadId, newStatus);
      fetchCRMData();
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  const handleDeleteLead = async (leadId) => {
    if (!window.confirm('Are you sure you want to delete this lead record?')) return;
    try {
      await api.leads.delete(leadId);
      fetchCRMData();
    } catch (err) {
      alert('Failed to delete lead: ' + err.message);
    }
  };

  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
        Loading LeadFlow CRM...
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {/* Mobile Header Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }} className="mobile-header">
          <button onClick={() => setMobileOpen(true)} className="btn btn-secondary btn-sm">
            <Menu size={18} /> Menu
          </button>
          <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>LeadFlow CRM</span>
        </div>

        {/* Dynamic Pages */}
        {activeTab === 'public-demo' ? (
          <PublicDemoPage onLeadSubmitted={fetchCRMData} />
        ) : activeTab === 'analytics' ? (
          <AnalyticsPage />
        ) : (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Top Toolbar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h1 style={{ fontSize: '1.6rem', fontWeight: '800' }}>
                  {activeTab === 'dashboard' ? 'Executive Overview' : activeTab === 'kanban' ? 'Visual Sales Pipeline' : 'Lead Management'}
                </h1>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                  Manage incoming client leads, pipeline status updates, and follow-ups.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button onClick={fetchCRMData} className="btn btn-secondary btn-sm" title="Refresh Data">
                  <RefreshCw size={14} /> Refresh
                </button>
                <button onClick={() => setIsNewLeadOpen(true)} className="btn btn-primary">
                  <Plus size={18} /> Add New Lead
                </button>
              </div>
            </div>

            {/* Stat Cards */}
            <StatCards summary={summary} />

            {/* Search & Filter Toolbar */}
            <div className="glass-card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              {/* Search Bar */}
              <div style={{ position: 'relative', flex: '1 1 240px' }}>
                <input
                  type="text"
                  placeholder="Search lead name, email, company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field"
                  style={{ paddingLeft: '2.4rem' }}
                />
                <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>

              {/* Status Filter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Filter size={16} color="var(--text-muted)" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="select-field"
                  style={{ width: 'auto' }}
                >
                  <option value="all">All Statuses</option>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="in_progress">In Progress</option>
                  <option value="converted">Converted</option>
                  <option value="lost">Lost</option>
                </select>
              </div>

              {/* Source Filter */}
              <div>
                <select
                  value={sourceFilter}
                  onChange={(e) => setSourceFilter(e.target.value)}
                  className="select-field"
                  style={{ width: 'auto' }}
                >
                  <option value="all">All Channels</option>
                  <option value="Website Contact Form">Website Form</option>
                  <option value="Referral">Referral</option>
                  <option value="LinkedIn Campaign">LinkedIn</option>
                  <option value="Google Ads">Google Ads</option>
                  <option value="Direct">Direct Outreach</option>
                </select>
              </div>
            </div>

            {/* Content View Switcher */}
            {activeTab === 'kanban' ? (
              <KanbanBoard
                leads={leads}
                onSelectLead={(id) => setSelectedLeadId(id)}
                onStatusChange={handleStatusChange}
              />
            ) : (
              <LeadTable
                leads={leads}
                onSelectLead={(id) => setSelectedLeadId(id)}
                onStatusChange={handleStatusChange}
                onDeleteLead={handleDeleteLead}
              />
            )}
          </div>
        )}
      </main>

      {/* Modals */}
      {selectedLeadId && (
        <LeadDetailModal
          leadId={selectedLeadId}
          onClose={() => setSelectedLeadId(null)}
          onLeadUpdated={fetchCRMData}
        />
      )}

      <NewLeadModal
        isOpen={isNewLeadOpen}
        onClose={() => setIsNewLeadOpen(false)}
        onLeadCreated={fetchCRMData}
      />
    </div>
  );
}
