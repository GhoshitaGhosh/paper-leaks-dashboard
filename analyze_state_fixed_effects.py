import pandas as pd
import numpy as np

# Load enriched dataset
df = pd.read_csv('paper_leaks_enriched.csv')

# State confirmed leaks only
state_ver = df[(df['governing_level'] == 'State') & (df['verified_leak_flag'] == 1)]

# State total confirmed leaks
state_leak_counts = state_ver['state_name'].value_counts()

# Total evaluation timeframe
total_timeframe_years = 22.16

# Calculate Baseline Annual Leak Risk per State (Leaks / Year)
state_baseline_risk = {}
for st, cnt in state_leak_counts.items():
    state_baseline_risk[st] = cnt / total_timeframe_years

print("=========================================================================================")
print("STATE BASELINE LEAK RISK (LEAKS PER YEAR BY GEOGRAPHIC JURISDICTION, 2004-2026)")
print("=========================================================================================")
risk_df = pd.DataFrame([
    {'State': st, 'Confirmed Leaks': cnt, 'Baseline Annual Risk (Leaks/Yr)': round(cnt / total_timeframe_years, 3)}
    for st, cnt in state_leak_counts.items()
])
print(risk_df.to_string(index=False))

# Detailed State-Tenure Mapping per Party (Years governed in specific states between May 2004 & July 2026)
party_state_tenures = {
    'BJP': {
        'Madhya Pradesh': 20.8, 'Gujarat': 22.16, 'Uttar Pradesh': 9.3, 'Rajasthan': 12.1,
        'Haryana': 11.8, 'Uttarakhand': 14.3, 'Himachal Pradesh': 10.0, 'Karnataka': 8.8,
        'Assam': 10.2, 'Chhattisgarh': 17.1, 'Arunachal Pradesh': 10.0, 'Maharashtra': 4.1
    },
    'INC': {
        'Rajasthan': 10.0, 'Madhya Pradesh': 1.3, 'Himachal Pradesh': 12.1, 'Haryana': 9.6,
        'Assam': 12.0, 'Uttarakhand': 5.0, 'Punjab': 7.8, 'Karnataka': 8.2,
        'Maharashtra': 13.0, 'Andhra Pradesh': 10.0, 'Manipur': 13.0, 'Chhattisgarh': 5.0
    },
    'SP': {'Uttar Pradesh': 8.0},
    'BSP': {'Uttar Pradesh': 5.0},
    'JD(U)': {'Bihar': 20.7},
    'AAP': {'Delhi': 11.4, 'Punjab': 4.3},
    'AITC': {'West Bengal': 15.2},
    'BJD': {'Odisha': 20.1},
    'BRS': {'Telangana': 9.5},
    'SAD': {'Punjab': 10.0},
    'CPI(M)': {'West Bengal': 7.0, 'Tripura': 14.0, 'Kerala': 15.2}
}

# Calculate Expected vs Observed Leaks per Party
expected_results = []
party_obs_counts = state_ver['state_ruling_party'].value_counts()

for party, tenures in party_state_tenures.items():
    obs = party_obs_counts.get(party, 0)
    # If party contains sub-coalition key like 'BJP / Mahayuti' or 'Shiv Sena (MVA)'
    if party == 'BJP':
        obs += party_obs_counts.get('BJP / Mahayuti', 0)
    
    exp = 0.0
    for st, yrs in tenures.items():
        st_risk = state_baseline_risk.get(st, 0.0)
        exp += st_risk * yrs
    
    ratio = obs / exp if exp > 0 else np.nan
    expected_results.append({
        'Political Party': party,
        'Observed State Leaks (O)': obs,
        'Expected State Leaks (E)': round(exp, 2),
        'O / E Ratio': round(ratio, 2),
        'State Fixed-Effects Verdict': 'Higher than State Expected' if ratio > 1.05 else ('Lower than State Expected' if ratio < 0.95 else 'Exactly as State Expected')
    })

exp_df = pd.DataFrame(expected_results)
print("\n=========================================================================================")
print("STATE FIXED-EFFECTS ADJUSTED: OBSERVED VS EXPECTED LEAKS BY PARTY")
print("=========================================================================================")
print(exp_df.to_string(index=False))
