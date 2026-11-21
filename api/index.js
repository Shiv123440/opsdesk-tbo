const { v4: uuidv4 } = require('uuid');

const initialTickets = [
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
      { id: "n1", author: "Aiko Tanaka", time: new Date(Date.now() - 3600000).toISOString(), text: "Called hotel duty manager. WebBeds reservation email was trapped in their spam folder." }
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
    history: [],
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
    history: [],
    sideConversations: [],
    internalNotes: []
  }
];

const agents = [
  { id: "AGT-101", name: "Sarah Jenkins", region: "AMER", tier: "Tier-2", activeTickets: 3, maxCapacity: 10, availability: "AVAILABLE" },
  { id: "AGT-102", name: "Tariq Mansoor", region: "EMEA", tier: "Tier-1", activeTickets: 7, maxCapacity: 10, availability: "AVAILABLE" },
  { id: "AGT-201", name: "Aiko Tanaka", region: "APAC", tier: "Tier-2", activeTickets: 5, maxCapacity: 10, availability: "AVAILABLE" },
  { id: "EM-01", name: "Vikram Malhotra", region: "GLOBAL", role: "Escalation Manager", activeTickets: 2, maxCapacity: 6, availability: "AVAILABLE" },
  { id: "LEAD-01", name: "Elena Rostova", region: "GLOBAL", role: "Ops Lead", activeTickets: 1, maxCapacity: 5, availability: "AVAILABLE" }
];

let tickets = [...initialTickets];

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
  return { ...t, dynamicSLA: sla, slaStatus: sla.status, slaMinutesRemaining: sla.remainingMinutes };
}

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const url = req.url || '';

  // 1. Meta
  if (url.includes('/api/meta')) {
    return res.json({ agents, taxonomy: {} });
  }

  // 2. Linked tickets
  if (url.includes('/linked')) {
    const idMatch = url.match(/\/api\/tickets\/([^\/]+)\/linked/);
    const id = idMatch ? idMatch[1] : '';
    const ticket = tickets.find(t => t.id === id);
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

    const linkedTBOH = tickets.filter(t => t.tboh === ticket.tboh && t.id !== ticket.id).map(enrichTicket);
    const linkedByAgency = tickets.filter(t => t.agencyId === ticket.agencyId && t.id !== ticket.id).map(enrichTicket);

    return res.json({ primaryTicket: enrichTicket(ticket), linkedByTBOH, linkedByAgency });
  }

  // 3. Insights
  if (url.includes('/api/insights')) {
    return res.json({
      topRecurringThemes: [
        { theme: "Repeat Refund Inquiries for Same TBOH", impact: "High Agency Frustration", volume: 3, suggestedFix: "Show live supplier refund status inside Agency Portal" },
        { theme: "Voucher Delivery Failure at Front Desk", impact: "High Check-in Escalation", volume: 2, suggestedFix: "Trigger automated API voucher push to hotel PMS 2 hours before check-in" },
        { theme: "Emergency Transport Breakdown Excursions", impact: "High Brand Risk", volume: 1, suggestedFix: "Require local DMC standby vehicle SLA verification" }
      ],
      categoryBreakdown: { "Refund": 3, "Check-in Issue": 1, "Booking Amendment": 1, "Sightseeing Disruption": 1 },
      supplierFriction: { "WebBeds Asia": 2, "Emirates Airline Desk": 1, "Rome Cabs & Tours DMC": 1 }
    });
  }

  // 4. Default: list tickets
  let filtered = tickets.map(enrichTicket);
  const q = req.query || {};
  if (q.view === 'triage') {
    filtered = filtered.filter(t => !t.assignedTo || t.status === 'New');
  } else if (q.view === 'escalation') {
    filtered = filtered.filter(t => t.status === 'Escalated' || t.slaStatus === 'BREACHED' || t.slaStatus === 'AT_RISK');
  } else if (q.view === 'my_queue') {
    filtered = filtered.filter(t => t.assignedTo === 'AGT-102');
  }

  return res.json({ total: filtered.length, tickets: filtered });
};
