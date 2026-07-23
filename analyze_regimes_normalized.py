import pandas as pd
import numpy as np

df = pd.read_csv('paper_leaks_enriched.csv')

print("==================================================")
print("1. EQUAL-BASELINE ERA COMPARISON (40 UPA vs 86 NDA)")
print("==================================================")
raw_counts = df['era'].value_counts()
ver_counts = df[df['verified_leak_flag'] == 1]['era'].value_counts()

years_map = {'UPA (2004-May2014)': 10.0, 'NDA (May2014-now)': 12.16}

comp_table = pd.DataFrame({
    'Raw Incidents': raw_counts,
    'Confirmed Leaks': ver_counts,
    'Unconfirmed Claims': raw_counts - ver_counts,
    'Duration (Years)': [years_map[idx] for idx in raw_counts.index]
})

comp_table['Raw Rate (Leaks/Year)'] = (comp_table['Raw Incidents'] / comp_table['Duration (Years)']).round(2)
comp_table['Confirmed Rate (Leaks/Year)'] = (comp_table['Confirmed Leaks'] / comp_table['Duration (Years)']).round(2)
comp_table['Unconfirmed Claim Share (%)'] = ((comp_table['Unconfirmed Claims'] / comp_table['Raw Incidents']) * 100).round(1)

print(comp_table[['Raw Incidents', 'Confirmed Leaks', 'Unconfirmed Claim Share (%)', 'Raw Rate (Leaks/Year)', 'Confirmed Rate (Leaks/Year)']])

print("\n==================================================")
print("2. CENTRAL VS STATE LEAKS BY ERA (CONFIRMED ONLY)")
print("==================================================")
ver_df = df[df['verified_leak_flag'] == 1]
print(pd.crosstab(ver_df['governing_level'], ver_df['era'], margins=True))

print("\n==================================================")
print("3. STATE-LEVEL LEAKS BY STATE RULING PARTY (CONFIRMED ONLY)")
print("==================================================")
state_ver = ver_df[ver_df['governing_level'] == 'State']
print(state_ver['state_ruling_party'].value_counts())

print("\n==================================================")
print("4. STATE-LEVEL LEAKS BY STATE RULING COALITION")
print("==================================================")
print(pd.crosstab(state_ver['state_ruling_coalition'], state_ver['era'], margins=True))

print("\n==================================================")
print("5. POLITICAL ALIGNMENT (DOUBLE ENGINE VS OPPOSITION) - CONFIRMED STATE LEAKS")
print("==================================================")
print(pd.crosstab(state_ver['political_alignment'], state_ver['era'], margins=True))

print("\n==================================================")
print("6. EXAM CATEGORY DISTRIBUTION (CONFIRMED LEAKS)")
print("==================================================")
print(pd.crosstab(ver_df['exam_category'], ver_df['era'], margins=True))

print("\n==================================================")
print("7. LEAK MECHANISM DISTRIBUTION (CONFIRMED LEAKS)")
print("==================================================")
print(pd.crosstab(ver_df['leak_mechanism'], ver_df['era'], margins=True))
