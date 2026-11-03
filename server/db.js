const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, 'complaints.db');

// Initialize SQLite database
const db = new DatabaseSync(DB_PATH);

// Create tables if they do not exist
function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS complaints (
      id TEXT PRIMARY KEY,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      student_name TEXT,
      department TEXT,
      location TEXT,
      status TEXT NOT NULL DEFAULT 'Raised',
      submitted_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      resolution_notes TEXT
    );

    CREATE TABLE IF NOT EXISTS status_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      complaint_id TEXT NOT NULL,
      from_status TEXT,
      to_status TEXT NOT NULL,
      changed_at TEXT NOT NULL,
      notes TEXT,
      changed_by TEXT DEFAULT 'Admin',
      FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE
    );
  `);

  // Seed sample data if empty
  seedSampleData();
}

// Category weights according to project requirements:
// Wi-Fi = 2, Hostel = 2, Classroom = 1, Laboratory = 3, Other = 1
const CATEGORY_WEIGHTS = {
  'Wi-Fi': 2,
  'Hostel': 2,
  'Classroom': 1,
  'Laboratory': 3,
  'Other': 1,
  'Campus Facilities': 1
};

function getCategoryWeight(category) {
  return CATEGORY_WEIGHTS[category] !== undefined ? CATEGORY_WEIGHTS[category] : 1;
}

// Calculate hours pending, urgency score and priority level
// Formula: Urgency Score = Category Weight + FLOOR(Hours Pending / 24)
function calculateUrgency(complaint, referenceTime = new Date()) {
  const submittedTime = new Date(complaint.submitted_at);
  const diffMs = Math.max(0, referenceTime.getTime() - submittedTime.getTime());
  const hoursPending = Math.floor(diffMs / (1000 * 60 * 60));
  const categoryWeight = getCategoryWeight(complaint.category);
  const daysPending = Math.floor(hoursPending / 24);
  const urgencyScore = categoryWeight + daysPending;

  let priorityLevel = 'Low Priority';
  if (urgencyScore >= 5) {
    priorityLevel = 'Critical Priority';
  } else if (urgencyScore >= 4) {
    priorityLevel = 'High Priority';
  } else if (urgencyScore >= 2) {
    priorityLevel = 'Medium Priority';
  } else {
    priorityLevel = 'Low Priority';
  }

  return {
    hoursPending,
    daysPending,
    categoryWeight,
    urgencyScore,
    priorityLevel
  };
}

function seedSampleData(force = false) {
  const countRow = db.prepare('SELECT COUNT(*) as count FROM complaints').get();
  if (!force && countRow && countRow.count > 0) {
    return; // Already seeded, do not duplicate
  }

  if (force) {
    db.exec('DELETE FROM status_history; DELETE FROM complaints;');
  }

  const now = new Date();

  // Exactly as defined in problem statement:
  // ID: C01, Category: Wi-Fi, Submitted: 48 hours ago, Status: Raised
  // ID: C02, Category: Hostel, Submitted: 8 hours ago, Status: In Progress
  // ID: C03, Category: Classroom, Submitted: 72 hours ago, Status: Raised
  // ID: C04, Category: Laboratory, Submitted: 24 hours ago, Status: Resolved
  const samples = [
    {
      id: 'C01',
      category: 'Wi-Fi',
      description: 'Wi-Fi is not working properly in the college campus.',
      student_name: 'Rahul Sharma',
      department: 'Computer Science & Engineering',
      location: 'Central Library & Block B',
      status: 'Raised',
      hoursAgo: 48,
      resolution_notes: null
    },
    {
      id: 'C02',
      category: 'Hostel',
      description: 'Water supply is not working properly in the hostel.',
      student_name: 'Ananya Iyer',
      department: 'Electronics & Communication',
      location: 'Girls Hostel Block 3, 2nd Floor',
      status: 'In Progress',
      hoursAgo: 8,
      resolution_notes: 'Plumber dispatched to inspect valve manifold on 2nd floor.'
    },
    {
      id: 'C03',
      category: 'Classroom',
      description: 'Classroom fans are not functioning.',
      student_name: 'Amit Patel',
      department: 'Mechanical Engineering',
      location: 'Academic Block A, Lecture Hall 104',
      status: 'Raised',
      hoursAgo: 72,
      resolution_notes: null
    },
    {
      id: 'C04',
      category: 'Laboratory',
      description: 'Laboratory computers are not working.',
      student_name: 'Sneha Reddy',
      department: 'Information Technology',
      location: 'Turing Computing Lab 2, Systems 12-18',
      status: 'Resolved',
      hoursAgo: 24,
      resolution_notes: 'Replaced faulty Ethernet switch and restored DHCP network lease.'
    }
  ];

  const insertComplaint = db.prepare(`
    INSERT INTO complaints (id, category, description, student_name, department, location, status, submitted_at, updated_at, resolution_notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertHistory = db.prepare(`
    INSERT INTO status_history (complaint_id, from_status, to_status, changed_at, notes, changed_by)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  for (const s of samples) {
    const submittedAt = new Date(now.getTime() - s.hoursAgo * 60 * 60 * 1000).toISOString();
    insertComplaint.run(
      s.id,
      s.category,
      s.description,
      s.student_name,
      s.department,
      s.location,
      s.status,
      submittedAt,
      submittedAt,
      s.resolution_notes
    );

    // Initial submission history
    insertHistory.run(
      s.id,
      null,
      'Raised',
      submittedAt,
      'Complaint registered via Campus Portal',
      s.student_name
    );

    if (s.status === 'In Progress') {
      const inProgressTime = new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString();
      insertHistory.run(
        s.id,
        'Raised',
        'In Progress',
        inProgressTime,
        'Maintenance team assigned for inspection',
        'Facility Admin'
      );
    } else if (s.status === 'Resolved') {
      const inProgressTime = new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString();
      const resolvedTime = new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString();
      insertHistory.run(
        s.id,
        'Raised',
        'In Progress',
        inProgressTime,
        'Lab technician troubleshooting hardware',
        'Lab Coordinator'
      );
      insertHistory.run(
        s.id,
        'In Progress',
        'Resolved',
        resolvedTime,
        s.resolution_notes || 'Issue resolved successfully',
        'Senior Admin'
      );
    }
  }

  console.log('Seeded sample complaints successfully.');
}

// Generate next unique complaint ID
function generateComplaintId() {
  const currentYear = new Date().getFullYear();
  // Find highest CMP-YYYY-XXXX number
  const rows = db.prepare("SELECT id FROM complaints WHERE id LIKE 'CMP-%'").all();
  let maxSeq = 4; // since C01-C04 exist
  for (const row of rows) {
    const match = row.id.match(/^CMP-\d{4}-(\d+)$/);
    if (match) {
      const seq = parseInt(match[1], 10);
      if (seq > maxSeq) maxSeq = seq;
    }
  }
  const nextSeq = maxSeq + 1;
  return `CMP-${currentYear}-${String(nextSeq).padStart(4, '0')}`;
}

module.exports = {
  db,
  initDb,
  seedSampleData,
  calculateUrgency,
  generateComplaintId,
  CATEGORY_WEIGHTS,
  getCategoryWeight
};
