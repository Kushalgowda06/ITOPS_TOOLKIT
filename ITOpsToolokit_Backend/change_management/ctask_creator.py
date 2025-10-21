import os

import json
from .itsm_connector import ITSM
from langchain.schema import Document
from .kb_manager import KBManager

from .change_assistant import ChangeAssistant
from .snow_ctask import ServiceNowTasks

from .vault import Vault

import split_impl

SCRIPT_PATH = os.path.dirname(__file__)
ROOT_PATH = SCRIPT_PATH.split('/service_now')[0]

class ServiceNowChangeRequests:
     def __init__(self):
        # Collect servicenow configuration details
        app_conf_path = SCRIPT_PATH + '/config/app_config.json'

        app_conf_file = open(app_conf_path, 'r')
        app_conf = json.load(app_conf_file)
        app_conf_file.close()
        # Initiate vault
        vault_path = SCRIPT_PATH + '/config/.vault_token'

        vault_file = open(vault_path, 'r')
        vault_token = vault_file.read().strip()
        vault_file.close()

        vault_url = app_conf['vault_url']
        self.vault_session = Vault(vault_url, vault_token)

        # Fetch ServiceNow credentials
        self.snow_url = app_conf['snow_url']
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

     def insert_cr_vectordb(self):   
            change_list = ["CHG0036169", "CHG0036170","CHG0036171", "CHG0036172", "CHG0036173"]
            change_obj = ITSM(self.snow_username, self.snow_password)
            ctask_obj = ServiceNowTasks()

            change_documents = []
            ctasks_doc = []
            for change in change_list:
                change_details = change_obj.get_change_request_details(change=change)
                if change_details != None:
                        content = 'Change Request Number - ' + change_details[0]['number'] +'\n\n'
                        content += 'Short Description - ' + change_details[0]['short_description'] + '\n\n'
                        content += 'Description - \n' + change_details[0]['description'] +'\n\n'
                        content += 'Assignment Group -\n'+ change_details[0]['assignment_group']+'\n\n'
                        content += 'Implementation Plan -\n' + change_details[0]['implementation_plan']+'\n\n'
                        content += 'Backout Plan -\n' + change_details[0]['backout_plan']+'\n\n'
                        content += 'Test Plan -\n' + change_details[0]['test_plan']+'\n\n'
                        for changes in change_details:
                            ctask_result = ctask_obj.get_historical_ctasks(changes['sys_id'])

                            ctasks = [{"number": d["number"],"short_description": d["short_description"], "assignment_group": d["assignment_group.name"]} for d in ctask_result]
                            task_number = [n["number"] for n in ctasks]
                            sd = [d["short_description"] for d in ctasks]
                            ag = [ag["assignment_group"] for ag in ctasks]

                            for task,d,agn in zip(task_number,sd,ag):
                                ctask_content = 'C-Tasks - ' +task + '\n '
                                ctask_content += 'Short Description - ' +d+'\n '
                                ctask_content += 'Assignment Group - ' +agn +'\n '
                                content += ctask_content

                        change_request_doc = Document(page_content = content, metadata = {'source':  change_details[0]['number']})
                        change_documents.append(change_request_doc)

                        #print(change_details[0]['number'])
                #print(content)

            kb_mng_obj = KBManager()

            #kb_mng_obj.insert_documents(change_documents, kb_name = 'platform_knowledge_base', collection_name = 'change_requests')
            
     def get_response_vector_db(self, curr_chg):
            
            kb_mng_obj = KBManager()
            result = kb_mng_obj.retrieve_kb_connection(kb_name = 'platform_knowledge_base', collection_name = 'change_requests')
            val = result.get()

            curr_chg_obj = ServiceNowTasks()
            change_number = curr_chg
            curr_chg = curr_chg_obj.get_change_details(number = change_number.upper())
            quest = "Give me documents with change request similar to the below change request - \n"
            quest += "Implementation Plan : \n"
            quest += curr_chg[0]['implementation_plan'] + '\n'
            quest += "Backout Plan - \n" +curr_chg[0]['backout_plan'] +'\n'
            quest += "Test Plan - \n" +curr_chg[0]['test_plan']+ '\n'
            quest += "Find the most appropriate article for the above change request given "

            ca_obj = ChangeAssistant()

            relevant_docs = ca_obj.get_compressed_response(quest)
            #print(relevant_docs)
            historical_change = ''
            for k, v in relevant_docs.items():
                #print("\n",k)
                #print(v)
                historical_change += v

            #print(historical_change)
            answer = split_impl.get_suggestions(curr_chg, historical_change)
            extract_object = split_impl.ChangeTask()
            ctask_json = extract_object.extract_json(answer)
            ctask_list = []
            for ctask_data in ctask_json:
                ctask = curr_chg_obj.create_task(short_description = ctask_data['short_description'], number = change_number.upper(), sys_id = curr_chg[0]['sys_id'], description = ctask_data['description'],assignment_group = ctask_data['assignment_group'])
                ctask_list.append(ctask)
            return ctask_list
#snow_obj = ServiceNowChangeRequests()
#snow_obj.get_response_vector_db()

