# LeadFlow CRM — Client Lead Management System

> **Task 2 - Full Stack Web Development (2026)**  
> **Built by Future Interns** | **GitHub Repo:** [ayaan0020/FUTURE_FS_02](https://github.com/ayaan0020/FUTURE_FS_02)

---

## 🔗 Live Deployments

- **🌐 Live Front-End (Vercel)**: [https://client-three-rho-98.vercel.app](https://client-three-rho-98.vercel.app)
- **⚡ Live Back-End API (Render)**: [https://mini-crm-backend-5see.onrender.com/api/health](https://mini-crm-backend-5see.onrender.com/api/health)
- **🔑 Admin Evaluation Credentials**:
  - **Email**: `admin@crm.com`
  - **Password**: `admin123` *(Or click the "1-Click Quick Demo Login" on the screen)*

---

## 🛠️ Tech Stack & Badges

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)

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

## 🚀 Quick Start Guide (Local Development)

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

## 🌐 Production Deployment Guide

To deploy this full-stack application to production, follow these steps to connect your GitHub repository directly to Vercel (frontend) and Render (backend) with continuous integration (CI/CD).

### Part 1: Deploy Backend REST API to Render
1. Sign in to your **[Render Dashboard](https://dashboard.render.com/)**.
2. Click **New +** and select **Web Service**.
3. Connect your GitHub repository `https://github.com/ayaan0020/FUTURE_FS_02`.
4. Configure the service settings:
   - **Name**: `leadflow-crm-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install --prefix server`
   - **Start Command**: `npm start --prefix server`
5. Add the following **Environment Variables**:
   - `PORT`: `5001`
   - `JWT_SECRET`: `any-secure-random-secret-key`
   - `NODE_ENV`: `production`
6. Click **Deploy Web Service**.
7. Once deployed, copy your backend URL (e.g., `https://mini-crm-backend-5see.onrender.com`).

### Part 2: Deploy Frontend React to Vercel
1. Sign in to your **[Vercel Dashboard](https://vercel.com/)**.
2. Click **Add New** and select **Project**.
3. Import your GitHub repository `https://github.com/ayaan0020/FUTURE_FS_02`.
4. Configure the project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `client` (Critical: Point this to the frontend subdirectory)
5. Under **Environment Variables**, add:
   - Key: `VITE_API_BASE_URL`
   - Value: `<YOUR_RENDER_BACKEND_URL>/api` (e.g. `https://mini-crm-backend-5see.onrender.com/api`)
6. Click **Deploy**. Vercel will build the project and output your live frontend domain!

---

## 🔑 Admin Evaluation Credentials

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

### Lead Management Endpoints (Protected with JWT Header `Authorization: Bearer <token>`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/leads` | List leads (supports search `?q=`, filter `?status=`, `?source=`) |
| `GET` | `/api/leads/:id` | Get single lead with activity timeline |
| `POST` | `/api/leads` | Create a lead manually |
| `PUT` | `/api/leads/:id` | Full update lead information |
| `PATCH` | `/api/leads/:id/status` | Update pipeline status |
| `POST` | `/api/leads/:id/notes` | Add follow-up note / log activity |
| `DELETE` | `/api/leads/:id` | Delete a lead record |

### Analytics Endpoints (Protected with JWT)
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
│   ├── index.html
│   └── vercel.json         # Vercel SPA Routing Configuration
├── package.json            # Root scripts (install:all, dev, seed)
├── render.yaml             # Render Blueprint Configuration
└── README.md
```

---

## 💼 Business Impact & Value

> *"How quickly can a business owner see new leads? Can they track follow-ups easily and calculate conversion rates?"*

LeadFlow CRM addresses these core business questions by transforming unstructured contact form submissions into actionable sales pipelines. Small business owners and freelancers can immediately see incoming opportunities, log phone calls and client discussions, and calculate exact conversion ratios.

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).
