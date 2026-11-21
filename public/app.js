let allTickets = [];
let currentSelectedId = null;
let currentView = 'all';
let currentPersona = 'agent';
let metaData = { agents: [] };

document.addEventListener('DOMContentLoaded', async () => {
  await loadMetadata();
  await loadTickets();
});

async function loadMetadata() {
  try {
    const res = await fetch('/api/meta');
    metaData = await res.json();
  } catch (err) {
    console.error('Failed to load metadata', err);
  }
}

async function loadTickets() {
  try {
    const region = document.getElementById('regionFilter').value;
    let url = `/api/tickets?view=${currentView}`;
    if (region) url += `&region=${region}`;

    const res = await fetch(url);
    const data = await res.json();
    allTickets = data.tickets || [];
    
    updateBadgeCounts();
    renderTicketList(allTickets);

    if (currentSelectedId) {
      renderDetail(currentSelectedId);
    } else if (allTickets.length > 0) {
      renderDetail(allTickets[0].id);
    }
  } catch (err) {
    console.error('Failed to load tickets', err);
  }
}

function updateBadgeCounts() {
  fetch('/api/tickets')
    .then(r => r.json())
    .then(data => {
      const tickets = data.tickets || [];
      document.getElementById('badge-all-count').innerText = tickets.length;
      document.getElementById('badge-my-count').innerText = tickets.filter(t => t.assignedTo === 'AGT-102').length;
      document.getElementById('badge-esc-count').innerText = tickets.filter(t => t.status === 'Escalated' || t.slaStatus === 'BREACHED' || t.slaStatus === 'AT_RISK').length;
      document.getElementById('badge-triage-count').innerText = tickets.filter(t => !t.assignedTo || t.status === 'New').length;
    });
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
  const filtered = allTickets.filter(t => 
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
  renderTicketList(allTickets);
  renderDetail(id);
}

async function renderDetail(id) {
  const container = document.getElementById('detailPane');
  try {
    const res = await fetch(`/api/tickets/${id}/linked`);
    if (!res.ok) throw new Error('Failed to fetch ticket');
    const data = await res.json();
    const t = data.primaryTicket;
    const linkedTBOH = data.linkedByTBOH || [];
    const linkedAgency = data.linkedByAgency || [];

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

          <!-- Quick Action Buttons -->
          <div class="flex items-center gap-2">
            <button onclick="promptReassign('${t.id}')" class="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50">
              <i class="fa-solid fa-arrow-right-arrow-left mr-1"></i> Reassign
            </button>
            <button onclick="promptEscalate('${t.id}')" class="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700 shadow-sm">
              <i class="fa-solid fa-triangle-exclamation mr-1"></i> Escalate to EM
            </button>
          </div>
        </div>

        <!-- Travel-Aware SLA Urgency Bar -->
        <div class="mt-4 p-3 rounded-lg border ${slaClass} flex items-center justify-between text-xs">
          <div class="flex items-center gap-2">
            <i class="fa-solid fa-hourglass-half"></i>
            <span><strong>Travel SLA:</strong> ${t.dynamicSLA.reasonTag}</span>
          </div>
          <div class="font-mono font-semibold">
            ${t.slaStatus === 'BREACHED' ? 'SLA EXPIRED' : `${t.slaMinutesRemaining} minutes remaining`}
          </div>
        </div>

        <!-- Travel Dates (Check-in & LCD) -->
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

        <!-- Routing Audit Reason -->
        <div class="mt-3 text-xs text-slate-600 bg-indigo-50/50 p-2 rounded border border-indigo-100 flex items-center gap-2">
          <i class="fa-solid fa-route text-indigo-600"></i>
          <span><strong>Routing Audit:</strong> ${t.routingReason} (Assigned: <strong>${t.assignedToName}</strong>)</span>
        </div>
      </div>

      <!-- Problem 1 Solved: FIRST-CLASS LINKED TICKETS (TBOH & Agency) -->
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

      <!-- Problem 3 Solved: SIDE CONVERSATIONS (SUPPLIERS & EXTERNAL RECIPIENTS) -->
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
          Explicit external recipients (airline desks, bedbanks, DMCs) that <strong>survive ticket transfers & reassignments</strong>.
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

                <!-- Messages in thread -->
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

                <!-- Quick Reply Box -->
                <div class="flex gap-2">
                  <input type="text" id="reply-input-${sc.id}" placeholder="Reply to external supplier thread..." class="flex-1 text-xs border border-slate-300 rounded px-2.5 py-1.5 outline-none focus:ring-1 focus:ring-emerald-500">
                  <button onclick="sendSideConvoReply('${t.id}', '${sc.id}')" class="bg-emerald-600 text-white text-xs px-3 py-1.5 rounded hover:bg-emerald-700 font-medium">Send</button>
                </div>
              </div>
            `).join('')}
          </div>`
        }
      </div>

      <!-- Activity Timeline & Audit Log -->
      <div class="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
        <h3 class="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
          <i class="fa-solid fa-timeline text-slate-600"></i> Complete Audit Trail & Timeline
        </h3>
        <div class="space-y-3">
          ${(t.history || []).map(h => `
            <div class="flex items-start gap-3 text-xs">
              <span class="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0"></span>
              <div class="flex-1">
                <p class="text-slate-800 font-medium">${h.action}</p>
                <div class="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                  <span>Actor: <strong>${h.actor}</strong></span>
                  <span>•</span>
                  <span>${new Date(h.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } catch (err) {
    console.error(err);
    container.innerHTML = `<div class="p-6 text-red-500">Error loading ticket details</div>`;
  }
}

// Side Convo Reply
async function sendSideConvoReply(ticketId, scId) {
  const input = document.getElementById(`reply-input-${scId}`);
  const text = input.value.trim();
  if (!text) return;

  await fetch(`/api/tickets/${ticketId}/side-conversations/${scId}/reply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sender: 'TBO Ops Support', text })
  });

  input.value = '';
  renderDetail(ticketId);
}

// New Side Convo Prompt
async function promptNewSideConvo(ticketId) {
  const supplierName = prompt('Enter Supplier Name (e.g. Emirates Desk, WebBeds, Rome DMC):', 'Supplier Partner Ops');
  if (!supplierName) return;
  const recipients = prompt('Enter Explicit Recipient Email(s):', 'partner-ops@supplier.com');
  if (!recipients) return;
  const subject = prompt('Thread Subject:', 'Urgent Escalation Request');
  if (!subject) return;
  const message = prompt('Initial Message:', 'Please confirm status on booking immediately.');

  await fetch(`/api/tickets/${ticketId}/side-conversations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      supplierName,
      recipients: recipients.split(','),
      subject,
      initialMessage: message
    })
  });

  await loadTickets();
  renderDetail(ticketId);
}

// Prompt Reassign
async function promptReassign(ticketId) {
  const agentsList = metaData.agents.map(a => `${a.id}: ${a.name} (${a.region})`).join('\n');
  const agentId = prompt(`Select Agent ID to Reassign:\n${agentsList}`, 'AGT-101');
  if (!agentId) return;

  await fetch(`/api/tickets/${ticketId}/reassign`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ agentId, reason: 'Supervisor workload balancing' })
  });

  await loadTickets();
  renderDetail(ticketId);
}

// Prompt Escalate
async function promptEscalate(ticketId) {
  const reason = prompt('Escalation Reason for Escalation Manager:', 'Check-in imminent and supplier uncontactable');
  if (!reason) return;

  await fetch(`/api/tickets/${ticketId}/escalate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reason })
  });

  await loadTickets();
  renderDetail(ticketId);
}

// AI Real-Time Intent Prediction
async function predictIntent() {
  const title = document.getElementById('form-title').value;
  const desc = document.getElementById('form-description').value;
  if (!title && !desc) return;

  const res = await fetch('/api/ai/classify-intent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description: desc })
  });
  const data = await res.json();

  document.getElementById('detectedIntentText').innerText = `${data.category} (${data.subIntent})`;
  document.getElementById('detectedConfidence').innerText = `${Math.round(data.confidence * 100)}% match`;
}

// Modal handling
function openNewTicketModal() {
  document.getElementById('newTicketModal').classList.remove('hidden');
}
function closeNewTicketModal() {
  document.getElementById('newTicketModal').classList.add('hidden');
}

// Create Ticket Submission
async function handleCreateTicket(e) {
  e.preventDefault();
  const tboh = document.getElementById('form-tboh').value;
  const agencyName = document.getElementById('form-agencyName').value;
  const region = document.getElementById('form-region').value;
  const title = document.getElementById('form-title').value;
  const description = document.getElementById('form-description').value;
  const priority = document.getElementById('form-priority').value;
  const checkIn = document.getElementById('form-checkIn').value;
  const lcd = document.getElementById('form-lcd').value;

  const res = await fetch('/api/tickets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tboh,
      agencyName,
      region,
      title,
      description,
      priority,
      checkInDate: checkIn ? new Date(checkIn).toISOString() : undefined,
      lcd: lcd ? new Date(lcd).toISOString() : undefined
    })
  });

  const created = await res.json();
  closeNewTicketModal();
  await loadTickets();
  selectTicket(created.id);
  alert(`Ticket ${created.id} created successfully! Routed to: ${created.assignedToName} (${created.routingReason})`);
}

// Show Insights Modal
async function showInsightsModal() {
  const modal = document.getElementById('insightsModal');
  modal.classList.remove('hidden');

  const res = await fetch('/api/insights');
  const data = await res.json();

  const themeList = document.getElementById('themeList');
  themeList.innerHTML = data.topRecurringThemes.map(th => `
    <div class="p-3 bg-slate-50 border border-slate-200 rounded-lg">
      <div class="flex items-center justify-between mb-1">
        <strong class="text-xs text-slate-800">${th.theme}</strong>
        <span class="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded font-semibold">${th.impact}</span>
      </div>
      <p class="text-xs text-slate-600 mt-1"><strong>Actionable Backlog Fix:</strong> ${th.suggestedFix}</p>
    </div>
  `).join('');

  const catDist = document.getElementById('categoryDist');
  catDist.innerHTML = Object.entries(data.categoryBreakdown).map(([k, v]) => `
    <div class="flex justify-between border-b border-slate-200 py-1">
      <span>${k}</span>
      <span class="font-bold text-slate-700">${v}</span>
    </div>
  `).join('');

  const supDist = document.getElementById('supplierFrictionDist');
  supDist.innerHTML = Object.entries(data.supplierFriction).map(([k, v]) => `
    <div class="flex justify-between border-b border-slate-200 py-1">
      <span>${k}</span>
      <span class="font-bold text-red-600">${v} issue(s)</span>
    </div>
  `).join('');
}

function closeInsightsModal() {
  document.getElementById('insightsModal').classList.add('hidden');
}

function exportCSV() {
  window.open('/api/export/tickets', '_blank');
}
