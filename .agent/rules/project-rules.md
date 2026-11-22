# Project rules: Village Water Decision Platform

## Data and modeling
- Never split data randomly. Split by year and hold out whole wells or blocks.
- Always compare any model against three baselines: last season,
  seasonal average, and a linear rainfall model.
- Never tune on the test set.
- Report results in a table, including cases where the model does not
  beat the baselines.

## Recommendations
- Every recommendation must show its data source and a confidence label.
- Show ranges, not single numbers.
- Add a disclaimer: decision support, not a substitute for expert advice.

## Code and security
- Python 3.11+, FastAPI backend, React frontend.
- Never hard-code API keys. Read them from environment variables.
- Do not collect personal data. Use public datasets only.
- Log the source and download date of every dataset.
- Do not modify files in data/raw/ after download.
