const bcrypt = require('bcryptjs');
const { initDb } = require('../config/db');

async function seed() {
  console.log('🌱 Starting CRM database seeding...');
  const db = await initDb();

  // Create default admin user if not existing
  const existingAdmin = await db.get('SELECT * FROM users WHERE email = ?', ['admin@crm.com']);
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await db.run(
      `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
      ['Sarah Jenkins (Admin)', 'admin@crm.com', hashedPassword, 'admin']
    );
    console.log('✅ Created default admin account: admin@crm.com / admin123');
  }

  // Check if leads table already has data
  const leadCount = await db.get('SELECT COUNT(*) as count FROM leads');
  if (leadCount.count > 0) {
    console.log(`ℹ️ Database already has ${leadCount.count} leads. Skipping sample leads seed.`);
    return;
  }

  const sampleLeads = [
    {
      name: 'Alex Rivera',
      email: 'alex.rivera@techpulse.io',
      phone: '+1 (555) 234-5678',
      company: 'TechPulse Solutions',
      source: 'Website Contact Form',
      status: 'new',
      priority: 'high',
      estimated_value: 12500,
      message: 'Looking for a complete full-stack web app development for our SaaS MVP platform.',
      notes: [
        { author: 'System', type: 'status_change', content: 'Lead submitted via Website Contact Form' }
      ]
    },
    {
      name: 'Elena Rostova',
      email: 'elena@luxeagency.com',
      phone: '+1 (555) 876-5432',
      company: 'Luxe Creative Agency',
      source: 'Referral',
      status: 'contacted',
      priority: 'high',
      estimated_value: 28000,
      message: 'Need custom UI redesign and CRM API integration for client onboarding.',
      notes: [
        { author: 'System', type: 'status_change', content: 'Lead created via Referral' },
        { author: 'Sarah Jenkins', type: 'call', content: 'Initial discovery call held. Discussed project scope and budget constraints.' },
        { author: 'Sarah Jenkins', type: 'status_change', content: 'Moved pipeline stage: NEW → CONTACTED' }
      ]
    },
    {
      name: 'Marcus Vance',
      email: 'marcus@vancecapital.net',
      phone: '+1 (555) 345-6789',
      company: 'Vance Capital Partners',
      source: 'LinkedIn Campaign',
      status: 'in_progress',
      priority: 'medium',
      estimated_value: 45000,
      message: 'Interested in enterprise automated lead routing and analytics dashboard setup.',
      notes: [
        { author: 'System', type: 'status_change', content: 'Lead created via LinkedIn Campaign' },
        { author: 'Sarah Jenkins', type: 'email', content: 'Sent proposal PDF with pricing tiers.' },
        { author: 'Sarah Jenkins', type: 'meeting', content: 'Technical requirements alignment meeting with CTO.' },
        { author: 'Sarah Jenkins', type: 'status_change', content: 'Moved pipeline stage: CONTACTED → IN_PROGRESS' }
      ]
    },
    {
      name: 'Sophia Patel',
      email: 'sophia@greenleafhealth.org',
      phone: '+1 (555) 987-6543',
      company: 'Green Leaf Wellness',
      source: 'Google Ads',
      status: 'converted',
      priority: 'high',
      estimated_value: 18500,
      message: 'Want to build an online patient booking system integrated with stripe.',
      notes: [
        { author: 'System', type: 'status_change', content: 'Lead created via Google Ads' },
        { author: 'Sarah Jenkins', type: 'call', content: 'Review call on final contract terms.' },
        { author: 'Sarah Jenkins', type: 'note', content: 'Contract signed! Deposit invoice sent.' },
        { author: 'Sarah Jenkins', type: 'status_change', content: 'Moved pipeline stage: IN_PROGRESS → CONVERTED' }
      ]
    },
    {
      name: 'David Chen',
      email: 'david@apexcloud.co',
      phone: '+1 (555) 456-7890',
      company: 'Apex Cloud Systems',
      source: 'Website Contact Form',
      status: 'lost',
      priority: 'low',
      estimated_value: 8000,
      message: 'Inquiring about basic landing page design.',
      notes: [
        { author: 'System', type: 'status_change', content: 'Lead created via Website Contact Form' },
        { author: 'Sarah Jenkins', type: 'email', content: 'Followed up twice. Client went with internal team.' },
        { author: 'Sarah Jenkins', type: 'status_change', content: 'Moved pipeline stage: CONTACTED → LOST' }
      ]
    },
    {
      name: 'Hannah Abbott',
      email: 'hannah@brightmind.edu',
      phone: '+1 (555) 654-3210',
      company: 'BrightMind Academy',
      source: 'Direct',
      status: 'new',
      priority: 'medium',
      estimated_value: 15000,
      message: 'Requesting consultation for student portal management upgrade.',
      notes: [
        { author: 'System', type: 'status_change', content: 'Lead created via Direct' }
      ]
    }
  ];

  for (const leadData of sampleLeads) {
    const { notes, ...lead } = leadData;
    const result = await db.run(
      `INSERT INTO leads (name, email, phone, company, source, status, priority, estimated_value, message)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        lead.name,
        lead.email,
        lead.phone,
        lead.company,
        lead.source,
        lead.status,
        lead.priority,
        lead.estimated_value,
        lead.message
      ]
    );

    const leadId = result.lastID;
    for (const note of notes) {
      await db.run(
        `INSERT INTO notes (lead_id, author, type, content) VALUES (?, ?, ?, ?)`,
        [leadId, note.author, note.type, note.content]
      );
    }
  }

  console.log(`✅ Successfully seeded ${sampleLeads.length} realistic client leads with follow-up activity logs!`);
}

if (require.main === module) {
  seed()
    .then(() => process.exit(0))
    .catch(err => {
      console.error('Seeding error:', err);
      process.exit(1);
    });
}

module.exports = seed;
