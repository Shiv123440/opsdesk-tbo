# OpsDesk — TBO Travel Operations CRM & Case Management Platform
> **VoyageHack 4.0 (TBO.com) Submission | Challenge 1: OpsDesk (Building Software Faster)**

OpsDesk is an AI-enhanced, next-generation B2B operations ticketing platform built specifically for TBO.com's operational complexity. Rather than treating customer contacts as isolated, reactive tickets with hardcoded FIFO triggers and blind transfers, OpsDesk puts **Relationships, Context, and Travel Urgency first**.

---

## 🎯 Executive Summary & Problem Mapping

| # | Current Ticketing Limitation (Part A) | How OpsDesk Solves It (Part B) | Demo Proof in OpsDesk |
|---|---------------------------------------|---------------------------------|-----------------------|
| **1** | **Tickets Without Context**: Every interaction is treated as an isolated task. 3 separate tickets for the same refund request. | **First-Class Booking (TBOH) Linkage & Intent Taxonomy**: Automatically links tickets by TBOH, Agency, and Sub-intent into unified case dossiers. | Click `TBOT-1001` or `TBOT-1002` to see the live 3-ticket cluster for `TBOH-89211`. |
| **2** | **Inefficient Routing & Ownership**: Hardcoded FIFO/LIFO rules with weak regional, time, and availability awareness. | **Intelligent Travel-Aware Routing Engine**: Scores region, agent capacity, priority, and check-in proximity. Shows routing audit reasoning. | View assigned queues and audit trail tags (e.g., `EMEA Match + Availability Check`). |
| **3** | **Fragile Side Conversations**: External threads with suppliers default to ticket groups and break or lose recipients on transfer. | **Resilient Side Conversations**: Explicit external recipient lists (airlines, hotel bedbanks, DMCs) that persist across transfers. | Open side conversation on `TBOT-1004` (WebBeds Desk) or `TBOT-1006` (Rome DMC). Reassigning the ticket preserves all recipients. |
| **4** | **Generic SLAs & Difficult Escalation**: One-size-fits-all timer ignoring real-world travel urgency (Check-in, LCD). Escalation only via email. | **Travel-Aware Dynamic SLA + First-Class Escalation**: SLA timers calculate proximity to Check-In Date and Last Cancellation Date (LCD). Direct 1-click escalate to Escalation Manager. | `TBOT-1001` breaches due to imminent LCD (<6h); `TBOT-1004` flags At-Risk due to guest arriving at front desk today. |
| **5** | **Broken Feedback Loop**: Insights trapped in ticket history. Third-party AI tools cost extra. | **Real-Time Conversation Theme Miner**: Continuously extracts repeat root causes and supplier friction hotspots into actionable backlog items. | Click **"Theme Insights Loop"** in the sidebar. |
| **6** | **3K-Row Data Limits & Archival Tax**: Severe row caps and lack of real-time sync. | **Uncapped Streaming Data Export**: Direct streaming CSV/JSON export path designed for high-scale travel operations. | Click **"Uncapped Data Export"** in the sidebar. |

---

## 🚀 Live Demo & Run Steps

### 1. Requirements
- Node.js (v18+)

### 2. Quick Start
```bash
# Navigate to project folder
cd opsdesk

# Dependencies are already installed, or run:
npm install

# Start the OpsDesk server
node src/server.js
```

### 3. Open Web Application
Open your browser at:
👉 **`http://localhost:3000`**

---

## 📋 5-Minute Demo Script (For Judges)

### Journey A: Context & First-Class Ticket Linkage (Problem 1)
1. In the ticket queue, click on **`TBOT-1001`** (Flight cancellation & emergency refund for `TBOH-89211`).
2. Notice the **First-Class Linked History** panel: OpsDesk immediately surfaces two other related tickets (`TBOT-1002` and `TBOT-1003`) opened by **Royal Travels Dubai** for the same booking.
3. The agent does not need to ask the agency to repeat their story or check a disjointed third-party app — full context is available in one view.

### Journey B: Intelligent Routing & Ownership (Problem 2)
1. Click **"Simulate New Ticket"** in the top-right header.
2. Enter booking `TBOH-77142`, title: *"Hotel voucher denied at check-in counter"*.
3. Notice the **AI Intent Auto-Detector** dynamically classifies the category as `Check-in Issue` (`Hotel Voucher Denied`) with 91% confidence.
4. Set Check-in Date to today and click **"Create & Auto-Route"**.
5. Observe the routing audit badge: OpsDesk routes the ticket directly to the Duty Desk / Escalation Manager because the check-in is imminent (<24 hours).

### Journey C: Resilient Supplier Side Conversations (Problem 3)
1. Select **`TBOT-1004`** (Guest voucher issue with WebBeds Asia).
2. Scroll to **"Side Conversations"**: see the active thread with WebBeds Ops (`sg-relo@webbeds.com`).
3. Click **"Reassign"** at the top right and transfer the ticket to another agent.
4. Return to the side conversation: note that **all external supplier recipients and thread histories remain completely intact**.

### Journey D: Travel-Aware SLA & First-Class Escalation (Problem 4)
1. Select the **"Escalations & At-Risk"** view from the left sidebar.
2. Observe `TBOT-1001` and `TBOT-1006`: their SLAs are calculated from **Check-In Proximity** and **Last Cancellation Date (LCD)** rather than generic 24-hour clocks.
3. For any ticket, click **"Escalate to EM"** — the ticket immediately moves to the Escalation Manager queue (`Vikram Malhotra`) with an audit reason logged in the timeline.

### Journey E: Feedback Loop & Theme Insights (Problem 5 & 6)
1. Click **"Theme Insights Loop"** in the sidebar.
2. Review the top recurring operational bottlenecks mined from conversation threads:
   - *Repeat Refund Inquiries for Same TBOH* (Product fix: Show live supplier refund status inside agency portal).
   - *Voucher Delivery Failure at Front Desk* (Product fix: Trigger automated API voucher push to hotel PMS 2 hours before check-in).
3. Click **"Uncapped Data Export"** to stream all operational data without third-party 3,000-row export caps.

---

## 🛠️ Architecture & Tech Stack

```
   [ Agency Portal / Support API ]
                 │
                 ▼
   ┌──────────────────────────────────────────────────────────┐
   │                  OpsDesk Engine                         │
   │  ┌───────────────────────────┬────────────────────────┐  │
   │  │   Travel Intent Engine    │   Dynamic Travel SLA   │  │
   │  │ (Taxonomy + NLP Matching) │  (Check-In & LCD Calc) │  │
   │  ├───────────────────────────┼────────────────────────┤  │
   │  │ Multi-Factor Routing Core │ Side Conversation Hub  │  │
   │  │ (Region + Urgency + Load) │ (Transfer-Proof Recip) │  │
   │  └───────────────────────────┴────────────────────────┘  │
   │              │                            │              │
   │              ▼                            ▼              │
   │       [ Linked Dossier ]           [ Theme Miner ]       │
   │   (TBOH + Agency Clusters)     (Backlog Action Loop)     │
   └──────────────────────────────────────────────────────────┘
```

- **Frontend**: Lightweight, responsive Single Page Architecture (Tailwind CSS, FontAwesome, Vanilla JS)
- **Backend**: Node.js & Express RESTful API
- **AI / Intent Layer**: Travel-specific intent classification & heuristic urgency scoring
- **Data Layer**: In-memory relational schema designed for straightforward transition to PostgreSQL / ClickHouse for large-scale operations.

---

## 👥 Demo Personas
- **Tariq Mansoor** (`AGT-102`): EMEA Operations Agent
- **Vikram Malhotra** (`EM-01`): Global Escalation Manager
- **Elena Rostova** (`LEAD-01`): Ops Lead & Governance
- **Royal Travels Dubai** (`AGY-101`): B2B Travel Agency
