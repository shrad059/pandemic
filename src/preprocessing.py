import json
import unicodedata
from collections import defaultdict

# Function to normalize country names (remove accents and unify formats)
def normalize_country_name(name):
    # Normalize and remove accents (e.g., "Côte d'Ivoire" to "Cote d'Ivoire")
    name = unicodedata.normalize('NFKD', name).encode('ASCII', 'ignore').decode('ASCII')
    # Handle special cases like 'United States of America' vs 'United States'
    special_cases = {
        "United States of America": "United States",
        "Côte d'Ivoire": "Cote d'Ivoire",
        "Solomon Is.": "Solomon Islands",
        "Fr. S. Antarctic Lands": "French Southern and Antarctic Lands",
        "Dem. Rep. Congo": "Democratic Republic of the Congo",
        "Eq. Guinea": "Equatorial Guinea",
        "W. Sahara": "Western Sahara",
        "S. Sudan": "South Sudan",
        "Macedonia": "North Macedonia",
        "Swaziland": "Eswatini",
        "Timor-Leste": "East Timor"
    }
    return special_cases.get(name, name)

# Load the data from both files
with open('./covid.json', 'r') as afghan_file:
    afghanistan_data = json.load(afghan_file)

with open('./files/globe-data.json', 'r') as globe_file:
    globe_data = json.load(globe_file)

# Create a dictionary to map country names to their ISO_A3 codes in global-data.json
country_to_iso = {}
if 'features' in globe_data:  # Ensure that the "features" key exists in the GeoJSON data
    for feature in globe_data['features']:
        if 'properties' in feature:
            country_name = feature['properties']['NAME']
            iso_a3 = feature['properties']['ISO_A3']
            country_to_iso[country_name] = iso_a3
else:
    print("GeoJSON 'features' key is missing. Please inspect the data format.")

# Extract country names from both datasets (normalized)
covid_countries = {normalize_country_name(entry['country']) for entry in afghanistan_data}
globe_countries = {normalize_country_name(feature['properties']['NAME']) for feature in globe_data.get('features', []) if 'properties' in feature}

# Find countries that are in either covid.json or global-data.json but not in both
missing_in_covid = globe_countries - covid_countries
missing_in_globe = covid_countries - globe_countries

# Print the countries that are not in both files, along with their ISO_A3 codes
print("Countries in global-data.json but not in covid.json:")
for country in missing_in_covid:
    iso_a3 = country_to_iso.get(country)
    print(f"{country} (ISO_A3: {iso_a3})")

print("\nCountries in covid.json but not in global-data.json:")
for country in missing_in_globe:
    print(country)

# Create a dictionary to aggregate the data
aggregated_data = defaultdict(lambda: {"ISO_A3": None, "data": []})

for entry in afghanistan_data:
    country_name = normalize_country_name(entry['country'])

    if country_name in country_to_iso:
        iso_a3 = country_to_iso[country_name]
        aggregated_data[country_name]['ISO_A3'] = iso_a3
        aggregated_data[country_name]['data'].append({
            "date": entry['date'],
            "new_cases": entry['new_cases'],
            "total_cases": entry['total_cases']
        })


# Convert the aggregated data to a list of dictionaries
final_data = [{"country": country, "ISO_A3": info['ISO_A3'], "data": info['data']} 
              for country, info in aggregated_data.items()]

# Save the updated data back to a JSON file
with open('final.json', 'w') as updated_file:
    json.dump(final_data, updated_file, indent=4)
