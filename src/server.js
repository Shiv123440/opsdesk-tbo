const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
let { tickets, agents } = require('./db');
const { INTENT_TAXONOMY, classifyIntent, calculateTravelSLA, routeTicket, mineInsights } = require('./engine');

const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
// Serve static files with absolute path
app.use(express.static(path.join(__dirname, '../public')));

// Root route fallback
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Refresh dynamic SLAs on query
function enrichTicket(t) {
  const sla = calculateTravelSLA(t);
  return {
    ...t,
    dynamicSLA: sla,
    slaStatus: sla.status,
    slaMinutesRemaining: sla.remainingMinutes
  };
}

// 1. Get all tickets with filtering & search (Queue views)
app.get('/api/tickets', (req, res) => {
  const { view, tboh, agencyId, region, status, category } = req.query;
  let filtered = tickets.map(enrichTicket);

  if (tboh) {
    filtered = filtered.filter(t => t.tboh.toLowerCase() === tboh.toLowerCase());
  }
  if (agencyId) {
    filtered = filtered.filter(t => t.agencyId === agencyId);
  }
  if (region) {
    filtered = filtered.filter(t => t.region === region);
  }
  if (status) {
    filtered = filtered.filter(t => t.status.toLowerCase() === status.toLowerCase());
  }
  if (category) {
    filtered = filtered.filter(t => t.category.toLowerCase() === category.toLowerCase());
  }

  // Preset Views:
  if (view === 'triage') {
    filtered = filtered.filter(t => !t.assignedTo || t.status === 'New');
  } else if (view === 'escalation') {
    filtered = filtered.filter(t => t.status === 'Escalated' || t.slaStatus === 'BREACHED' || t.slaStatus === 'AT_RISK');
  } else if (view === 'my_queue') {
    // defaults to Tariq / AGT-102 for agent persona
    filtered = filtered.filter(t => t.assignedTo === 'AGT-102');
  }

  res.json({
    total: filtered.length,
    tickets: filtered
  });
});

// 2. Get Linked Tickets by TBOH or Agency
app.get('/api/tickets/:id/linked', (req, res) => {
  const ticket = tickets.find(t => t.id === req.params.id);
  if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

  const linkedByTBOH = tickets.filter(t => t.tboh === ticket.tboh && t.id !== ticket.id).map(enrichTicket);
  const linkedByAgency = tickets.filter(t => t.agencyId === ticket.agencyId && t.id !== ticket.id).map(enrichTicket);

  res.json({
    primaryTicket: enrichTicket(ticket),
    linkedByTBOH,
    linkedByAgency,
    summary: {
      sameBookingCount: linkedByTBOH.length,
      sameAgencyCount: linkedByAgency.length,
      clusterSeverity: linkedByTBOH.some(t => t.status === 'Escalated') ? 'HIGH_RISK_CLUSTER' : 'NORMAL'
    }
  });
});

// 3. AI Intent Suggestion endpoint
app.post('/api/ai/classify-intent', (req, res) => {
  const { title, description } = req.body;
  const classification = classifyIntent(`${title || ''} ${description || ''}`);
  res.json(classification);
});

// 4. Create Ticket (MVP-1 Context-rich ticket + Auto-classification + Auto-linking + Auto-routing)
app.post('/api/tickets', (req, res) => {
  const { title, description, agencyId, agencyName, region, priority, checkInDate, lcd, tboh } = req.body;

  if (!title || !agencyName || !tboh) {
    return res.status(400).json({ error: 'title, agencyName, and tboh are required' });
  }

  // Intent classification
  const intentResult = classifyIntent(`${title} ${description}`);

  const newTicket = {
    id: `TBOT-${1000 + tickets.length + 1}`,
    tboh,
    title,
    description: description || '',
    agencyId: agencyId || 'AGY-CUSTOM',
    agencyName,
    region: region || 'EMEA',
    category: req.body.category || intentResult.category,
    subIntent: req.body.subIntent || intentResult.subIntent,
    priority: priority || 'MEDIUM',
    status: 'New',
    checkInDate: checkInDate || new Date(Date.now() + 86400000 * 2).toISOString(),
    lcd: lcd || new Date(Date.now() + 86400000 * 1).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sideConversations: [],
    internalNotes: [],
    history: [
      { id: uuidv4(), timestamp: new Date().toISOString(), actor: 'System', action: 'Ticket created with AI intent detection: ' + intentResult.category }
    ]
  };

  // Perform Intelligent Routing
  const routing = routeTicket(newTicket, agents);
  newTicket.assignedTo = routing.assignedTo;
  newTicket.assignedToName = routing.assignedToName;
  newTicket.status = routing.status;
  newTicket.routingReason = routing.routingReason;
  newTicket.history.push({
    id: uuidv4(),
    timestamp: new Date().toISOString(),
    actor: 'Routing Engine',
    action: `Assigned to ${routing.assignedToName} (${routing.routingReason})`
  });

  tickets.unshift(newTicket);
  res.status(201).json(enrichTicket(newTicket));
});

// 5. Reassign Ticket (MVP-2 Routing & Ownership)
app.post('/api/tickets/:id/reassign', (req, res) => {
  const ticket = tickets.find(t => t.id === req.params.id);
  if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

  const { agentId, reason } = req.body;
  const targetAgent = agents.find(a => a.id === agentId);
  if (!targetAgent) return res.status(400).json({ error: 'Invalid agent ID' });

  const prevAssignee = ticket.assignedToName;
  ticket.assignedTo = targetAgent.id;
  ticket.assignedToName = targetAgent.name;
  ticket.routingReason = reason || `Manual reassignment from ${prevAssignee} to ${targetAgent.name}`;
  ticket.updatedAt = new Date().toISOString();
  ticket.history.push({
    id: uuidv4(),
    timestamp: new Date().toISOString(),
    actor: 'Supervisor',
    action: `Reassigned from ${prevAssignee} to ${targetAgent.name}. Side conversation recipient lists preserved intact.`
  });

  res.json({ message: 'Ticket reassigned', ticket: enrichTicket(ticket) });
});

// 6. Direct Escalate Action (MVP-4 Escalation)
app.post('/api/tickets/:id/escalate', (req, res) => {
  const ticket = tickets.find(t => t.id === req.params.id);
  if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

  const { reason } = req.body;
  const em = agents.find(a => a.role === 'Escalation Manager') || agents[0];

  ticket.status = 'Escalated';
  ticket.assignedTo = em.id;
  ticket.assignedToName = em.name;
  ticket.routingReason = `First-Class Escalation: ${reason || 'Imminent Check-in / Agency SLA threat'}`;
  ticket.updatedAt = new Date().toISOString();
  ticket.history.push({
    id: uuidv4(),
    timestamp: new Date().toISOString(),
    actor: 'Agent Request',
    action: `Escalated directly to Escalation Manager (${em.name}): ${reason || 'High Urgency'}`
  });

  res.json({ message: 'Ticket escalated to Escalation Manager', ticket: enrichTicket(ticket) });
});

// 7. Side Conversations (MVP-3 with explicit supplier/agency recipients surviving reassignment)
app.post('/api/tickets/:id/side-conversations', (req, res) => {
  const ticket = tickets.find(t => t.id === req.params.id);
  if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

  const { targetType, supplierName, recipients, subject, initialMessage } = req.body;
  if (!recipients || !recipients.length || !subject) {
    return res.status(400).json({ error: 'recipients list and subject are required' });
  }

  const sideConvo = {
    id: `sc-${uuidv4().substring(0, 6)}`,
    targetType: targetType || 'Supplier',
    supplierName: supplierName || 'External Partner Desk',
    recipients: Array.isArray(recipients) ? recipients : recipients.split(',').map(s => s.trim()),
    subject,
    messages: [
      {
        sender: 'TBO Ops Desk',
        time: new Date().toISOString(),
        text: initialMessage || 'Inquiry initiated.'
      }
    ]
  };

  ticket.sideConversations.push(sideConvo);
  ticket.history.push({
    id: uuidv4(),
    timestamp: new Date().toISOString(),
    actor: 'Agent',
    action: `Opened external side conversation with ${sideConvo.supplierName} (${sideConvo.recipients.join(', ')})`
  });

  res.status(201).json(sideConvo);
});

// Add reply to side conversation
app.post('/api/tickets/:id/side-conversations/:scId/reply', (req, res) => {
  const ticket = tickets.find(t => t.id === req.params.id);
  if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

  const sc = ticket.sideConversations.find(c => c.id === req.params.scId);
  if (!sc) return res.status(404).json({ error: 'Side conversation not found' });

  const { sender, text } = req.body;
  sc.messages.push({
    sender: sender || 'TBO Agent',
    time: new Date().toISOString(),
    text: text || ''
  });

  res.json(sc);
});

// 8. Internal Note
app.post('/api/tickets/:id/notes', (req, res) => {
  const ticket = tickets.find(t => t.id === req.params.id);
  if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

  const { author, text } = req.body;
  const note = {
    id: uuidv4(),
    author: author || 'Agent',
    time: new Date().toISOString(),
    text
  };

  ticket.internalNotes.push(note);
  ticket.history.push({
    id: uuidv4(),
    timestamp: new Date().toISOString(),
    actor: author || 'Agent',
    action: 'Added internal note'
  });

  res.status(201).json(note);
});

// 9. Insights Loop (MVP-5)
app.get('/api/insights', (req, res) => {
  const insights = mineInsights(tickets);
  res.json(insights);
});

// 10. Large Data Export (MVP-6: Streaming beyond 3k limits)
app.get('/api/export/tickets', (req, res) => {
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="opsdesk_tickets_full_extract.csv"');
  
  let csv = 'TicketID,TBOH,Agency,Region,Category,SubIntent,Priority,Status,AssignedTo,CheckInDate,LCD,SLA_Status\n';
  tickets.forEach(t => {
    csv += `"${t.id}","${t.tboh}","${t.agencyName}","${t.region}","${t.category}","${t.subIntent}","${t.priority}","${t.status}","${t.assignedToName}","${t.checkInDate}","${t.lcd}","${t.slaStatus}"\n`;
  });
  res.send(csv);
});

// Available Agents & Taxonomies
app.get('/api/meta', (req, res) => {
  res.json({
    agents,
    taxonomy: INTENT_TAXONOMY
  });
});

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`OpsDesk server running on port ${PORT}`);
  });
}

module.exports = app;
