import pandas as pd

upa_years = 10.0
nda_years = 12.16

nda_confirmed = 65
nda_rate = nda_confirmed / nda_years

print("=========================================================================================")
print("SENSITIVITY ANALYSIS: IMPACT OF UNOBSERVED PRE-2014 INCIDENTS ON REGIME COMPARISON")
print("=========================================================================================")
print(f"NDA Confirmed Rate: {nda_rate:.2f} leaks/year (65 leaks over 12.16 years)\n")

header = f"{'Observed UPA':<15} | {'Unobserved Missed':<18} | {'Total UPA Leaks':<18} | {'UPA Rate (leaks/yr)':<22} | {'NDA/UPA Ratio':<15}"
print(header)
print("-" * len(header))

for missed in [0, 5, 10, 14, 15, 20, 25, 30, 40]:
    total_upa = 40 + missed
    upa_rate = total_upa / upa_years
    ratio = nda_rate / upa_rate
    print(f"{40:<15} | {missed:<18} | {total_upa:<18} | {upa_rate:<22.2f} | {ratio:<15.2f}x")
