import pandas as pd


# Cargar el archivo CSV
file_path = 'globe-name/data/GLOBEMeasurementData-21713.csv'  # Cambia esta ruta a la ubicación de tu archivo
data = pd.read_csv(file_path)

# Limpiar datos y combinar registros duplicados por 'org_name'
cleaned_data = data.groupby(' org_name').apply(lambda group: group.ffill().bfill().iloc[0])

# Reiniciar el índice
cleaned_data = cleaned_data.reset_index(drop=True)

# Guardar el archivo limpio
cleaned_data.to_csv('Cleaned_GLOBEMeasurementData_21713.csv', index=False)

