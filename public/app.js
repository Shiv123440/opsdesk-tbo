// Pure client-side data store & engine for 100% resilient deployment everywhere (Vercel, GitHub Pages, Netlify)
let allTickets = [
  {
    id: "TBOT-1001",
    tboh: "TBOH-89211",
    title: "Flight cancellation & immediate refund inquiry",
    description: "Agency requested cancellation of booking TBOH-89211 due to medical emergency and requires an accelerated refund.",
    agencyId: "AGY-101",
    agencyName: "Royal Travels Dubai",
    region: "EMEA",
    category: "Refund",
    subIntent: "Emergency Refund",
    priority: "HIGH",
    status: "Escalated",
    checkInDate: "2026-11-21T04:00:00Z",
    lcd: "2026-11-20T20:00:00Z",
    slaMinutesRemaining: -45,
    slaStatus: "BREACHED",
    assignedTo: "EM-01",
    assignedToName: "Vikram Malhotra (Escalation Manager)",
    routingReason: "Check-in < 24h & LCD imminent: Auto-escalated from EMEA Tier-2 to Escalation Manager",
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    updatedAt: new Date().toISOString(),
    history: [
      { id: "h1", timestamp: new Date(Date.now() - 3600000 * 4).toISOString(), actor: "System", action: "Ticket Created via Agency Portal" },
      { id: "h2", timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), actor: "SLA Watchdog", action: "SLA At Risk: LCD expires in < 6 hours" },
      { id: "h3", timestamp: new Date(Date.now() - 3600000 * 1).toISOString(), actor: "Routing Engine", action: "Escalated to Vikram Malhotra (Escalation Manager)" }
    ],
    sideConversations: [
      {
        id: "sc-1",
        targetType: "Supplier",
        supplierName: "Emirates Airline Desk",
        recipients: ["ops@emirates-partner.com", "tbo-desk@emirates.com"],
        subject: "Urgent Medical Waiver Refund - PNR EK-98214",
        messages: [
          { sender: "Vikram Malhotra (TBO)", time: new Date(Date.now() - 1800000).toISOString(), text: "Please expedite refund review under Medical Exception clause. Certificate attached in original TBOH dossier." }
        ]
      }
    ],
    internalNotes: [
      { id: "n1", author: "Priya Sharma (Agent)", time: new Date(Date.now() - 7200000).toISOString(), text: "Medical cert verified. Supplier fee waiver pending approval." }
    ]
  },
  {
    id: "TBOT-1002",
    tboh: "TBOH-89211",
    title: "Duplicate deduction query for TBOH-89211",
    description: "Agency reports double charge on deposit ledger for the same flight booking TBOH-89211.",
    agencyId: "AGY-101",
    agencyName: "Royal Travels Dubai",
    region: "EMEA",
    category: "Refund",
    subIntent: "Payment Dispute",
    priority: "MEDIUM",
    status: "Open",
    checkInDate: "2026-11-21T04:00:00Z",
    lcd: "2026-11-20T20:00:00Z",
    slaMinutesRemaining: 15,
    slaStatus: "AT_RISK",
    assignedTo: "AGT-102",
    assignedToName: "Tariq Mansoor (EMEA Ops)",
    routingReason: "Region EMEA + Agency Tier 1 + Availability (Score: 92/100)",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date().toISOString(),
    history: [
      { id: "h1", timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), actor: "System", action: "Created & automatically linked to TBOT-1001 via TBOH-89211" }
    ],
    sideConversations: [],
    internalNotes: []
  },
  {
    id: "TBOT-1003",
    tboh: "TBOH-89211",
    title: "Request for credit note copy TBOH-89211",
    description: "Accountant at Royal Travels asking for the credit note invoice copy for tax filing.",
    agencyId: "AGY-101",
    agencyName: "Royal Travels Dubai",
    region: "EMEA",
    category: "Invoicing",
    subIntent: "Credit Note Retrieval",
    priority: "LOW",
    status: "New",
    checkInDate: "2026-11-21T04:00:00Z",
    lcd: "2026-11-20T20:00:00Z",
    slaMinutesRemaining: 120,
    slaStatus: "ON_TRACK",
    assignedTo: null,
    assignedToName: "Unassigned",
    routingReason: "Pending triage in EMEA Finance pool",
    createdAt: new Date(Date.now() - 3600000 * 0.5).toISOString(),
    updatedAt: new Date().toISOString(),
    history: [
      { id: "h1", timestamp: new Date(Date.now() - 3600000 * 0.5).toISOString(), actor: "System", action: "Linked to TBOH-89211 cluster (3 tickets linked)" }
    ],
    sideConversations: [],
    internalNotes: []
  },
  {
    id: "TBOT-1004",
    tboh: "TBOH-44109",
    title: "Hotel voucher not accepted at check-in counter",
    description: "Guest arrived at Grand Plaza Singapore, hotel claims no active reservation received from bedbank supplier WebBeds.",
    agencyId: "AGY-204",
    agencyName: "Pacific Gateway Holidays",
    region: "APAC",
    category: "Check-in Issue",
    subIntent: "Hotel Voucher Denied",
    priority: "HIGH",
    status: "Pending",
    checkInDate: "2026-11-20T17:00:00Z",
    lcd: "2026-11-18T00:00:00Z",
    slaMinutesRemaining: 20,
    slaStatus: "AT_RISK",
    assignedTo: "AGT-201",
    assignedToName: "Aiko Tanaka (APAC Duty Desk)",
    routingReason: "APAC live check-in alert routed to High-Priority Duty Agent",
    createdAt: new Date(Date.now() - 3600000 * 1.5).toISOString(),
    updatedAt: new Date().toISOString(),
    history: [
      { id: "h1", timestamp: new Date(Date.now() - 3600000 * 1.5).toISOString(), actor: "System", action: "Ticket Created via Emergency Hotline" },
      { id: "h2", timestamp: new Date(Date.now() - 3600000 * 1.2).toISOString(), actor: "AGT-201", action: "Initiated supplier side conversation with WebBeds Ops" }
    ],
    sideConversations: [
      {
        id: "sc-2",
        targetType: "Supplier",
        supplierName: "WebBeds Asia",
        recipients: ["sg-relo@webbeds.com", "hotlinesg@webbeds.com"],
        subject: "CRITICAL: Booking Ref WB-992144 - Guest at Counter",
        messages: [
          { sender: "Aiko Tanaka (TBO)", time: new Date(Date.now() - 3600000).toISOString(), text: "Guest Mr. Chen is at front desk. Please re-send supplier voucher immediately to reservations@grandplazasg.com." }
        ]
      }
    ],
    internalNotes: [
      { id: "n1", author: "Aiko Tanaka", time: new Date(Date.now() - 3600000).toISOString(), text: "Called hotel duty manager. WebBeds reservation email was trapped in their spam folder. Awaiting re-confirmation." }
    ]
  },
  {
    id: "TBOT-1005",
    tboh: "TBOH-66321",
    title: "Room upgrade billing discrepancy",
    description: "Agency billed USD 140 instead of quoted USD 90 for sea view upgrade in Bali resort.",
    agencyId: "AGY-204",
    agencyName: "Pacific Gateway Holidays",
    region: "APAC",
    category: "Booking Amendment",
    subIntent: "Price Mismatch",
    priority: "LOW",
    status: "Resolved",
    checkInDate: "2026-12-05T10:00:00Z",
    lcd: "2026-11-28T00:00:00Z",
    slaMinutesRemaining: 480,
    slaStatus: "ON_TRACK",
    assignedTo: "AGT-201",
    assignedToName: "Aiko Tanaka (APAC Duty Desk)",
    routingReason: "Account match + normal priority queue",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    history: [
      { id: "h1", timestamp: new Date(Date.now() - 86400000).toISOString(), actor: "System", action: "Ticket Created" },
      { id: "h2", timestamp: new Date(Date.now() - 14400000).toISOString(), actor: "AGT-201", action: "Adjusted invoice with USD 50 credit note. Resolved." }
    ],
    sideConversations: [],
    internalNotes: []
  },
  {
    id: "TBOT-1006",
    tboh: "TBOH-77142",
    title: "Sightseeing tour bus breakdown in Rome",
    description: "Group of 14 passengers stranded during Colosseum & Vatican full day excursion.",
    agencyId: "AGY-305",
    agencyName: "EuroVenture Travel London",
    region: "EMEA",
    category: "Sightseeing Disruption",
    subIntent: "Transport Breakdown",
    priority: "HIGH",
    status: "Escalated",
    checkInDate: "2026-11-20T09:00:00Z",
    lcd: "2026-11-19T00:00:00Z",
    slaMinutesRemaining: -10,
    slaStatus: "BREACHED",
    assignedTo: "EM-01",
    assignedToName: "Vikram Malhotra (Escalation Manager)",
    routingReason: "Passenger stranded indicator triggered instant escalation",
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    updatedAt: new Date().toISOString(),
    history: [
      { id: "h1", timestamp: new Date(Date.now() - 7200000).toISOString(), actor: "System", action: "Ticket opened via phone incident bridge" },
      { id: "h2", timestamp: new Date(Date.now() - 5000000).toISOString(), actor: "Routing Engine", action: "Auto-escalated to Escalation Manager" }
    ],
    sideConversations: [
      {
        id: "sc-3",
        targetType: "Supplier",
        supplierName: "Rome Cabs & Tours DMC",
        recipients: ["dispatch@rometours.it", "operations@rometours.it"],
        subject: "URGENT REPLACEMENT VEHICLE - 14 PAX",
        messages: [
          { sender: "Vikram Malhotra", time: new Date(Date.now() - 4000000).toISOString(), text: "Has replacement bus dispatched? Provide driver ETA and phone number now." }
        ]
      }
    ],
    internalNotes: []
  }
];

const agentsList = [
  { id: "AGT-101", name: "Sarah Jenkins", region: "AMER", tier: "Tier-2", activeTickets: 3, maxCapacity: 10, availability: "AVAILABLE" },
  { id: "AGT-102", name: "Tariq Mansoor", region: "EMEA", tier: "Tier-1", activeTickets: 7, maxCapacity: 10, availability: "AVAILABLE" },
  { id: "AGT-201", name: "Aiko Tanaka", region: "APAC", tier: "Tier-2", activeTickets: 5, maxCapacity: 10, availability: "AVAILABLE" },
  { id: "EM-01", name: "Vikram Malhotra", region: "GLOBAL", role: "Escalation Manager", activeTickets: 2, maxCapacity: 6, availability: "AVAILABLE" },
  { id: "LEAD-01", name: "Elena Rostova", region: "GLOBAL", role: "Ops Lead", activeTickets: 1, maxCapacity: 5, availability: "AVAILABLE" }
];

let currentSelectedId = "TBOT-1001";
let currentView = 'all';
let currentPersona = 'agent';

function calculateTravelSLA(ticket) {
  const now = new Date();
  const checkIn = ticket.checkInDate ? new Date(ticket.checkInDate) : null;
  const lcd = ticket.lcd ? new Date(ticket.lcd) : null;

  let baseMinutes = 240;
  if (ticket.priority === 'HIGH') baseMinutes = 60;
  if (ticket.priority === 'LOW') baseMinutes = 480;

  let checkInUrgencyHours = checkIn ? (checkIn.getTime() - now.getTime()) / 36e5 : null;
  let lcdUrgencyHours = lcd ? (lcd.getTime() - now.getTime()) / 36e5 : null;

  let dynamicMinutes = baseMinutes;
  let reasonTag = "Standard Priority Clock";

  if (checkInUrgencyHours !== null && checkInUrgencyHours <= 24 && checkInUrgencyHours > 0) {
    dynamicMinutes = Math.min(dynamicMinutes, 30);
    reasonTag = `Check-in Imminent (${Math.round(checkInUrgencyHours)}h remaining)`;
  } else if (checkInUrgencyHours !== null && checkInUrgencyHours <= 0) {
    dynamicMinutes = 15;
    reasonTag = "Guest In-Transit / At Counter";
  }

  if (lcdUrgencyHours !== null && lcdUrgencyHours <= 6 && lcdUrgencyHours > 0) {
    dynamicMinutes = Math.min(dynamicMinutes, 20);
    reasonTag = `LCD Cancellation Cutoff in ${Math.round(lcdUrgencyHours * 60)} mins`;
  }

  const created = new Date(ticket.createdAt || now);
  const elapsedMinutes = Math.round((now.getTime() - created.getTime()) / (1000 * 60));
  const remainingMinutes = dynamicMinutes - elapsedMinutes;

  let status = "ON_TRACK";
  if (remainingMinutes <= 0) {
    status = "BREACHED";
  } else if (remainingMinutes <= 30) {
    status = "AT_RISK";
  }

  return { allocatedMinutes: dynamicMinutes, elapsedMinutes, remainingMinutes, status, reasonTag };
}

function enrichTicket(t) {
  const sla = calculateTravelSLA(t);
  return {
    ...t,
    dynamicSLA: sla,
    slaStatus: sla.status,
    slaMinutesRemaining: sla.remainingMinutes
  };
}

document.addEventListener('DOMContentLoaded', () => {
  loadTickets();
});

function loadTickets() {
  const region = document.getElementById('regionFilter').value;
  let list = allTickets.map(enrichTicket);

  if (region) {
    list = list.filter(t => t.region === region);
  }

  if (currentView === 'triage') {
    list = list.filter(t => !t.assignedTo || t.status === 'New');
  } else if (currentView === 'escalation') {
    list = list.filter(t => t.status === 'Escalated' || t.slaStatus === 'BREACHED' || t.slaStatus === 'AT_RISK');
  } else if (currentView === 'my_queue') {
    list = list.filter(t => t.assignedTo === 'AGT-102');
  }

  updateBadgeCounts();
  renderTicketList(list);

  if (currentSelectedId) {
    renderDetail(currentSelectedId);
  } else if (list.length > 0) {
    selectTicket(list[0].id);
  }
}

function updateBadgeCounts() {
  const enriched = allTickets.map(enrichTicket);
  document.getElementById('badge-all-count').innerText = enriched.length;
  document.getElementById('badge-my-count').innerText = enriched.filter(t => t.assignedTo === 'AGT-102').length;
  document.getElementById('badge-esc-count').innerText = enriched.filter(t => t.status === 'Escalated' || t.slaStatus === 'BREACHED' || t.slaStatus === 'AT_RISK').length;
  document.getElementById('badge-triage-count').innerText = enriched.filter(t => !t.assignedTo || t.status === 'New').length;
}

function setView(view) {
  currentView = view;
  ['all', 'my_queue', 'escalation', 'triage'].forEach(v => {
    const el = document.getElementById(`nav-${v}`);
    if (v === view) {
      el.className = "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition bg-indigo-600/20 text-indigo-400 border border-indigo-500/30";
    } else {
      el.className = "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition hover:bg-slate-800 text-slate-300";
    }
  });

  const titles = {
    all: 'All Active Tickets',
    my_queue: 'My Assigned Queue (Tariq Mansoor)',
    escalation: 'Escalations & Travel-Urgent SLA Queue',
    triage: 'Unassigned Incoming Triage'
  };
  document.getElementById('currentViewTitle').innerText = titles[view] || 'Tickets';
  loadTickets();
}

function switchPersona() {
  currentPersona = document.getElementById('personaSelect').value;
  if (currentPersona === 'em') {
    setView('escalation');
  } else if (currentPersona === 'agent') {
    setView('my_queue');
  } else {
    setView('all');
  }
}

function filterLocalTickets() {
  const q = document.getElementById('quickFilter').value.toLowerCase();
  const filtered = allTickets.map(enrichTicket).filter(t => 
    t.title.toLowerCase().includes(q) ||
    t.tboh.toLowerCase().includes(q) ||
    t.agencyName.toLowerCase().includes(q) ||
    t.id.toLowerCase().includes(q)
  );
  renderTicketList(filtered);
}

function renderTicketList(list) {
  const container = document.getElementById('ticketList');
  document.getElementById('ticketCountLabel').innerText = `Showing ${list.length} tickets`;

  if (!list.length) {
    container.innerHTML = `<div class="p-8 text-center text-slate-400 text-xs">No tickets found for this queue.</div>`;
    return;
  }

  container.innerHTML = list.map(t => {
    const isSelected = t.id === currentSelectedId;
    let badgeClass = 'badge-ontrack';
    let slaLabel = `${t.slaMinutesRemaining}m left`;
    if (t.slaStatus === 'BREACHED') {
      badgeClass = 'badge-breached';
      slaLabel = `Breached by ${Math.abs(t.slaMinutesRemaining)}m`;
    } else if (t.slaStatus === 'AT_RISK') {
      badgeClass = 'badge-atrisk';
      slaLabel = `At-Risk (${t.slaMinutesRemaining}m left)`;
    }

    return `
      <div onclick="selectTicket('${t.id}')" class="p-4 cursor-pointer transition border-l-4 ${isSelected ? 'bg-indigo-50/70 border-indigo-600' : 'hover:bg-slate-50 border-transparent'}">
        <div class="flex items-center justify-between mb-1.5">
          <div class="flex items-center gap-2">
            <span class="font-mono text-xs font-bold text-slate-700">${t.id}</span>
            <span class="bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold">${t.tboh}</span>
          </div>
          <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full ${badgeClass}">
            <i class="fa-solid fa-clock mr-1 text-[9px]"></i>${slaLabel}
          </span>
        </div>
        <h4 class="text-sm font-semibold text-slate-900 line-clamp-1 mb-1">${t.title}</h4>
        <div class="flex items-center justify-between text-xs text-slate-500">
          <span class="truncate max-w-[150px]"><i class="fa-regular fa-building text-slate-400 mr-1"></i>${t.agencyName}</span>
          <span class="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-medium text-slate-600">${t.category}</span>
        </div>
        <div class="mt-2 flex items-center justify-between text-[11px] text-slate-400">
          <span><i class="fa-solid fa-user-circle mr-1"></i>${t.assignedToName || 'Unassigned'}</span>
          <span>${t.region}</span>
        </div>
      </div>
    `;
  }).join('');
}

function selectTicket(id) {
  currentSelectedId = id;
  loadTickets();
  renderDetail(id);
}

function renderDetail(id) {
  const container = document.getElementById('detailPane');
  const t = allTickets.map(enrichTicket).find(x => x.id === id);
  if (!t) return;

  const linkedTBOH = allTickets.map(enrichTicket).filter(x => x.tboh === t.tboh && x.id !== t.id);

  let slaClass = 'text-emerald-700 bg-emerald-50 border-emerald-300';
  if (t.slaStatus === 'BREACHED') slaClass = 'text-red-700 bg-red-50 border-red-300';
  if (t.slaStatus === 'AT_RISK') slaClass = 'text-amber-700 bg-amber-50 border-amber-300';

  container.innerHTML = `
    <!-- Header Info Banner -->
    <div class="bg-white rounded-xl p-5 shadow-sm border border-slate-200 mb-5">
      <div class="flex items-start justify-between">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="text-xs font-mono font-bold text-slate-500">${t.id}</span>
            <span class="bg-indigo-600 text-white font-mono text-xs px-2 py-0.5 rounded font-semibold">${t.tboh}</span>
            <span class="text-xs px-2 py-0.5 rounded-full font-medium ${t.priority === 'HIGH' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'}">${t.priority} Priority</span>
            <span class="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">${t.status}</span>
          </div>
          <h2 class="text-lg font-bold text-slate-900">${t.title}</h2>
          <p class="text-xs text-slate-500 mt-1">Agency: <strong>${t.agencyName}</strong> (${t.agencyId}) • Region: ${t.region}</p>
        </div>

        <div class="flex items-center gap-2">
          <button onclick="promptReassign('${t.id}')" class="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50">
            <i class="fa-solid fa-arrow-right-arrow-left mr-1"></i> Reassign
          </button>
          <button onclick="promptEscalate('${t.id}')" class="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700 shadow-sm">
            <i class="fa-solid fa-triangle-exclamation mr-1"></i> Escalate to EM
          </button>
        </div>
      </div>

      <!-- Travel SLA Urgency Bar -->
      <div class="mt-4 p-3 rounded-lg border ${slaClass} flex items-center justify-between text-xs">
        <div class="flex items-center gap-2">
          <i class="fa-solid fa-hourglass-half"></i>
          <span><strong>Travel SLA:</strong> ${t.dynamicSLA.reasonTag}</span>
        </div>
        <div class="font-mono font-semibold">
          ${t.slaStatus === 'BREACHED' ? 'SLA EXPIRED' : `${t.slaMinutesRemaining} minutes remaining`}
        </div>
      </div>

      <!-- Travel Dates -->
      <div class="grid grid-cols-2 gap-3 mt-3 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200">
        <div>
          <span class="text-slate-500 block text-[10px] uppercase font-semibold">Guest Check-In Date</span>
          <span class="font-medium text-slate-800">${new Date(t.checkInDate).toLocaleString()}</span>
        </div>
        <div>
          <span class="text-slate-500 block text-[10px] uppercase font-semibold">Last Cancellation Date (LCD)</span>
          <span class="font-medium text-slate-800">${new Date(t.lcd).toLocaleString()}</span>
        </div>
      </div>

      <!-- Routing Reason -->
      <div class="mt-3 text-xs text-slate-600 bg-indigo-50/50 p-2 rounded border border-indigo-100 flex items-center gap-2">
        <i class="fa-solid fa-route text-indigo-600"></i>
        <span><strong>Routing Audit:</strong> ${t.routingReason} (Assigned: <strong>${t.assignedToName}</strong>)</span>
      </div>
    </div>

    <!-- FIRST-CLASS LINKED HISTORY -->
    <div class="bg-white rounded-xl p-5 shadow-sm border border-slate-200 mb-5">
      <div class="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
        <div class="flex items-center gap-2">
          <i class="fa-solid fa-link text-indigo-600"></i>
          <h3 class="text-sm font-bold text-slate-800">First-Class Linked History for ${t.tboh}</h3>
        </div>
        <span class="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-semibold border border-indigo-200">
          ${linkedTBOH.length} Related Case(s)
        </span>
      </div>

      ${linkedTBOH.length === 0 ? 
        `<p class="text-xs text-slate-400">No other open tickets for this booking reference.</p>` :
        `<div class="space-y-2">
          ${linkedTBOH.map(lt => `
            <div onclick="selectTicket('${lt.id}')" class="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg cursor-pointer flex items-center justify-between text-xs transition">
              <div>
                <div class="flex items-center gap-2 mb-0.5">
                  <span class="font-mono font-bold text-slate-700">${lt.id}</span>
                  <span class="px-1.5 py-0.5 rounded text-[10px] bg-slate-200 text-slate-700 font-medium">${lt.category} - ${lt.subIntent}</span>
                  <span class="text-[10px] font-semibold text-slate-500">${lt.status}</span>
                </div>
                <p class="text-slate-800 font-medium">${lt.title}</p>
              </div>
              <div class="text-right text-slate-400 text-[11px]">
                <span>${new Date(lt.createdAt).toLocaleDateString()}</span>
                <i class="fa-solid fa-arrow-right ml-2 text-indigo-600"></i>
              </div>
            </div>
          `).join('')}
        </div>`
      }
    </div>

    <!-- SIDE CONVERSATIONS -->
    <div class="bg-white rounded-xl p-5 shadow-sm border border-slate-200 mb-5">
      <div class="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
        <div class="flex items-center gap-2">
          <i class="fa-solid fa-comments text-emerald-600"></i>
          <h3 class="text-sm font-bold text-slate-800">Side Conversations (Supplier & Agency Threads)</h3>
        </div>
        <button onclick="promptNewSideConvo('${t.id}')" class="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-3 py-1 rounded-lg flex items-center gap-1 shadow-sm">
          <i class="fa-solid fa-plus text-[10px]"></i> New Supplier Thread
        </button>
      </div>

      <p class="text-[11px] text-slate-500 mb-3">
        Explicit external recipients that <strong>survive ticket transfers & reassignments</strong>.
      </p>

      ${!t.sideConversations || t.sideConversations.length === 0 ? 
        `<p class="text-xs text-slate-400 italic">No external supplier threads opened yet.</p>` :
        `<div class="space-y-3">
          ${t.sideConversations.map(sc => `
            <div class="border border-emerald-200 rounded-lg bg-emerald-50/20 p-3.5">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                  <span class="text-xs font-bold text-emerald-900">${sc.supplierName}</span>
                  <span class="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono">${sc.recipients.join(', ')}</span>
                </div>
                <span class="text-[10px] text-slate-400 font-mono">${sc.id}</span>
              </div>
              <h5 class="text-xs font-semibold text-slate-800 mb-2">${sc.subject}</h5>

              <div class="space-y-2 mb-3 bg-white p-3 rounded border border-slate-100 text-xs">
                ${sc.messages.map(m => `
                  <div class="border-b border-slate-100 pb-1.5 last:border-0 last:pb-0">
                    <div class="flex justify-between text-[11px] text-slate-500 mb-0.5">
                      <strong class="text-slate-700">${m.sender}</strong>
                      <span>${new Date(m.time).toLocaleTimeString()}</span>
                    </div>
                    <p class="text-slate-800">${m.text}</p>
                  </div>
                `).join('')}
              </div>

              <div class="flex gap-2">
                <input type="text" id="reply-input-${sc.id}" placeholder="Reply to supplier..." class="flex-1 text-xs border border-slate-300 rounded px-2.5 py-1.5 outline-none focus:ring-1 focus:ring-emerald-500">
                <button onclick="sendSideConvoReply('${t.id}', '${sc.id}')" class="bg-emerald-600 text-white text-xs px-3 py-1.5 rounded hover:bg-emerald-700 font-medium">Send</button>
              </div>
            </div>
          `).join('')}
        </div>`
      }
    </div>
  `;
}

function promptReassign(ticketId) {
  const target = allTickets.find(x => x.id === ticketId);
  if (!target) return;
  const agentOptions = agentsList.map(a => `${a.id}: ${a.name} (${a.region})`).join('\n');
  const agentId = prompt(`Select Agent ID to Reassign:\n${agentOptions}`, 'AGT-101');
  const chosen = agentsList.find(a => a.id === agentId);
  if (chosen) {
    target.assignedTo = chosen.id;
    target.assignedToName = chosen.name;
    target.routingReason = `Manual reassignment to ${chosen.name}. Supplier thread recipients preserved intact.`;
    loadTickets();
  }
}

function promptEscalate(ticketId) {
  const target = allTickets.find(x => x.id === ticketId);
  if (!target) return;
  const reason = prompt('Escalation Reason:', 'Imminent Check-in and uncontactable hotel supplier');
  if (reason) {
    target.status = 'Escalated';
    target.assignedTo = 'EM-01';
    target.assignedToName = 'Vikram Malhotra (Escalation Manager)';
    target.routingReason = `First-Class Escalation: ${reason}`;
    loadTickets();
  }
}

function sendSideConvoReply(ticketId, scId) {
  const input = document.getElementById(`reply-input-${scId}`);
  const text = input.value.trim();
  if (!text) return;

  const target = allTickets.find(x => x.id === ticketId);
  const sc = target.sideConversations.find(s => s.id === scId);
  sc.messages.push({
    sender: 'TBO Support Desk',
    time: new Date().toISOString(),
    text
  });
  input.value = '';
  renderDetail(ticketId);
}

function promptNewSideConvo(ticketId) {
  const supplierName = prompt('Enter Supplier Partner Name:', 'Bedbank Partner Desk');
  if (!supplierName) return;
  const recipients = prompt('Enter Recipient Email(s):', 'ops@bedbank.com');
  if (!recipients) return;
  const subject = prompt('Thread Subject:', 'Urgent Status Inquiry');
  if (!subject) return;

  const target = allTickets.find(x => x.id === ticketId);
  target.sideConversations.push({
    id: `sc-${Math.floor(Math.random()*900 + 100)}`,
    targetType: 'Supplier',
    supplierName,
    recipients: recipients.split(',').map(s=>s.trim()),
    subject,
    messages: [
      { sender: 'TBO Ops Desk', time: new Date().toISOString(), text: 'Inquiry opened.' }
    ]
  });
  loadTickets();
}

function predictIntent() {
  const title = (document.getElementById('form-title').value || '').toLowerCase();
  let cat = 'Booking Amendment (Special Request)';
  let conf = '82% match';

  if (title.includes('refund') || title.includes('cancel')) {
    cat = 'Refund (Emergency Refund)';
    conf = '95% match';
  } else if (title.includes('hotel') || title.includes('voucher') || title.includes('room')) {
    cat = 'Check-in Issue (Hotel Voucher Denied)';
    conf = '92% match';
  } else if (title.includes('bus') || title.includes('tour')) {
    cat = 'Sightseeing Disruption (Transport Breakdown)';
    conf = '89% match';
  }

  document.getElementById('detectedIntentText').innerText = cat;
  document.getElementById('detectedConfidence').innerText = conf;
}

function openNewTicketModal() {
  document.getElementById('newTicketModal').classList.remove('hidden');
}

function closeNewTicketModal() {
  document.getElementById('newTicketModal').classList.add('hidden');
}

function handleCreateTicket(e) {
  e.preventDefault();
  const tboh = document.getElementById('form-tboh').value;
  const agencyName = document.getElementById('form-agencyName').value;
  const region = document.getElementById('form-region').value;
  const title = document.getElementById('form-title').value;
  const description = document.getElementById('form-description').value;
  const priority = document.getElementById('form-priority').value;

  const newT = {
    id: `TBOT-${1000 + allTickets.length + 1}`,
    tboh,
    agencyName,
    agencyId: 'AGY-CUSTOM',
    region,
    title,
    description,
    priority,
    category: title.toLowerCase().includes('refund') ? 'Refund' : 'Check-in Issue',
    subIntent: 'Hotel Voucher Denied',
    status: 'New',
    checkInDate: new Date(Date.now() + 86400000).toISOString(),
    lcd: new Date(Date.now() + 3600000 * 12).toISOString(),
    createdAt: new Date().toISOString(),
    assignedTo: 'AGT-201',
    assignedToName: 'Aiko Tanaka (APAC Duty Desk)',
    routingReason: 'APAC live check-in alert routed to Duty Agent',
    sideConversations: [],
    internalNotes: []
  };

  allTickets.unshift(newT);
  closeNewTicketModal();
  selectTicket(newT.id);
  alert(`Ticket ${newT.id} created and automatically routed!`);
}

function showInsightsModal() {
  document.getElementById('insightsModal').classList.remove('hidden');
  const themeList = document.getElementById('themeList');
  themeList.innerHTML = `
    <div class="p-3 bg-slate-50 border border-slate-200 rounded-lg">
      <div class="flex items-center justify-between mb-1">
        <strong class="text-xs text-slate-800">Repeat Refund Inquiries for Same TBOH</strong>
        <span class="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded font-semibold">High Agency Frustration</span>
      </div>
      <p class="text-xs text-slate-600 mt-1"><strong>Actionable Backlog Fix:</strong> Show live supplier refund status inside Agency Portal</p>
    </div>
    <div class="p-3 bg-slate-50 border border-slate-200 rounded-lg">
      <div class="flex items-center justify-between mb-1">
        <strong class="text-xs text-slate-800">Voucher Delivery Failure at Front Desk</strong>
        <span class="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded font-semibold">High Check-in Escalation</span>
      </div>
      <p class="text-xs text-slate-600 mt-1"><strong>Actionable Backlog Fix:</strong> Trigger automated API voucher push to hotel PMS 2 hours before check-in</p>
    </div>
  `;

  document.getElementById('categoryDist').innerHTML = `
    <div class="flex justify-between border-b py-1"><span>Refund</span><span class="font-bold">3</span></div>
    <div class="flex justify-between border-b py-1"><span>Check-in Issue</span><span class="font-bold">1</span></div>
    <div class="flex justify-between border-b py-1"><span>Disruption</span><span class="font-bold">1</span></div>
  `;

  document.getElementById('supplierFrictionDist').innerHTML = `
    <div class="flex justify-between border-b py-1"><span>WebBeds Asia</span><span class="font-bold text-red-600">2 issues</span></div>
    <div class="flex justify-between border-b py-1"><span>Emirates Airline</span><span class="font-bold text-red-600">1 issue</span></div>
  `;
}

function closeInsightsModal() {
  document.getElementById('insightsModal').classList.add('hidden');
}

function exportCSV() {
  let csv = 'TicketID,TBOH,Agency,Region,Category,Priority,Status\n';
  allTickets.forEach(t => {
    csv += `"${t.id}","${t.tboh}","${t.agencyName}","${t.region}","${t.category}","${t.priority}","${t.status}"\n`;
  });
  const blob = new Blob([csv], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'opsdesk_tickets_full_extract.csv';
  a.click();
}
