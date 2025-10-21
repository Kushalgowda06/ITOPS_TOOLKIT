# Author - Viraj Purandare
# Created On - August 19, 2024

import os
import sys
import datetime

import json
import requests

SCRIPT_PATH = os.path.dirname(__file__)
ROOT_PATH = SCRIPT_PATH.split('/itsm')[0]

sys.path.append(ROOT_PATH)

from vault import Vault

class ITSM:
    def __init__(self):
        conf_f_path = ROOT_PATH + '/config/app_config.json'

        # Read configuration file
        with open(conf_f_path) as conf_f:
            app_conf = json.load(conf_f)

        self.snow_url = app_conf['snow_url']

        if self.snow_url.endswith('/'):
            self.snow_url = self.snow_url[:-1]

        # Initiate vault
        vault_path = ROOT_PATH + '/config/.vault_token'

        vault_file = open(vault_path, 'r')
        vault_token = vault_file.read().strip()
        vault_file.close()

        vault_url = app_conf['vault_url']
        self.vault_session = Vault(vault_url, vault_token)

        snow_tag = app_conf['snow_tag']

        if self.snow_url.endswith('/'):
            self.snow_url = self.snow_url[:-1]

    
        snow_creds = self.vault_session.retrieve_secret(snow_tag)
        if snow_creds[0]:
            for k, v in snow_creds[1].items():
                self.snow_username = k
                self.snow_password = v
        else:
            self.snow_username = None
            self.snow_password = None
        '''
        self.snow_username = username
        self.snow_password = password
        '''
        self.auth_status = True

        self.headers = {'content-type': 'application/json'}

        
    # Fetch list of incidents
    def get_ticket_details(self, table = 'incident', start_ts = None, end_ts = None, conditions = []):
        tickets = []
        target_url = self.snow_url + '/api/now/table/' + table

        filters = {}
        filters['sysparm_query'] = 'stateNOT IN6,7^assignment_groupSTARTSWITHZenossGroup^ORassignment_groupSTARTSWITHDWP Operations Center'
        
        query = ''
        for condition in conditions:
            query += '^' + condition['param'] + condition['op'] + condition['val']

        if start_ts != None and end_ts != None:
            start_ts_obj = datetime.datetime.strptime(start_ts, '%Y-%m-%d %H:%M:%S')
            end_ts_obj = datetime.datetime.strptime(end_ts, '%Y-%m-%d %H:%M:%S')

            if end_ts_obj < start_ts_obj:
                return tickets

            [start_date, start_time] = start_ts.split(' ')
            [end_date, end_time] = end_ts.split(' ')

            filters['sysparm_query'] = 'sys_created_onBETWEEN' + \
                    'javascript:gs.dateGenerate(\'' + start_date + '\',\'' + start_time + '\')@' + \
                    'javascript:gs.dateGenerate(\'' + end_date + '\',\'' + end_time + '\')'

        if conditions != []:
            filters['sysparm_query'] += query

        filters['sysparm_fields'] = 'sys_id,number,caller_id,location,sys_created_by,opened_by,sys_created_on,state,hold_reason,cmdb_ci,priority,category,subcategory,assignment_group,assigned_to,short_description,description,comments_and_work_notes'

        filters['sysparm_display_value'] = 'true'
        # filters['sysparm_exclude_reference_link'] = 'true'

        if filters != {}:
            target_url += '?'

        for fl_nm, fl_val in filters.items():
            target_url += fl_nm + '=' + fl_val + '&'

        target_url = target_url[:-1]

        try:
            print(target_url)
            print(self.headers)
            response = requests.get(target_url, auth = (self.snow_username, self.snow_password), \
                    headers = self.headers, verify = False)
        except Exception as e:
            print(str(e))
            return tickets

        self.auth_status = response.status_code

        try:
            for ticket in response.json()['result']:
                ticket['ticket_link'] = self.snow_url + '/now/nav/ui/classic/params/target/' + table + '.do%3Fsys_id%3D' + ticket['sys_id']
                tickets.append(ticket)
        except Exception:
            tickets = []

        return tickets


    # Update ticket
    def update_ticket_details(self, ticket_sys_id, table = 'incident', comments = '', work_notes = '', resolution_notes = '', resolve = False, assignment_group = '', assigned_to = ''):
        target_url = self.snow_url + '/api/now/table/' + table + '/' + ticket_sys_id

        payload = {}

        if comments.strip() != '':
            payload['comments'] = comments

        if work_notes.strip() != '':
            payload['work_notes'] = work_notes

        if assignment_group.strip() != '':
            payload['assignment_group'] = assignment_group

        if assigned_to.strip() != '':
            payload['assigned_to'] = assigned_to

        if resolve and resolution_notes.strip() != '':
            payload['close_notes'] = resolution_notes
            payload['state'] = '6'
            payload['close_code'] = 'Solved (Permanently)'

        try:
            response = requests.put(target_url, auth = (self.snow_username, self.snow_password), \
                    data = json.dumps(payload), headers = self.headers, verify = False)
        except Exception as e:
            print(str(e))

    # Fetch Change Request Details
    def get_change_request_details(self, start_ts = None, end_ts = None, conditions = [], change = None):
        
        change_requests = []
        target_url = self.snow_url + '/api/now/table/change_request'

        filters = {}

        query = ''
        for condition in conditions:
            query += '^' + condition['param'] + condition['op'] + condition['val']
        
        if change != None and (start_ts != None and end_ts != None):
            print(change)
            filters['sysparm_query'] += '^number=' + change
        elif change != None:
            filters['sysparm_query'] = 'number=' + change
        elif start_ts == None and end_ts == None:
            print('1')
            return []
        
        if start_ts != None and end_ts != None:
            start_ts_obj = datetime.datetime.strptime(start_ts, '%Y-%m-%d %H:%M:%S')
            end_ts_obj = datetime.datetime.strptime(end_ts, '%Y-%m-%d %H:%M:%S')

            if end_ts_obj < start_ts_obj:
                return tickets

            [start_date, start_time] = start_ts.split(' ')
            [end_date, end_time] = end_ts.split(' ')

            filters['sysparm_query'] = 'start_dateBETWEEN' + \
                    'javascript:gs.dateGenerate(\'' + start_date + '\',\'' + start_time + '\')@' + \
                    'javascript:gs.dateGenerate(\'' + end_date + '\',\'' + end_time + '\')'

        if conditions != []:
            if 'sysparm_query' in filters:
                filters['sysparm_query'] += query
            else:
                filters['sysparm_query'] = query[1:]

        filters['sysparm_fields'] = 'sys_id,number,short_description,description,implementation_plan,backout_plan,test_plan,assignment_group,start_date,end_date,state,chg_model,approval'
        filters['sysparm_display_value'] = 'true'
        # filters['sysparm_exclude_reference_link'] = 'true'

        if filters != {}:
            target_url += '?'

        for fl_nm, fl_val in filters.items():
            target_url += fl_nm + '=' + fl_val + '&'
        
        
        target_url = target_url[:-1]
        
        try:
            response = requests.get(target_url, auth = (self.snow_username, self.snow_password), \
                    headers = self.headers, verify = False)
            
        except Exception as e:
            print(e)
        
        return response.json()['result']
        self.auth_status = response.status_code

        try:
            for change_request in response.json()['result']:
                change_request['change_request_link'] = self.snow_url + '/now/nav/ui/classic/params/target/change_request.do%3Fsys_id%3D' + change_request['sys_id']
                change_requests['assignment_group'] = change_request['assignment_group']
                change_requests.append(change_request)
        except Exception as e:
            change_requests = []
        
        return change_requests

    # Create Change Request
    def create_change_request(self, short_description, description = '', ci = '', chg_model = 'normal', implementation_plan = '', backout_plan = '', test_plan = '', risk_impact_analysis = '', attachments = []):
        target_url = self.snow_url + '/api/now/table/change_request'

        payload = {}
        payload['short_description'] = short_description
        payload['description'] = description
        payload['cmdb_ci'] = ci
        payload['chg_model'] = chg_model
        payload['implementation_plan'] = implementation_plan
        payload['backout_plan'] = backout_plan
        payload['test_plan'] = test_plan
        payload['risk_impact_analysis'] = risk_impact_analysis

        payload['start_date'] = datetime.datetime.utcnow() + datetime.timedelta(minutes = 30)
        payload['end_date'] = payload['start_date'] + datetime.timedelta(hours = 1)
        payload['start_date'] = payload['start_date'].strftime('%Y-%m-%d %H:%M:%S')
        payload['end_date'] = payload['end_date'].strftime('%Y-%m-%d %H:%M:%S')

        try:
            response = requests.post(target_url, auth = (self.snow_username, self.snow_password), \
                    data = json.dumps(payload), headers = self.headers, verify = False)
            output = {'number': response.json()['result']['number']}
            output['target_link'] = self.snow_url + '/now/nav/ui/classic/params/target/change_request.do%3Fsys_id%3D' + response.json()['result']['sys_id']
        except Exception as e:
            output = {}

        file_types = {'png': 'image/png'}
        for attachment in attachments:
            file_extension = attachment.split('.')[-1].lower().strip()
            self.attach_file(response.json()['result']['sys_id'], attachment, file_types[file_extension])

        return output

    # Create Problem Ticket
    def create_problem_request(self, short_description, description = '', incidents = []):
        target_url = self.snow_url + '/api/now/table/problem'

        payload = {}
        payload['short_description'] = short_description
        payload['description'] = description

        try:
            response = requests.post(target_url, auth = (self.snow_username, self.snow_password), \
                    data = json.dumps(payload), headers = self.headers, verify = False)
            output = {'number': response.json()['result']['number']}
            output['target_link'] = self.snow_url + '/now/nav/ui/classic/params/target/problem.do%3Fsys_id%3D' + response.json()['result']['sys_id']
        except Exception as e:
            output = {}

        return output

    # Attach files in ticket
    def attach_file(self, sys_id, file_name, file_type):
        target_url = self.snow_url + '/api/now/attachment/upload'
        payload = {'table_name': 'change_request', 'table_sys_id': sys_id}

        files = {'file': (file_name, open(SCRIPT_PATH + '/static/' + file_name, 'rb'), file_type, {'Expires': '0'})}

        try:
            response = requests.post(target_url, auth = (self.snow_username, self.snow_password),
                                     data = payload, files = files)
        except Exception:
            pass

    # Create Knowledge Article
    def create_knowledge_article(self, short_description = '', text = ''):
        target_url = self.snow_url + '/api/now/table/kb_knowledge'

        payload = {}
        payload['short_description'] = short_description
        payload['text'] = text
        payload['kb_knowledge_base'] = 'IT'
        payload['workflow_state'] = 'draft'

        try:
            response = requests.post(target_url, auth = (self.snow_username, self.snow_password), \
                    data = json.dumps(payload), headers = self.headers, verify = False)
            output = {'number': response.json()['result']['number']}
            output['target_link'] = self.snow_url + '/now/nav/ui/classic/params/target/kb_knowledge.do%3Fsys_id%3D' + response.json()['result']['sys_id']
        except Exception:
            output = {}

        return output

    # Fetch configuration item details
    def get_cmdb_ci(self, ci):
        target_url = self.snow_url + '/api/now/table/cmdb_ci'

        params = {}
        params['sysparm_query'] = 'nameLIKE' + ci + '^ORip_address=' + ci
        params['sysparm_display_value'] = 'true'

        try:
            response = requests.get(target_url, auth = (self.snow_username, self.snow_password), \
                    params = params, headers = self.headers, verify = False)
            output = response.json()['result']

            if type(output) == dict:
                output = [output]
        except Exception:
            output = []

        return output


    # Obtain child or parent hierarchy of any CMDB element
    def get_parents_children(self, sys_id, target, service_map = []):
        data = ''

        target_url = self.snow_url + '/api/now/table/cmdb_rel_ci'
        params = {
                'sysparm_query': 'parent=' + sys_id + '^ORchild=' + sys_id,
                'sysparm_fields': 'parent,child,type,parent.name,parent.sys_class_name,parent.ip_address,child.name,child.sys_class_name,child.ip_address,type.name'
                }

        if target == 'parent':
            relation = 'child'
        elif target == 'child':
            relation = 'parent'

        try:
            direct_targets = []

            output = requests.get(target_url, auth = (self.snow_username, self.snow_password), 
                                  params = params, headers = self.headers)
            output = output.json()['result']

            for entry in output:
                if (entry['parent.name'] == '' and entry['parent.sys_class_name'] == '') or (entry['child.name'] == '' and entry['child.sys_class_name'] == ''):
                    continue

                if entry[relation]['value'] == sys_id:
                    direct_targets.append(entry[target])
                    if 'parent.sys_class_name' in entry and entry['parent.sys_class_name'] != '':
                        data += entry['parent.sys_class_name'] + ' '
                    data += entry['parent.name'] + ' '

                    if 'parent.ip_address' in entry and entry['parent.ip_address'] != '':
                        data += 'with IP address ' + entry['parent.ip_address'] + ' '
                        data += entry['type.name'].split(':')[0] + ' '

                    if 'child.sys_class_name' in entry and entry['child.sys_class_name'] != '':
                        data += entry['child.sys_class_name'] + ' '
                    data += entry['child.name'] + ' '

                    if 'child.ip_address' in entry and entry["child.ip_address"] != '':
                        data += 'with IP address ' + entry['child.ip_address']

                    if data.strip() != '':
                        data += '\n'

            # service_map.append({sys_id: direct_targets})
            if data.strip() != '':
                service_map.append(data)

            for tg in direct_targets:
                self.get_parents_children(tg['value'], target, service_map)

            return service_map
        except Exception as e:
            print(str(e))
            return []


'''
itsm_obj = ITSM('ServicenowAPI', 'Qwerty@123')
data = itsm_obj.get_cmdb_ci("bond_trade_ny")

for ci in data:
    ci_sys_id = ci['sys_id']

    service_map = itsm_obj.get_parents_children(ci_sys_id, 'parent')
    service_map = service_map[::-1]
    service_map = itsm_obj.get_parents_children(ci_sys_id, 'child', service_map)

    for i in service_map:
        print(i)
# print(itsm_obj.get_change_request_details(conditions = [{'param': 'number', 'op': '=', 'val': 'CHG0034920'}]))

itsm_obj = ITSM('ServicenowAPI', 'Qwerty@123')
data = itsm_obj.get_cmdb_ci('Employee-360')
for entry in data:
    print("IP - " + entry["ip_address"])
    print("Name - " + entry["name"])
    print("Class - " + entry["sys_class_name"])
    
    for key in entry:
        if "manufacturer" in key.lower():
            print("Manufacturer - " + str(entry[key]))
'''
