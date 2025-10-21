import pandas as pd

class EmployeeDirectory:
    def __init__(self, excel_file):
        self.df = pd.read_excel(excel_file)
        self.df.columns = [col.strip().lower().replace(" ", "_") for col in self.df.columns]

    def get_person_by_department(self, department_name):
        result = self.df[self.df['department_name'].str.lower() == department_name.lower()]
        return result['person_name'].tolist()

    def get_department_by_person(self, person_name):
        result = self.df[self.df['person_name'].str.lower() == person_name.lower()]
        return result['department_name'].tolist()

    def get_person_by_shift_and_department(self, shift_time, department_name):
        result = self.df[
            (self.df['shift_time'].str.lower() == shift_time.lower()) &
            (self.df['department_name'].str.lower() == department_name.lower())
        ]
        return result['person_name'].tolist()

'''
directory = EmployeeDirectory('stake_holder_mapping.xlsx')

# 1. Get person(s) by department
person  = directory.get_person_by_department(input("Enter department name to get Person name: "))
print(person)

# 2. Get department by person
get_department = directory.get_department_by_person(input("Enter Person name to get department name: "))
print(get_department)

# 3. Get person(s) by shift and tower
value = directory.get_person_by_shift_and_department(input("Enter Shift Time: "), input("Enter Department Name: "))
print(value)
'''
