# 🎓 CampusPulse — Campus Complaint Management System

A full-stack, modern, responsive, and persistent **Campus Complaint Management System** designed for colleges and universities. Features role-based authentication (Student vs. Administrator), automated urgency calculation, priority dispatch queues, status audit histories, interactive analytics, and persistent SQLite database storage.

---

## 🌐 Local Access Links

| Application | Local URL | Network URL |
| :--- | :--- | :--- |
| **Frontend Web App** | [http://localhost:5173/](http://localhost:5173/) | `http://10.134.39.144:5173/` |
| **Backend REST API** | [http://localhost:5000/api](http://localhost:5000/api) | `http://localhost:5000/api/complaints` |
| **API Health Status** | [http://localhost:5000/api/health](http://localhost:5000/api/health) | `{"status":"ok"}` |

---

## 🔐 Sign-In Portal & Role-Based Access Control

The application features a dual-tab sign-in portal enforcing strict role-based permissions:

### 1. 🎓 Student / Complainant Portal
Designed for college students to lodge complaints and monitor live progress:
- **Capabilities (Allowed):**
  - ✅ Submit new complaints (Wi-Fi, Hostel, Classroom, Laboratory, Campus Facilities).
  - ✅ Monitor live status of grievances (`Raised` $\to$ `In Progress` $\to$ `Resolved`).
  - ✅ View full dashboard metrics, charts, and top priority queue.
  - ✅ Inspect complaint details, submission age in hours, and resolution notes.
- **Restrictions (Disabled):**
  - ❌ **Cannot** change complaint status (only administrators can start work or resolve tickets).
  - ❌ **Cannot** edit or delete existing complaint records.
  - ❌ **Cannot** reset the database or change administrative settings.
- **Demo Quick-Select:** Choose between **Aarav Patel** (*CS-2024-042*) or **Kavya Verma** (*EC-2024-089*) with 1-click.

### 2. 🛡️ Campus Administrator Portal
Designed for facility managers, department heads, and maintenance admins:
- **Capabilities (Full Authority):**
  - 🛠️ Change complaint status: transition tickets from `Raised` $\to$ `In Progress` (start work) $\to$ `Resolved`.
  - 📝 Record technician notes, dispatch logs, and resolution details.
  - ✏️ Edit complaint details (category, description, location).
  - 🗑️ Permanently delete complaints with confirmation modal.
  - 🔄 Re-seed / reset sample demonstration data.
  - 📊 Export full complaints dataset to CSV.
- **Demo Credentials (with 1-Click Autofill):**
  - **Email:** `admin@college.edu` *(or `admin@campus.edu`)*
  - **Password:** `admin123`

### 3. 🚪 Sign-Out / Logout Option
A prominent **Sign Out** button is available in:
- The top **Navbar** header.
- The **Sidebar** profile card.
- The **Settings** account section.
Signing out securely clears the active session and returns to the Sign-In screen.

---

## ⚡ Core Mathematical Urgency Calculation

The system implements the required automatic urgency calculation:

$$\text{Urgency Score} = \text{Category Weight} + \left\lfloor \frac{\text{Hours Pending}}{24} \right\rfloor$$

### Category Weights:
- **Laboratory:** `3` *(Affects research, practical exams, lab workstations)*
- **Wi-Fi:** `2` *(Academic connectivity & submissions)*
- **Hostel:** `2` *(Living conditions, electricity & water supply)*
- **Classroom:** `1` *(Fans, projector, furniture)*
- **Other Facilities:** `1` *(General campus infrastructure)*

### Priority Tiers:
- **Critical Priority:** Score $\ge 5$ (Red badge)
- **High Priority:** Score $= 4$ (Amber badge)
- **Medium Priority:** Score $2 - 3$ (Blue badge)
- **Low Priority:** Score $\le 1$ (Slate badge)

### Priority Queue Rules:
1. **Unresolved Only:** Only complaints in `Raised` or `In Progress` status appear in the priority queue.
2. **Exclusion Rule:** Resolved complaints are strictly excluded from the unresolved priority queue.
3. **Descending Sort:** Sorted in descending order of Urgency Score.
4. **Tie-Breaker:** If two tickets have identical urgency scores, the older complaint (`submitted_at ASC`) takes precedence.
5. **Top 3 Spotlight:** The top 3 most urgent unresolved tickets are highlighted in the priority queue and dashboard.
6. **Automatic Escalation:** Every 24 hours a ticket remains unresolved, its score increments by $+1$.

---

## 🧪 Pre-loaded Benchmark Sample Complaints

| ID | Category | Age (Hours) | Weight | Status | Calculated Score | Priority Level |
| :--- | :--- | :--- | :---: | :--- | :---: | :--- |
| **C03** | Classroom | 72 hrs (3d) | 1 | Raised | $1 + 3 = 4$ | **High Priority** *(#1 in Queue on tie-break)* |
| **C01** | Wi-Fi | 48 hrs (2d) | 2 | Raised | $2 + 2 = 4$ | **High Priority** *(#2 in Queue)* |
| **C02** | Hostel | 8 hrs (0d) | 2 | In Progress | $2 + 0 = 2$ | **Medium Priority** *(#3 in Queue)* |
| **C04** | Laboratory | 24 hrs (1d) | 3 | **Resolved** | $3 + 1 = 4$ | *Excluded from Unresolved Queue* |

---

## 🛠️ Technology Stack

- **Frontend:** React 19, Vite, Tailwind CSS v3.4, Lucide React icons, Recharts (Area, Bar, Pie charts).
- **Backend:** Node.js v24, Express.js REST API.
- **Database:** Native persistent SQLite (`node:sqlite`) with `complaints.db`.
- **Fault-Tolerance:** Automated mirror fallback to `localStorage` if backend is disconnected, ensuring 100% uptime.

---

## 📋 Running the Project Locally

### 1. Start the Backend API (Port 5000):
```bash
cd server
node server.js
```

### 2. Start the Frontend Client (Port 5173):
```bash
cd client
npm run dev
```

Visit [http://localhost:5173/](http://localhost:5173/) in your web browser.
