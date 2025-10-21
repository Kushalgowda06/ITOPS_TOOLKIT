import pandas as pd
from datetime import datetime

class EmployeeDirectory:
    def __init__(self, excel_file):
        self.excel_file = excel_file
        self.shift_data = pd.read_excel(excel_file, sheet_name = 'shifts', header=[0, 1])
        self.legend_data = pd.read_excel(excel_file, sheet_name = 'legend')
        self.tower_data = pd.read_excel(excel_file, sheet_name = 'towers')

    def get_person_by_department(self, tower):
        result = self.tower_data[self.tower_data['Tower'].str.lower() == tower.lower()]
        return result['Name'].tolist()

    def get_department_by_person(self, name):
        result = self.tower_data[self.tower_data['Name'].str.lower() == name.lower()]
        return result['Tower'].tolist()

    def get_person_by_shift_and_tower(self, date_input, time_input, tower_input):
        # Convert time columns to datetime.time
        self.shift_data.columns = [str(col[0]).strip() for col in self.shift_data.columns]

        self.legend_data['StartTime'] = pd.to_datetime(self.legend_data['StartTime'], format='%H:%M:%S').dt.time
        self.legend_data['EndTime'] = pd.to_datetime(self.legend_data['EndTime'], format='%H:%M:%S').dt.time

        # User input
        input_date = date_input #input("Enter time in DD-MM-YYYY format: ")  # DD-MM-YYYY format
        #input_start = datetime.strptime('14:00:00', '%H:%M:%S').time()
        input_time = datetime.strptime(time_input, '%H:%M:%S').time()
        input_tower = tower_input  # Case-insensitive

        # Convert input date to match column format
        formatted_date = datetime.strptime(input_date, '%d-%m-%Y')
        # Merge tower info from towers sheet with shifts sheet
        self.shift_data.columns = ['_'.join(col).strip() if isinstance(col, tuple) else col for col in self.shift_data.columns]
        # Extract static columns from towers and shifts sheet
        tower_info = self.tower_data
        # Extract static columns
        #print(self.shift_data)
        shift_info = self.shift_data['Name'].copy()
        #print(shift_info)
        shift_info.columns = ['Name']

        # Normalize Tower case
        tower_info['Tower'] = tower_info['Tower'].astype(str).str.lower()

        # Find the column for the input date
        date_columns = [col for col in self.shift_data.columns if pd.to_datetime(col, errors='coerce').date() == formatted_date.date()]

        if not date_columns:
            raise ValueError(f"Date {formatted_date} not found in shift data.")

        # Assume shift code is in the first sub-column under the date
        shift_column = date_columns[0]
        shift_info['ShiftCode'] = self.shift_data[shift_column]

        # Filter by Tower
        filtered_data = tower_info[tower_info['Tower'] == input_tower.lower()]

        # Merge with legend
        merged = pd.merge(filtered_data, self.shift_data, on='Name', how='left')
        merged['ShiftCode'] = merged[shift_column]
        merged_df = pd.merge(merged, self.legend_data, on ='ShiftCode' , how = 'left')

        # Check overlap
        def is_available(row):
            if pd.isna(row['StartTime']) or pd.isna(row['EndTime']):
                return False
            if row['StartTime'] < row['EndTime']:
                return row['StartTime'] <= input_time <= row['EndTime']
            else:
                return input_time >= row['StartTime'] or input_time <= row['EndTime']

        available_people = merged_df[merged_df.apply(is_available, axis=1)]

        # Output result
        unique = set(available_people['Name'].tolist())
        return list(unique)

'''
mim_obj = EmployeeDirectory('shift_schedule.xlsx')
person = mim_obj.get_person_by_department("CFS")
print(person)

dept = mim_obj.get_department_by_person("Vicky")
print(dept)

# Output result
input_time = datetime.strptime('16:05:00', '%H:%M:%S').time()
input_tower = 'CFS'

person_avl = mim_obj.get_person_by_shift_and_tower(input_time, input_tower)
print("Available people: ", person_avl)
'''

