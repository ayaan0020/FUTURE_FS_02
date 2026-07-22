# Client Lead Management System (Mini CRM)

> **Task 2 - Full Stack Web Development (2026)**  
> **Built by Future Interns** | **GitHub Repo:** [ayaan0020/FUTURE_FS_02](https://github.com/ayaan0020/FUTURE_FS_02)

---

## 🔍 About the Project

**LeadFlow Mini CRM** is a lightweight, high-performance Client Lead Management System designed for agencies, freelancers, and startups. 

Whenever a prospect fills out a contact form on a client website, business owners need a reliable workflow to:
1. **Capture & Store** website leads automatically in a central database.
2. **Track Pipeline Status** (`New` → `Contacted` → `In Progress` → `Converted` → `Lost`).
3. **Log Follow-up Interactions** (Calls, Emails, Meetings, and Timestamped Notes).
4. **Analyze Sales Metrics** (Conversion Ratios, Won Revenue, Acquisition Channels).

This application solves these exact business challenges with a sleek, responsive React dashboard backed by a Node.js/Express REST API.

---

## ✨ Key Features

- **🎯 Live Public Contact Form Simulator**: Embedded website contact widget that demonstrates real-time lead ingestion into the CRM via `POST /api/public/contact`.
- **📊 Executive Analytics Dashboard**: Real-time summary cards for Total Leads, Active Pipeline, Converted Clients, Conversion Rate %, and Won Revenue.
- **🔄 Dual Pipeline Views**:
  - **Searchable & Filterable Table**: Multi-field search (name, email, company) with status, source, and priority filters.
  - **Drag-and-Drop Style Kanban Board**: Visual workflow columns for quick status advancement across sales stages.
- **📝 Follow-up Activity Log & Timeline**: Comprehensive interaction stream for each lead (Log Phone Calls, Email Threads, Meetings, and Internal Notes).
- **🔒 Secure Admin Access**: JWT authentication with password hashing (`bcryptjs`) and pre-configured quick demo login.
- **⚡ Zero-Config Dual Storage**: Runs out of the box with zero setup using an embedded **SQLite** database, while seamlessly supporting **MongoDB** if a `MONGO_URI` is provided.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 (Vite)
- **UI & Icons**: Lucide React, Glassmorphism CSS Design System
- **Theme**: Light & Dark mode toggle with custom CSS variables & Google Fonts (Inter & Outfit)

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Authentication**: JSON Web Tokens (`jsonwebtoken`), `bcryptjs`
- **Database**: Dual Adapter — **SQLite** (via `sqlite3`) with optional **MongoDB** / Mongoose integration.

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18.0 or higher
- **npm**: v9.0 or higher

### Installation & Launch

1. **Clone the Repository**
   ```bash
   git clone https://github.com/ayaan0020/FUTURE_FS_02.git
   cd FUTURE_FS_02
   ```

2. **Install All Dependencies**
   ```bash
   npm run install:all
   ```

3. **Start the Development Servers**
   Run both backend API and React frontend concurrently:
   ```bash
   npm run dev
   ```

   - **Backend API**: Running on `http://localhost:5001`
   - **Frontend App**: Accessible at `http://localhost:3000`

---

## 🔑 Admin Login Credentials

For quick evaluation, click the **"1-Click Quick Demo Login"** button on the login screen, or use:

- **Email**: `admin@crm.com`
- **Password**: `admin123`

---

## 📡 API Documentation

### Public Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/public/contact` | Capture lead from website contact form |

### Admin Auth Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Authenticate admin & receive JWT token |
| `GET` | `/api/auth/me` | Fetch active user profile |

### Lead Management Endpoints (Protected)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/leads` | List leads (supports `?q=`, `status=`, `source=`) |
| `GET` | `/api/leads/:id` | Get single lead with activity timeline |
| `POST` | `/api/leads` | Create a lead manually |
| `PUT` | `/api/leads/:id` | Full update lead information |
| `PATCH` | `/api/leads/:id/status` | Update pipeline status |
| `POST` | `/api/leads/:id/notes` | Add follow-up note / log activity |
| `DELETE` | `/api/leads/:id` | Delete a lead record |

### Analytics Endpoints (Protected)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/analytics/summary` | Get CRM metrics, conversion rates, and acquisition breakdown |

---

## 📁 Repository Structure

```
.
├── server/
│   ├── config/             # Database connection & SQLite schema
│   ├── middleware/         # Auth verification & error handlers
│   ├── routes/             # REST API controllers (/auth, /leads, /analytics, /public)
│   ├── seed/               # Sample data & admin account seeder
│   └── index.js            # Express server entry point
├── client/
│   ├── src/
│   │   ├── components/     # Sidebar, LeadTable, KanbanBoard, StatCards, Modals
│   │   ├── context/        # AuthContext & Theme state
│   │   ├── pages/          # DashboardPage, AnalyticsPage, PublicDemoPage, LoginPage
│   │   ├── services/       # Fetch API wrapper
│   │   └── index.css       # Design tokens & theme variables
│   └── index.html
├── package.json            # Root scripts (install:all, dev, seed)
└── README.md
```

---

## 💼 Business Impact & Value

> *"How quickly can a business owner see new leads? Can they track follow-ups easily and calculate conversion rates?"*

LeadFlow CRM addresses these core business questions by transforming unstructured contact form submissions into actionable sales pipelines. Small business owners and freelancers can immediately see incoming opportunities, log phone calls and client discussions, and calculate exact conversion ratios.

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).
