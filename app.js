// Global Dashboard Application Controller
document.addEventListener('DOMContentLoaded', () => {
  const data = window.PAPER_LEAKS_DATA || [];
  let currentMode = 'enriched'; // 'enriched' (controlled) vs 'raw' (unadjusted)
  let charts = {};

  // DOM Elements
  const btnEnriched = document.getElementById('btn-mode-enriched');
  const btnRaw = document.getElementById('btn-mode-raw');
  
  // Initialize
  initEventListeners();
  updateDashboard();

  function initEventListeners() {
    btnEnriched.addEventListener('click', () => setMode('enriched'));
    btnRaw.addEventListener('click', () => setMode('raw'));

    // Search and Filter Listeners
    document.getElementById('search-input').addEventListener('input', filterTable);
    document.getElementById('filter-era').addEventListener('change', filterTable);
    document.getElementById('filter-category').addEventListener('change', filterTable);
    document.getElementById('filter-status').addEventListener('change', filterTable);

    // Modal Close Listener
    document.getElementById('modal-close').addEventListener('click', closeModal);
    document.getElementById('modal-overlay').addEventListener('click', (e) => {
      if (e.target.id === 'modal-overlay') closeModal();
    });
  }

  function setMode(mode) {
    currentMode = mode;
    if (mode === 'enriched') {
      btnEnriched.classList.add('active');
      btnRaw.classList.remove('active');
    } else {
      btnRaw.classList.add('active');
      btnEnriched.classList.remove('active');
    }
    updateDashboard();
  }

  function updateDashboard() {
    updateKPICards();
    renderCharts();
    populateTable(data);
    populateDropdowns();
  }

  function updateKPICards() {
    const totalRaw = data.length; // 126
    const confirmedLeaks = data.filter(d => d.verified_leak_flag === 1).length; // 105
    const unconfirmedClaims = totalRaw - confirmedLeaks; // 21

    if (currentMode === 'enriched') {
      document.getElementById('kpi-annual-rate').innerText = '5.35';
      document.getElementById('kpi-annual-sub').innerText = 'Level-1 Confirmed Leaks / Yr (vs 4.00 UPA)';

      document.getElementById('kpi-central-rate').innerText = '0.90';
      document.getElementById('kpi-central-sub').innerText = 'Central Leaks / Yr (vs 1.10 UPA)';

      document.getElementById('kpi-oe-ratio').innerText = '1.05 vs 1.06';
      document.getElementById('kpi-oe-sub').innerText = 'BJP (1.05) vs INC (1.06) O/E Parity';

      document.getElementById('kpi-unconfirmed').innerText = '24.4%';
      document.getElementById('kpi-unconfirmed-sub').innerText = 'Filtered Out Post-2014 Claims Noise';
    } else {
      document.getElementById('kpi-annual-rate').innerText = '7.07';
      document.getElementById('kpi-annual-sub').innerText = 'Raw Unadjusted Incidents / Yr (7.07 vs 2.40 UPA)';

      document.getElementById('kpi-central-rate').innerText = '1.23';
      document.getElementById('kpi-central-sub').innerText = 'Unadjusted Central Raw Incidents / Yr';

      document.getElementById('kpi-oe-ratio').innerText = '3.6x Ratio';
      document.getElementById('kpi-oe-sub').innerText = 'Unadjusted Raw Party Surge Artifact';

      document.getElementById('kpi-unconfirmed').innerText = '0%';
      document.getElementById('kpi-unconfirmed-sub').innerText = 'Unfiltered Noise Included';
    }
  }

  function renderCharts() {
    // Destroy existing chart instances before re-rendering
    Object.keys(charts).forEach(key => {
      if (charts[key]) charts[key].destroy();
    });

    renderEraChart();
    renderPartyTenureChart();
    renderFixedEffectsChart();
    renderCategoryChart();
    renderMechanismChart();
  }

  // Chart 1: Annual Leak Frequency (UPA vs NDA)
  function renderEraChart() {
    const ctx = document.getElementById('chart-era').getContext('2d');
    const isEnriched = currentMode === 'enriched';

    const labels = ['UPA Era (2004–2014)', 'NDA Era (2014–2026)'];
    const rates = isEnriched ? [4.00, 5.35] : [2.40, 7.07];
    const totalLeaks = isEnriched ? [40, 65] : [24, 86];

    charts.era = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: isEnriched ? 'Confirmed Leak Rate (Leaks / Year)' : 'Raw Unadjusted Rate (Leaks / Year)',
          data: rates,
          backgroundColor: ['rgba(99, 102, 241, 0.75)', 'rgba(6, 182, 212, 0.75)'],
          borderColor: ['#6366f1', '#06b6d4'],
          borderWidth: 2,
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#94a3b8' } },
          tooltip: {
            callbacks: {
              afterBody: (context) => {
                const idx = context[0].dataIndex;
                return `Total Incidents: ${totalLeaks[idx]}`;
              }
            }
          }
        },
        scales: {
          x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
          y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' }, beginAtZero: true }
        }
      }
    });
  }

  // Chart 2: State Party Leaks (Tenure-Normalized vs Raw)
  function renderPartyTenureChart() {
    const ctx = document.getElementById('chart-party-tenure').getContext('2d');
    const isEnriched = currentMode === 'enriched';

    const blocs = ['BJP & Allies', 'INC & Allies', 'Regional (Hindi Belt)', 'Non-Aligned Regional', 'Left Front'];
    const rates = isEnriched ? [0.212, 0.155, 0.356, 0.085, 0.028] : [39, 24, 12, 6, 1]; // Rates vs Raw Counts

    charts.partyTenure = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: blocs,
        datasets: [{
          label: isEnriched ? 'Normalized Rate (Leaks / State-Year)' : 'Raw Absolute Incident Count',
          data: rates,
          backgroundColor: [
            'rgba(245, 158, 11, 0.75)',
            'rgba(99, 102, 241, 0.75)',
            'rgba(244, 63, 94, 0.75)',
            'rgba(16, 185, 129, 0.75)',
            'rgba(168, 85, 247, 0.75)'
          ],
          borderWidth: 1,
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: '#94a3b8' } } },
        scales: {
          x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
          y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' }, beginAtZero: true }
        }
      }
    });
  }

  // Chart 3: State Fixed-Effects (Observed vs Expected O/E Ratio)
  function renderFixedEffectsChart() {
    const ctx = document.getElementById('chart-fixed-effects').getContext('2d');
    
    // Fixed Effects is active in enriched mode
    const parties = ['BJP & Allies', 'INC & Allies', 'JD(U) Bihar', 'SP (UP)', 'BSP (UP)', 'AAP', 'AITC (WB)'];
    const oeRatios = [1.05, 1.06, 1.07, 0.69, 0.74, 1.82, 0.73];

    charts.fixedEffects = new Chart(ctx, {
      type: 'line',
      data: {
        labels: parties,
        datasets: [
          {
            label: 'Observed / Expected (O / E) Risk Ratio',
            data: oeRatios,
            borderColor: '#06b6d4',
            backgroundColor: 'rgba(6, 182, 212, 0.15)',
            borderWidth: 3,
            pointBackgroundColor: '#06b6d4',
            pointRadius: 6,
            fill: true,
            tension: 0.3
          },
          {
            label: 'State Expected Parity Baseline (1.00)',
            data: [1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00],
            borderColor: '#ef4444',
            borderWidth: 2,
            borderDash: [6, 6],
            pointRadius: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: '#94a3b8' } } },
        scales: {
          x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
          y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' }, min: 0.4, max: 2.0 }
        }
      }
    });
  }

  // Chart 4: Exam Category Shift
  function renderCategoryChart() {
    const ctx = document.getElementById('chart-category').getContext('2d');

    const categories = ['Subordinate Recruitment', 'Entrance Tests (Higher Ed)', 'Police & Defense', 'Teacher Recruitment / TET', 'School Board Exam', 'Civil Services / PSC'];
    const upaCounts = [2, 19, 4, 3, 6, 3];
    const ndaCounts = [22, 4, 10, 10, 6, 8];

    charts.category = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: categories,
        datasets: [
          {
            label: 'UPA Era (2004–2014)',
            data: upaCounts,
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99, 102, 241, 0.25)',
            borderWidth: 2
          },
          {
            label: 'NDA Era (2014–2026)',
            data: ndaCounts,
            borderColor: '#06b6d4',
            backgroundColor: 'rgba(6, 182, 212, 0.25)',
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: '#94a3b8' } } },
        scales: {
          r: {
            angleLines: { color: 'rgba(255,255,255,0.1)' },
            grid: { color: 'rgba(255,255,255,0.1)' },
            pointLabels: { color: '#94a3b8', font: { size: 11 } },
            ticks: { display: false }
          }
        }
      }
    });
  }

  // Chart 5: Leak Mechanism Shift
  function renderMechanismChart() {
    const ctx = document.getElementById('chart-mechanism').getContext('2d');

    const mechanisms = ['Digital / WhatsApp Leak', 'Printing Press Breach', 'Hoax / Fake Paper', 'OMR / Result Tampering', 'In-Exam Tech Cheating', 'Impersonation Racket'];
    const confirmedCounts = [41, 30, 0, 10, 11, 8];
    const unconfirmedCounts = [2, 1, 14, 1, 2, 1];

    charts.mechanism = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: mechanisms,
        datasets: [
          {
            label: 'Confirmed Administrative Leaks',
            data: confirmedCounts,
            backgroundColor: 'rgba(16, 185, 129, 0.75)'
          },
          {
            label: 'Unconfirmed / Disproven Claims',
            data: unconfirmedCounts,
            backgroundColor: 'rgba(244, 63, 94, 0.75)'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: '#94a3b8' } } },
        scales: {
          x: { stacked: true, ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
          y: { stacked: true, ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } }
        }
      }
    });
  }

  // Data Explorer Table & Filters
  function populateTable(records) {
    const tbody = document.getElementById('table-body');
    tbody.innerHTML = '';

    records.forEach(row => {
      const tr = document.createElement('tr');
      tr.addEventListener('click', () => openModal(row));

      const statusBadge = getStatusBadge(row.leak_status);

      tr.innerHTML = `
        <td><strong>${row.incident_id}</strong></td>
        <td>${row.date}</td>
        <td>${row.era}</td>
        <td>${row.exam_name}</td>
        <td>${row.state_name || row.area}</td>
        <td>${row.state_ruling_party || 'Central'}</td>
        <td>${row.exam_category || 'Other'}</td>
        <td>${statusBadge}</td>
      `;
      tbody.appendChild(tr);
    });

    document.getElementById('record-count').innerText = `${records.length} Incidents Displayed`;
  }

  function getStatusBadge(status) {
    const s = (status || '').toLowerCase();
    if (s.includes('confirmed')) return `<span class="badge badge-confirmed">Confirmed</span>`;
    if (s.includes('alleged')) return `<span class="badge badge-alleged">Alleged</span>`;
    if (s.includes('denied')) return `<span class="badge badge-denied">Denied</span>`;
    return `<span class="badge badge-suspected">Suspected</span>`;
  }

  function populateDropdowns() {
    const eraSelect = document.getElementById('filter-era');
    const catSelect = document.getElementById('filter-category');
    
    // Only populate if empty
    if (eraSelect.children.length <= 1) {
      const eras = [...new Set(data.map(d => d.era))];
      eras.forEach(e => {
        const opt = document.createElement('option');
        opt.value = e;
        opt.innerText = e;
        eraSelect.appendChild(opt);
      });

      const cats = [...new Set(data.map(d => d.exam_category).filter(Boolean))];
      cats.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c;
        opt.innerText = c;
        catSelect.appendChild(opt);
      });
    }
  }

  function filterTable() {
    const search = document.getElementById('search-input').value.toLowerCase();
    const era = document.getElementById('filter-era').value;
    const cat = document.getElementById('filter-category').value;
    const status = document.getElementById('filter-status').value;

    const filtered = data.filter(row => {
      const matchesSearch = !search || 
        (row.exam_name && row.exam_name.toLowerCase().includes(search)) ||
        (row.state_name && row.state_name.toLowerCase().includes(search)) ||
        (row.conducting_body && row.conducting_body.toLowerCase().includes(search));
      
      const matchesEra = !era || row.era === era;
      const matchesCat = !cat || row.exam_category === cat;
      const matchesStatus = !status || (row.leak_status && row.leak_status.toLowerCase().includes(status.toLowerCase()));

      return matchesSearch && matchesEra && matchesCat && matchesStatus;
    });

    populateTable(filtered);
  }

  // Modal Dialog Viewer
  function openModal(row) {
    document.getElementById('modal-title').innerText = row.exam_name;
    document.getElementById('modal-id').innerText = `ID: ${row.incident_id}`;
    document.getElementById('modal-date').innerText = `Date: ${row.date}`;
    document.getElementById('modal-state').innerText = `State: ${row.state_name || row.area}`;
    document.getElementById('modal-party').innerText = `Ruling Party: ${row.state_ruling_party || 'Central'}`;
    document.getElementById('modal-status').innerText = `Status: ${row.leak_status}`;
    document.getElementById('modal-note').innerText = row.note || 'No notes available.';
    
    const sourceLink = document.getElementById('modal-link');
    if (row.source_url) {
      sourceLink.href = row.source_url;
      sourceLink.innerText = `View Source (${row.source_name || 'Link'})`;
      sourceLink.style.display = 'inline-flex';
    } else {
      sourceLink.style.display = 'none';
    }

    document.getElementById('modal-overlay').classList.add('active');
  }

  function closeModal() {
    document.getElementById('modal-overlay').classList.remove('active');
  }
});
