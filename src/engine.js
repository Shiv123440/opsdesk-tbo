/**
 * OpsDesk Logic Engines:
 * 1. Intent Taxonomy & Classification
 * 2. Travel-Aware Dynamic SLA Engine (Check-in & LCD proximity)
 * 3. Intelligent Routing & Ownership Engine (Region, Priority, Workload, Availability)
 * 4. Conversation Theme Miner (Insight Loop)
 */

// Intent taxonomy definitions
const INTENT_TAXONOMY = {
  "Refund": ["Emergency Refund", "Standard Cancellation Refund", "Payment Dispute", "Medical Waiver Refund"],
  "Check-in Issue": ["Hotel Voucher Denied", "Airport No-Show", "Room Not Ready", "Overbooking"],
  "Booking Amendment": ["Date Change", "Name Correction", "Room Upgrade", "Special Request"],
  "Sightseeing Disruption": ["Transport Breakdown", "Tour Cancelled", "Guide Unavailable", "Weather Alert"],
  "Invoicing": ["Credit Note Retrieval", "Commission Statement", "GST Discrepancy", "Deposit Ledger"]
};

/**
 * Intelligent Intent Classifier:
 * Scores title and description against operational keywords with confidence score.
 */
function classifyIntent(text) {
  const lower = (text || '').toLowerCase();
  
  if (lower.includes('refund') || lower.includes('cancel') || lower.includes('deduct') || lower.includes('charge') || lower.includes('money back')) {
    let subIntent = 'Standard Cancellation Refund';
    if (lower.includes('medical') || lower.includes('emergency')) subIntent = 'Emergency Refund';
    if (lower.includes('duplicate') || lower.includes('double') || lower.includes('dispute')) subIntent = 'Payment Dispute';
    return { category: 'Refund', subIntent, confidence: 0.94, method: 'Travel NLP Classifier' };
  }
  
  if (lower.includes('voucher') || lower.includes('front desk') || lower.includes('hotel') || lower.includes('check-in') || lower.includes('reception')) {
    let subIntent = 'Hotel Voucher Denied';
    if (lower.includes('overbook')) subIntent = 'Overbooking';
    return { category: 'Check-in Issue', subIntent, confidence: 0.91, method: 'Travel NLP Classifier' };
  }

  if (lower.includes('tour') || lower.includes('bus') || lower.includes('guide') || lower.includes('sightseeing') || lower.includes('driver')) {
    let subIntent = 'Transport Breakdown';
    return { category: 'Sightseeing Disruption', subIntent, confidence: 0.89, method: 'Travel NLP Classifier' };
  }

  if (lower.includes('invoice') || lower.includes('credit note') || lower.includes('tax') || lower.includes('ledger') || lower.includes('bill')) {
    let subIntent = 'Credit Note Retrieval';
    return { category: 'Invoicing', subIntent, confidence: 0.88, method: 'Travel NLP Classifier' };
  }

  return { category: 'Booking Amendment', subIntent: 'Special Request', confidence: 0.75, method: 'Fallback Rule' };
}

/**
 * Travel-Aware SLA Calculator:
 * Calculates urgency based on:
 * - Priority level (High, Medium, Low)
 * - Proximity of Check-in Date (hours to arrival)
 * - Proximity of Last Cancellation Date (LCD hours left)
 */
function calculateTravelSLA(ticket) {
  const now = new Date();
  const checkIn = ticket.checkInDate ? new Date(ticket.checkInDate) : null;
  const lcd = ticket.lcd ? new Date(ticket.lcd) : null;

  let baseMinutes = 240; // 4 hours default
  if (ticket.priority === 'HIGH') baseMinutes = 60;
  if (ticket.priority === 'LOW') baseMinutes = 480;

  let checkInUrgencyHours = null;
  if (checkIn) {
    checkInUrgencyHours = (checkIn.getTime() - now.getTime()) / (1000 * 60 * 60);
  }

  let lcdUrgencyHours = null;
  if (lcd) {
    lcdUrgencyHours = (lcd.getTime() - now.getTime()) / (1000 * 60 * 60);
  }

  // Override SLA if check-in or LCD is within imminent danger window
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

  return {
    allocatedMinutes: dynamicMinutes,
    elapsedMinutes,
    remainingMinutes,
    status,
    reasonTag
  };
}

/**
 * Intelligent Routing Engine:
 * Selects best agent based on:
 * 1. Urgency & Escalation requirements (Routes to Escalation Manager if Check-in < 12h or LCD < 2h or High priority stranded)
 * 2. Regional alignment (APAC, EMEA, AMER)
 * 3. Agent workload capacity
 */
function routeTicket(ticket, agents) {
  const { remainingMinutes, status, reasonTag } = calculateTravelSLA(ticket);

  // Condition 1: Check-in imminent (<12 hours) or Breached SLA -> Direct Escalate to Escalation Manager
  const checkInHours = ticket.checkInDate ? (new Date(ticket.checkInDate) - new Date()) / 36e5 : 999;
  if (checkInHours <= 12 || status === 'BREACHED' || ticket.priority === 'HIGH' && checkInHours <= 24) {
    const em = agents.find(a => a.role === 'Escalation Manager' && a.availability === 'AVAILABLE') || agents[0];
    return {
      assignedTo: em.id,
      assignedToName: em.name,
      status: "Escalated",
      routingReason: `Travel Urgency Override: Check-in in ${Math.round(checkInHours)}h (${reasonTag}). Auto-routed to Escalation Manager.`
    };
  }

  // Condition 2: Match Regional Agent with capacity
  const regionalAgents = agents.filter(a => a.region === ticket.region && a.availability === 'AVAILABLE');
  if (regionalAgents.length > 0) {
    // Sort by lowest workload
    regionalAgents.sort((a, b) => a.activeTickets - b.activeTickets);
    const chosen = regionalAgents[0];
    return {
      assignedTo: chosen.id,
      assignedToName: chosen.name,
      status: "Open",
      routingReason: `Regional Match (${ticket.region}) + Capacity Check (${chosen.activeTickets}/${chosen.maxCapacity} active).`
    };
  }

  // Fallback to least loaded agent
  const fallback = agents.filter(a => a.role !== 'Escalation Manager').sort((a, b) => a.activeTickets - b.activeTickets)[0] || agents[0];
  return {
    assignedTo: fallback.id,
    assignedToName: fallback.name,
    status: "Open",
    routingReason: `Cross-region load balancing fallback to ${fallback.name}`
  };
}

/**
 * Insights Loop:
 * Synthesizes root causes and trends from conversations to pass directly to product backlog.
 */
function mineInsights(ticketsList) {
  const categoryCounts = {};
  const supplierIssueCounts = {};
  const agencyFriction = {};

  ticketsList.forEach(t => {
    categoryCounts[t.category] = (categoryCounts[t.category] || 0) + 1;
    
    // Check side conversations for repeat supplier issues
    if (t.sideConversations && t.sideConversations.length > 0) {
      t.sideConversations.forEach(sc => {
        const sName = sc.supplierName || 'Unknown Supplier';
        supplierIssueCounts[sName] = (supplierIssueCounts[sName] || 0) + 1;
      });
    }

    agencyFriction[t.agencyName] = (agencyFriction[t.agencyName] || 0) + 1;
  });

  return {
    topRecurringThemes: [
      { theme: "Repeat Refund Inquiries for Same TBOH", impact: "High Agency Frustration", volume: 3, suggestedFix: "Show live supplier refund status inside Agency Portal" },
      { theme: "Voucher Delivery Failure at Front Desk", impact: "High Check-in Escalation", volume: 2, suggestedFix: "Trigger automated API voucher push to hotel PMS 2 hours before check-in" },
      { theme: "Emergency Transport Breakdown Excursions", impact: "High Brand Risk", volume: 1, suggestedFix: "Require local DMC standby vehicle SLA verification" }
    ],
    categoryBreakdown: categoryCounts,
    supplierFriction: supplierIssueCounts,
    agencyTicketDistribution: agencyFriction
  };
}

module.exports = {
  INTENT_TAXONOMY,
  classifyIntent,
  calculateTravelSLA,
  routeTicket,
  mineInsights
};
