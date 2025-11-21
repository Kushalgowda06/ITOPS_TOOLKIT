import os

import datetime
import sys, traceback

import json
import requests

from langchain_community.document_loaders import UnstructuredHTMLLoader

SCRIPT_PATH = os.path.dirname(__file__)
ROOT_PATH = SCRIPT_PATH.split('/itsm')[0]

sys.path.append(ROOT_PATH)

from vault import Vault

class CustomError(Exception):
    """Custom exception for application-specific errors."""
    def __init__(self, message):
        super().__init__(message)
        self.message = message

class ITSM:
    def __init__(self):
        conf_f_path = ROOT_PATH + '/config/mim_conf.json'

        # Read configuration file
        with open(conf_f_path) as conf_f:
            mim_conf = json.load(conf_f)

        self.snow_url = mim_conf['snow_url']

        if self.snow_url.endswith('/'):
            self.snow_url = self.snow_url[:-1]

        # Initiate vault
        vault_path = ROOT_PATH + '/config/.vault_token'

        vault_file = open(vault_path, 'r')
        vault_token = vault_file.read().strip()
        vault_file.close()

        vault_url = mim_conf['vault_url']
        self.vault_session = Vault(vault_url, vault_token)

        self.ke_category = mim_conf["ke_category_name"]

        if mim_conf['proxy_url']:
            self.proxies = { 
              "http"  : mim_conf['proxy_url'], 
              "https" : mim_conf['proxy_url']
            }
        else:
            self.proxies = None

        snow_tag = mim_conf['snow_tag']

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
        
        # self.snow_username = username
        # self.snow_password = password

        self.headers = {'content-type': 'application/json'}

        
    # Fetch list of incidents
    def get_ticket_details(self, table = 'incident', start_ts = None, end_ts = None, conditions = []):
        tickets = []
        target_url = self.snow_url + '/api/now/table/' + table

        filters = {}

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
            filters['sysparm_query'] = query

        filters['sysparm_fields'] = 'sys_id,number,short_description,description,close_notes'

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
            raise CustomError(str(e))

        try:
            for ticket in response.json()['result']:
                ticket['ticket_link'] = self.snow_url + '/now/nav/ui/classic/params/target/' + table + '.do%3Fsys_id%3D' + ticket['sys_id']
                tickets.append(ticket)
                
        except Exception:
            raise CustomError(str(e))

        return tickets


    def get_kb_articles_details(self, conditions = []):
        ke_sysid = ''
        query = ''
        filters = {}

        if conditions:
            target_url = self.snow_url + '/api/now/table/kb_knowledge'
            
            for condition in conditions:
                query += '^' + condition['param'] + condition['op'] + condition['val']
            
            filters['sysparm_query'] = query

        else:    
            ke_url = self.snow_url + '/api/now/table/kb_knowledge_base?sysparm_query=title='+ self.ke_category + '&sysparm_fields=sys_id' 
            try:
                response = requests.get(ke_url, auth = (self.snow_username, self.snow_password), \
                    headers = self.headers, verify = False)
            
                sysid = response.json()['result']
                ke_sysid = sysid[0]['sys_id']
            except Exception as e:
                #print(str(e))
                raise CustomError(str(e))

                #if number == None:
        
            target_url = self.snow_url + '/api/now/table/kb_knowledge?sysparm_query=kb_knowledge_base=' + ke_sysid

        
        if filters != {}:
            target_url += '?'

        filters['sysparm_fields'] = 'number,sys_id,category,short_description,text'

        filters['sysparm_display_value'] = 'true'
        #filters['sysparm_exclude_reference_link'] = 'true'


        for fl_nm, fl_val in filters.items():
            target_url += '&' + fl_nm + '=' + fl_val
        try:
            
            response = requests.get(target_url, auth = (self.snow_username, self.snow_password), \
                    headers = self.headers, verify = False)
            kb_articles = response.json()['result']
        
        except Exception as e:
            raise CustomError(str(e))

        for ind in range(len(kb_articles)):
            f_path = SCRIPT_PATH + '/' + kb_articles[ind]['number'] + '.html'
            f = open(f_path, 'w+')
            try:
                f.write(kb_articles[ind]['text'])
                f.close()
            except:
                os.remove(f_path)
                continue

            # Parse HTML content of the document using langchain document loader
            loader = UnstructuredHTMLLoader(f_path)
            data = loader.load()
            kb_articles[ind]['text'] = data[0].page_content
            kb_articles[ind]['kb_link'] = self.snow_url + '/now/nav/ui/classic/params/target/kb_view.do%3Fsys_kb_id%3D' + kb_articles[ind]['sys_id']

            os.remove(f_path)

        return kb_articles


    # Update knowledge article
    def update_knowledge_article(self, sys_id, short_description = '', text = ''):
        target_url = self.snow_url + '/api/now/table/kb_knowledge/'+ sys_id

        payload = {}
        #payload['sys_id'] = sys_id
        #payload['short_description'] = short_description
        payload['text'] = text
        
        print(target_url)
        try:
            response = requests.patch(target_url, auth = (self.snow_username, self.snow_password), \
                    data = json.dumps(payload), headers = self.headers, verify = False)
            print(response.json())
            output = {'number': response.json()['result']['number']}
            output['target_link'] = self.snow_url + '/now/nav/ui/classic/params/target/kb_knowledge.do%3Fsys_id%3D' + response.json()['result']['sys_id']
        except Exception as e:
            raise CustomError(str(e))
            #output = {}

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

            print(output)
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
            #print(str(e))
            #return []
            raise CustomError(str(e))

        
    # Fetch list of change_request
    def get_change_request_details(self, table = 'change_request', start_ts = None, end_ts = None, conditions = []):
        change_requests = []
        target_url = self.snow_url + '/api/now/table/' + table

        filters = {}

        query = ''
        #for condition in conditions:
        #    query += '^' + condition['param'] + condition['op'] + condition['val']

        if start_ts != None and end_ts != None:
            start_ts_obj = datetime.datetime.strptime(start_ts, '%Y-%m-%d %H:%M:%S')
            end_ts_obj = datetime.datetime.strptime(end_ts, '%Y-%m-%d %H:%M:%S')

            if end_ts_obj < start_ts_obj:
                return change_requests

            [start_date, start_time] = start_ts.split(' ')
            [end_date, end_time] = end_ts.split(' ')

            filters['sysparm_query'] = 'sys_created_onBETWEEN' + \
                    'javascript:gs.dateGenerate(\'' + start_date + '\',\'' + start_time + '\')@' + \
                    'javascript:gs.dateGenerate(\'' + end_date + '\',\'' + end_time + '\')'

        if conditions:
            #filters['sysparm_query'] = query
            for condition in conditions:
                query += '^' + condition['param'] + condition['op'] + condition['val']
            filters['sysparm_query'] = query


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
                    headers = self.headers, verify = False, proxies = self.proxies)

        except Exception as e:
            raise CustomError(str(e))

        try:
            for ticket in response.json()['result']:
                ticket['ticket_link'] = self.snow_url + '/now/nav/ui/classic/params/target/' + table + '.do%3Fsys_id%3D' + ticket['sys_id']
                change_requests.append(ticket)

        except Exception:
            raise CustomError(str(e))

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

        file_types = {'png': 'image/png', 'jpg': 'image/jpeg', 'jpeg': 'image/jpeg', 'bmp': 'image/bmp'}
        for attachment in attachments:
            file_extension = attachment.split('.')[-1].lower().strip()
            self.attach_file(response.json()['result']['sys_id'], attachment, file_types[file_extension.strip()])

        return output

    def attach_file(self, sys_id, file_name, file_type):
        target_url = self.snow_url + '/api/now/attachment/upload'
        payload = {'table_name': 'change_request', 'table_sys_id': sys_id}

        files = {'file': (file_name, open(SCRIPT_PATH + '/static/' + file_name, 'rb'), file_type, {'Expires': '0'})}
        print(files)

        try:
            response = requests.post(target_url, auth = (self.snow_username, self.snow_password),
                                     data = payload, files = files)
        except Exception as e:
            print(e)
            pass

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

