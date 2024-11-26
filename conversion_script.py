import pandas as pd
from datetime import datetime


url = "https://catalog.ourworldindata.org/garden/covid/latest/cases_deaths/cases_deaths.csv"
data = pd.read_csv(url)

data = data[['country', 'date', 'new_cases']]

data['date'] = pd.to_datetime(data['date'])

grouped_data = data.groupby(['country', 'date']).agg({
    'new_cases': 'sum'
}).reset_index()

print(grouped_data.head())

