const express = require('express');
const { getDb } = require('../config/db');

const router = express.Router();

// Public lead submission endpoint (from website contact form)
router.post('/contact', async (req, res) => {
  try {
    const { name, email, phone, company, source, message } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required fields' });
    }

    const db = getDb();
    const leadSource = source || 'Website Contact Form';
    const initialStatus = 'new';
    const estimatedValue = req.body.estimated_value ? parseFloat(req.body.estimated_value) : 0;
    const priority = req.body.priority || 'medium';

    const result = await db.run(
      `INSERT INTO leads (name, email, phone, company, source, status, priority, estimated_value, message)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name.trim(),
        email.trim().toLowerCase(),
        phone ? phone.trim() : '',
        company ? company.trim() : '',
        leadSource,
        initialStatus,
        priority,
        estimatedValue,
        message ? message.trim() : ''
      ]
    );

    const leadId = result.lastID;

    // Log automated creation event in notes
    await db.run(
      `INSERT INTO notes (lead_id, author, type, content)
       VALUES (?, ?, ?, ?)`,
      [
        leadId,
        'System',
        'status_change',
        `Lead created via ${leadSource}`
      ]
    );

    res.status(201).json({
      message: 'Thank you! Your request has been received. Our team will follow up shortly.',
      leadId
    });
  } catch (error) {
    console.error('Public lead submission error:', error);
    res.status(500).json({ error: 'Failed to process lead submission' });
  }
});

module.exports = router;
