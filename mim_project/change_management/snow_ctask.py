import os
import datetime
import json
import requests
from dotenv import load_dotenv

load_dotenv()


class ServiceNowTasks:
    snow_url = os.getenv('SNOW_URL')
    snow_username = os.getenv('SNOW_USERNAME')
    snow_password = os.getenv('SNOW_PWD')
    
    headers = {'content-type': 'application/json'}
    

    def get_change_details(self, number):
        change_url = self.snow_url + '/api/now/table/change_request?number=' +number
        #task_url = self.snow_url + '/api/now/table/change_task?change_request='

        try:
            change_response = requests.get(change_url, auth = (self.snow_username, self.snow_password), headers = self.headers, verify = False)
        #print(due_date)
            data = change_response.json()['result']
            impl_plan = data[0]['implementation_plan']
            #print("\n",str(impl_plan))
            #print(f"{data[0]['sys_id']}\n")
        except Exception as e:
            print(str(e))
    
        return(data)
        
    #create task
    def create_task(self, short_description = "", number = "", sys_id = "", description = "", assignment_group = ""):
    #def create_task(self, data_json, number):
        '''
        change_url = self.snow_url + '/api/now/table/change_request?number=' +number
        #task_url = self.snow_url + '/api/now/table/change_task?change_request=' 

        try:
            change_response = requests.get(change_url, auth = (self.snow_username, self.snow_password), headers = self.headers, verify = False)
        #print(due_date)
            data = change_response.json()['result']
            impl_plan = data[0]['impl_plan']
            print(f"{data[0]['sys_id']}\n")
  
        except Exception as e:
            print(str(e))
        '''
        task_url = self.snow_url + '/api/now/table/change_task?number=' +number
        print(task_url)
        
        payload = {}

        if short_description == "":
            payload['short_description'] = 'Change Task Creation'
            payload['change_request'] = sys_id
            payload['description'] = ''
            payload['assignment_group'] = assignment_group
            payload['priority'] = '5 - Planning'
            #payload['assigned_to'] = assigned_to

        else:
            payload['change_request'] = sys_id
            payload['short_description'] = short_description
            #payload['work_notes'] = work_notes
            payload['description'] = description
            payload['assignment_group'] = assignment_group
            payload['priority'] = '5 - Planning'
            #payload['cmdb_ci'] = cmdb_ci
            #payload['due_date'] = due_date


        try:
            response = requests.post(task_url, auth = (self.snow_username, self.snow_password), \
                    data = json.dumps(payload), headers = self.headers, verify = False)
            output = {'number': response.json()['result']['number']}
            result_value = response.json()['result']
            output['target_link'] = self.snow_url + '/api/now/table/change_task?sys_id=' + response.json()['result']['sys_id']
            
            print(output['target_link'])
        except Exception as e:
            print(str(e))
            output = {}

        #print(output)
        return output

    def get_historical_ctasks(self, change_sys_id):
        ctask_url =  self.snow_url + '/api/now/table/change_task?change_request=' +change_sys_id+'&sysparm_fields=number,short_description,assignment_group.name'

    
        try:
            ctask_response = requests.get(ctask_url, auth = (self.snow_username, self.snow_password), headers = self.headers, verify = False)
        #print(due_date)
            data = ctask_response.json()['result'] 

            #print("\n",str(ctask_result))
            #print(f"{data[0]['sys_id']}\n")
        
        except Exception as e:
            print(str(e))
            ctask_result = {}

        return(data)
