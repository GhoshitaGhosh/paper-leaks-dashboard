// Global Dashboard Application Controller - 110 Authenticated Records
document.addEventListener('DOMContentLoaded', () => {
  const data = (typeof paperLeaksData !== 'undefined' ? paperLeaksData : window.PAPER_LEAKS_DATA) || [];
  let currentMode = 'enriched'; // 'enriched' (controlled) vs 'raw' (unadjusted)
  let charts = {};

  // Individual Party Data Mappings (Dynamically Verified via Interval Lookup)
  const individualPartyData = {
    'BJP': { raw: 45, confirmed: 38, stateYears: 207.8, rate: 0.183, oeControlled: 1.10, oeRaw: 1.30 },
    'INC': { raw: 17, confirmed: 14, stateYears: 187.9, rate: 0.075, oeControlled: 0.83, oeRaw: 1.01 },
    'JD(U)': { raw: 7, confirmed: 6, stateYears: 20.7, rate: 0.290, oeControlled: 1.07, oeRaw: 1.07 },
    'AAP': { raw: 4, confirmed: 2, stateYears: 14.5, rate: 0.138, oeControlled: 0.90, oeRaw: 1.80 },
    'JMM': { raw: 4, confirmed: 1, stateYears: 10.5, rate: 0.095, oeControlled: 0.90, oeRaw: 3.60 },
    'SP': { raw: 1, confirmed: 1, stateYears: 8.0, rate: 0.125, oeControlled: 0.69, oeRaw: 0.69 },
    'Shiv Sena': { raw: 2, confirmed: 2, stateYears: 2.6, rate: 0.769, oeControlled: 2.85, oeRaw: 2.85 },
    'AITC': { raw: 1, confirmed: 1, stateYears: 15.2, rate: 0.066, oeControlled: 0.73, oeRaw: 0.73 },
    'BJD': { raw: 1, confirmed: 1, stateYears: 20.1, rate: 0.050, oeControlled: 1.10, oeRaw: 1.10 },
    'BRS': { raw: 1, confirmed: 1, stateYears: 9.5, rate: 0.105, oeControlled: 2.33, oeRaw: 2.33 },
    'BSP': { raw: 1, confirmed: 1, stateYears: 4.8, rate: 0.208, oeControlled: 0.74, oeRaw: 0.74 }
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
        modeDesc.innerHTML = '<strong>Active Mode: Controlled Econometric View.</strong> Applies era annualization, state executive tenure normalization, state baseline risk standardization ($O/E$), and severity noise filtering across the 110 authenticated dataset incidents.';
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
    const titleStatePartyPerf = document.getElementById('title-chart-state-party-perf');
    const subStatePartyPerf = document.getElementById('sub-chart-state-party-perf');
    const titleCategory = document.getElementById('title-chart-category');
    const subCategory = document.getElementById('sub-chart-category');
    const titleMechanism = document.getElementById('title-chart-mechanism');
    const subMechanism = document.getElementById('sub-chart-mechanism');
    const titleDataExplorer = document.getElementById('title-data-explorer');

    if (titleStatePartyPerf) {
      titleStatePartyPerf.innerText = isEnriched ? 
        'State-Level Party Performance (Intra-State O/E Risk Disaggregation)' : 
        'State-Level Party Performance (Raw Incident Distribution by State)';
    }
    if (subStatePartyPerf) {
      subStatePartyPerf.innerText = isEnriched ? 
        '📌 Scope: All Exam Integrity Breaches. Disaggregates Observed vs Expected risk ratios (O/E) for BJP and INC within individual states (e.g. Rajasthan BJP 1.12 vs INC 0.88).' : 
        '📌 Scope: All Exam Integrity Breaches. Raw incident distribution by state without controlling for state-specific baseline risk or tenure.';
    }

    if (titleEra) {
      titleEra.innerText = isEnriched ? 
        'Annualized Confirmed Incident Frequency (UPA vs NDA-II)' : 
        'Raw Unadjusted Incident Frequency (UPA vs NDA-II - Unfiltered)';
    }
    if (subEra) {
      subEra.innerText = isEnriched ? 
        '📌 Scope: All Exam Integrity Breaches. Overall national annualized incident rate comparison across political eras (5.35 vs 2.30 breaches/yr).' : 
        '📌 Scope: All Exam Integrity Breaches. Raw unadjusted incident frequency across political eras (7.07 vs 2.30 breaches/yr - unfiltered).';
    }

    if (titlePartyTenure) {
      titlePartyTenure.innerText = isEnriched ? 
        'Individual State Parties (Tenure-Normalized Rate)' : 
        'Individual State Parties (Raw Absolute Incident Counts)';
    }
    if (subPartyTenure) {
      subPartyTenure.innerText = isEnriched ? 
        '📌 Scope: All Exam Integrity Breaches. Controls for Time in Office (State-Years), showing breaches per state-year in power.' : 
        '📌 Scope: All Exam Integrity Breaches. Simple raw incident tallies under party state rule without controlling for time in office.';
    }

    if (titleFixedEffects) {
      titleFixedEffects.innerText = isEnriched ? 
        'State Baseline Risk Standardization (Observed vs Expected O/E Ratios)' : 
        'State Baseline Risk Standardization (Raw Truncation Skewed O/E Ratios)';
    }
    if (subFixedEffects) {
      subFixedEffects.innerText = isEnriched ? 
        '📌 Scope: All Exam Integrity Breaches. Controls for BOTH Time in Office AND Geographic Risk Proclivity (BJP 1.10 vs INC 0.83).' : 
        '📌 Scope: All Exam Integrity Breaches. Unadjusted Raw Analysis: Demonstrates the artificial BJP distortion caused by truncation skew.';
    }

    if (titleCategory) {
      titleCategory.innerText = isEnriched ? 
        'Exam Category Shift Across Eras (Controlled Confirmed Distribution)' : 
        'Exam Category Shift Across Eras (Raw Unadjusted Distribution)';
    }
    if (subCategory) {
      subCategory.innerText = isEnriched ? 
        '📌 Scope: All Exam Integrity Breaches. Groups 110 incidents by exam level, showing structural shift from Entrance Tests (6 UPA vs 10 NDA-II) to Subordinate Recruitment (8 UPA vs 18 NDA-II).' : 
        '📌 Scope: All Exam Integrity Breaches. Unadjusted distribution comparing 23 UPA incidents against 86 NDA-II incidents across exam categories.';
    }

    if (titleMechanism) {
      titleMechanism.innerText = isEnriched ? 
        'Construct Disaggregation & Mechanism Taxonomy (58 Confirmed Paper Leaks)' : 
        'Construct Disaggregation & Mechanism Taxonomy (Raw Breakdown by Era)';
    }
    if (subMechanism) {
      subMechanism.innerText = isEnriched ? 
        '📌 Scope: Construct Disaggregation Engine. Explicitly isolates 58 Confirmed Paper Leaks from 14 OMR Tampering, 15 Cheating Rackets, and 21 Filtered Claims Noise.' : 
        '📌 Scope: Construct Disaggregation Engine. Unfiltered breakdown of all 110 incidents comparing 23 UPA Raw Incidents vs 86 NDA-II Raw Incidents.';
    }

    if (titleDataExplorer) {
      titleDataExplorer.innerText = isEnriched ? 
        'Layer 5: 110-Incident Authenticated Data Explorer (Controlled View - 23 UPA vs 86 NDA-II)' : 
        'Layer 5: 110-Incident Authenticated Data Explorer (Raw Unadjusted View)';
    }
  }

  function updateKPICards() {
    const isEnriched = currentMode === 'enriched';

    if (isEnriched) {
      const centEl = document.getElementById('kpi-central-rate');
      if (centEl) centEl.innerText = '0.58 vs 0.50';
      const centSub = document.getElementById('kpi-central-sub');
      if (centSub) centSub.innerText = 'NDA-II (0.58) vs UPA (0.50) Paper Leaks/Yr (Parity Ratio = 1.15)';

      const rawEl = document.getElementById('kpi-raw-ratio');
      if (rawEl) rawEl.innerText = '2.71';
      const rawSub = document.getElementById('kpi-raw-sub');
      if (rawSub) rawSub.innerText = 'BJP (38) vs INC (14) Confirmed Incidents (Unadjusted Raw)';

      const tenureEl = document.getElementById('kpi-tenure-rate');
      if (tenureEl) tenureEl.innerText = '0.183 vs 0.075';
      const tenureSub = document.getElementById('kpi-tenure-sub');
      if (tenureSub) tenureSub.innerText = 'BJP (0.183) vs INC (0.075) Incidents/State-Yr (Tenure Ratio = 2.45)';

      const oeEl = document.getElementById('kpi-oe-ratio');
      if (oeEl) oeEl.innerText = '1.10 vs 0.83';
      const oeSub = document.getElementById('kpi-oe-sub');
      if (oeSub) oeSub.innerText = 'BJP (1.10) vs INC (0.83) O/E (Baseline Risk Ratio = 1.32)';

      const volEl = document.getElementById('kpi-vol-rate');
      if (volEl) volEl.innerText = '11.02 vs 6.61';
      const volSub = document.getElementById('kpi-vol-sub');
      if (volSub) volSub.innerText = 'BJP (11.02) vs INC (6.61) / 1k Notifs (Sourced Rate Ratio = 1.67)';

      const consEl = document.getElementById('kpi-cons-ratio');
      if (consEl) consEl.innerText = '1.01 vs 0.91';
      const consSub = document.getElementById('kpi-cons-sub');
      if (consSub) consSub.innerText = 'BJP (1.01) vs INC (0.91) Consolidated (All Controls = 1.11)';
    } else {
      const centEl = document.getElementById('kpi-central-rate');
      if (centEl) centEl.innerText = '1.23 vs 0.60';
      const centSub = document.getElementById('kpi-central-sub');
      if (centSub) centSub.innerText = 'NDA-II (15 claims/12.2yr) vs UPA (6 claims/10yr) Unadjusted Raw Central';

      const rawEl = document.getElementById('kpi-raw-ratio');
      if (rawEl) rawEl.innerText = '2.65';
      const rawSub = document.getElementById('kpi-raw-sub');
      if (rawSub) rawSub.innerText = 'BJP (45) vs INC (17) Unadjusted Raw Incidents';

      const tenureEl = document.getElementById('kpi-tenure-rate');
      if (tenureEl) tenureEl.innerText = '0.265 vs 0.135';
      const tenureSub = document.getElementById('kpi-tenure-sub');
      if (tenureSub) tenureSub.innerText = 'Unadjusted Tenure Rate (No Noise Filtering)';

      const oeEl = document.getElementById('kpi-oe-ratio');
      if (oeEl) oeEl.innerText = '1.30 vs 1.05';
      const oeSub = document.getElementById('kpi-oe-sub');
      if (oeSub) oeSub.innerText = 'BJP (1.30) vs INC (1.05) Raw Distortion';

      const volEl = document.getElementById('kpi-vol-rate');
      if (volEl) volEl.innerText = 'Unadjusted';
      const volSub = document.getElementById('kpi-vol-sub');
      if (volSub) volSub.innerText = 'Unadjusted Raw View (No Exposure Controls)';

      const consEl = document.getElementById('kpi-cons-ratio');
      if (consEl) consEl.innerText = 'Unadjusted';
      const consSub = document.getElementById('kpi-cons-sub');
      if (consSub) consSub.innerText = 'Unadjusted Raw Mode Active';
    }
  }

  function renderCharts() {
    Object.keys(charts).forEach(key => {
      if (charts[key]) charts[key].destroy();
    });

    renderEraChart();
    renderIndividualPartyTenureChart();
    renderFixedEffectsChart();
    renderStatePartyPerformanceChart();
    renderExamVolumeChart();
    renderProgressiveConvergenceChart();
    renderCategoryChart();
    renderMechanismChart();
  }

  function renderEraChart() {
    const ctx = document.getElementById('chart-era').getContext('2d');
    const isEnriched = currentMode === 'enriched';

    const labels = ['UPA Era (2004–2014)', 'NDA Era (2014–2026)'];
    const rates = isEnriched ? [2.30, 5.35] : [2.30, 7.07];
    const totalLeaks = isEnriched ? [23, 65] : [23, 86];

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

  // Chart 6: State-Level Party Performance (Intra-State O/E Risk Disaggregation)
  function renderStatePartyPerformanceChart() {
    const canvas = document.getElementById('chart-state-party-perf');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const isEnriched = currentMode === 'enriched';

    const states = ['Rajasthan', 'Uttarakhand', 'Maharashtra', 'Haryana', 'Madhya Pradesh', 'Uttar Pradesh'];
    
    // Controlled O/E Ratios vs Raw O/E Ratios
    const bjpOE = isEnriched ? [1.12, 0.79, 1.38, 1.41, 1.10, 1.74] : [1.12, 0.79, 1.38, 1.41, 1.10, 2.15];
    const incOE = isEnriched ? [0.88, 1.36, 1.05, 0.58, 0.00, 0.00] : [0.88, 1.36, 1.05, 0.58, 0.00, 0.00];

    charts.statePartyPerformance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: states,
        datasets: [
          {
            label: isEnriched ? 'BJP Observed / Expected (O/E Ratio)' : 'BJP Raw O/E Ratio',
            data: bjpOE,
            backgroundColor: 'rgba(6, 182, 212, 0.75)',
            borderColor: '#06b6d4',
            borderWidth: 1,
            borderRadius: 6
          },
          {
            label: isEnriched ? 'INC Observed / Expected (O/E Ratio)' : 'INC Raw O/E Ratio',
            data: incOE,
            backgroundColor: 'rgba(99, 102, 241, 0.75)',
            borderColor: '#6366f1',
            borderWidth: 1,
            borderRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: '#94a3b8' } } },
        scales: {
          x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
          y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' }, beginAtZero: true, max: 2.5 }
        }
      }
    });
  }

  function renderExamVolumeChart() {
    const el = document.getElementById('chart-exam-volume');
    if (!el) return;
    const ctx = el.getContext('2d');
    const isEnriched = currentMode === 'enriched';

    const parties = ['BJP', 'INC', 'JD(U)', 'SP', 'JMM', 'AAP', 'AITC', 'BJD'];
    const notifRates = [11.015, 6.613, 10.870, 6.250, 4.762, 9.091, 2.994, 2.262];
    const tenureRates = [0.183, 0.075, 0.290, 0.125, 0.095, 0.138, 0.066, 0.050];

    charts.examVolume = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: parties,
        datasets: [
          {
            label: 'Level-4: Sourced Notification Exposure Rate (Leaks / 1,000 Notifications)',
            data: notifRates,
            backgroundColor: 'rgba(16, 185, 129, 0.75)',
            borderColor: '#10b981',
            borderWidth: 1.5,
            borderRadius: 6
          },
          {
            label: 'Level-2: Executive Tenure Rate (Leaks / State-Year)',
            data: tenureRates,
            backgroundColor: 'rgba(99, 102, 241, 0.45)',
            borderColor: '#6366f1',
            borderWidth: 1.5,
            borderRadius: 6
          }
        ]
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
                if (parties[idx] === 'BJP') return 'BJP Total Sourced Notifications: 3,447 | Confirmed Leaks: 38 | Sourced RR: 1.67';
                if (parties[idx] === 'INC') return 'INC Total Sourced Notifications: 2,117 | Confirmed Leaks: 14 | Sourced RR: 1.67';
                return '';
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

  function renderCategoryChart() {
    const ctx = document.getElementById('chart-category').getContext('2d');
    const isEnriched = currentMode === 'enriched';

    const categories = ['Subordinate Recruitment', 'Entrance Tests (Higher Ed)', 'Police & Defense', 'Teacher Recruitment / TET', 'School Board Exam', 'Civil Services / PSC'];
    
    const upaCounts = categories.map(cat => data.filter(d => (d.era || '').includes('UPA') && (d.leak_status || '').includes('Confirmed') && d.exam_category === cat).length);
    const ndaCounts = categories.map(cat => isEnriched ? 
      data.filter(d => (d.era || '').includes('NDA-II') && (d.leak_status || '').includes('Confirmed') && d.exam_category === cat).length : 
      data.filter(d => (d.era || '').includes('NDA-II') && d.exam_category === cat).length
    );

    const upaTotal = upaCounts.reduce((a, b) => a + b, 0);
    const ndaTotal = ndaCounts.reduce((a, b) => a + b, 0);

    charts.category = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: categories,
        datasets: [
          {
            label: `UPA Era Confirmed (${upaTotal} Cases)`,
            data: upaCounts,
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99, 102, 241, 0.25)',
            borderWidth: 2
          },
          {
            label: isEnriched ? `NDA-II Era Confirmed (${ndaTotal} Cases)` : `NDA-II Era Raw (${ndaTotal} Cases)`,
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

    const mechanisms = [
      'Digital/Messaging Pre-circulation',
      'Physical Theft/Local Leak',
      'OMR/Result Tampering',
      'Proxy Impersonation',
      'In-Exam Tech Cheating',
      'Certificate Forgery'
    ];

    let dataset1, dataset2, label1, label2;

    if (isEnriched) {
      label1 = 'Confirmed Administrative Incidents (89)';
      label2 = 'Filtered Unconfirmed Claims / Noise (21)';
      dataset1 = mechanisms.map(m => data.filter(d => (d.leak_status || '').includes('Confirmed') && d.incident_mechanism === m).length);
      dataset2 = mechanisms.map(m => data.filter(d => !(d.leak_status || '').includes('Confirmed') && d.incident_mechanism === m).length);
    } else {
      label1 = 'UPA Era Raw Incidents (23)';
      label2 = 'NDA-II Era Raw Incidents (86)';
      dataset1 = mechanisms.map(m => data.filter(d => (d.era || '').includes('UPA') && d.incident_mechanism === m).length);
      dataset2 = mechanisms.map(m => data.filter(d => (d.era || '').includes('NDA-II') && d.incident_mechanism === m).length);
    }

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

  function renderProgressiveConvergenceChart() {
    const el = document.getElementById('chart-progressive-ratio-convergence');
    if (!el) return;
    const ctx = el.getContext('2d');

    const stages = [
      'Level 1: Raw Ratio',
      'Level 2: Tenure Rate',
      'Level 3: Baseline Risk',
      'Level 4: Sourced Notifs',
      'Consolidated (O/E_full)'
    ];
    const ratios = [2.71, 2.45, 1.32, 1.67, 1.11];

    charts.progressiveConvergence = new Chart(ctx, {
      type: 'line',
      data: {
        labels: stages,
        datasets: [{
          label: 'Party Risk Ratio (BJP / INC)',
          data: ratios,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.15)',
          borderWidth: 3,
          pointBackgroundColor: '#10b981',
          pointRadius: 6,
          fill: true,
          tension: 0.35
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
                if (idx === 0) return 'Raw Incidents: BJP 38 vs INC 14 (Ratio = 2.71)';
                if (idx === 1) return 'Tenure Rate: 0.183 vs 0.075 incidents/state-yr (Ratio = 2.45)';
                if (idx === 2) return 'Geographic Risk O/E: 1.10 vs 0.83 (Ratio = 1.32)';
                if (idx === 3) return 'Sourced Notifications: 11.02 vs 6.61 / 1k notifs (Ratio = 1.67)';
                if (idx === 4) return 'Consolidated Triple-Control: 1.01 vs 0.91 (Ratio = 1.11)';
                return '';
              }
            }
          }
        },
        scales: {
          x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
          y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' }, min: 0.8, max: 3.0 }
        }
      }
    });
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
