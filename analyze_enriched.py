import pandas as pd
import numpy as np

df = pd.read_csv('paper_leaks_enriched.csv')

print("==================================================")
print("1. ERA COMPARISON: RAW VS VERIFIED LEAKS")
print("==================================================")
raw_era = df['era'].value_counts()
ver_era = df[df['verified_leak_flag'] == 1]['era'].value_counts()
era_table = pd.DataFrame({'Total Raw Incidents': raw_era, 'Confirmed/Verified Leaks': ver_era})
era_table['Unconfirmed / Claims (%)'] = ((era_table['Total Raw Incidents'] - era_table['Confirmed/Verified Leaks']) / era_table['Total Raw Incidents'] * 100).round(1)
print(era_table)

print("\n==================================================")
print("2. GOVERNING LEVEL BREAKDOWN (CENTRAL VS STATE)")
print("==================================================")
print(pd.crosstab(df['governing_level'], df['era'], margins=True))

print("\n==================================================")
print("3. STATE-LEVEL LEAKS BY STATE RULING COALITION / PARTY")
print("==================================================")
state_df = df[df['governing_level'] == 'State']
print("\nState Incidents by Ruling Coalition:")
print(pd.crosstab(state_df['state_ruling_coalition'], state_df['verified_leak_flag'], margins=True))

print("\nState Incidents by Ruling Party (Top 10):")
print(state_df['state_ruling_party'].value_counts().head(10))

print("\n==================================================")
print("4. POLITICAL ALIGNMENT (DOUBLE ENGINE VS OPPOSITION)")
print("==================================================")
print(pd.crosstab(state_df['political_alignment'], state_df['verified_leak_flag'], margins=True))

print("\n==================================================")
print("5. EXAM CATEGORY DISTRIBUTION")
print("==================================================")
print(pd.crosstab(df['exam_category'], df['verified_leak_flag'], margins=True))

print("\n==================================================")
print("6. LEAK MECHANISM BREAKDOWN")
print("==================================================")
print(pd.crosstab(df['leak_mechanism'], df['verified_leak_flag'], margins=True))

print("\n==================================================")
print("7. STATE-BY-STATE INCIDENT FREQUENCY (TOP 10 STATES)")
print("==================================================")
print(state_df['state_name'].value_counts().head(10))

print("\n==================================================")
print("8. DATE PRECISION BREAKDOWN")
print("==================================================")
print(df['date_precision'].value_counts())
