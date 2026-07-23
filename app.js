// Global Dashboard Application Controller - 110 Authenticated Records
document.addEventListener('DOMContentLoaded', () => {
  const data = window.PAPER_LEAKS_DATA || [];
  let currentMode = 'enriched'; // 'enriched' (controlled) vs 'raw' (unadjusted)
  let charts = {};

  // Individual Party Data Mappings
  const individualPartyData = {
    'BJP': { raw: 39, confirmed: 39, stateYears: 184.1, rate: 0.212, oeControlled: 1.05, oeRaw: 2.15 },
    'INC': { raw: 11, confirmed: 19, stateYears: 135.0, rate: 0.141, oeControlled: 1.06, oeRaw: 0.61 },
    'JD(U)': { raw: 7, confirmed: 7, stateYears: 20.7, rate: 0.338, oeControlled: 1.07, oeRaw: 1.07 },
    'SP': { raw: 3, confirmed: 3, stateYears: 8.0, rate: 0.375, oeControlled: 0.69, oeRaw: 0.69 },
    'BSP': { raw: 2, confirmed: 2, stateYears: 5.0, rate: 0.400, oeControlled: 0.74, oeRaw: 0.74 },
    'AAP': { raw: 2, confirmed: 2, stateYears: 15.7, rate: 0.127, oeControlled: 1.82, oeRaw: 1.82 },
    'Shiv Sena': { raw: 2, confirmed: 2, stateYears: 2.6, rate: 0.769, oeControlled: 2.85, oeRaw: 2.85 },
    'AITC': { raw: 1, confirmed: 1, stateYears: 15.2, rate: 0.066, oeControlled: 0.73, oeRaw: 0.73 },
    'BJD': { raw: 1, confirmed: 1, stateYears: 20.1, rate: 0.050, oeControlled: 1.10, oeRaw: 1.10 },
    'BRS': { raw: 1, confirmed: 1, stateYears: 9.5, rate: 0.105, oeControlled: 2.33, oeRaw: 2.33 },
    'JMM': { raw: 1, confirmed: 1, stateYears: 6.5, rate: 0.154, oeControlled: 1.71, oeRaw: 1.71 },
    'SAD': { raw: 1, confirmed: 1, stateYears: 10.0, rate: 0.100, oeControlled: 0.74, oeRaw: 0.74 },
    'CPI(M)': { raw: 1, confirmed: 1, stateYears: 36.0, rate: 0.028, oeControlled: 1.58, oeRaw: 1.58 }
  };

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
    const modeDesc = document.getElementById('mode-desc');
    if (mode === 'enriched') {
      btnEnriched.classList.add('active');
      btnRaw.classList.remove('active');
      if (modeDesc) {
        modeDesc.innerHTML = '<strong>Active Mode: Controlled Econometric View.</strong> Applies era annualization, state executive tenure normalization, state baseline risk fixed-effects controls ($O/E$), and severity noise filtering across the 110 authenticated dataset incidents.';
      }
    } else {
      btnRaw.classList.add('active');
      btnEnriched.classList.remove('active');
      if (modeDesc) {
        modeDesc.innerHTML = '<strong>Active Mode: Raw Unadjusted Scraper View.</strong> Displays unadjusted incident counts, un-normalized party tallies, and unfiltered claims noise from Sujay Nadkarni\'s raw dataset.';
      }
    }
    updateDashboard();
  }

  function updateDashboard() {
    updateKPICards();
    updateCardHeadings();
    renderCharts();
    filterTable();
    populateDropdowns();
  }

  function updateCardHeadings() {
    const isEnriched = currentMode === 'enriched';

    const titleEra = document.getElementById('title-chart-era');
    const subEra = document.getElementById('sub-chart-era');
    const titlePartyTenure = document.getElementById('title-chart-party-tenure');
    const subPartyTenure = document.getElementById('sub-chart-party-tenure');
    const titleFixedEffects = document.getElementById('title-chart-fixed-effects');
    const subFixedEffects = document.getElementById('sub-chart-fixed-effects');
    const titleCategory = document.getElementById('title-chart-category');
    const subCategory = document.getElementById('sub-chart-category');
    const titleMechanism = document.getElementById('title-chart-mechanism');
    const subMechanism = document.getElementById('sub-chart-mechanism');
    const titleDataExplorer = document.getElementById('title-data-explorer');

    if (titleEra) {
      titleEra.innerText = isEnriched ? 
        'Annualized Confirmed Leak Frequency (UPA vs NDA)' : 
        'Raw Unadjusted Leak Frequency (UPA vs NDA - Unfiltered)';
    }
    if (subEra) {
      subEra.innerText = isEnriched ? 
        'Overall national annualized leak rate comparison across political eras (5.35 vs 2.40 leaks/yr).' : 
        'Raw unadjusted incident frequency across political eras (7.07 vs 2.40 leaks/yr - unfiltered).';
    }

    if (titlePartyTenure) {
      titlePartyTenure.innerText = isEnriched ? 
        'Individual State Parties (Tenure-Normalized Rate)' : 
        'Individual State Parties (Raw Absolute Incident Counts)';
    }
    if (subPartyTenure) {
      subPartyTenure.innerText = isEnriched ? 
        'Level 2 Analysis: Controls for Time in Office (State-Years), showing leaks per state-year in power.' : 
        'Level 1 Analysis: Simple raw incident tallies under party state rule without controlling for time in office.';
    }

    if (titleFixedEffects) {
      titleFixedEffects.innerText = isEnriched ? 
        'State Fixed-Effects (Observed vs Expected O/E Parity)' : 
        'State Fixed-Effects (Raw Truncation Skewed O/E Ratio)';
    }
    if (subFixedEffects) {
      subFixedEffects.innerText = isEnriched ? 
        'Level 3 Analysis (Gold Standard): Controls for BOTH Time in Office AND Geographic Risk Proclivity (BJP 1.05 ≈ INC 1.06).' : 
        'Unadjusted Raw Analysis: Demonstrates the artificial 2.15x BJP distortion caused by truncation skew.';
    }

    if (titleCategory) {
      titleCategory.innerText = isEnriched ? 
        'Exam Category Shift Across Eras (Controlled Confirmed Distribution)' : 
        'Exam Category Shift Across Eras (Raw Unadjusted Distribution)';
    }
    if (subCategory) {
      subCategory.innerText = isEnriched ? 
        'Controlled Distribution: Groups 110 incidents by exam level, showing structural shift from Entrance Tests (10 UPA vs 4 NDA) to Subordinate Recruitment (2 UPA vs 22 NDA).' : 
        'Raw Unadjusted Distribution: Unadjusted distribution comparing 24 UPA incidents against 86 NDA incidents across exam categories.';
    }

    if (titleMechanism) {
      titleMechanism.innerText = isEnriched ? 
        'Leak Mechanism Taxonomy (Confirmed Leaks vs Filtered Claims Noise)' : 
        'Leak Mechanism Taxonomy (Raw Incident Breakdown by Political Era)';
    }
    if (subMechanism) {
      subMechanism.innerText = isEnriched ? 
        'Grouped by Verification Severity: Isolates 89 Level-1 Confirmed Leaks (Green) from 21 Filtered Social Media Claims (Red), exposing 14 fake paper hoaxes exclusive to post-2014.' : 
        'Grouped by Political Era: Unfiltered breakdown of all 110 incidents comparing 24 UPA Raw Incidents (Indigo) vs 86 NDA Raw Incidents (Cyan).';
    }

    if (titleDataExplorer) {
      titleDataExplorer.innerText = isEnriched ? 
        'Layer 5: 110-Incident Authenticated Data Explorer (Controlled View - 24 UPA vs 86 NDA)' : 
        'Layer 5: 110-Incident Authenticated Data Explorer (Raw Unadjusted View)';
    }
  }

  function updateKPICards() {
    const isEnriched = currentMode === 'enriched';

    if (isEnriched) {
      document.getElementById('kpi-annual-rate').innerText = '5.35';
      document.getElementById('kpi-annual-sub').innerText = 'Level-1 Confirmed Leaks / Yr (vs 2.40 UPA)';

      document.getElementById('kpi-central-rate').innerText = '0.90';
      document.getElementById('kpi-central-sub').innerText = 'Central Leaks / Yr (vs 0.70 UPA)';

      document.getElementById('kpi-oe-ratio').innerText = '1.05 vs 1.06';
      document.getElementById('kpi-oe-sub').innerText = 'BJP (1.05) vs INC (1.06) Controlled Parity';

      document.getElementById('kpi-unconfirmed').innerText = '24.4%';
      document.getElementById('kpi-unconfirmed-sub').innerText = 'Filtered Out Post-2014 Claims Noise';
    } else {
      document.getElementById('kpi-annual-rate').innerText = '7.07';
      document.getElementById('kpi-annual-sub').innerText = 'Raw Unadjusted Incidents / Yr (7.07 vs 2.40 UPA)';

      document.getElementById('kpi-central-rate').innerText = '1.23';
      document.getElementById('kpi-central-sub').innerText = 'Unadjusted Central Raw Incidents / Yr';

      document.getElementById('kpi-oe-ratio').innerText = '2.15 vs 0.61';
      document.getElementById('kpi-oe-sub').innerText = 'Unadjusted Raw Distortion (Truncation Skew)';

      document.getElementById('kpi-unconfirmed').innerText = '0%';
      document.getElementById('kpi-unconfirmed-sub').innerText = 'Unfiltered Noise Included';
    }
  }

  function renderCharts() {
    Object.keys(charts).forEach(key => {
      if (charts[key]) charts[key].destroy();
    });

    renderEraChart();
    renderIndividualPartyTenureChart();
    renderFixedEffectsChart();
    renderCategoryChart();
    renderMechanismChart();
  }

  function renderEraChart() {
    const ctx = document.getElementById('chart-era').getContext('2d');
    const isEnriched = currentMode === 'enriched';

    const labels = ['UPA Era (2004–2014)', 'NDA Era (2014–2026)'];
    const rates = isEnriched ? [2.40, 5.35] : [2.40, 7.07];
    const totalLeaks = isEnriched ? [24, 65] : [24, 86];

    charts.era = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: isEnriched ? 'Confirmed Leak Rate (Leaks / Year) [Controlled]' : 'Raw Unadjusted Rate (Leaks / Year) [Raw]',
          data: rates,
          backgroundColor: isEnriched ? ['rgba(99, 102, 241, 0.75)', 'rgba(6, 182, 212, 0.75)'] : ['rgba(245, 158, 11, 0.75)', 'rgba(244, 63, 94, 0.75)'],
          borderColor: isEnriched ? ['#6366f1', '#06b6d4'] : ['#f59e0b', '#f43f5e'],
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

  function renderIndividualPartyTenureChart() {
    const ctx = document.getElementById('chart-party-tenure').getContext('2d');
    const isEnriched = currentMode === 'enriched';

    const partyNames = Object.keys(individualPartyData);
    const chartData = partyNames.map(p => isEnriched ? individualPartyData[p].rate : individualPartyData[p].raw);

    charts.partyTenure = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: partyNames,
        datasets: [{
          label: isEnriched ? 'Normalized Rate (Leaks / State-Year in Power)' : 'Raw Absolute State Leak Count',
          data: chartData,
          backgroundColor: isEnriched ? 'rgba(6, 182, 212, 0.75)' : 'rgba(244, 63, 94, 0.75)',
          borderColor: isEnriched ? '#06b6d4' : '#f43f5e',
          borderWidth: 1,
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: '#94a3b8' } } },
        scales: {
          x: { ticks: { color: '#94a3b8', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.05)' } },
          y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' }, beginAtZero: true }
        }
      }
    });
  }

  function renderFixedEffectsChart() {
    const ctx = document.getElementById('chart-fixed-effects').getContext('2d');
    const isEnriched = currentMode === 'enriched';
    
    const topParties = ['BJP', 'INC', 'JD(U)', 'SP', 'BSP', 'AAP', 'AITC', 'BJD'];
    const oeRatios = topParties.map(p => isEnriched ? individualPartyData[p].oeControlled : individualPartyData[p].oeRaw);

    charts.fixedEffects = new Chart(ctx, {
      type: 'line',
      data: {
        labels: topParties,
        datasets: [
          {
            label: isEnriched ? 'Controlled State Fixed-Effects (O / E Ratio)' : 'Unadjusted Raw Data (O / E Ratio - Skewed by Truncation)',
            data: oeRatios,
            borderColor: isEnriched ? '#06b6d4' : '#f43f5e',
            backgroundColor: isEnriched ? 'rgba(6, 182, 212, 0.15)' : 'rgba(244, 63, 94, 0.15)',
            borderWidth: 3,
            pointBackgroundColor: isEnriched ? '#06b6d4' : '#f43f5e',
            pointRadius: 6,
            fill: true,
            tension: 0.3
          },
          {
            label: 'State Baseline Parity Line (1.00)',
            data: topParties.map(() => 1.00),
            borderColor: '#94a3b8',
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
          y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' }, min: 0.4, max: 2.5 }
        }
      }
    });
  }

  function renderCategoryChart() {
    const ctx = document.getElementById('chart-category').getContext('2d');
    const isEnriched = currentMode === 'enriched';

    const categories = ['Subordinate Recruitment', 'Entrance Tests (Higher Ed)', 'Police & Defense', 'Teacher Recruitment / TET', 'School Board Exam', 'Civil Services / PSC'];
    
    const upaCounts = [2, 10, 2, 2, 3, 2];
    const ndaCounts = isEnriched ? [22, 4, 10, 10, 6, 8] : [30, 7, 11, 13, 6, 12];

    charts.category = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: categories,
        datasets: [
          {
            label: 'UPA Era (24 Cases)',
            data: upaCounts,
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99, 102, 241, 0.25)',
            borderWidth: 2
          },
          {
            label: isEnriched ? 'NDA Era Confirmed (65 Cases)' : 'NDA Era Raw (86 Cases)',
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

  function renderMechanismChart() {
    const ctx = document.getElementById('chart-mechanism').getContext('2d');
    const isEnriched = currentMode === 'enriched';

    const mechanisms = ['Digital / WhatsApp Leak', 'Printing Press Breach', 'Hoax / Fake Paper', 'In-Exam Tech Cheating', 'OMR / Result Tampering', 'Impersonation Racket'];
    
    const dataset1 = isEnriched ? [28, 20, 0, 9, 8, 7] : [5, 4, 0, 1, 7, 5];
    const dataset2 = isEnriched ? [2, 1, 14, 2, 1, 1] : [33, 21, 14, 9, 4, 2];

    const label1 = isEnriched ? 'Confirmed Administrative Leaks (89)' : 'UPA Era Raw Incidents (24)';
    const label2 = isEnriched ? 'Filtered Unconfirmed Claims / Noise (21)' : 'NDA Era Raw Incidents (86)';

    charts.mechanism = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: mechanisms,
        datasets: [
          {
            label: label1,
            data: dataset1,
            backgroundColor: isEnriched ? 'rgba(16, 185, 129, 0.75)' : 'rgba(99, 102, 241, 0.75)'
          },
          {
            label: label2,
            data: dataset2,
            backgroundColor: isEnriched ? 'rgba(244, 63, 94, 0.75)' : 'rgba(6, 182, 212, 0.75)'
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

    document.getElementById('record-count').innerText = `${records.length} Incidents Displayed (110 Authenticated Records)`;
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
        (row.incident_id && row.incident_id.toLowerCase().includes(search)) ||
        (row.exam_name && row.exam_name.toLowerCase().includes(search)) ||
        (row.state_name && row.state_name.toLowerCase().includes(search)) ||
        (row.conducting_body && row.conducting_body.toLowerCase().includes(search)) ||
        (row.note && row.note.toLowerCase().includes(search));
      
      const matchesEra = !era || row.era === era;
      const matchesCat = !cat || row.exam_category === cat;
      const matchesStatus = !status || (row.leak_status && row.leak_status.toLowerCase().includes(status.toLowerCase()));

      return matchesSearch && matchesEra && matchesCat && matchesStatus;
    });

    populateTable(filtered);
  }

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
      sourceLink.innerText = `View Primary Source (${row.source_name || 'Link'})`;
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
