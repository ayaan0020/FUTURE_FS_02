const express = require('express');
const { getDb } = require('../config/db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all lead management endpoints
router.use(authMiddleware);

// List leads with filtering, search, and sorting
router.get('/', async (req, res) => {
  try {
    const { q, status, source, priority, sortBy = 'created_at', order = 'desc' } = req.query;
    const db = getDb();

    let query = 'SELECT * FROM leads WHERE 1=1';
    const params = [];

    if (q) {
      query += ' AND (name LIKE ? OR email LIKE ? OR company LIKE ? OR message LIKE ?)';
      const searchTerm = `%${q.trim()}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    if (status && status !== 'all') {
      query += ' AND status = ?';
      params.push(status);
    }

    if (source && source !== 'all') {
      query += ' AND source = ?';
      params.push(source);
    }

    if (priority && priority !== 'all') {
      query += ' AND priority = ?';
      params.push(priority);
    }

    const validSortFields = ['created_at', 'updated_at', 'name', 'status', 'estimated_value', 'priority'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'created_at';
    const sortOrder = order.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

    query += ` ORDER BY ${sortField} ${sortOrder}`;

    const leads = await db.all(query, params);

    // Get notes counts for each lead
    const leadIds = leads.map(l => l.id);
    let noteCounts = {};
    if (leadIds.length > 0) {
      const placeholders = leadIds.map(() => '?').join(',');
      const counts = await db.all(
        `SELECT lead_id, COUNT(*) as count FROM notes WHERE lead_id IN (${placeholders}) GROUP BY lead_id`,
        leadIds
      );
      counts.forEach(row => {
        noteCounts[row.lead_id] = row.count;
      });
    }

    const leadsWithMeta = leads.map(lead => ({
      ...lead,
      notes_count: noteCounts[lead.id] || 0
    }));

    res.json({ leads: leadsWithMeta, total: leadsWithMeta.length });
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
});

// Single lead view with notes timeline
router.get('/:id', async (req, res) => {
  try {
    const db = getDb();
    const lead = await db.get('SELECT * FROM leads WHERE id = ?', [req.params.id]);

    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    const notes = await db.all(
      'SELECT * FROM notes WHERE lead_id = ? ORDER BY created_at DESC',
      [req.params.id]
    );

    res.json({ lead, notes });
  } catch (error) {
    console.error('Error fetching lead details:', error);
    res.status(500).json({ error: 'Failed to fetch lead details' });
  }
});

// Create new lead manually
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, company, source, status, priority, estimated_value, message } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const db = getDb();
    const result = await db.run(
      `INSERT INTO leads (name, email, phone, company, source, status, priority, estimated_value, message)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name.trim(),
        email.trim().toLowerCase(),
        phone ? phone.trim() : '',
        company ? company.trim() : '',
        source || 'Manual Entry',
        status || 'new',
        priority || 'medium',
        estimated_value ? parseFloat(estimated_value) : 0,
        message ? message.trim() : ''
      ]
    );

    const leadId = result.lastID;

    // Log creation note
    await db.run(
      `INSERT INTO notes (lead_id, author, type, content) VALUES (?, ?, ?, ?)`,
      [leadId, req.user.name || 'Admin', 'status_change', 'Lead manually added to CRM']
    );

    const newLead = await db.get('SELECT * FROM leads WHERE id = ?', [leadId]);

    res.status(201).json({ message: 'Lead created successfully', lead: newLead });
  } catch (error) {
    console.error('Error creating lead:', error);
    res.status(500).json({ error: 'Failed to create lead' });
  }
});

// Update lead details
router.put('/:id', async (req, res) => {
  try {
    const { name, email, phone, company, source, status, priority, estimated_value, message } = req.body;
    const db = getDb();

    const existingLead = await db.get('SELECT * FROM leads WHERE id = ?', [req.params.id]);
    if (!existingLead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    await db.run(
      `UPDATE leads 
       SET name = ?, email = ?, phone = ?, company = ?, source = ?, status = ?, priority = ?, estimated_value = ?, message = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        name ? name.trim() : existingLead.name,
        email ? email.trim().toLowerCase() : existingLead.email,
        phone !== undefined ? phone.trim() : existingLead.phone,
        company !== undefined ? company.trim() : existingLead.company,
        source || existingLead.source,
        status || existingLead.status,
        priority || existingLead.priority,
        estimated_value !== undefined ? parseFloat(estimated_value) : existingLead.estimated_value,
        message !== undefined ? message.trim() : existingLead.message,
        req.params.id
      ]
    );

    // Log status change if updated
    if (status && status !== existingLead.status) {
      await db.run(
        `INSERT INTO notes (lead_id, author, type, content) VALUES (?, ?, ?, ?)`,
        [
          req.params.id,
          req.user.name || 'Admin',
          'status_change',
          `Status changed from ${existingLead.status.toUpperCase()} to ${status.toUpperCase()}`
        ]
      );
    }

    const updatedLead = await db.get('SELECT * FROM leads WHERE id = ?', [req.params.id]);
    res.json({ message: 'Lead updated successfully', lead: updatedLead });
  } catch (error) {
    console.error('Error updating lead:', error);
    res.status(500).json({ error: 'Failed to update lead' });
  }
});

// Update status quickly (for Kanban / Quick Switcher)
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Status field is required' });
    }

    const db = getDb();
    const existingLead = await db.get('SELECT * FROM leads WHERE id = ?', [req.params.id]);
    if (!existingLead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    const oldStatus = existingLead.status;
    await db.run(
      `UPDATE leads SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [status, req.params.id]
    );

    // Record timeline event
    await db.run(
      `INSERT INTO notes (lead_id, author, type, content) VALUES (?, ?, ?, ?)`,
      [
        req.params.id,
        req.user.name || 'Admin',
        'status_change',
        `Moved pipeline stage: ${oldStatus.toUpperCase()} → ${status.toUpperCase()}`
      ]
    );

    const updatedLead = await db.get('SELECT * FROM leads WHERE id = ?', [req.params.id]);
    res.json({ message: 'Lead status updated', lead: updatedLead });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ error: 'Failed to update lead status' });
  }
});

// Add a follow-up note / activity log
router.post('/:id/notes', async (req, res) => {
  try {
    const { content, type = 'note' } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Note content cannot be empty' });
    }

    const db = getDb();
    const lead = await db.get('SELECT * FROM leads WHERE id = ?', [req.params.id]);
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    const result = await db.run(
      `INSERT INTO notes (lead_id, author, type, content) VALUES (?, ?, ?, ?)`,
      [req.params.id, req.user.name || 'Admin', type, content.trim()]
    );

    // Touch lead updated_at timestamp
    await db.run(`UPDATE leads SET updated_at = CURRENT_TIMESTAMP WHERE id = ?`, [req.params.id]);

    const newNote = await db.get('SELECT * FROM notes WHERE id = ?', [result.lastID]);
    res.status(201).json({ message: 'Follow-up note added', note: newNote });
  } catch (error) {
    console.error('Error adding note:', error);
    res.status(500).json({ error: 'Failed to add follow-up note' });
  }
});

// Delete lead record
router.delete('/:id', async (req, res) => {
  try {
    const db = getDb();
    const lead = await db.get('SELECT * FROM leads WHERE id = ?', [req.params.id]);
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    await db.run('DELETE FROM notes WHERE lead_id = ?', [req.params.id]);
    await db.run('DELETE FROM leads WHERE id = ?', [req.params.id]);

    res.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    console.error('Error deleting lead:', error);
    res.status(500).json({ error: 'Failed to delete lead' });
  }
});

module.exports = router;
