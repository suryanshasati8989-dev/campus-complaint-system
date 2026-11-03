# 🎓 CampusPulse — Campus Complaint Management System

A full-stack, modern, responsive, and persistent **Campus Complaint Management System** designed for colleges and universities. Features automated urgency calculation, priority dispatch queues, status audit histories, interactive analytics, and persistent SQLite database storage.

---

## 🌐 Local Access Links

| Application | Local URL | Network URL |
| :--- | :--- | :--- |
| **Frontend Web App** | [http://localhost:5173/](http://localhost:5173/) | `http://10.134.39.144:5173/` |
| **Backend REST API** | [http://localhost:5000/api](http://localhost:5000/api) | `http://localhost:5000/api/complaints` |
| **API Health Status** | [http://localhost:5000/api/health](http://localhost:5000/api/health) | `{"status":"ok"}` |

---

## 🔑 Demo Administrator Credentials

The application includes an administrator login portal with a 1-click **Autofill** helper:

- **Email:** `admin@college.edu` *(or `admin@campus.edu`)*
- **Password:** `admin123`
- **Role:** Chief Campus Administrator *(Dr. S. K. Raman)*
- **Student Mode:** A 1-click student mode is also available to test filing complaints from a student's perspective without authentication friction.

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
