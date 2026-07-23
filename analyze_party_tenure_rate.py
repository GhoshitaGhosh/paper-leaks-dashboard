import pandas as pd

# Coalition / Bloc Consolidation
blocs = [
    {
        'Political Bloc': 'BJP & NDA State Governments',
        'Parties Included': 'BJP, BJP/Mahayuti',
        'Confirmed State Leaks': 39,
        'Cumulative State-Years in Power': 184.1,
        'Normalized Leak Rate (Leaks/State-Year)': round(39 / 184.1, 3),
        'Frequency (Years per Leak)': round(184.1 / 39, 2)
    },
    {
        'Political Bloc': 'INC & UPA/MVA State Governments',
        'Parties Included': 'INC, Shiv Sena (MVA), DMK, JMM, NC',
        'Confirmed State Leaks': 24,
        'Cumulative State-Years in Power': 155.3,
        'Normalized Leak Rate (Leaks/State-Year)': round(24 / 155.3, 3),
        'Frequency (Years per Leak)': round(155.3 / 24, 2)
    },
    {
        'Political Bloc': 'Regional Parties (Hindi Belt: SP, BSP, JD(U))',
        'Parties Included': 'SP, BSP, JD(U)',
        'Confirmed State Leaks': 12,
        'Cumulative State-Years in Power': 33.7,
        'Normalized Leak Rate (Leaks/State-Year)': round(12 / 33.7, 3),
        'Frequency (Years per Leak)': round(33.7 / 12, 2)
    },
    {
        'Political Bloc': 'Non-Aligned Regional Parties (AAP, BRS, BJD, AITC, SAD)',
        'Parties Included': 'AAP, BRS, BJD, AITC, SAD',
        'Confirmed State Leaks': 6,
        'Cumulative State-Years in Power': 70.5,
        'Normalized Leak Rate (Leaks/State-Year)': round(6 / 70.5, 3),
        'Frequency (Years per Leak)': round(70.5 / 6, 2)
    },
    {
        'Political Bloc': 'Left Front / CPI(M)',
        'Parties Included': 'CPI(M)',
        'Confirmed State Leaks': 1,
        'Cumulative State-Years in Power': 36.0,
        'Normalized Leak Rate (Leaks/State-Year)': round(1 / 36.0, 3),
        'Frequency (Years per Leak)': round(36.0 / 1, 2)
    }
]

bloc_df = pd.DataFrame(blocs)
print("=========================================================================================")
print("BLOC-LEVEL TENURE-NORMALIZED LEAK RATES AT STATE LEVEL")
print("=========================================================================================")
print(bloc_df.to_string(index=False))
