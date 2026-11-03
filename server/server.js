const express = require('express');
const cors = require('cors');
const {
  db,
  initDb,
  seedSampleData,
  calculateUrgency,
  generateComplaintId,
  CATEGORY_WEIGHTS,
  getCategoryWeight
} = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize database
initDb();

// Middleware
app.use(cors());
app.use(express.json());

// Helper to format complaint with live calculated urgency
function enrichComplaint(row) {
  const urgency = calculateUrgency(row);
  return {
    ...row,
    ...urgency
  };
}

// ---------------------- ROUTES ----------------------

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// GET all complaints with filtering, search, and sorting
app.get('/api/complaints', (req, res) => {
  try {
    const { category, status, search, sortBy } = req.query;

    let rows = db.prepare('SELECT * FROM complaints ORDER BY submitted_at DESC').all();

    // Map live urgency calculations
    let enriched = rows.map(enrichComplaint);

    // Filter by category
    if (category && category !== 'All') {
      enriched = enriched.filter(c => c.category.toLowerCase() === category.toLowerCase());
    }

    // Filter by status
    if (status && status !== 'All') {
      enriched = enriched.filter(c => c.status.toLowerCase() === status.toLowerCase());
    }

    // Search by ID, description, student_name, or location
    if (search && search.trim() !== '') {
      const q = search.trim().toLowerCase();
      enriched = enriched.filter(c =>
        c.id.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        (c.student_name && c.student_name.toLowerCase().includes(q)) ||
        (c.location && c.location.toLowerCase().includes(q)) ||
        (c.department && c.department.toLowerCase().includes(q))
      );
    }

    // Sorting
    if (sortBy === 'urgency_desc') {
      // Highest urgency first; if equal, older first (submitted_at ASC)
      enriched.sort((a, b) => {
        if (b.urgencyScore !== a.urgencyScore) {
          return b.urgencyScore - a.urgencyScore;
        }
        return new Date(a.submitted_at) - new Date(b.submitted_at);
      });
    } else if (sortBy === 'urgency_asc') {
      enriched.sort((a, b) => a.urgencyScore - b.urgencyScore);
    } else if (sortBy === 'oldest') {
      enriched.sort((a, b) => new Date(a.submitted_at) - new Date(b.submitted_at));
    } else if (sortBy === 'category') {
      enriched.sort((a, b) => a.category.localeCompare(b.category));
    } else {
      // default: newest
      enriched.sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at));
    }

    res.json(enriched);
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).json({ error: 'Failed to fetch complaints' });
  }
});

// GET Priority Queue (Rules: Unresolved only, Urgency DESC, tie-break: older first, top 3 highlighted)
app.get('/api/priority-queue', (req, res) => {
  try {
    const rows = db.prepare("SELECT * FROM complaints WHERE status != 'Resolved'").all();
    const enriched = rows.map(enrichComplaint);

    // Sort by Urgency Score DESC, then tie-break older submitted_at ASC
    enriched.sort((a, b) => {
      if (b.urgencyScore !== a.urgencyScore) {
        return b.urgencyScore - a.urgencyScore;
      }
      return new Date(a.submitted_at) - new Date(b.submitted_at);
    });

    const topThree = enriched.slice(0, 3);

    res.json({
      topThree,
      allUnresolved: enriched,
      totalUnresolved: enriched.length,
      categoryWeights: CATEGORY_WEIGHTS,
      formulaExplanation: 'Urgency Score = Category Weight + FLOOR(Hours Pending / 24)'
    });
  } catch (error) {
    console.error('Error fetching priority queue:', error);
    res.status(500).json({ error: 'Failed to fetch priority queue' });
  }
});

// GET single complaint details with status history
app.get('/api/complaints/:id', (req, res) => {
  try {
    const { id } = req.params;
    const complaint = db.prepare('SELECT * FROM complaints WHERE id = ?').get(id);

    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    const history = db.prepare('SELECT * FROM status_history WHERE complaint_id = ? ORDER BY changed_at ASC').all(id);

    const enriched = enrichComplaint(complaint);
    res.json({
      ...enriched,
      history
    });
  } catch (error) {
    console.error('Error fetching complaint details:', error);
    res.status(500).json({ error: 'Failed to fetch complaint details' });
  }
});

// POST Add New Complaint
app.post('/api/complaints', (req, res) => {
  try {
    const { category, description, student_name, department, location } = req.body;

    // Validation: Category & Description are mandatory
    if (!category || !category.trim()) {
      return res.status(400).json({ error: 'Complaint Category is mandatory.' });
    }
    if (!description || !description.trim()) {
      return res.status(400).json({ error: 'Complaint Description is mandatory.' });
    }

    const id = generateComplaintId();
    const nowIso = new Date().toISOString();
    const initialStatus = 'Raised';

    db.prepare(`
      INSERT INTO complaints (id, category, description, student_name, department, location, status, submitted_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      category.trim(),
      description.trim(),
      student_name ? student_name.trim() : 'Anonymous Student',
      department ? department.trim() : 'Not Specified',
      location ? location.trim() : 'Campus Area',
      initialStatus,
      nowIso,
      nowIso
    );

    // Initial history entry
    db.prepare(`
      INSERT INTO status_history (complaint_id, from_status, to_status, changed_at, notes, changed_by)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      id,
      null,
      initialStatus,
      nowIso,
      'Complaint submitted by student via campus portal',
      student_name ? student_name.trim() : 'Student'
    );

    const created = db.prepare('SELECT * FROM complaints WHERE id = ?').get(id);
    const enriched = enrichComplaint(created);

    res.status(201).json({
      message: 'Complaint submitted successfully',
      complaint: enriched
    });
  } catch (error) {
    console.error('Error creating complaint:', error);
    res.status(500).json({ error: 'Failed to create complaint' });
  }
});

// PUT Update Complaint details
app.put('/api/complaints/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { category, description, student_name, department, location } = req.body;

    const existing = db.prepare('SELECT * FROM complaints WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    if (!category || !category.trim()) {
      return res.status(400).json({ error: 'Category is required' });
    }
    if (!description || !description.trim()) {
      return res.status(400).json({ error: 'Description is required' });
    }

    const nowIso = new Date().toISOString();

    db.prepare(`
      UPDATE complaints
      SET category = ?, description = ?, student_name = ?, department = ?, location = ?, updated_at = ?
      WHERE id = ?
    `).run(
      category.trim(),
      description.trim(),
      student_name || existing.student_name,
      department || existing.department,
      location || existing.location,
      nowIso,
      id
    );

    const updated = db.prepare('SELECT * FROM complaints WHERE id = ?').get(id);
    res.json({
      message: 'Complaint updated successfully',
      complaint: enrichComplaint(updated)
    });
  } catch (error) {
    console.error('Error updating complaint:', error);
    res.status(500).json({ error: 'Failed to update complaint' });
  }
});

// PATCH Update status ('Raised' -> 'In Progress' -> 'Resolved')
app.patch('/api/complaints/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes, changed_by } = req.body;

    const allowed = ['Raised', 'In Progress', 'Resolved'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be Raised, In Progress, or Resolved.' });
    }

    const existing = db.prepare('SELECT * FROM complaints WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    const nowIso = new Date().toISOString();
    const resolutionNotes = status === 'Resolved' ? (notes || existing.resolution_notes || 'Resolved by administrator') : existing.resolution_notes;

    db.prepare(`
      UPDATE complaints
      SET status = ?, updated_at = ?, resolution_notes = ?
      WHERE id = ?
    `).run(status, nowIso, resolutionNotes, id);

    // Record status history
    db.prepare(`
      INSERT INTO status_history (complaint_id, from_status, to_status, changed_at, notes, changed_by)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      id,
      existing.status,
      status,
      nowIso,
      notes || `Status changed from ${existing.status} to ${status}`,
      changed_by || 'Admin'
    );

    const updated = db.prepare('SELECT * FROM complaints WHERE id = ?').get(id);
    const history = db.prepare('SELECT * FROM status_history WHERE complaint_id = ? ORDER BY changed_at ASC').all(id);

    res.json({
      message: `Status updated to ${status}`,
      complaint: {
        ...enrichComplaint(updated),
        history
      }
    });
  } catch (error) {
    console.error('Error updating complaint status:', error);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// DELETE complaint
app.delete('/api/complaints/:id', (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT * FROM complaints WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    db.prepare('DELETE FROM status_history WHERE complaint_id = ?').run(id);
    db.prepare('DELETE FROM complaints WHERE id = ?').run(id);

    res.json({ message: `Complaint ${id} deleted successfully` });
  } catch (error) {
    console.error('Error deleting complaint:', error);
    res.status(500).json({ error: 'Failed to delete complaint' });
  }
});

// GET Analytics & Reports
app.get('/api/analytics', (req, res) => {
  try {
    const complaints = db.prepare('SELECT * FROM complaints').all().map(enrichComplaint);

    const total = complaints.length;
    const resolved = complaints.filter(c => c.status === 'Resolved').length;
    const inProgress = complaints.filter(c => c.status === 'In Progress').length;
    const raised = complaints.filter(c => c.status === 'Raised').length;
    const pending = total - resolved;

    const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

    // Categories breakdown
    const categoriesMap = {};
    for (const c of complaints) {
      if (!categoriesMap[c.category]) {
        categoriesMap[c.category] = {
          category: c.category,
          weight: getCategoryWeight(c.category),
          total: 0,
          raised: 0,
          inProgress: 0,
          resolved: 0,
          urgencyScoresSum: 0
        };
      }
      categoriesMap[c.category].total += 1;
      if (c.status === 'Raised') categoriesMap[c.category].raised += 1;
      if (c.status === 'In Progress') categoriesMap[c.category].inProgress += 1;
      if (c.status === 'Resolved') categoriesMap[c.category].resolved += 1;
      categoriesMap[c.category].urgencyScoresSum += c.urgencyScore;
    }

    const categoryStats = Object.values(categoriesMap).map(cat => ({
      ...cat,
      avgUrgency: cat.total > 0 ? (cat.urgencyScoresSum / cat.total).toFixed(1) : 0
    }));

    // Priority breakdown
    const priorityCounts = {
      Critical: complaints.filter(c => c.priorityLevel === 'Critical Priority' && c.status !== 'Resolved').length,
      High: complaints.filter(c => c.priorityLevel === 'High Priority' && c.status !== 'Resolved').length,
      Medium: complaints.filter(c => c.priorityLevel === 'Medium Priority' && c.status !== 'Resolved').length,
      Low: complaints.filter(c => c.priorityLevel === 'Low Priority' && c.status !== 'Resolved').length,
    };

    // Calculate monthly/daily timeline data
    // Group complaints by date of submission
    const dateCounts = {};
    for (const c of complaints) {
      const dateKey = new Date(c.submitted_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
      if (!dateCounts[dateKey]) {
        dateCounts[dateKey] = { date: dateKey, total: 0, resolved: 0, raised: 0 };
      }
      dateCounts[dateKey].total += 1;
      if (c.status === 'Resolved') dateCounts[dateKey].resolved += 1;
      if (c.status === 'Raised') dateCounts[dateKey].raised += 1;
    }
    const timeline = Object.values(dateCounts);

    res.json({
      metrics: {
        total,
        resolved,
        pending,
        raised,
        inProgress,
        resolutionRate
      },
      categoryStats,
      priorityCounts,
      timeline,
      categoryWeights: CATEGORY_WEIGHTS
    });
  } catch (error) {
    console.error('Error generating analytics:', error);
    res.status(500).json({ error: 'Failed to generate analytics' });
  }
});

// CSV Export Endpoint
app.get('/api/export-csv', (req, res) => {
  try {
    const complaints = db.prepare('SELECT * FROM complaints ORDER BY submitted_at DESC').all().map(enrichComplaint);

    const headers = [
      'Complaint ID',
      'Category',
      'Description',
      'Student Name',
      'Department',
      'Location',
      'Status',
      'Submitted At',
      'Hours Pending',
      'Category Weight',
      'Urgency Score',
      'Priority Level',
      'Resolution Notes'
    ];

    const escapeCsv = (str) => {
      if (str === null || str === undefined) return '""';
      const clean = String(str).replace(/"/g, '""');
      return `"${clean}"`;
    };

    const csvRows = [headers.join(',')];

    for (const c of complaints) {
      const row = [
        escapeCsv(c.id),
        escapeCsv(c.category),
        escapeCsv(c.description),
        escapeCsv(c.student_name),
        escapeCsv(c.department),
        escapeCsv(c.location),
        escapeCsv(c.status),
        escapeCsv(new Date(c.submitted_at).toLocaleString()),
        c.hoursPending,
        c.categoryWeight,
        c.urgencyScore,
        escapeCsv(c.priorityLevel),
        escapeCsv(c.resolution_notes || '')
      ];
      csvRows.push(row.join(','));
    }

    const csvString = csvRows.join('\r\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=campus_complaints_${Date.now()}.csv`);
    res.status(200).send(csvString);
  } catch (error) {
    console.error('Error exporting CSV:', error);
    res.status(500).json({ error: 'Failed to export CSV' });
  }
});

// Reset database to initial sample data
app.post('/api/reset-sample', (req, res) => {
  try {
    seedSampleData(true);
    res.json({ message: 'Database reset to sample data successfully (C01, C02, C03, C04 seeded).' });
  } catch (error) {
    console.error('Error resetting sample data:', error);
    res.status(500).json({ error: 'Failed to reset database' });
  }
});

app.listen(PORT, () => {
  console.log(`Campus Complaint Backend running at http://localhost:${PORT}`);
});
