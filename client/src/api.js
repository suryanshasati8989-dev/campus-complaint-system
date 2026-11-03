// API service with automatic backend detection and LocalStorage fallback
const API_BASE_URL = 'http://localhost:5000/api';

export const CATEGORY_WEIGHTS = {
  'Wi-Fi': 2,
  'Hostel': 2,
  'Classroom': 1,
  'Laboratory': 3,
  'Other': 1,
  'Campus Facilities': 1
};

export function getCategoryWeight(category) {
  return CATEGORY_WEIGHTS[category] !== undefined ? CATEGORY_WEIGHTS[category] : 1;
}

export function calculateUrgency(complaint, referenceTime = new Date()) {
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

export function enrichComplaint(c) {
  return {
    ...c,
    ...calculateUrgency(c)
  };
}

// LocalStorage helpers for fallback
const LOCAL_STORAGE_KEY = 'campus_pulse_complaints_v1';
const HISTORY_STORAGE_KEY = 'campus_pulse_history_v1';

function getInitialLocalSampleComplaints() {
  const now = new Date();
  return [
    {
      id: 'C01',
      category: 'Wi-Fi',
      description: 'Wi-Fi is not working properly in the college campus.',
      student_name: 'Rahul Sharma',
      department: 'Computer Science & Engineering',
      location: 'Central Library & Block B',
      status: 'Raised',
      submitted_at: new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString(),
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
      submitted_at: new Date(now.getTime() - 8 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(),
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
      submitted_at: new Date(now.getTime() - 72 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(now.getTime() - 72 * 60 * 60 * 1000).toISOString(),
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
      submitted_at: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
      resolution_notes: 'Replaced faulty Ethernet switch and restored DHCP network lease.'
    }
  ];
}

function loadLocalComplaints() {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!data) {
    const initial = getInitialLocalSampleComplaints();
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
  try {
    return JSON.parse(data);
  } catch {
    return getInitialLocalSampleComplaints();
  }
}

function saveLocalComplaints(complaints) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(complaints));
}

function loadLocalHistory() {
  const data = localStorage.getItem(HISTORY_STORAGE_KEY);
  if (!data) return {};
  try {
    return JSON.parse(data);
  } catch {
    return {};
  }
}

function saveLocalHistory(complaintId, historyEntries) {
  const allHistory = loadLocalHistory();
  allHistory[complaintId] = historyEntries;
  localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(allHistory));
}

// Check backend connectivity
export async function checkBackendHealth() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`${API_BASE_URL}/health`, { signal: controller.signal });
    clearTimeout(timeoutId);
    return res.ok;
  } catch {
    return false;
  }
}

// Main API Object
export const api = {
  // Fetch all complaints
  async getComplaints(params = {}) {
    const query = new URLSearchParams();
    if (params.category && params.category !== 'All') query.set('category', params.category);
    if (params.status && params.status !== 'All') query.set('status', params.status);
    if (params.search) query.set('search', params.search);
    if (params.sortBy) query.set('sortBy', params.sortBy);

    try {
      const res = await fetch(`${API_BASE_URL}/complaints?${query.toString()}`);
      if (!res.ok) throw new Error('API request failed');
      const data = await res.json();
      return { data, source: 'backend' };
    } catch {
      // Local fallback
      let list = loadLocalComplaints().map(enrichComplaint);

      if (params.category && params.category !== 'All') {
        list = list.filter(c => c.category.toLowerCase() === params.category.toLowerCase());
      }
      if (params.status && params.status !== 'All') {
        list = list.filter(c => c.status.toLowerCase() === params.status.toLowerCase());
      }
      if (params.search && params.search.trim()) {
        const q = params.search.trim().toLowerCase();
        list = list.filter(c =>
          c.id.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          (c.student_name && c.student_name.toLowerCase().includes(q)) ||
          (c.location && c.location.toLowerCase().includes(q))
        );
      }

      if (params.sortBy === 'urgency_desc') {
        list.sort((a, b) => {
          if (b.urgencyScore !== a.urgencyScore) return b.urgencyScore - a.urgencyScore;
          return new Date(a.submitted_at) - new Date(b.submitted_at);
        });
      } else if (params.sortBy === 'urgency_asc') {
        list.sort((a, b) => a.urgencyScore - b.urgencyScore);
      } else if (params.sortBy === 'oldest') {
        list.sort((a, b) => new Date(a.submitted_at) - new Date(b.submitted_at));
      } else if (params.sortBy === 'category') {
        list.sort((a, b) => a.category.localeCompare(b.category));
      } else {
        list.sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at));
      }

      return { data: list, source: 'localStorage' };
    }
  },

  // Get Priority Queue
  async getPriorityQueue() {
    try {
      const res = await fetch(`${API_BASE_URL}/priority-queue`);
      if (!res.ok) throw new Error('Priority queue request failed');
      const data = await res.json();
      return { data, source: 'backend' };
    } catch {
      const list = loadLocalComplaints().map(enrichComplaint);
      const unresolved = list.filter(c => c.status !== 'Resolved');
      unresolved.sort((a, b) => {
        if (b.urgencyScore !== a.urgencyScore) return b.urgencyScore - a.urgencyScore;
        return new Date(a.submitted_at) - new Date(b.submitted_at);
      });
      return {
        data: {
          topThree: unresolved.slice(0, 3),
          allUnresolved: unresolved,
          totalUnresolved: unresolved.length,
          categoryWeights: CATEGORY_WEIGHTS,
          formulaExplanation: 'Urgency Score = Category Weight + FLOOR(Hours Pending / 24)'
        },
        source: 'localStorage'
      };
    }
  },

  // Get single complaint with history
  async getComplaint(id) {
    try {
      const res = await fetch(`${API_BASE_URL}/complaints/${id}`);
      if (!res.ok) throw new Error('Failed to fetch complaint');
      const data = await res.json();
      return { data, source: 'backend' };
    } catch {
      const list = loadLocalComplaints();
      const complaint = list.find(c => c.id === id);
      if (!complaint) throw new Error('Complaint not found');
      const history = (loadLocalHistory()[id]) || [
        {
          id: 1,
          complaint_id: id,
          from_status: null,
          to_status: complaint.status,
          changed_at: complaint.submitted_at,
          notes: 'Initial registration',
          changed_by: complaint.student_name || 'Student'
        }
      ];
      return {
        data: {
          ...enrichComplaint(complaint),
          history
        },
        source: 'localStorage'
      };
    }
  },

  // Create new complaint
  async createComplaint(payload) {
    try {
      const res = await fetch(`${API_BASE_URL}/complaints`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to create complaint');
      }
      const data = await res.json();
      return { data: data.complaint, source: 'backend' };
    } catch (err) {
      // Local fallback creation
      const list = loadLocalComplaints();
      const currentYear = new Date().getFullYear();
      let maxSeq = 4;
      for (const item of list) {
        const m = item.id.match(/^CMP-\d{4}-(\d+)$/);
        if (m) {
          const s = parseInt(m[1], 10);
          if (s > maxSeq) maxSeq = s;
        }
      }
      const id = `CMP-${currentYear}-${String(maxSeq + 1).padStart(4, '0')}`;
      const nowIso = new Date().toISOString();

      const newComplaint = {
        id,
        category: payload.category.trim(),
        description: payload.description.trim(),
        student_name: payload.student_name ? payload.student_name.trim() : 'Anonymous Student',
        department: payload.department ? payload.department.trim() : 'Not Specified',
        location: payload.location ? payload.location.trim() : 'Campus Area',
        status: 'Raised',
        submitted_at: nowIso,
        updated_at: nowIso,
        resolution_notes: null
      };

      list.unshift(newComplaint);
      saveLocalComplaints(list);

      // Save initial history
      saveLocalHistory(id, [
        {
          id: Date.now(),
          complaint_id: id,
          from_status: null,
          to_status: 'Raised',
          changed_at: nowIso,
          notes: 'Complaint submitted by student via campus portal',
          changed_by: newComplaint.student_name
        }
      ]);

      return { data: enrichComplaint(newComplaint), source: 'localStorage' };
    }
  },

  // Update complaint details
  async updateComplaint(id, payload) {
    try {
      const res = await fetch(`${API_BASE_URL}/complaints/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to update complaint');
      const data = await res.json();
      return { data: data.complaint, source: 'backend' };
    } catch {
      const list = loadLocalComplaints();
      const index = list.findIndex(c => c.id === id);
      if (index === -1) throw new Error('Complaint not found');

      list[index] = {
        ...list[index],
        category: payload.category.trim(),
        description: payload.description.trim(),
        student_name: payload.student_name || list[index].student_name,
        department: payload.department || list[index].department,
        location: payload.location || list[index].location,
        updated_at: new Date().toISOString()
      };

      saveLocalComplaints(list);
      return { data: enrichComplaint(list[index]), source: 'localStorage' };
    }
  },

  // Update status (Raised -> In Progress -> Resolved)
  async updateStatus(id, { status, notes, changed_by }) {
    try {
      const res = await fetch(`${API_BASE_URL}/complaints/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes, changed_by })
      });
      if (!res.ok) throw new Error('Failed to update status');
      const data = await res.json();
      return { data: data.complaint, source: 'backend' };
    } catch {
      const list = loadLocalComplaints();
      const index = list.findIndex(c => c.id === id);
      if (index === -1) throw new Error('Complaint not found');

      const prevStatus = list[index].status;
      const nowIso = new Date().toISOString();

      list[index].status = status;
      list[index].updated_at = nowIso;
      if (status === 'Resolved') {
        list[index].resolution_notes = notes || list[index].resolution_notes || 'Resolved by administrator';
      }

      saveLocalComplaints(list);

      // Append to history
      const histMap = loadLocalHistory();
      const entries = histMap[id] || [];
      entries.push({
        id: Date.now(),
        complaint_id: id,
        from_status: prevStatus,
        to_status: status,
        changed_at: nowIso,
        notes: notes || `Status changed from ${prevStatus} to ${status}`,
        changed_by: changed_by || 'Admin'
      });
      saveLocalHistory(id, entries);

      return {
        data: {
          ...enrichComplaint(list[index]),
          history: entries
        },
        source: 'localStorage'
      };
    }
  },

  // Delete complaint
  async deleteComplaint(id) {
    try {
      const res = await fetch(`${API_BASE_URL}/complaints/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete complaint');
      return { success: true, source: 'backend' };
    } catch {
      let list = loadLocalComplaints();
      list = list.filter(c => c.id !== id);
      saveLocalComplaints(list);

      const histMap = loadLocalHistory();
      delete histMap[id];
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(histMap));

      return { success: true, source: 'localStorage' };
    }
  },

  // Get Analytics
  async getAnalytics() {
    try {
      const res = await fetch(`${API_BASE_URL}/analytics`);
      if (!res.ok) throw new Error('Failed to fetch analytics');
      const data = await res.json();
      return { data, source: 'backend' };
    } catch {
      const complaints = loadLocalComplaints().map(enrichComplaint);
      const total = complaints.length;
      const resolved = complaints.filter(c => c.status === 'Resolved').length;
      const inProgress = complaints.filter(c => c.status === 'In Progress').length;
      const raised = complaints.filter(c => c.status === 'Raised').length;
      const pending = total - resolved;
      const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

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

      const priorityCounts = {
        Critical: complaints.filter(c => c.priorityLevel === 'Critical Priority' && c.status !== 'Resolved').length,
        High: complaints.filter(c => c.priorityLevel === 'High Priority' && c.status !== 'Resolved').length,
        Medium: complaints.filter(c => c.priorityLevel === 'Medium Priority' && c.status !== 'Resolved').length,
        Low: complaints.filter(c => c.priorityLevel === 'Low Priority' && c.status !== 'Resolved').length,
      };

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

      return {
        data: {
          metrics: { total, resolved, pending, raised, inProgress, resolutionRate },
          categoryStats,
          priorityCounts,
          timeline: Object.values(dateCounts),
          categoryWeights: CATEGORY_WEIGHTS
        },
        source: 'localStorage'
      };
    }
  },

  // Reset to initial sample data
  async resetSampleData() {
    try {
      const res = await fetch(`${API_BASE_URL}/reset-sample`, { method: 'POST' });
      if (res.ok) {
        const initial = getInitialLocalSampleComplaints();
        saveLocalComplaints(initial);
        localStorage.removeItem(HISTORY_STORAGE_KEY);
        return { success: true, source: 'backend' };
      }
    } catch {
      // Local reset
      const initial = getInitialLocalSampleComplaints();
      saveLocalComplaints(initial);
      localStorage.removeItem(HISTORY_STORAGE_KEY);
      return { success: true, source: 'localStorage' };
    }
  },

  // Export CSV download
  exportCsvUrl() {
    return `${API_BASE_URL}/export-csv`;
  },

  // Direct client-side CSV generator (works even offline)
  downloadClientCsv(complaints) {
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
      const enriched = c.urgencyScore !== undefined ? c : enrichComplaint(c);
      const row = [
        escapeCsv(enriched.id),
        escapeCsv(enriched.category),
        escapeCsv(enriched.description),
        escapeCsv(enriched.student_name),
        escapeCsv(enriched.department),
        escapeCsv(enriched.location),
        escapeCsv(enriched.status),
        escapeCsv(new Date(enriched.submitted_at).toLocaleString()),
        enriched.hoursPending,
        enriched.categoryWeight,
        enriched.urgencyScore,
        escapeCsv(enriched.priorityLevel),
        escapeCsv(enriched.resolution_notes || '')
      ];
      csvRows.push(row.join(','));
    }

    const blob = new Blob([csvRows.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `campus_complaints_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
