const express = require('express');
const { getDb } = require('../config/db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

// Get CRM Executive Summary & Analytics
router.get('/summary', async (req, res) => {
  try {
    const db = getDb();

    // Total leads count
    const totalRow = await db.get('SELECT COUNT(*) as count FROM leads');
    const totalLeads = totalRow ? totalRow.count : 0;

    // Status counts
    const statusRows = await db.all('SELECT status, COUNT(*) as count FROM leads GROUP BY status');
    const statusBreakdown = {
      new: 0,
      contacted: 0,
      in_progress: 0,
      converted: 0,
      lost: 0
    };
    statusRows.forEach(row => {
      statusBreakdown[row.status] = row.count;
    });

    // Conversion metrics
    const convertedLeads = statusBreakdown.converted || 0;
    const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : 0;

    // Total & Won Pipeline Value
    const totalValueRow = await db.get('SELECT SUM(estimated_value) as sum FROM leads');
    const wonValueRow = await db.get('SELECT SUM(estimated_value) as sum FROM leads WHERE status = "converted"');
    const totalPipelineValue = totalValueRow ? (totalValueRow.sum || 0) : 0;
    const wonPipelineValue = wonValueRow ? (wonValueRow.sum || 0) : 0;

    // Source breakdown
    const sourceRows = await db.all('SELECT source, COUNT(*) as count FROM leads GROUP BY source');

    // Recent activity stream (latest 10 notes)
    const recentActivities = await db.all(`
      SELECT n.*, l.name as lead_name, l.company as lead_company
      FROM notes n
      JOIN leads l ON n.lead_id = l.id
      ORDER BY n.created_at DESC
      LIMIT 10
    `);

    res.json({
      summary: {
        totalLeads,
        newLeads: statusBreakdown.new || 0,
        contactedLeads: statusBreakdown.contacted || 0,
        inProgressLeads: statusBreakdown.in_progress || 0,
        convertedLeads,
        lostLeads: statusBreakdown.lost || 0,
        conversionRate: parseFloat(conversionRate),
        totalPipelineValue,
        wonPipelineValue
      },
      statusBreakdown,
      sourceBreakdown: sourceRows,
      recentActivities
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to generate analytics summary' });
  }
});

module.exports = router;
